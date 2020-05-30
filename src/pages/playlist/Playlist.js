import React from "react";
import { Col, Row } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import ExternalSearch from "./../common/components/ExternalSearch/Search";
import PlayListExplorer from "./../common/components/PlayListExplorer/PlayListExplorer";
import "./playlist.scss";

const Playlist = () => {

    return (
        <div className="page-playlist-container">
            <DndProvider backend={Backend}>
                <Row>
                    <Col>
                        <ExternalSearch />
                        <PlayListExplorer />
                    </Col>
                </Row>
            </DndProvider>
        </div>        
    )
}

export default Playlist;