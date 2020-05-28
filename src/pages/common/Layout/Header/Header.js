import classNames from "classnames";
import React, { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import LoadingBar from 'react-redux-loading-bar';
import { toRange } from "./../../../../utils/math/argRanges";
import "./header.scss";
import NavBar from "./NavBar/NabBar";

class Header extends React.Component {
  constructor() {
    super();

    this.barState = {
      barElement: React.createRef(null),
      barElementHeight: 0,
      translateY: 0,
      shiftTranslateY: 0,
      stickiState: false,
    }
    this.scrollState = {
      prevScrollDirection: null, // "up" or "down",
      prevScrollPosition: 0,
      snapPosition: null,
    }
  }

  startWatching() {
    window.addEventListener('scroll', this.scrollWatching.bind(this))
  }

  stopWatching() {
    window.removeEventListener('scroll', this.scrollWatching.bind(this))
  }

  scrollWatching(_) {
    const setTranslate = setTranslateFun.bind(this);
    const changeStickiClass = changeStickiClassFun.bind(this)

    const scrollDirection =
      (window.scrollY - this.scrollState.prevScrollPosition < 0) ? "up" : "down";

    if (scrollDirection !== this.scrollState.prevScrollDirection) {
      this.scrollState.snapPosition = window.scrollY;
      this.barState.shiftTranslateY = this.barState.translateY;
      // 
      if ((scrollDirection === "up") && (window.scrollY > this.barState.barElementHeight)) {
        changeStickiClass("add");
        // this has to be set afater refreshing so is added simply flag that is used only in this place
        if(!this.firstFlag){
          this.barState.shiftTranslateY = -this.barState.barElementHeight;
          this.firstFlag = true;
        }
      }
    }

    this.scrollState.prevScrollPosition = window.scrollY;
    this.scrollState.prevScrollDirection = scrollDirection;

    if (window.scrollY === 0) {
    //  console.log("set on int")
      setTranslate(0);
    } else if (this.barState.stickiState) {
      if (scrollDirection === "up") {
        let y = this.scrollState.snapPosition - window.scrollY + this.barState.shiftTranslateY;
        setTranslate(y);
      } else if (scrollDirection === "down") {
        let y = window.scrollY - this.scrollState.snapPosition - this.barState.shiftTranslateY;
        if (y < 1.5 * this.barState.barElementHeight) {
          setTranslate(-y);
        } else {
          changeStickiClass("remove");
        }
      }
    }



    function setTranslateFun(tY) {
      changeStickiClassFun.call(this, "add")
      tY = toRange(tY, -this.barState.barElementHeight, 0);
      this.barState.barElement.current.style.transform = `translateY(${tY}px)`;
      this.barState.translateY = tY;
    }
    function changeStickiClassFun(action) {
      if (action === "add") {
        this.barState.barElement.current.classList.add("bar--sticki");
        this.barState.stickiState = true;
      } else if (action === "remove") {
        this.barState.barElement.current.classList.remove("bar--sticki");
        this.barState.stickiState = false;
      }
    }
  }

  updateState(prevProps) {
    if (this.props.sticki) {
      this.startWatching();
    } else {
      this.stopWatching();
    }
  }

  componentDidMount() {
    this.updateState();
    this.barState.barElementHeight =
      this.barState.barElement.current.getBoundingClientRect().height;
  }

  componentDidUpdate(prevProps) {
    this.updateState(prevProps);
  }

  render() {
    return (
      <Fragment>
        <LoadingBar className="loading-bar" />
        <header
          className={classNames("top-bar", {
            "bar--hidden": this.props.hidden,
            "bar--dissabled": this.props.dissabled
          })}
          ref={this.barState.barElement}>
          <Container className="app layout container-xl" >
            <Row>
              <Col>
                <NavBar className="navigation-bar" />
              </Col>
            </Row>
          </Container>
        </header>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  sticki: state.layout.header.sticki,
  hidden: state.layout.header.hidden,
  disabled: state.layout.header.disabled,
})

export default connect(mapStateToProps)(Header);