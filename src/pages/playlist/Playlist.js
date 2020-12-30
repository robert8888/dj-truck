import React from "react";
import {connect} from "react-redux"
import {Col, Container, Row} from "react-bootstrap";
import ExternalSearch from "pages/common/components/ExternalSearch/Search";
import PlayerControls from "pages/common/components/PlayerControls/PlayerControls";
import PlayListExplorer from "pages/common/components/PlayListExplorer/PlayListExplorer";
import { usePlayer } from "pages/common/Hooks/usePlayer";
import "./playlist.scss";

const Playlist = ({currentPlaylistContent}) => {
    const [controls, player] = usePlayer();

    return (
        <>
            <Container className={"container-xl"}>
                <div className="page-playlist-container">
                    <Row>
                        <Col>
                            <ExternalSearch controls={controls} player={player}/>
                            <PlayListExplorer page="playlist" player={player} controls={controls} />
                        </Col>
                    </Row>
                </div>
            </Container>
            <PlayerControls player={player} controls={controls} list={currentPlaylistContent}/>
        </>
    )
}

const mapStateToProps  = state => ({
    currentPlaylistContent : state.playList.list,
})

export default connect(mapStateToProps)(Playlist);