import React from "react";
import { connect } from "react-redux";
import {Button} from "react-bootstrap";
import { loadTrack} from "../../../../actions";

import "./play-list.scss";

//--------------------------------------------
const Row = (props) => {
    const format = time => time.substr(2 ,time.length).toLowerCase();

    let track = {
        id : props.item.id,
        title : props.item.title,
        duration : props.item.duration, 
        source: props.item.source || "YouTube",
        bpm: props.item.bpm, 
        offset : props.item.offset,
        quality : props.item.quality,
        thumbnail : props.item.thumbnails
    };

    return (
        <tr className="track-list-table-row">
            <td className="track-list-table-col source">{track.source}</td>
            <td className="track-list-table-col title">{track.title}</td>
            <td className="track-list-table-col quality">{track.quality}</td>
            <td className="track-list-table-col time">{format(track.duration)}</td>
            <td className="track-list-table-col bpm">{track.bpm && track.bpm.toFixed(2)}</td>
            <td className="track-list-table-col">
                <Button className="btn-dest dest-a" onClick={e => props.load(track, "A")}>A</Button>
                <Button className="btn-dest dest-b" onClick={e => props.load(track, "B")}>B</Button>
            </td>
        </tr>
    )
}

const mapDispachToProps = dispach => ({
    load : (track, destination) => dispach(loadTrack(track, destination))
})

const RowConnected = connect(null, mapDispachToProps)(Row);


//------------------------------------
const Table = (props) => {
    return (           
        <table className={props.classNames}>
            <thead>
                <tr>
                    {props.headers && props.headers.map( (text, index) => <th key={index}>{text}</th>)}
                </tr>
            </thead>
            <tbody>
                { props.children }
            </tbody>
        </table>
    )
}

//--------------------------------------------------
class PlayList extends React.Component {

    headers = ['Source', 'Title', 'Quality', 'Time', 'Bpm', 'Destination']; 

    render(){
        return (
            (this.props.playList.length > 0 && <div className="play-list">
                <Table headers={this.headers} classNames="play-list-table">
                    {this.props.playList && this.props.playList.map( item => 
                        <RowConnected item= {item} key={item.id}/>
                    )}
                </Table>
            </div>)
        )

    }
}

const mapStateToProps = (state) => ({
    playList : state.playList.list
})

export default connect(mapStateToProps)(PlayList);