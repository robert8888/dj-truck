import React from "react";
import {connect} from "react-redux";
import {Log} from "./../../../../utils/logger/logger";
import {pushLog, clearPublicError} from "./../../../../actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSyncAlt} from "@fortawesome/free-solid-svg-icons"
import {Button} from "react-bootstrap";
import "./error-boundary.scss"

class ErrorBoundary extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            hasError : false,
            error : null,
        }
    }

    static getDerivedStateFromError(error, info){
        return {
            hasError : true,
            error,
            info
        }
    }

    componentDidCatch(error, info){
        this.props.push(Log.Error(
            info.componentStack,
            "Component throw Error: " + error.message,
            "Sorry. Something went wrong :(. One of application component doesn't work correctly.",
            error,
        ))
    }

    clearError(){
        this.setState(()=> ({
            hasError: false,
        }))
        this.props.clear();
    }

    render(){
        if(this.state.hasError){
            return (
                <div className="componet-error-container">
                    <h6>Sorry. Something went wrong. Component does not work correctly.</h6>
                    <Button onClick={this.clearError.bind(this)}><FontAwesomeIcon icon={faSyncAlt}/></Button>
                </div>
            )
        } 
        
        return this.props.children;
    }
}

const mapDispatchToProps = dispatch => ({
    push : log => dispatch(pushLog(log)),
    clear: () => dispatch(clearPublicError()),
})

export default connect(null, mapDispatchToProps)(ErrorBoundary);