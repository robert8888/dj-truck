import React, {useEffect} from "react";
import BoxesSection from "../BoxesSection/BoxesSection";
import "./top-genres.scss";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import useFetchGenresList from "../../Hooks/useFetchGenresList";

const TopGenres = () =>{
    const [items, fetchItems, aboard] = useFetchGenresList(7);
    useEffect(() => {
        fetchItems()
        return () => {
            aboard.current = true;
        }
    } ,  [fetchItems, aboard])

    if(!items) return null;

    return (
        <div className={"top-genres"}>
            <ErrorBoundary>
                <BoxesSection items={items} perRow={4}/>
            </ErrorBoundary>
        </div>
    )
}

export default TopGenres;