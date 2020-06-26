import React from "react";
import {Col} from "react-bootstrap"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Link} from "react-router-dom";
import Rosa from "react-on-scroll-animation";

const Feature = ({icon, header, text, link, order}) => {
    return (
        <Col lg={4} md={7} sm={8} className="feature__col">
            <Rosa className="feature"
                  animation="flip-left"
                  offset={-300}
                  delay={100 + order * 200}
                  anchorPlacement="top-bottom"
                  once>
                <div className="feature__icon">
                    <FontAwesomeIcon className="icon" icon={icon}/>
                </div>
                <h5 className="feature__title">
                    <Link to={link}>{header}</Link>
                </h5>
                <p className="feature__text text">
                    {text}
                </p>
                <Link to={link} className="feature__link">Learn more </Link>
            </Rosa>
        </Col>
    )
}

export default Feature;