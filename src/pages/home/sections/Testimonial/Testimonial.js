import React from "react";
import UUID from "uuidjs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar as fillStar} from "@fortawesome/free-solid-svg-icons";
import {faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";

const Testimonial = ({
    data : {
        stars,
        text,
        author: {
            name: authorName,
            position: authorPosition,
            image: authorImage,
        } = {}
    } = {}
}) => {

    return (
        <div className="testimonial">
            <div className="stars">
                {Array(5).fill(1).map((e, i) => 
                    <FontAwesomeIcon key={UUID.genV1()} icon={((i < stars) ? fillStar : emptyStar )}/>)
                }
            </div>
            <p className="text">
                {text}
            </p>
            <div className="testimonial-author">
                <img src={authorImage || "/testimonials/user-anonymous.png"} alt="testimonial author"/>
                <h5 className="author-name">{authorName}</h5>
                <h6 className="author-position">{authorPosition}</h6>
            </div>
        </div>
    )
}

export default Testimonial;