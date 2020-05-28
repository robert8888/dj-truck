import React, { useCallback, useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import PlayerControls from "../common/components/PlayerControls/PlayerControls";
import Record from "../common/components/Record/Record";
import { loadRecords, reqRecData, reqRecs, setFooterType } from "./../../actions";
import RecordComments from "./../common/components/RecordComments/RecordComments";
import RecordDetails from "./../common/components/RecordDetails/RecordDetails";
import RecordTracklist from "./../common/components/RecordTracklist/RecordTracklist";
import { useRecordPlayer } from "./../common/Hooks/useRecordPlayer";
import "./user-record.scss";

const UserRecord = ({ 
        setFooter,
        requestRecordList, 
        recordsList,
        requestRecordData, 
        userId, 
        setRecordsList, 
        countAll }) => {
    const [controls, player] = useRecordPlayer();
    const { user, title, id } = useParams();
    const history = useHistory()
    const [record, setRecord] = useState();
    const [tracklist, setTracklist] = useState(null);

    const reqFlag = useRef();

    const escapeUnderdash = useCallback(str => str.split("_").join(" "), []);

    useEffect(()=>{
        setFooter("player")
    },[setFooter])

    useEffect(() => {
        if (!title && !user) { 
            history.replace('/records') 
            return;
        }
        if (!title && user) {
            history.replace('/records/' + user)
            return;
        }

        const _title = escapeUnderdash(title);

        let recs = recordsList?.filter(r => r.title === _title)
        if (id) {
            let _id = parseInt(id)
            recs = recs.filter(r => r.id === _id);
        }
        //if is exact this record 
        if (recs && recs.length === 1) {
            setRecord(recs[0]);
            return;
        }
        //if there is none record request it
        if ((recs && recs.length === 0 || !recs) && !reqFlag.current) {

            const where = { title: _title}
            if (id) {
                where.id = +id;
            }

            if (user) {
                where.nickname = user;
            } else if (userId) {
                where.userId = userId;
            }
        
            requestRecordList(100, 0, where);
            //to prevent reqesting again if result is empty
            reqFlag.current = true;
            return;
        }
        // if is more than one record with this title 

        if(recs.length > 1){
            setRecordsList(recs);
            history.replace('/records?preloaded=true')
        }

        if(countAll === 0){
            history.replace('/404')
        }

    }, [recordsList, 
        setRecord, 
        title, 
        id, 
        userId,
        user, 
        setRecordsList, 
        escapeUnderdash, 
        reqFlag,
        history, 
    ])

    useEffect(() => {
        if(!record) return;
        requestRecordData(record.id);
    }, [record])

    const seekToTrack = useCallback((time)=>{
        if(!controls || !player || !record || time === undefined) return;
        
        controls.seek({
            id: record.id,
            progress: time / (record.duration / 1000),
            duration: record.duration,
        })
    },[controls, player, record])

    return (
        <div className="user-record">
            <Record record={record} controls={controls} player={player} simple />
            <Row>
                <Col xs={12} xs={{order: 2}}  md={6} md={{order:1}}>
                    <RecordComments/>
                </Col>
                <Col xs={12} md={6}  md={{order:2}}>
                    <RecordDetails record={record} />
                    <RecordTracklist onSeek={seekToTrack}/>
                </Col> 
            </Row>
            <PlayerControls controls={controls} player={player} list={record} />
        </div>
    )
}

const mapStateToProps = state => ({
    recordsList: state.records.list,
    countAll: state.records.countAll,
    userId: state.user.dbId,
})

const mapDispatchToProps = dispatch => ({
    requestRecordList: (pageSize, page, where) => dispatch(reqRecs(pageSize, page, where)),
    requestRecordData: (id) => dispatch(reqRecData(id)),
    setRecordsList: (list) => dispatch(loadRecords(list)),
    setFooter: (type) => dispatch(setFooterType(type))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserRecord)


