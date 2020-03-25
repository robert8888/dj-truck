import {connect} from "react-redux";

export default function mapComponentToParameter(param, Component){
    const mapStateToProps = state => {
        const effect = state.effector.channels[param.channel].effects[param.effect];
        if(effect){
            return {
                value : effect[param.name]
            }
        } else {
            return {}
        }
    }

    return connect(mapStateToProps)(Component);
}