import STATUS from "./../STATUS";
import STATES from "./../../../../../../reducers/console/recorder/stateDef";

export default function recState(prev, current) {
  prev = prev.recorder;
  current = current.recorder;
  let response = [];

  const recState = current.recordingState;
  if(prev.recordingState !== recState && 
    (recState === STATES.INIT || recState === STATES.IDLE )){
        response.push({
            status: STATUS.RECORDER,
            subStatus : (recState === STATES.INIT) ? STATUS.RECORD_START : STATUS.RECORD_END,
            recParam : {
              recName : current.recName,
              recId : current.recId
            }

        })
  }

  return response;
}
