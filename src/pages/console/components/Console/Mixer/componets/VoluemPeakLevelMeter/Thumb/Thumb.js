import React from "react";
import "./thumb.scss";

const Thumb = React.forwardRef(({aspect, onMouseDown}, ref) => {

    return (
        <div ref={ref}
             onMouseDown={onMouseDown}
             onDragStart={e => e.preventDefault()}
             className={"volume-plm__thumb volume-plm__thumb--" + aspect}>
            <div className={"thumb thumb--" + aspect}>
                <div className={"thumb__triangle thumb__triangle--" + aspect}/>
                <div className={"thumb__bar thumb__bar--" + aspect}/>
                <div className={"thumb__triangle thumb__triangle--" + aspect}/>
            </div>
        </div>
    )
})

export default Thumb;