import React, {useRef, useEffect, useCallback, useMemo} from "react";
import { connect } from "react-redux";
import Console from "pages/console/core/console/console";
import ZoomControls from "./ZoomControls/ZoomControls";
import TrackLoading from "./Loading/Loading";
import {pushLog, setBpmOrOffsetDeck, setZoom} from "actions";
import {Item, Menu, Separator, useContextMenu} from "react-contexify";
import {Log} from "utils/logger/logger";
import classNames from "classnames";
import InputModal from "pages/common/components/InputModal/InputModal";
import "./player.scss";

const Player = ({channel, mode, zoom, setBpmOrOffset, timeWarning, paused, loaded, trackTitle, trackBpm, allChannels}) => {
    const {show} = useContextMenu({id: "PLAYER-" + channel})
    const openModalRef = useRef();
    const masterContainer = useRef();
    const slaveContainer = useRef();

    useEffect(() => {
      Console.Get().then( _console => {
          _console.createChannel(
              channel,
              masterContainer.current,
              slaveContainer.current
          )
      });

      return () => {
          Console.Get().then(console => console.destroyChannel(channel))
      }
    }, [masterContainer, slaveContainer, channel])

    useEffect(()=> {
        const sizes = new Map([
            ["mobile", {"master": 90, "slave": 30}],
            ["tablet", {"master": 120, "slave": 40}],
            ["desktop", {"master": 150, "slave": 50}],
        ])
        Console.Get().then(_console =>{
          _console.channels.updateWavesurferParams(
                channel, "master", {height: sizes.get(mode)["master"]}
              )
          _console.channels.updateWavesurferParams(
                channel, "slave", {height: sizes.get(mode)["slave"]}
            )
        })
    }, [mode, channel])

    const handleZoom = useCallback((direction) => {
      if(mode !== "desktop"){
          allChannels.split(",").forEach(channel => zoom(direction, channel))
          return;
      }
      zoom(direction)
    }, [zoom, mode, allChannels])

    const overlayClasses = useMemo(() => {
      return classNames("player__warning-overlay",
          {"player__warning-overlay--hidden": !timeWarning}
      )
    }, [timeWarning])

    const setOffset = useCallback(() => {
        const asyncCallback = async () =>{
            const consoleInstance = await Console.Get();
            const channelInterface = consoleInstance.getChannelInterface(channel);
            const currentTime = channelInterface.getCurrentTime();
            setBpmOrOffset(null, currentTime.sampleTime)
        }
        asyncCallback().catch((err)=>{
            pushLog(Log.Error(["console", "deck", "set offset"], err))
        });
    }, [channel, setBpmOrOffset])

    const setOpenModalRef = useCallback(ref => openModalRef.current = ref, [openModalRef])

    return (
      <div className={"player player-" + channel + " player--" + mode}
           onContextMenu={show}>
        <TrackLoading name={channel}/>
          {mode === "desktop" &&
              <ZoomControls
                zoomIn={handleZoom.bind(null, "decrement")}
                zoomOut={handleZoom.bind(null, "increment")}
                className={"scale-controls--" + channel}/>
          }
        <div className={"player__wrapper"}>
          <div className="player__master" ref={masterContainer} />
          <div className={overlayClasses}/>
        </div>
        <div className={"player__wrapper"}>
          <div className="player__slave" ref={slaveContainer} />
          <div className={overlayClasses}/>
        </div>
          <Menu id={"PLAYER-" + channel}>
              {loaded &&
                <>
                <Item onClick={setOffset.bind(null)} disabled={!paused}> Set offset </Item>
                <Item onClick={openModalRef.current}> Set BPM </Item>
                <Separator/>
                </>
              }
              <Item onClick={handleZoom.bind(null, "decrement")}> Zoom In </Item>
              <Item onClick={handleZoom.bind(null, "increment")}> Zoom out </Item>
          </Menu>
          <InputModal
              openRef={setOpenModalRef}
              title={"Set Bpm"}
              onConfirm={bpm => setBpmOrOffset(bpm, null)}
              textContent={trackTitle}
              buttonText={"Update BPM"}
              initValue={trackBpm}
              inputProps={{min: 60, max: 300, step: .01}}
              inputType="number"
          />
      </div>
    );
}

const mapStateToProps = (state, ownProps) => ({
    timeWarning: state.console.channel[ownProps.channel].playBackState.timeWarning &&
        !state.console.channel[ownProps.channel].playBackState.paused,
    paused: state.console.channel[ownProps.channel].playBackState.paused,
    trackTitle: state.console.channel[ownProps.channel].track.title,
    trackBpm: state.console.channel[ownProps.channel].track.bpm,
    loaded: state.console.channel[ownProps.channel].playBackState.ready,
    allChannels: Object.keys(state.console.channel).join(","), // passing by string to prevent re rendering
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    zoom: (direction, channel) => dispatch(setZoom(channel || ownProps.channel, direction)),
    setBpmOrOffset: (bpm, offset) => dispatch(setBpmOrOffsetDeck(ownProps.channel, bpm, offset)),
    pushLog: log => dispatch(pushLog(log))
})



export default connect(mapStateToProps, mapDispatchToProps)(Player);
