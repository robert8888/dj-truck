import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import PlaybackButton from "./PlaybackButton/PlaybackButton";
import "./player-controls.scss";
import ProgressSlider from "./ProgressSlider/ProgressSlider";
import RecordDetails from "./RecordDetails/RecordDetails";
import Volume from "./Volume/Volume";
import ErrorBoundary from './../ErrorBoundary/ErrorBoundary'

const lastRecordCache = {
    current: null,
}

const PlayerControls = ({controls, player,  list}) => {
    const [currentRecord , setCurrentRecord] = useState(null);
    const [currentRecordDetails, setCurrentRecordDetails] = useState(lastRecordCache.current);

    useEffect(() => {
        if(!player){
            return;
        }
        player.subscribeCurrent(setCurrentRecord);

        return ()=>{
            player.unSubscribeCurrent(setCurrentRecord)
        }
    }, [player, setCurrentRecord])

    useEffect(()=>{
        if(!list) {return; }
        let currentId = currentRecord?.id;
        
        if(!currentId){
            currentId = player.getCurrent().id;
        }

        const itemList = (list instanceof Array) ? list : [list];

        const current = itemList.find( item => (item.id === currentId || item?.sourceId === currentId))
       
        if(!current) return; 
        
        setCurrentRecordDetails(current)
        lastRecordCache.current = current;
    }, [player, list, currentRecord, setCurrentRecordDetails])

    return (
        <ErrorBoundary>
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
        </ErrorBoundary>
    )
}

export default PlayerControls;