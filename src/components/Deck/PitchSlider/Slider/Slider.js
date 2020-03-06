import React from "react";
import "./slider.scss";

class Slider extends React.Component{
    constructor() {
        super();

        this.sliderRangeElement = React.createRef();
        this.sliderThumbElement = React.createRef();
        this.sliderAreaElement = React.createRef();
    }

    state = {
        //from get derived stated from props
        sliderCurrnetPositionFromProps: null,

        sliderRange: null,
        sliderCurrnetPosition: null,
        sliderPrevPosition: null,
        isDragged : false,

        thumbHeight: 0,
        sliderAreaTopOffset : 0,
    }

    static getRange = (from , to) => {
        return{
            from,
            to,
            range : (from * to < 0) ?  Math.abs(to) + Math.abs(from) : to - from,
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(!state.sliderRange || !state.thumbHeight) return null;

        const getPostion = (value) => {
            const { from , range } = Slider.getRange(props.from, props.to);
            const progress = (value - from)/ range;  
            const position = progress * (state.sliderRange);
            return (position + state.thumbHeight / 2 )
        }

        if(props.value > props.to || props.value < props.from){
            return null;
        }

        let currentPosition = getPostion(props.value);
        return {
            ...state,
            sliderCurrnetPositionFromProps: currentPosition,
        }
    }



    evalValue = () => {
        const {from , range} = Slider.getRange(this.props.from, this.props.to);
        const progress = (this.state.sliderCurrnetPosition - this.state.thumbHeight / 2)
                         / this.state.sliderRange;

        let value =  range * progress + from;
        return value;
    }

    setValue = (value) => {
        const { from , range } = Slider.getRange(this.props.from, this.props.to);
        const progress = (value - from)/ range;  
        const position = progress * (this.state.sliderRange);
        this.setPosition(position + this.state.thumbHeight / 2 )
    }

    positionNormalize(position){
        return Math.min( Math.max(position, this.state.thumbHeight / 2), 
                        this.state.sliderRange + this.state.thumbHeight / 2 );
    }


    setPosition = (currentPosition, prevPosition) => {
        this.setState({...this.state, 
            sliderCurrnetPosition : this.positionNormalize(currentPosition),
            sliderPrevPosition : prevPosition || this.state.sliderPrevPosition,
        }, ()=>{
            if(this.props.onChange){
                this.props.onChange(this.evalValue());
            }
        });
    }

    mouseDownHandle = (event) =>{
        if(event.target === this.sliderAreaElement.current || event.target === this.sliderRangeElement.current){ //temporary
            let clickY = event.clientY - this.sliderAreaElement.current.getBoundingClientRect().top;
            this.setPosition(clickY, this.state.sliderCurrnetPositionFromProps);
        } else // dragging 
            if(event.target === this.sliderThumbElement.current){ 
            this.setState({...this.state, isDragged: true});
            const shiftY = event.clientY - this.sliderThumbElement.current.getBoundingClientRect().top;
            document.addEventListener('mousemove', e =>  this.mouseMoveHandler.call(this, e, shiftY))
            document.addEventListener('dragstart', e => e.preventDefault())
        }

        document.addEventListener('mouseup', this.mouseUpHandler);
        document.addEventListener('dragend', this.mouseUpHandler);
    }

    mouseUpHandler = event => {
        if(this.state.isDragged){
            this.setState({...this.state, isDragged: false});
        } else {
            this.setPosition(this.state.sliderPrevPosition);
        }

        document.removeEventListener('mousemove', this.mouseMoveHandler.bind(this));
        document.removeEventListener('mouseup', this.mouseUpHandler);
        document.removeEventListener('dragend', this.mouseUpHandler);
    }

    mouseMoveHandler = (event, shiftY) =>{
        if(!this.state.isDragged) return;
        let position = event.clientY 
                        - this.state.sliderAreaTopOffset 
                        - shiftY 
                        + (this.state.thumbHeight/2);
       
        this.setPosition(position);
    }

    componentDidMount(){
        const thumbHeight = this.sliderThumbElement.current.getBoundingClientRect().height;
        const topOffset = this.sliderAreaElement.current.getBoundingClientRect().top;
        const top = parseInt(window.getComputedStyle(this.sliderThumbElement.current).top) ;
        const range = parseInt(window.getComputedStyle(this.sliderRangeElement.current).height)

        this.setState( state => {
            const _state = {...state};
            _state.sliderCurrnetPosition = top;
            _state.sliderRange = range;
            _state.thumbHeight = thumbHeight;
            _state.sliderAreaTopOffset = topOffset;
            return _state;
        }, () => {
            if(this.props.value !== undefined){
                this.setValue(this.props.value);
            }
        })

        this.sliderAreaElement.current.addEventListener('mousedown',  this.mouseDownHandle.bind(this));
    }


    render() {
            return (
                <div className="slider" >
                    <div ref={this.sliderAreaElement} className="slider-area">
                        <div ref={this.sliderRangeElement} className="slider-range"/>
                        <div className="slider-thumb" 
                             ref={this.sliderThumbElement} 
                             style={ (this.state.sliderCurrnetPosition !== null || this.state.sliderCurrnetPosition !== undefined)
                                     && {top: this.state.sliderCurrnetPositionFromProps}} />
                    </div>
                </div>
            )
        }
}

export default Slider;