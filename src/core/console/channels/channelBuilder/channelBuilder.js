import store from "./../../../../store";
import config from "./../../../../components/Deck/Player/configuration";

import WaveSurfer from "wavesurfer";
import ChannelEvnetHandler from "./../channelEvnetHandler/channelEvnetHandler"
import { getBeatLength } from "./../../../../utils/bpm/converter";



export default class ChannelBuilder {
  constructor() {
    this.eventHandler = new ChannelEvnetHandler();
    this.dispatch = store.dispatch;
  }

  create(channelName, masterContainer, slaveContainer) {
    let channel = {channelName, masterContainer, slaveContainer};

    channel.masterConfig = config.master(masterContainer, channelName);
    channel.slaveConfig = config.slave(slaveContainer, channelName);

    channel.master = WaveSurfer.create(channel.masterConfig);
    channel.master.__proto__.loadWithEvent = function(...args) {
      this.fireEvent("load");
      this.load(...args);
    };
    channel.slave = WaveSurfer.create(channel.slaveConfig);

    this.eventHandler.CreateEventHandling(channel)

    return channel;
  }

  createBars(channel, {bpm, offset}){
    let wrapper = channel.master.drawer.wrapper;
    let styleApply = WaveSurfer.Drawer.style;
    let minPxPerSec = config.master().minPxPerSec;
    let bitLength = getBeatLength(bpm);

    let barPostions = [];

    for (let i = offset; i < channel.master.getDuration(); i += bitLength) {
      barPostions.push(i);
    }

    let barStyle = position => ({
      position: "absolute",
      left: position + "px",
      top: "0px",
      width: "1px",
      maxWidth: "1px",
      height: "100%",
      background: "rgba(255,255,255, 0.5)"
    });

    channel.barsElements = [];
    barPostions.forEach(position => {
      let bar = document.createElement("div");
      let style = barStyle(minPxPerSec * position);
      styleApply(bar, style);
      wrapper.appendChild(bar);
      channel.barsElements.push(bar);
    });
  }
}
