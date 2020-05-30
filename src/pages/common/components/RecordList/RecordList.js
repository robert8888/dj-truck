
import React, { Fragment } from "react";
import Record from "./../Record/Record";
import "./record-list.scss";

const RecordList = React.memo(({ list, player, controls }) => {

    return (
        <Fragment>
            <ul className="record-list">
                {list && list.map(record => {
                    return <li className="record-list-item" key={record.id + "-list"}>
                        <Record
                            key={record.id}
                            record={record}
                            player={player}
                            controls={controls} />
                    </li>
                })}
            </ul>
        </Fragment>
    )
})

export default RecordList;