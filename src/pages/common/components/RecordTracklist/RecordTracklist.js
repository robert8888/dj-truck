import React, { useEffect, useState, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import Tracklist from "./../TrackTable/TrackTable";
import { formater } from "./../../../../utils/time/timeFromater";
import "./record-track-list.scss";

const RecordTracklist = ({ record , onSeek}) => {
    const [tracklist, setTracklist] = useState(null);

    const cols = useMemo(() => ({
        "#": { map: "index" },
        // "Source": "source",
        "Title": { map: "title"  , class: 'overflow'},
        "From": { map: "start" },
        "To": { map: "end" }
    }), []);

    useEffect(() => {
        if (!record) return;
        setTracklist(record.tracks.map(item => ({
            start: formater.secondsToStr(item.start),
            _start : item.start,
            end: formater.secondsToStr(item.end),
            _end: item.end,
            id: item.track.id,
            title: item.track.title,
            source: item.track.source,
            sourceId: item.track.sourceId,
        })))
    }, [record, setTracklist])

    const onClickTrack = useCallback((index, id)=>{
        if(!onSeek || !tracklist) return;
        const to = tracklist.find(track => track.id === id)._start;
        onSeek(to)
    }, [onSeek, tracklist])

    return (
        <Tracklist className="record-track-list"
            cols={cols}
            items={tracklist}
            onClickRow={onClickTrack}
        />
    )
}

const mapStateToProps = state => ({
    record: state.records.currentRecord,
})

export default connect(mapStateToProps)(RecordTracklist);