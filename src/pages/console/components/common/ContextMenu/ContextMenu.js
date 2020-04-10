import React , { useCallback, useRef, useEffect } from "react";
import { ContextMenu, MenuItem } from "react-contextmenu"
import UUID from "uuidjs";
import "./context-menu.scss";


const CtxMenu = props => {
    const contextNav = useRef();

    useEffect(() => {
        if (!contextNav.current.addEventListener) {
            return;
        }
        
        contextNav.current.addEventListener =
            contextNav.current.addEventListener._original;
    }, [contextNav])

    const menuItems = useCallback(() => {
        return Object.entries(props.items).map(([text, handler], index) => 
             (<MenuItem key={UUID.genV1()} onClick={handler}>
                {text}
            </MenuItem>)
        )
    }, [props.items])

    return (
            <ContextMenu id={props.id} ref={contextNav} {...props.handlers}>
                {menuItems()}
            </ContextMenu>
    )
}

export default CtxMenu;