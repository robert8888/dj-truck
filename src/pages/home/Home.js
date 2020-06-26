import React, { useEffect } from "react";
import {connect} from "react-redux";
import {setFooterType} from "./../../actions";

import Intro from "./sections/Intro";
import Logos from "./sections/Logos";
import Features from "./sections/Features/Features";
import Advantages from "./sections/Advantages/Advantages";
import Testimonials from "./sections/Testimonial/Testimonials";
import Encourage from "./sections/Encourage";

import "./home.scss";


const Home = ({setFooter})=>{
    useEffect(()=>{
        setFooter();
    }, [setFooter])


    return (

            <div className="home">
                <Intro/>
                <Logos/>
                <Features/>
                <Advantages/>
                <Testimonials/>
                <Encourage/>
            </div>

    )
}

export default connect(null, dispatch => ({
    setFooter: () => dispatch(setFooterType("default"))
}))(Home);