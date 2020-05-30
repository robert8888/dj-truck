import React, { Fragment, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import UUID from "uuidjs";
import PlaybackButton from "./../PlaybackButton/PlaybackButton";
import Created from "./Created/Created";
import GenereList from "./GenereList/GenereList";
import LikeButton from "./LikeButton/LikeButton";
import "./record.scss";
import Time from "./Time/Time";
import WaveSurrferPlayer from "./WaveSurrferPlayer/WaveSurferPlayer";

const Record = ({ record, controls: { seek, playback }, player, simple }) => {
    const escapeSpace = useCallback(str => str.split(" ").join("_"), [])

    const header = useMemo(() => {
        if (!record || simple) {
            return null;
        }
        return (
            <Fragment>
                <nav>
                    <Link to={`/records/user/${record.user.nickname}`} >
                        <h6 className="record-owner">{record.user.nickname} </h6>
                    </Link>
                    <Link to={`/record/${record.user.nickname}/${escapeSpace(record.title)}/${record.id}`} >
                        <h6 className="record-title">{record.title}</h6>
                    </Link>
                </nav>
                <aside>
                        <GenereList list={record.generes} />
                </aside>
            </Fragment>
        )
    }, [record, escapeSpace, simple])


    return (
        <div className="record" key={UUID.genV1()}>
            <header>
                {header}
            </header>
            <main>
                {record &&
                    <Fragment>
                        <PlaybackButton playback={playback} id={record.id} player={player} />
                        <LikeButton recordId={record.id} state={record.favorited}/>
                        <WaveSurrferPlayer seek={seek} record={record} key={record.id} player={player} />
                        <Time record={record} player={player} />
                        <Created date={record.createdAt}/>
                    </Fragment>}
            </main>
        </div>
    )
}

export default Record