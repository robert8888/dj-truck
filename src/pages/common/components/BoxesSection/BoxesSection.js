import React, {useCallback, useMemo} from "react";
import {Link} from "react-router-dom";
import "./boxes-section.scss";

const BoxesSection = ({items}) => {

    const renderItems = useCallback((item, index) => {
        return (
            <li key={item.title + "-" + index} className={"boxes-section__item"}>
                <Link to={item.link}>{item.title}</Link>
            </li>
        )
    }, [])

    const render = useCallback((data)=>{
        return (
            <div className={"boxes-section__container"}>
                <ol className={"boxes-section__row"}>
                 {data.map((item, i) => renderItems(item, i))}
                </ol>
            </div>
        )
    }, [renderItems])

    const content = useMemo(() => render(items)
    , [render, items])

    return (
        <div className={"boxes-section"}>
            {content}
        </div>
    )
}

export default BoxesSection;