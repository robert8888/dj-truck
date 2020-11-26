import React, {useEffect, useState} from "react";

import usePath from "../Hooks/usePath";
import selectors from "remark-css-selectors"
import unified from 'unified'
import parse from 'remark-parse';
import remark2rehype from "remark-rehype";
import rehypeReact  from "rehype-react"
import remarkCustomBlocks from 'remark-custom-blocks'
import picture from "rehype-picture"

import "./content.scss";
import "./markups.scss";
import useImageMagnific from "../../common/Hooks/useImageMagnific";

const getMarkups = () => require.context('./../markups', true, /\.*md/).keys()

const load = (module) => import(
    /* webpackChunkName: "chunk-[request][index]" */
    `./../markups/${module}`
    ).then( module => module.default);

const Content = () => {
    const [currentPath] = usePath();
    const [md, setMd] = useState(null);
    const [content, setContent] = useState(null);
    const [container, popup, update] = useImageMagnific({
        minResolution: 1920,
        mobileOnly: false,
    })

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
            .use(picture, {
                png: {webp: 'image/webp'},
            })
            .use(rehypeReact, {createElement: React.createElement})
            .processSync(md);
        setContent(processed.result);
    }, [md, setContent])


    useEffect(()=>{
        update();
    }, [content, update])

    return (
        <>
        <main className="introduction__content">
            <div className="introduction__content__wrapper" ref={container}>
                {content}
            </div>
        </main>
        {popup}
        </>
    )
}

export default Content;