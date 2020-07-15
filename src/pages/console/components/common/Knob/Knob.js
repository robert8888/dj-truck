import React from "react";
import style from "./knob.scss";
import _throttle from "lodash/throttle";
import PropTypes from "prop-types";


class Knob extends React.Component{

    constructor(...args){
        super(...args);
        this.html = {
            bigCircle : React.createRef(),
            leftHalf : React.createRef(),
            rightHalf : React.createRef(),
            value : React.createRef(),
            smallCircle : React.createRef(),
            dot : React.createRef()
        }
        this.throttleTime = this.props.throttle || 75;

        this.onChange = _throttle((...args) => {
            this.props.onChange && this.props.onChange(...args);
        }, this.throttleTime)
    }

    state = {
        value: 0,
        position: 0, 
        snapShotPosition: 0,

        idDragged: false,
        isMouseOver: false,
    }

    snap(){
        this.setState({...this.state, snapShotPosition: this.state.position})
    }

    normalizePostion(position){
        if(this.props.symmetric || this.props.asymmetric){
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

        if(this.props.asymmetric){
            if(this.props.asymmetric.positive && value > 0 ){
                let scale = this.props.asymmetric.positive;
                position = position * scale;
            } 
            if(this.props.asymmetric.negative &&  value < 0){
                let scale = this.props.asymmetric.negative;
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
        
        if(this.props.asymmetric){
            if(this.props.asymmetric.positive && position > 0 ){
                let scale = this.props.asymmetric.positive;
                value = value / scale;
            } 
            if(this.props.asymmetric.negative && position < 0){
                let scale = this.props.asymmetric.negative;
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


    update(value){
        const position = this.valueToPosition(value);
        this.setPosition(position, true);
    }

    setPosition(position, silent){
        position =  this.normalizePostion(position);
        const value = this.evalValue(position);
        /**
         * Warning uncomment below !!!
         */
        this.setState({...this.state, position, value});
        window.requestAnimationFrame(()=> this.mapPositionToArms(position))
        !silent && this.onChange(value);
    }

    mapPositionToArms(position){
        let rightArm, leftArm, dotAngle;
        let reversArm = false;
        position = this.quantizePosition(position); 

        if(this.props.symmetric || this.props.asymmetric){
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
        if(this.isMouseOver && !this.state.isDragged && this.props.text){
            value = this.props.text.substr(0,4).toUpperCase();
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
        window.requestAnimationFrame(() => {
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

            this.html.dot.current.style.transform = 'rotate('+ dotAngle + 'deg)';
        })
    }

    setActive(value){
        window.requestAnimationFrame(()=>{
            if(value){
                this.html.value.current.classList.add("knob--focus")
                this.html.bigCircle.current.classList.add("big-circle--focus");
            }else {
                this.html.value.current.classList.remove("knob--focus");
                this.html.bigCircle.current.classList.remove("big-circle--focus");
            }
        })
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
        let position = this.state.snapShotPosition - (event.clientY  - startY) * responsFactor;
        this.setPosition(position);
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

    mouseDoubleClick(){
        if(this.props.doubleClickInit){
            const value = this.props.initValue || 0;
            const position = this.valueToPosition(value);
            this.setState({...this.state, value : value}, ()=>{
                this.setPosition(position)
            })
        }
    }

    //----------------live cycle methods
    componentDidMount(){
        let position = this.state.position;
        if(this.props.initValue || this.props.value){
            position = this.valueToPosition(this.props.initValue || this.props.value)
        }

        this.setState({...this.state, position : position}, ()=>{
            this.mapPositionToArms(position);
        })
    }

    componentDidUpdate(oldProps){
        if(this.props.value === oldProps.value || this.state.isDragged) return;
        this.update(this.props.value);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (this.props.value !== nextProps.value && !this.state.isDragged)
    }

    render(){
        console.log("render knob")
        return (
            <div 
                className={"knob " + this.props.className} 
                onMouseDown={this.mouseDown.bind(this)}
                onDragStart={ e => e.preventDefault()}
                onDoubleClick={this.mouseDoubleClick.bind(this)}
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

Knob.propTypes = {
    initValue: PropTypes.number, //allow to set init value
    showValue: PropTypes.oneOfType([
        PropTypes.bool, //display numeric value on knob
        PropTypes.oneOf(["always"]),
    ]),
    displayFormula: PropTypes.func, // allow to pass function witch transform displayed value
    scale: PropTypes.number,// scale value eg. 10 give range from 0 to 10 - (100 / scale)
    symmetric: PropTypes.bool, // if is true instead value from 0 to 100 / scale - it will have from -100 to 100
    asymmetric: PropTypes.shape({ // allows to set asymmetric scale
        negative: PropTypes.number, // eg: negative: 2 makes negative value dived by 2 - instead -100 to 100 gives: -50 to 100
        positive: PropTypes.number, //
    }),
    quantize: PropTypes.oneOfType([
        PropTypes.number, // eg:  value : 2 -> 100, 98 , 96....
        PropTypes.shape({
            negative: PropTypes.number, // asymmetric quantization
            positive: PropTypes.number, //
        })
    ]),
    responseFactor: PropTypes.number, // ratio for mouse dragging action - default 1
    text: PropTypes.string, // text displayed during dragging and hover
}


export default Knob;