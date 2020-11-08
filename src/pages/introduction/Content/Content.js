import React, {useEffect, useState} from "react";

import usePath from "../Hooks/usePath";
import selectors from "remark-css-selectors"
import unified from 'unified'
import parse from 'remark-parse';
import remark2rehype from "remark-rehype";
import rehypeReact  from "rehype-react"
import remarkCustomBlocks from 'remark-custom-blocks'

import "./content.scss";

const getMarkups = () => require.context('./../markups', true, /\.*md/).keys()

const load = (module) => import(
    /* webpackChunkName: "chunk-[request][index]" */
    `./../markups/${module}`
    ).then( module => module.default);

const Content = () => {
    const [currentPath] = usePath();
    const [md, setMd] = useState(null);
    const [content, setContent] = useState(null);

    useEffect(()=>{
        if(!currentPath.length) return;
        let pattern = "";
        currentPath.forEach( slug => pattern += "\\/?\\d?\\." + slug)
        pattern += "\\.md";
        let regex = new RegExp(pattern);
        let file = getMarkups().filter( path => regex.test(path))[0]?.replace("./", "");
        if(!file) return;
        load(file)
            .then(md => fetch(md))
            .then(response => response.text())
            .then(md => setMd(md))
    },[currentPath, setMd])

    useEffect(()=>{
        if(!md) return;
        const processed = unified()
            .use(parse)
            .use(selectors)
            .use(remarkCustomBlocks, {
                block: {
                    classes: 'block'
                },
            })
            .use(remark2rehype)
            .use(rehypeReact, {createElement: React.createElement})
            .processSync(md);
        setContent(processed.result);
    }, [md, setContent])


    return (
        <main className="introduction__content">
            <div className="introduction__content__wrapper">
                {content}
            </div>
        </main>
    )
}

export default Content;