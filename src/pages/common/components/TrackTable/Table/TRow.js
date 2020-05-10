import React from "react";
import UUIDClass from "uuidjs";

const TRow = ({cols, data, ...props}) => {

    return (
        <tr {...props}>
            {(cols && data) &&
                Object.entries(cols).map( ([col, opt]) => (
                    <td className={col} key={UUIDClass.genV1()} {...(opt.class ? {className: opt.class} : {})}>
                        {data[opt.map || col]}
                    </td>
                ))
            }
        </tr>
    )
}

export default TRow;