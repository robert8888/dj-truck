import React from "react";
import { Col, Row } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import ExternalSearch from "./../common/components/ExternalSearch/Search";
import PlayerControls from "./../common/components/PlayerControls/PlayerControls";
import PlayListExplorer from "./../common/components/PlayListExplorer/PlayListExplorer";
import { usePlayer } from "./../common/Hooks/usePlayer";
import "./playlist.scss";

const Playlist = () => {
    const [controls, player] = usePlayer();

    return (
        <>
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
        <PlayerControls player={player} controls={controls} />
        </>        
    )
}

export default Playlist;