import React from "react";
import {connect} from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowsAltV} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import {setPitchRange} from "../../../../../../actions";
import "./pitch-range-button.scss"

const PitchRangeButton = ({channel,range, setRange}) => {
    const ranges = [8, 16];

    const onClick = () => {
        const next = ranges[(ranges.indexOf(range) + 1) % ranges.length]
        setRange(next)
    }

    return (
        <Button className={`pitch-range-btn pitch-range-btn--${channel}`} onClick={onClick}>
            <FontAwesomeIcon icon={faArrowsAltV}/>  {range}
        </Button>
    )
}

const mapStateToProps = (state, ownProps) => ({
    range: state.console.channel[ownProps.channel].playBackState.pitch.max,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setRange: value => dispatch(setPitchRange(ownProps.channel, value))
})

export default connect(mapStateToProps, mapDispatchToProps)(PitchRangeButton);