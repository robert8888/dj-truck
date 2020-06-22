import React from "react";
import {Col} from "react-bootstrap"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Link} from "react-router-dom";

const Feature = ({icon, header, text, link, animationDelay}) => {
    return (
        <Col lg={4} md={7} sm={8} className="feature-col">
            <div className="single-feature" 
                 data-aos="lg-flip-left" 
                 data-aos-offset="300" 
                 data-aos-delay={animationDelay}
                 data-aos-anchor-placement="top-bottom"
                 data-aos-once="true">
                <div className="feature-icon">
                    <FontAwesomeIcon className="icon" icon={icon}/>
                </div>
                <h5 className="feature-title">
                    <Link to={link}>{header}</Link>
                </h5>
                <p className="text">
                    {text}
                </p>
                <Link to={link} className="link-more">Learn more </Link>
            </div>

        </Col>
    )
}

export default Feature;