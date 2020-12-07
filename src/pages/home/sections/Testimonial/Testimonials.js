import React, {useEffect, useState, useCallback, useRef} from "react";
import Testimonial from "./Testimonial";
import Slider from "pages/common/components/CarouselSlider/Slider";
import {Container, Row, Col} from "react-bootstrap"
import "./testimonials.scss";
import SliderControl from "pages/common/components/CarouselSlider/SliderControls";

const getTestimonials = () => require.context('./testimonials', true, /\.json$/).keys();

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState(null);

    const nextSlideHandle = useRef()
    const prevSlideHandle = useRef();
    const setSlideHandle = useRef();
    const changeSlideHandle = useRef();

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
                <Row className="section__header">
                    <Col lg={12} xs={12}>
                        <div >
                            <div className="line"/>
                            <h3 className="section__title">
                                Users sharing<span className="light"> their experience</span>
                            </h3>
                        </div>
                    </Col>
                </Row>
                <div className="home-testimonial__slider">
                    <Row className="slide__wrapper">
                        <Col sm={12}>
                            <Slider
                                slides={testimonials.map(tst => <Testimonial data={tst}/>)}
                                next={handle => {
                                    nextSlideHandle.current = () => handle();
                                }}
                                prev={handle => {
                                    prevSlideHandle.current = () => handle()
                                }}
                                set={ handle => {
                                    setSlideHandle.current = (...args) => handle(...args);
                                }}
                                onChange={current => changeSlideHandle.current(current)}
                                minSlideWidth={'300px'}
                                auto={3000}
                            />
                        </Col>
                    </Row>
                </div>
                <Row>
                    <Col sm={12}>
                        <div className="testimonial__slider__control">
                            <SliderControl
                                next={() => nextSlideHandle.current()}
                                prev={() => prevSlideHandle.current()}
                                set={(target)=> setSlideHandle.current(target)}
                                update={ handle => {
                                    changeSlideHandle.current = (...arg) => handle(...arg)
                                }}
                                size={testimonials.length}
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Testimonials;