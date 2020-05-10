import React, {useState, useEffect} from "react";
import { formater } from "./../../../../../utils/time/timeFromater";
import "./time.scss"

const Time = ({ record: { duration, id },  player }) => {
    const [progress, setProgress] = useState(0)
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (!player) {
            return;
        }
        player.subscribeProgress(id, setProgress)
        return () => {
            player.unSubscribeProgress(id, setProgress)
        }
    }, [player, setProgress, id])

    useEffect(() => {
        setCurrent(duration * progress)
    }, [progress, setCurrent, duration])



    return (
        <div className="record-player-time">
            <div className="record-player-time-current">
                <span>
                    { formater.secondsToStr(current / 1000) }
                </span>
            </div>
            <div className="record-player-time-duration">
                <span>
                    { formater.secondsToStr(duration / 1000) }
                </span>
            </div>
        </div>
    )

}

export default Time;