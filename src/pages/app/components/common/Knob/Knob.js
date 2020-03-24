

// Spec 
// witout any option Knob is standard with value from 0 to 100 and on inti value is 0
// -initValue:number allow to set init value
// -showValue props allows to display numeric value on knob
// -diplayFormula : a callbac function with will be used to show value on knob
// -scale:number allow to scale value eg. 10 give range from 0 to 10 
// -symetric:boolean if this props is present knob havse valeu from -100 to 100 * scale 
// -unsymetric:{negative:number, positive:number} allows to set unsymetric range value : 
//  {positive : 5 } means that values bigger than 0 are divided by 5 range is from -100 to 20 * scale
// -quantize:number switch knob to quantize mode in witch returned values are quantize to parametr 
//       eg: 2 returns value 100, 98 , 96 ... quantize:0.05 returns values 100, 99.95.... 
// -qunatize:{negative:number, positive:number} allows to set diffrent qunatizes for negative and positives values.
// -responseFactor if is present adjust knob response on a mouse move // default= 1 eg responseFactor 2 will increase response two times
// -alt if is present when mouse is over and knob is not draggin it will display alt value 

import React from "react";
import style from "./knob.scss";


class Knob extends React.PureComponent{

    constructor(){
        super();
        this.html = {
            bigCircle : React.createRef(),
            leftHalf : React.createRef(),
            rightHalf : React.createRef(),
            value : React.createRef(),
            smallCircle : React.createRef(),
            dot : React.createRef()
        }
    }

    state = {
        value: 0,
        position: 0, 
        snapShotPostion: 0,

        idDragged: false,
        isMouseOver: false,
    }

    snap(){
        this.setState({...this.state, snapShotPostion: this.state.position})
    }

    normalizePostion(position){
        if(this.props.symetric || this.props.unsymetric){
            return Math.min(Math.max(position, -100), 100)
        } 
        return Math.min(Math.max(position, 0), 100)
    }

    quantizePosition(position){
        if(!this.props.quantize) 
            return position;

         // value is quantaized 
         return this.valueToPosition(this.evalValue(position));

    }

    valueToPosition(value){
        let position = value;
        if(this.props.scale){
            position = value * 100 / this.props.scale;
        }

        if(this.props.unsymetric){
            if(this.props.unsymetric.positive && value > 0 ){
                let scale = this.props.unsymetric.positive;
                position = position * scale;
            } 
            if(this.props.unsymetric.negative &&  value < 0){
                let scale = this.props.unsymetric.negative;
                position = position * scale;
            }
        }
        return position;
    }

    evalValue(position){
        let value = position;
        
        if(this.props.scale){
            value = this.props.scale * position / 100 ;
        } 
        
        if(this.props.unsymetric){
            if(this.props.unsymetric.positive && position > 0 ){
                let scale = this.props.unsymetric.positive;
                value = value / scale;
            } 
            if(this.props.unsymetric.negative && position < 0){
                let scale = this.props.unsymetric.negative;
                value = value / scale;
            }
        }

        if(this.props.quantize){
            let factor; 
            if(typeof this.props.quantize === "object"){
                if(this.props.quantize.positive && value >= 0 ){
                    factor = this.props.quantize.positive;
                } if(this.props.quantize.negative && value < 0){
                    factor = this.props.quantize.negative;
                }
            } else if (typeof this.props.quantize === "number") {
                factor = this.props.quantize;
            }
            const rest = value % factor;
            value = value - rest;
        }

        //rounding 
        return Math.floor(value * 1000000) / 1000000;
    }

    setPostion(position){
        position =  this.normalizePostion(position);
        const value = this.evalValue(position);

        this.setState({...this.state, position, value}, ()=>{
            this.mapPostionToArms(this.state.position)
        });

        (this.props.onChange && this.props.onChange(this.state.value))
    }

    mapPostionToArms(position){
        let rightArm, leftArm, dotAngle;
        let reversArm = false;
        position = this.quantizePosition(position); 

        if(this.props.symetric || this.props.unsymetric){
            rightArm = 88;
            leftArm = 92; 
            dotAngle = position  * 1.4 ;     
            
            if(position < -2 ) {
                rightArm = 90 - Math.abs(position) * 1.5;
                leftArm = 90;
            } else if(position > 2 ){
                rightArm = 90;
                leftArm = 90 + position * 1.5;
            }
        } else {
            rightArm = -60;
            leftArm = -60; 
            dotAngle = -150 + position * 2.95;
            leftArm += position * 3;
            if(position > 60) {
                reversArm = true;
                leftArm =  -240 + (position - 60) * 3;
                rightArm =  -240 ;
            }
        }
        this.updateStyle({rightArm, leftArm, dotAngle, reversArm});
        this.updateValue();
    }

