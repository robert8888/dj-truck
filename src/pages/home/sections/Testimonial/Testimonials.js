import React, {useEffect, useState, useCallback, useRef} from "react";
import Testimonial from "./Testimonial";
import Slider from "./../../../common/components/Carousel-slider/Slider";
import {Container, Row, Col} from "react-bootstrap"
import "./testimonials.scss";
import SliderControl from "../../../common/components/Carousel-slider/SliderControls";

const getTestimonials = () => require.context('./testimonials', true, /\.json$/).keys();

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState(null);

    const nextSlideHandle = useRef()
    const prevSlideHandle = useRef();

    const testimonialsJsons = useCallback(() => getTestimonials().map(file => {
        return import("./testimonials" + file.substr(1, file.length));
    }), []);

    useEffect(() => {
        if (!testimonialsJsons) return;
        Promise.all(testimonialsJsons())
            .then(jsons => jsons.map(module => module.default))
            .then(testimonials => {
                setTestimonials(testimonials)
            })
    }, [testimonialsJsons, setTestimonials])


    if (!testimonials) return null;
    return (
        <section className="home-testimonial">
            <Container>
                <div className="testimonial-slider">
                    <Row className="slide-wrapper">
                        <Col sm={12}>
                            <Slider
                                slides={testimonials.map(tst => <Testimonial data={tst}/>)}
                                next={handle => {
                                    nextSlideHandle.current = () => handle();
                                }}
                                prev={handle => {
                                    prevSlideHandle.current = () => handle()
                                }}
                            />
                        </Col>
                    </Row>
                </div>
                <Row>
                    <Col sm={12}>
                        <div className="testimonial-slider-control">
                            <SliderControl
                                next={() => nextSlideHandle.current()}
                                prev={() => prevSlideHandle.current()}/>

                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Testimonials;