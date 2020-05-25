import React, { useEffect, useState } from "react";
import {Row, Col, Container} from "react-bootstrap"
import PlaybackButton from "./PlaybackButton/PlaybackButton";
import ProgressSlider from "./ProgressSlider/ProgressSlider";
import Volume from "./Volume/Volume";
import RecordDetails from "./RecordDetails/RecordDetails";

import "./player-controls.scss";

const PlayerControls = ({controls, player,  list:recordList}) => {
    const [currentRecord , setCurrentRecrod] = useState(null);
    const [currentRecordDetails, setCurrentRecrodDails] = useState(null);

    useEffect(() => {
        if(!player){
            return;
        }
        player.subscribeCurrent(setCurrentRecrod);

        return ()=>{
            player.unSubscribeCurrent(setCurrentRecrod)
        }
    }, [player, setCurrentRecrod])

    useEffect(()=>{
        if(!recordList) {return; }
        let currentId = currentRecord?.id;
        
        if(!currentId){
            currentId = player.getCurrent().id;
        }

        const list = (recordList instanceof Array) ? recordList : [recordList];

        const current = list.find( record => record.id === currentId)
       
        if(!current) return; 
        
        setCurrentRecrodDails(current)
        
    }, [recordList, currentRecord, setCurrentRecrodDails])

    return (
        <div className="record-player-controls_container">
            <Container>
                <Row>
                    <Col>
                        <div className="record-player-controls">
                            <PlaybackButton playback={controls.playback} player={player}/>
                            <ProgressSlider seek={controls.seek} player={player} />
                            <Volume setVolume = {controls.setVolume}/>
                            <RecordDetails {...currentRecordDetails}/>
                        </div>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}

export default PlayerControls;