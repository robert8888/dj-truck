import React, {useEffect, useMemo} from "react";
import {setFooterType} from "./../../actions";
import {connect} from "react-redux";
import {Col, Container, Row} from "react-bootstrap";
import Content from "./Content/Content"
import Menu from "./Menu/Menu";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import "./introduction.scss";
import ErrorBoundary from "../common/components/ErrorBoundary/ErrorBoundary";
import Separator from "./Separator/Separator";
import Footer from "../common/Layout/Footer/Footer";

const Introduction = ({dispatch}) => {
    useEffect(() => {dispatch(setFooterType("none"))}, [dispatch])

    return (
        <ErrorBoundary>
            <div className="introduction">
                <Separator placement="top" content={<Breadcrumb/>}/>
                <div className={"introduction__background"}>
                    <Container className="container-xl">
                        <Row>
                            <Col xs={{span: 12, order:0}} lg={{span: 3, order:1}}>
                                <ErrorBoundary>
                                    <Menu/>
                                </ErrorBoundary>
                            </Col>
                            <Col xs={{span: 12, order:1}} lg={{span: 9, order:0}}>
                                <ErrorBoundary>
                                    <Content/>
                                </ErrorBoundary>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <Separator placement={"bottom"} content={<Footer/>}/>
            </div>
        </ErrorBoundary>
    )
}

export  default connect()(Introduction);