
const ytToObj = (ytTime) => {
    let regex = /^PT(?:(?<h>\d+)H)??(?:(?<m>\d+)M)??(?:(?<s>\d+)S){1}$/;
    let match = ytTime.match(regex);
    if(!match) return ytTime;

    let {h = 0 , m = 0 , s =0 } = match.groups;
    return {
        h : parseInt(h), 
        m : parseInt(m),
        s : parseInt(s),
    }
}

const objToStr = (objTime) => {
    let { h = 0, m = 0, s = 0}  = objTime;
    const houre =  ( h === 0 ) ? "" : h + ":";
    const minute = ( m === 0 ) ? "00:" : (m < 10) ?  "0" + m + ":" : m + ":";
    const seconds = ( s === 0 ) ? "00" : (s < 10) ?  "0" + s : s;
    
    return houre + minute + seconds;
}

const objToSeconds = (objTime) => {
    let {h, m, s} = objTime;
    return (s + m * 60 + h * 3600);
}

const secondsToObj = (seconds) => {
    let h = Math.floor(seconds / 3600);
    seconds -= h * 3600;
    let m = Math.floor(seconds / 60);
    seconds -= m * 60;
    let s = seconds;
    return { h, m , s }; 
}

export const formater = {
    ytToStr : (ytTime) => {
        const objTime = ytToObj(ytTime);
        return objToStr(objTime);
    },

    ytToSeconds : (ytTime) => {
        const objTime = ytToObj(ytTime)
        return objToSeconds(objTime);
    },

    secondsToStr : (seconds) => {
        const objTime = secondsToObj(seconds);
        return objToStr(objTime);
    } 
}