import React from "react";
import {connect} from "react-redux"
import {Col, Container, Row} from "react-bootstrap";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import ExternalSearch from "./../common/components/ExternalSearch/Search";
import PlayerControls from "./../common/components/PlayerControls/PlayerControls";
import PlayListExplorer from "./../common/components/PlayListExplorer/PlayListExplorer";
import { usePlayer } from "./../common/Hooks/usePlayer";
import "./playlist.scss";

const Playlist = ({currentPlalistContent}) => {
    const [controls, player] = usePlayer();

    return (
        <>
        <Container className={"container-xl"}>
            <div className="page-playlist-container">
                <DndProvider backend={Backend}>
                    <Row>
                        <Col>
                            <ExternalSearch controls={controls} player={player}/>
                            <PlayListExplorer page="playlist" player={player} controls={controls} />
                        </Col>
                    </Row>
                </DndProvider>
            </div>
        </Container>
        <PlayerControls player={player} controls={controls} list={currentPlalistContent}/>
        </>        
    )
}

const mapStateToProps  = state => ({
    currentPlalistContent : state.playList.list,
})

export default connect(mapStateToProps)(Playlist);