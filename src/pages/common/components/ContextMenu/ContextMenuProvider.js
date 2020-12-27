import React from "react";
import {useContextMenu} from "react-contexify";

const ContextMenuProvider = ({children, id}) => {
   const {show} = useContextMenu({id})

    return (
        <div onContextMenu={show}>
            {children}
        </div>
    )
}

export default ContextMenuProvider;