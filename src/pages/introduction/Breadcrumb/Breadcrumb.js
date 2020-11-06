import React, {useCallback, useMemo} from "react";
import usePath from "../Hooks/usePath";
import "./beadcrumb.scss";

const Breadcrumb = () => {
    const [path] = usePath();
    const fullPath = useMemo(()=> ["introduction", ...path], [path])

    const getSpan = useCallback(text => <span>{text}</span>,[])

    const renderItem = useCallback((item, index, path) => {
        return (
            <li key={item} className={"breadcrumb__item"}>
                {getSpan(item)}
            </li>
        )
    }, [getSpan])

    return (
        <ol className={"breadcrumb"}>
            {fullPath && fullPath.map((item, index) => renderItem(item, index, fullPath))}
        </ol>
    )
}

export default Breadcrumb;