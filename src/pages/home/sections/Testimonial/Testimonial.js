import React from "react";
import UUID from "uuidjs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar as fillStar, faQuoteRight} from "@fortawesome/free-solid-svg-icons";
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
            <header>
                <FontAwesomeIcon icon={faQuoteRight} className="testimonial__quote icon"/>
                <div className="testimonial__rank">
                    {Array(5).fill(1).map((e, i) =>
                        <FontAwesomeIcon key={UUID.genV1()}  className="icon" icon={((i < stars) ? fillStar : emptyStar )}/>)
                    }
                </div>
            </header>
            <p className="testimonial__text">
                {text}
            </p>
            <footer className="testimonial__author">
                <picture>
                    <source srcSet={authorImage + ".webp"} type={"image/webp"}/>
                    <source srcSet={authorImage + ".png"} type={"image/png"}/>
                    <source srcSet={"/testimonials/user-anonymous.webp"} type={"image/webp"}/>
                    <source srcSet={"/testimonials/user-anonymous.png"} type={"image/png"}/>
                    <img src={"/testimonials/user-anonymous.png"} alt="testimonial author"/>
                </picture>
                <h5 className="testimonial__author__name">{authorName}</h5>
                <h6 className="testimonial__author__position">{authorPosition}</h6>
            </footer>
        </div>
    )
}

export default Testimonial;