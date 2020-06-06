import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import ErrorBoundary from "./../ErrorBoundary/ErrorBoundary";
import { connect } from "react-redux";
import { LOG_TYPES } from "./../../../../utils/logger/logger";
import "./logger.scss";



const Logger = ({ log }) => {
    const [hidden, setHidden] = useState(true);

    useEffect(()=>{
        if(!log){
            setHidden(true)
        } else {
            setHidden(false);
        }
    },[log])

    const createHeader = useCallback((text, className = "") => {
        return <h6 className={"logger-header " + className}>{text}</h6>
    }, []);

    const header = useMemo(()=>{
        if(!log) return; 
        
        switch(log.type){
            case LOG_TYPES.ERROR : {
                return createHeader("Error:", "logger-header-error");
            }
            case LOG_TYPES.WARNING: {
                return createHeader("Warning:", "logger-header-warning")
            }
            case LOG_TYPES.DEBUG: {
                return createHeader("Debug:", "logger-header-debug");
            }
            case LOG_TYPES.LOG : {
                return createHeader("Logger:");
            }
            default: return null;
        }
    }, [log, createHeader])

    const content = useMemo(()=>{
        if(!log) return;
        
        switch(log.type){
            case LOG_TYPES.DEBUG: {
                return (
                    <pre className="logger-message logger-pre">
                        {log.message}
                    </pre>
                )
            }
            default: return (
                <p className="logger-message">
                    {log.message}
                </p>
            )
        }
    }, [log])

    const path = useMemo(()=>{
        if(!log) return;
        
        if(!log.path){
            return null;
        }
        return (
            <ul className="logger-path">
                {log.path && log.path.length && log.path.map( (part , index) => 
                    <li key={part + index} > {part} </li>
                )}
            </ul>
        )
    }, [log])
  
    const loggerClasses = useMemo(()=>{
        return classNames(
            'logger',
            {'logger--hidden': hidden}
        )
    }, [hidden])
    
    return (
        <ErrorBoundary>
            <Container className="app layout container-xl" >
                <Row><Col>
                    <div className={loggerClasses}>
                        <Button className="btn-close" onClick={setHidden.bind(null, true)}>
                            <FontAwesomeIcon icon={faTimesCircle}/>
                        </Button>
                        {header}
                        {content}
                        {path}
                    </div>
                </Col></Row>
            </Container>
        </ErrorBoundary>
    )
}

const mapStateToProps = state => ({
    log: state.logger.last ,
})

export default connect(mapStateToProps)(Logger);