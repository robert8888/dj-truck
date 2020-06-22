import React, { useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col, Button } from "react-bootstrap";
import classNames from "classnames";
import UUID from "uuidjs"


const Advantage = ({ header, text, link, image, side = "left" }) => {
    const random = useCallback((range)=>{
        return ~~(Math.random() * range)
    },[])

    const animationSetup = useCallback(col => ({
        "data-aos-once": "true",
        "data-aos-anchor-placement": "top-center",
        "data-aos": (col === "right") ? 
            ["lg-fade-left", "lg-fade-down-left", "lg-fade-up-left"][random(3)] : 
            ["lg-fade-right", "lg-fade-down-right", "lg-fade-up-right"][random(3)] 
    }), [random])

    const imageCol = useMemo(() => {
        if (!image) return null;
        return (
            <div className="adv-section-image">
                <img src={image} alt="advantages section" />
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
            <div className="adv-section-content">
                <div>
                    <div className="line" />
                    <h4 className="adv-section-title">
                        {headers.map(h => (<span key={UUID.genV1()}><b >{h.bold}</b>{h.normal}</span>))}
                    </h4>
                </div>
                <p className="adv-section-content text">{text}</p>
                <Link to={link.to}><Button>{link.text}</Button></Link>
            </div>
        )
    }, [header, link, text, headers])

    const mobileCol = useCallback(name => ({
        span: 12,
        order: (name === "image") ? 1 : 2,
    }), [])

    if (!header || !text || !image) return null;

    const sectionClass = classNames("advantage", {
        "section-left": (side === "left"),
        "section-right": (side === "right")
    })

    return (
        <section className={sectionClass}>
            <Container>
                <Row>
                    <Col sm={{ ...(mobileCol((side === "left") ? "image" : "content")) }}
                        lg={{ span: 6, order: 1 }}>
                        <div {...animationSetup("left")}>
                            {(side === "left") ? imageCol : contentCol}
                        </div>
                    </Col>
                    <Col sm={{ ...mobileCol((side === "right") ? "image" : "content") }}
                        lg={{ span: 6, order: 1 }}>
                        <div {...animationSetup("right")}>
                            {(side === "right") ? imageCol : contentCol}
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Advantage;