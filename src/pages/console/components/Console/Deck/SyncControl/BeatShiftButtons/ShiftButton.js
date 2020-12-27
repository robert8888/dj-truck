import React, {useCallback, useRef} from "react";
import {connect} from "react-redux";
import HoldButton from "pages/common/components/HoldButton/HoldButton";
import withControlMapping from "../../../Control/withControlMapping";

const rate = 5;

const ShiftButton = ({className, children, direction, update, pitch}) =>{
    const cache = useRef();

    const updatePitch = useCallback((mode) => {
        if(mode === "on"){
            const sign = direction === "forward" ? 1 : -1;
            const to = pitch + sign * rate;
            cache.current = pitch;
            update(to);
        } else if(mode === "off"){
            update(cache.current)
        }
    }, [pitch, update, cache, direction])

    return (
        <HoldButton className={className}
                    onHold={updatePitch.bind(null, "on")}
                    onRelease={updatePitch.bind(null, "off")}>
            {children}
        </HoldButton>
    )
}

const mapStateToProps = (state, {get}) => ({
    pitch: get(state),
})

const mapDispatchToProps = (dispatch, {set}) => ({
    update: (value) => dispatch(set(value))
})

export default withControlMapping(connect(mapStateToProps, mapDispatchToProps)(ShiftButton));

