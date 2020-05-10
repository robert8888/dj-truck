import React from "react";
import { Col, Row } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import Search from "./../common/components/Search/Search";
import PlayListExplorer from "./../common/components/PlayListExplorer/PlayListExplorer";
import "./playlist.scss";

const Playlist = ({}) => {

    return (
        <div className="page-playlist-container">
            <DndProvider backend={Backend}>
                <Row>
                    <Col>
                        <Search />
                        <PlayListExplorer />
                    </Col>
                </Row>
            </DndProvider>
        </div>        
    )
}

export default Playlist;