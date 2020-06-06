
import React from "react";
import Record from "./../Record/Record";
import "./record-list.scss";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const RecordList = React.memo(({ list, player, controls }) => {

    return (
        <ErrorBoundary>
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
        </ErrorBoundary>
    )
})

export default RecordList;