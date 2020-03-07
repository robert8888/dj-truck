import React from "react";
import {connect} from "react-redux";
import WaveSurfer from "wavesurfer";
import Console from "./../../../core/console/console";
import config from "./configuration";
import {setChannelReady , setTimeLeft } from "./../../../actions";
import "./player.scss"

class Player extends React.Component {
    constructor(){
        super();
        this.masterContainer = React.createRef();
        this.slaveContainer = React.createRef();

        this.state = {
            loadingProgress : 0,
        }
    }

    setLoading(progress){
        this.setState( state => {
            let _state = {...state};
            _state.loadingProgress = progress;
            return _state
        })
    }

    componentDidMount(){
        this.master = WaveSurfer.create(config.master(this.masterContainer.current, this.props.name));
        this.slave = WaveSurfer.create(config.slave(this.slaveContainer.current, this.props.name));

        const mixConsole = Console.Get();
        mixConsole.setPlayer(this.props.name, this.master);

        this.master.on('ready', ()=>{
            this.currentDuration = this.master.getDuration();
            this.slave.load(null, this.master.backend.getPeaks(430, 0, 430));
            this.setLoading(100);
            this.props.setReadyHandler(true);
            startSync();
        })

        this.slave.on('seek', (progress)=>{
            let wasPlaying = this.master.isPlaying();
            this.master.backend.seekTo(progress * this.currentDuration);
            this.master.drawer.progress(progress);
            this.master.fireEvent('seek', progress);

            if(wasPlaying){
                this.master.play();
            }
            this.slave.drawer.progress(progress);

            if(wasPlaying){
                this.props.setTimeLeftHandler(parseInt(this.master.getDuration() - this.master.getCurrentTime()))
            } else {
                this.props.setTimeLeftHandler(parseInt(this.master.getDuration() - (this.master.getDuration() * progress)))
            }


        })

        this.master.on('loading', (progress)=>{
            this.setLoading(progress);
        })

        const startSync = () => {
            this.syncHandle = setInterval(() => {
                this.slave.drawer.progress(this.master.getCurrentTime() / this.currentDuration);
            }, 100)
        }
    }

    shouldComponentUpdate(nextProps, nextState){
    
        if(this.props.url !== nextProps.url){
            this.setLoading(0);
            this.slave.load(null, []);
            this.master.load(nextProps.url);
            this.props.setReadyHandler(false);
            return false;
        }
        return true;
    }

    render(){
        return (
            <div className={"player player-"+this.props.name}>
                {
                (this.state.loadingProgress < 100 && this.state.loadingProgress > 0) &&
                    <div className="player-loading"><span>Loading { this.state.loadingProgress } % </span></div>
                }
                <div className="master" ref={ this.masterContainer } />
                <div className="slave" ref={ this.slaveContainer } /> 
            </div>
        )
    }
}

const mapDispachToProps = (dispatch, ownProps) =>({
    setReadyHandler : (status) => dispatch(setChannelReady(status, ownProps.name)),
    setTimeLeftHandler : (timeLeft) => dispatch(setTimeLeft(ownProps.name, timeLeft))
})


export default connect(null, mapDispachToProps)(Player);