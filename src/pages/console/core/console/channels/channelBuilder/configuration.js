import colors from "css/colors.scss";
import style from "./../../../../components/Console/Deck/Player/player.scss"
import WaveSurferAsync from "wavesurfer.js-async";
import ZoomRenderer from "../WavesurferZoomRenderer/ZoomRenderer";

const getCssColor= (variable, name) => colors[ "deck" + name.toUpperCase() + variable ];

const ZOOM_RENDERER = process.env.REACT_APP_PLAYER_PARTIAL_RENDERER;


const zoomRenderer = (name) => ({
    cursorColor: "#FFFFFFCC",
    cursorWidth: 1,
    beatBarColor: "#FFFFFF7D",
    beatBarWidth: 1,
    interact: true,
    regionColor:  (name && getCssColor('Primary', name) + "4C") || 'white',
    renderer: ZoomRenderer,
    plugins: [WaveSurferAsync.create()]
})

const masterConfig = (container, name) => ({ // name deck A or B 
    container: container,
    waveColor: (name && getCssColor('Primary', name)) || 'white',
    progressColor: (name && getCssColor('PrimaryDark', name))|| 'gray',
    autoCenter : true,
    scrollParent: true,
    hideScrollbar:true,
    fillParent: false,
    height: style.masterHeight.slice(0, -2) || 100,
    minPxPerSec : 150,
    pixelRatio : 1,
    //partialRender: true,

    ...(ZOOM_RENDERER === "true"  ? zoomRenderer(name) : {})
})

const slaveConfig = (container, name) => ({
    container: container,
    waveColor: (name && getCssColor('Primary', name)) || 'white',
    progressColor: (name && getCssColor('PrimaryDark', name)) || 'gray',
    fillParent: true,
    scrollParent : false,
    hideScrollbar: true,
    height: style.slaveHeight.slice(0, -2),
})

export default {
    slave : slaveConfig, 
    master : masterConfig
}