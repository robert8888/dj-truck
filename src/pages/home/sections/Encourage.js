import React, {useMemo} from "react";
import {Col, Container, Row, Button} from "react-bootstrap";
import Rosa from "react-on-scroll-animation"
import {useAuth0} from "./../../../auth0/react-auth0-spa";
import { useHistory } from "react-router-dom";
import "./encourage.scss";

const Encourage = () => {
    const {isAuthenticated, loading, loginWithPopup} = useAuth0();
    const history = useHistory();


    const backgroundSvg = useMemo(() => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
                fill="#fafafa"
                d="m 0 7 q 9 17 26 16 q 22 -3 30 6 q 9 10 28 7 q 14 -3 28 0 q 9 4 21 5 v -41 h -133 z"
           />
        </svg>
    ), []);

    const content = useMemo(()=>{
        const title = {main: "", sub: ""};
        const button = {text: "", action: () => null};

        if(isAuthenticated || loading){
            title.main = "Don't waste your time"
            title.sub = " start develop your talent now"
            button.text = "Run application"
            button.action = () => history.replace('/console')
        } else {
            title.main = "Don't waste your time"
            title.sub = " start develop your talent now"
            button.text = "Create account"
            button.action = () => loginWithPopup();
        }

        return (
            <>
                <Rosa animation="zoom-in" anchorPlacement="bottom-bottom" offset={100} once className="encourage">
                    <Col xs={12} lg={8}>
                        <h4 className="encourage__title">{title.main} </h4>
                        <h5 className="encourage__subtitle">{title.sub} </h5>
                    </Col>
                    <Col xs={12} lg={4} className="col button">
                        <Button className="encourage__button" onClick={button.action.bind(null)}>{button.text}</Button>
                    </Col>
                </Rosa>
            </>
        )

    }, [loading, isAuthenticated, history, loginWithPopup])


    return (
        <section className="home-encourage">
            {backgroundSvg}
            <Container>
                <Row>
                    <Col xs={12} lg={9}>
                    {content}
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Encourage;