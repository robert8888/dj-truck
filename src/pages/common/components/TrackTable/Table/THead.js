import React from 'react';
import UUID from 'uuidjs'

export default function THead({cols, ...props}){
    return (
        <thead {...props}>
            <tr>
                { cols && Object.entries(cols).map( ([col, colMap]) => (
                    <th key={UUID.genV1()} className={"th-"+(colMap || col)}>{col}</th>
                ))}
            </tr>
        </thead>
    )
}