import React, {useEffect} from "react";
import "./genres.scss";
import ErrorBoundary from "../common/components/ErrorBoundary/ErrorBoundary";
import BoxesSection from "../common/components/BoxesSection/BoxesSection";
import useFetchGenresList from "../common/Hooks/useFetchGenresList";
import {Col, Container, Row} from "react-bootstrap";

const Genres = () =>{
    const [items, fetchItems] = useFetchGenresList();
    useEffect(() => fetchItems() ,  [fetchItems])

    if(!items) return null;

    return (
        <div className={"page--genres"}>
            <Container className={"container-xl"}>
                <Row>
                    <Col xs={12}>
                        <div className={"genres__section"}>
                            <h3 className={"genres__title"}>
                                Music genres are like boxes for individuality
                            </h3>
                            <h6 className={"genres__subtitle"}>
                                Choose from many music genres among which you will surely find something for yourself.
                            </h6>
                        </div>
                    </Col>
                </Row>
                <ErrorBoundary>
                    <Row>
                        <Col xs={12}>
                            <BoxesSection items={items} perRow={6}/>
                        </Col>
                    </Row>
                </ErrorBoundary>

            </Container>
        </div>
    )
}

export default Genres;