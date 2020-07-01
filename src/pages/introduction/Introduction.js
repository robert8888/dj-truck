import React, {useEffect} from "react";
import {setFooterType} from "./../../actions";
import {connect} from "react-redux";
import {Col, Container, Row} from "react-bootstrap";
import Content from "./Content/Content"
import Menu from "./Menu/Menu";
import "./introduction.scss";
import ErrorBoundary from "../common/components/ErrorBoundary/ErrorBoundary";

const Introduction = ({dispatch}) => {

    useEffect(() => {dispatch(setFooterType("default"))}, [dispatch])


    return (
        <ErrorBoundary>
            <div className="introduction">
                <Container className="container-xl">
                    {/*<svg preserveAspectRatio="none" width="100" height="100" className="introduction__background">*/}
                    {/*    <path d={"M 0 0 L 282 -2 L 1401 1026 L 1416 1266"}/>*/}
                    {/*</svg>*/}
                    <Row>
                        <Col xs={{span: 12, order:1}} lg={{span: 9, order:0}}>
                            <ErrorBoundary>
                                <Content/>
                            </ErrorBoundary>
                        </Col>
                        <Col xs={{span: 12, order:0}} lg={{span: 3, order:1}}>
                            <ErrorBoundary>
                                <Menu/>
                            </ErrorBoundary>
                        </Col>
                    </Row>
                </Container>
            </div>
        </ErrorBoundary>
    )
}

export  default connect()(Introduction);