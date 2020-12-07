import React, {useCallback, useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import RecordSearch from "pages/common/components/RecordSearch/RecordSearch";
import useRecordSearchUrl from "pages/common/Hooks/useRecordSearchURL";
import {Container} from "react-bootstrap";
import TopGenres from "pages/common/components/TopGenres/TopGenres";
import "./explorer.scss";
import PlayerControls from "pages/common/components/PlayerControls/PlayerControls";
import {usePlayer} from "pages/common/Hooks/usePlayer";
import { PLAYBACK_STATE } from "pages/common/Hooks/usePlabackState";
import useDynamicFooter from "pages/common/Hooks/useDynamicFooter";

const Explorer = props =>{
    const history = useHistory();
    const [getSearchUrl] = useRecordSearchUrl();
    const [controls, player] = usePlayer();
    const [showPlayer, setShowPlayer] = useState(false);
    const [setFooterType] = useDynamicFooter();

    const onSearch = useCallback((queryStr, searchOpt)=>{
        const url = getSearchUrl(queryStr, {searchOpt: searchOpt});
        history.push(url);
    }, [getSearchUrl, history] )

    useEffect(() =>{
        if(player.current.state === PLAYBACK_STATE.PLAY){
            setShowPlayer(true);
            setFooterType("player")
        } else {
            setFooterType("default")
        }
    }, [setShowPlayer, setFooterType, player])

    return (
        <div className={"page"}>
        <Container className="app layout container-xl" >
            <div className="c-explorer">
                <RecordSearch title="Dj Truck Records" onSearch={onSearch}/>
                <TopGenres/>
                <Link to={"/genres"} className={"c-explorer__link"}>See all genres</Link>
            </div>
        </Container>
        {showPlayer && <PlayerControls controls={controls} player={player}/>}
        </div>
    )
}

export default Explorer