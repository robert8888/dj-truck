import React, {useCallback, useMemo} from "react";
import usePath from "../Hooks/usePath";
import "./beadcrumb.scss";
import {Link} from "react-router-dom";


const Breadcrumb = () => {
    const [path] = usePath();
    const fullPath = useMemo(()=> ["introduction", ...path], [path])

    const getLink = useCallback((text, path, index) => {
        const to = "/" + path.slice(0, index + 1).join("/")
        return <Link to={to}>{text}</Link>
    }, [])

    const getSpan = useCallback(text => <span>{text}</span>,[])

    const renderItem = useCallback((item, index, path) => {
        const current = index === path.length - 1;
        return (
            <li key={item} className={"breadcrumb__item"}>
                {getSpan(item)}
            </li>
        )
    })

    return (
        <ol className={"breadcrumb"}>
            {fullPath && fullPath.map((item, index) => renderItem(item, index, fullPath))}
        </ol>
    )
}

export default Breadcrumb;