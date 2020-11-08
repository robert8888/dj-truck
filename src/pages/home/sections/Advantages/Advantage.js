import React, { useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col, Button } from "react-bootstrap";
import classNames from "classnames";
import UUID from "uuidjs"
import Rosa from "react-on-scroll-animation";


const Advantage = ({ header, text, link, image, side = "left" }) => {
    const random = useCallback((range)=>{
        return ~~(Math.random() * range)
    },[])


    const animation = useCallback(col => (col === "right") ?
        ["fade-left",  "fade-up-left"][random(2)] :
        ["fade-right", "fade-up-right"][random(2)]
    , [random])


    const imageCol = useMemo(() => {
        if (!image) return null;
        return (
            <div className="advantage-section__image">
                <picture>
                    <source srcSet={image + ".webp"} type="image/webp"/>
                    <source srcSet={image + ".png"} type="image/png"/>
                    <img src={image + ".png"} alt="Advantages section"/>
                </picture>
            </div>
        )
    }, [image])


    const headers = useMemo(()=>{
        if (!(header instanceof Array)) 
            return [header];
        return header;
    }, [header])

    const contentCol = useMemo(() => {
        if (!header || !text) return null;

        return (
            <div className="advantage-section__content">
                <div>
                    <div className="advantage-section__line" />
                    <h4 className="advantage-section__title">
                        {headers.map(h => (<span key={UUID.genV1()}><b >{h.bold}</b>{h.normal}</span>))}
                    </h4>
                </div>
                <p className="advantage-section__text">
                    {(text instanceof Array ) ? text.join("") : text}
                </p>
                <Link to={link.to}><Button>{link.text}</Button></Link>
            </div>
        )
    }, [header, link, text, headers])

    const mobileCol = useCallback((column) => {
        let name;
        if(column === 1){
            name = (side === "left") ? "image" : "content";
        } else if(column === 2){
            name = (side === "right") ? "image" : "content";
        }
        return ({
        span: 12,
        order: (name === "image") ? 1 : 2,
    })}, [side])

    const sectionClass = useMemo(() => classNames(
        "advantage-section", {
        "section-left": (side === "left"),
        "section-right": (side === "right")
    }), [side])

    if (!header || !text || !image) return null;

    return (
        <section className={sectionClass}>
            <Container>
                <Row>
                    <Col sm={{...(mobileCol(1))}}
                         xs={{...(mobileCol(1))}}
                         lg={{ span: 6, order: 1 }}>
                         <Rosa animation={animation("left")} offset={200} disable="phone" once>
                            {(side === "left") ? imageCol : contentCol}
                         </Rosa>
                    </Col>
                    <Col sm={{...mobileCol(2)}}
                         xs={{...(mobileCol(2))}}
                         lg={{ span: 6, order: 2 }}>
                         <Rosa animation={animation("right")} offset={200} disable="phone" once>
                            {(side === "right") ? imageCol : contentCol}
                         </Rosa>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Advantage;