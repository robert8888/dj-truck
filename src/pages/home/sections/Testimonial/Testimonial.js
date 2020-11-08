import React, {useEffect, useState} from "react";
import UUID from "uuidjs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar as fillStar, faQuoteRight} from "@fortawesome/free-solid-svg-icons";
import {faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";

const Testimonial = React.memo(({
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
    const [authorImageSrc, setAuthorImageSrc] = useState("/testimonials/user-anonymous");
    useEffect(()=>{
        const img = <img scr={authorImage} alt={""} onError={() => console.log("can find image")} onLoad={() => {
            setAuthorImageSrc(authorImage)
        }}/>
    }, [setAuthorImageSrc, authorImage])


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
                    <source srcSet={(authorImageSrc || "/testimonials/user-anonymous") + ".webp"} type={"image/webp"}/>
                    <source srcSet={(authorImageSrc ||"/testimonials/user-anonymous") + ".png"} type={"image/png"}/>
                    <img src={"/testimonials/user-anonymous.png"} alt="testimonial author"/>
                </picture>
                <h5 className="testimonial__author__name">{authorName}</h5>
                <h6 className="testimonial__author__position">{authorPosition}</h6>
            </footer>
        </div>
    )
}, () => true)

export default Testimonial;