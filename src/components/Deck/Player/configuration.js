import colors from "./../../../css/colors.scss";
import style from "./player.scss"

const getCssColor= (variable, name) => colors[ "deck" + name.toUpperCase() + variable ]; 

const masterConfig = (container, name) => ({ // name deck A or B 
    container: container,
    waveColor: (name && getCssColor('Primary', name)) || 'white',
    progressColor: (name && getCssColor('PrimaryDark', name))|| 'gray',
    autoCenter : true,
    scrollParent: true,
    hideScrollbar:true,
    fillParent: false,
    height: style.masterHeight.slice(0, -2) || 100,
    minPxPerSec : 150
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