    updateValue(){
        let value = ""
        if(this.isMouseOver && !this.state.isDragged && this.props.alt){
            value = this.props.alt.substr(0,4).toUpperCase();
        } else {
            if(this.props.showValue){
                value = this.evalValue(this.state.position)
            }
            if(this.props.displayFormula){
                value = this.props.displayFormula(value);
            }
        }

        this.html.value.current.textContent = value.toString().substr(0,6);
    }

    updateStyle({rightArm, leftArm, dotAngle, reversArm}){
        this.html.bigCircle.current.style.backgroundImage = 
            `linear-gradient(`+ (180 + leftArm)  +`deg, `+style.primaryDark+` 50%, transparent 50%),
             linear-gradient(`+ (180 + rightArm) +`deg, transparent 50%, `+style.primaryDark+` 50%)`;

        this.html.rightHalf.current.style.transform = `rotate(`+ leftArm +`deg)`;
        this.html.leftHalf.current.style.transform = `rotate(`+ rightArm +`deg)`;
        if(reversArm){
            this.html.leftHalf.current.classList.add("half--reverse")
        } else {
            this.html.leftHalf.current.classList.remove("half--reverse")
        }

        this.html.dot.current.style.transform= 'rotate('+ dotAngle + 'deg)';
    }

    setActive(value){
        if(value){
            this.html.value.current.classList.add("knob--focus")
            this.html.bigCircle.current.classList.add("big-circle--focus");
        }else {
            this.html.value.current.classList.remove("knob--focus");
            this.html.bigCircle.current.classList.remove("big-circle--focus");
        }
    }

    // -------------- events below

    mouseDown(event){
        const startY = event.clientY;
        let mouseMove = this.mouseMove.bind(this, startY);
        this.snap();

        const removeListener = () =>{
            document.body.removeEventListener('mousemove', mouseMove);
            document.body.removeEventListener('mouseup', removeListener);
            document.body.removeEventListener('mouseleave', removeListener);
            this.setState({...this.setState, isDragged: false}, ()=>{
                if(!this.state.isDragged &&  !this.isMouseOver){
                    this.setActive(false);
                }
            })
            
        }

        document.body.addEventListener('mousemove', mouseMove)
        document.body.addEventListener('mouseup', removeListener);
        document.body.addEventListener('mouseleave', removeListener);
        this.setState({...this.setState, isDragged: true})
        this.setActive(true);
    }

    mouseMove(startY, event){
        event.stopPropagation();
        let responsFactor = this.props.responsFactor || 1;
        let position = this.state.snapShotPostion - (event.clientY  - startY) * responsFactor;
        this.setPostion(position);
    }

    mouseEnter(){
        this.isMouseOver = true;
        if(this.state.isDragged ||  this.isMouseOver){
            this.setActive(true);
        }
    }

    mouseLeve(){
        this.isMouseOver = false;
        if(!this.state.isDragged &&  !this.isMouseOver){
            this.setActive(false)
        }
    }

    mouseDoubelClick(){
        if(this.props.dobuleClickInit){
            const value = this.props.initValue || 0;
            const position = this.valueToPosition(value);
            this.setState({...this.state, value : value}, ()=>{
                this.setPostion(position)
            })
        }
    }

    //----------------compontent metod
    componentDidMount(){
        let position = this.state.position;
        if(this.props.initValue){
            position = this.valueToPosition(this.props.initValue)
        }

        this.setState({...this.state, position : position}, ()=>{
            this.mapPostionToArms(position);
        })
    }

    componentDidUpdate(oldProps){
        if(this.props.value !== oldProps.value){
            const postion = this.valueToPosition(this.props.value);
            this.setPostion(postion);
        }
    }


    render(){
        console.log("render knob")
        
        return (
            <div 
                className={"knob " + this.props.className} 
                onMouseDown={this.mouseDown.bind(this)}
                onDragStart={ e => e.preventDefault()}
                onDoubleClick={this.mouseDoubelClick.bind(this)}
                onMouseEnter={ this.mouseEnter.bind(this)}
                onMouseLeave={ this.mouseLeve.bind(this)}
                >
                <div 
                    className="knob-big-circle"
                    ref={this.html.bigCircle}>
                    <div 
                        ref = {this.html.rightHalf}
                        className="half-circle half-right"
                        />
                    <div 
                        ref = {this.html.leftHalf} 
                        className="half-circle half-left "
                       />
                    {( this.props.showValue && 
                        <div
                            ref={this.html.value} 
                            className={"knob-value " + ((this.props.showValue === "always") ? "knob--focus" : "")}
                           >
                        </div>
                    )}
                </div>
                <div 
                    ref={this.html.smallCircle}
                    className={"knob-small-circle "}
       
                    />
                <div 
                    ref={this.html.dot}
                    className="knob-dot"
                  />
            </div>
        )
    }
}

export default Knob;