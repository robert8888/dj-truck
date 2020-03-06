import React from "react";
import style from "./knob.scss";



class Knob extends React.Component{

    state = {
        value: 0,
        position: 0, // form 0 to 100
        snapShotPostion: 0,//

        rightArm: 90, // form -60 to 90 - this is midle
        leftArm: 90, // from 90 to 240 
        dotAngle: 0,
        reversArm: false,//for not symetri linera gradient swap

        idDragged: false,
        isMouseOver: false,
        isActive: false,
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
        this.setState({...this.state, position: this.normalizePostion(position)}, ()=>{
            this.mapPostionToArms(this.state.position);
        })

        this.setState({...this.state, value: this.evalValue(this.state.position)});
        (this.props.onChange && this.props.onChange(this.state.value))
    }


    mapPostionToArms(position){
        let rightArm, leftArm, dotAngle;
        let reversArm = false;
        position = this.quantizePosition(position); 

        if(this.props.symetric || this.props.unsymetric){
            rightArm = 88;
            leftArm = 92; 
            dotAngle = position * 1.4;     
            
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
            console.log(position)
            leftArm += position * 3;
            if(position > 60) {
                reversArm = true;
                leftArm =  -240 + (position - 60) * 3;
                rightArm =  -240 ;
            }

        }

        this.setState({...this.state, rightArm, leftArm, dotAngle, reversArm});
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
                if(!this.state.isDragged &&  !this.state.isMouseOver){
                    this.setState({...this.state, isActive: false})
                }
            })
            
        }

        document.body.addEventListener('mousemove', mouseMove)
        document.body.addEventListener('mouseup', removeListener);
        document.body.addEventListener('mouseleave', removeListener);
        this.setState({...this.setState, isDragged: true, isActive:true})
    }

    mouseMove(startY, event){
        event.stopPropagation();
        let position = this.state.snapShotPostion - 2 * (event.clientY  - startY);
        this.setPostion(position);
    }

    mouseEnter(){
        this.setState({...this.setState, isMouseOver: true}, ()=>{
            if(this.state.isDragged ||  this.state.isMouseOver){
                this.setState({...this.state, isActive: true})
            }
        });
    }

    mouseLeve(){
        this.setState({...this.setState, isMouseOver: false}, ()=>{
            if(!this.state.isDragged &&  !this.state.isMouseOver){
                this.setState({...this.state, isActive: false})
            }
        });
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

    render(){
        return (
            <div className={"knob " + this.props.className}
                onMouseDown={this.mouseDown.bind(this)}
                onDragStart={ e => e.preventDefault()}>
                <div className="knob-big-circle" style={{
                    backgroundImage : `linear-gradient(`+ (180 + this.state.leftArm)  +`deg, `+style.primaryDark+` 50%, transparent 50%),
                                       linear-gradient(`+ (180 + this.state.rightArm) +`deg, transparent 50%, `+style.primaryDark+` 50%)`
                }}>
                    <div className="half-circle half-right"
                         style={{transform: `rotate(`+ this.state.leftArm +`deg)`}}
                         onMouseEnter={ this.mouseEnter.bind(this)}
                         onMouseLeave={ this.mouseLeve.bind(this)}/>
                    <div className={"half-circle half-left " + ((this.state.reversArm) ?"half--reverse" : "" )}
                         style={{transform: `rotate(`+ this.state.rightArm +`deg)`}}
                         onMouseEnter={ this.mouseEnter.bind(this)}
                         onMouseLeave={ this.mouseLeve.bind(this)}/>

                    {( this.props.showValue && <div className={"knob-value " + ((this.state.isActive) ? "knob--focus" : "")}
                        onMouseEnter={ this.mouseEnter.bind(this)}
                        onMouseLeave={ this.mouseLeve.bind(this)}>
                        { this.evalValue(this.state.position) }
                    </div>)}
                </div>
                <div 
                    className={"knob-small-circle " + ((this.state.isActive) ? "small-circle--focus" : "")}
                    onMouseEnter={ this.mouseEnter.bind(this) }
                    onMouseLeave={ this.mouseLeve.bind(this) }
                    />
                <div className="knob-dot"
                    style={{transform: 'rotate('+ this.state.dotAngle + 'deg)'}}
                    onMouseEnter={ this.mouseEnter.bind(this) }
                    onMouseLeave={ this.mouseLeve.bind(this) }/>

            </div>
        )
    }
}


export default Knob;