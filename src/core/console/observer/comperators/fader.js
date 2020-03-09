import STATUS from  "./../STATUS";

export default function eqLowChange(prev, current){
    prev = prev.mixer;
    current = current.mixer;
    
    let response = null;

    const prevValue = prev.fader.position;
    const currentValue = current.fader.position;
    if( prevValue !== currentValue){
        return {
            status : STATUS.FADER_CHANGE,
            prevValue : prevValue,
            currentValue : currentValue
        }                
    }
    
    return response;
}