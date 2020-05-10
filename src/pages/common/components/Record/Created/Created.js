import React, { useMemo } from 'react';
import {useFormatRelative} from "./../../../Hooks/useFormatDate";
import "./created.scss"

const Created = ({ date: timestamp }) => {

    const [formatRelative] = useFormatRelative();
    const dateFormated = useMemo(()=>{
        return formatRelative(timestamp, {timezone: true})
    },[timestamp, formatRelative])

    return (
        <div className="record-created">
            <span>{dateFormated}</span>
        </div>
    )
}


export default Created;