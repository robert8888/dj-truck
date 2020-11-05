import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {set} from "lodash/object";
import UUID from "uuidjs";
import "./menu.scss"
import usePath from "../Hooks/usePath";
import Spacer from "./Spacer";

const getMarkups = () => require.context('./../markups', true, /\.*.md$/).keys();

const Menu = () => {
    const [markups, setMarkups] = useState();
    const [structure, setStructure] = useState();
    const [currentPath] = usePath();
    const menu = useRef();

    const escapeNumberRegex = useMemo(() => /^\d?\./, [])

    useEffect(() => {
        setMarkups(getMarkups())
    }, [setMarkups])

    useEffect(() => {
        if (!markups) return;
        let _structure = {};
        markups.forEach(item => {
            let path = item.substr(2, item.length).split("/")
                .map(part => part.replace(".md", ""))
            set(_structure, path, item)
        });
        setStructure(_structure);
    }, [markups, setStructure])

    const target = useCallback(path =>
        "/introduction/" + path.map( slug => slug.replace(escapeNumberRegex, "")).join("/")
        , [escapeNumberRegex])

    const name = useCallback( path =>
        path.map( slug => slug.replace(escapeNumberRegex, "")).join('-').replace(" ", "-")
    , [escapeNumberRegex])

    const renderListItem = useCallback((path, slug)=>{
        return (
            <li key={UUID.genV1()}
                className={"menu__item menu__" + name([...path, slug])}>
                <Link to={target([...path, slug])}>
                    {slug.replace(escapeNumberRegex, "")}
                </Link>
            </li>
        )
    }, [name, escapeNumberRegex, target])

    const renderSublistItem = useCallback((path, slug, sublist,  renderList) => {
        return (
            <li key={UUID.genV1()}
                className={"menu__item menu__item--catalog menu__" + name([...path, slug])}
                onClick={ e =>{
                    e.stopPropagation();
                    e.target.closest("li").classList.toggle("menu__item--open");
                }}>
                <div>
                    <h6>
                        {slug.replace(escapeNumberRegex, "")}
                    </h6>
                    <i/>
                </div>
                {renderList(sublist, [...path, slug])}
            </li>
        )
    },[name, escapeNumberRegex])

    const renderList = useCallback((list, path = []) => {
        const items = Object.entries(list).map(([key, value]) => {
            if (typeof value === "string") {
                return renderListItem(path, key);
            } else if (typeof value === "object") {
                return renderSublistItem(path, key, value,  renderList);
            }
            return null;
        });

        return (
             <ul key={UUID.genV1()}
                 className={"menu__list menu__list--depth-" + path.length}>
                    {items}
             </ul>
        )
    }, [renderSublistItem, renderListItem])


    const updateLast = () => {
        setTimeout(() =>{
            for(let item of menu.current.querySelectorAll(".menu__list__item--last")){
                item.classList.remove(".menu__list__item--last")
            }

            let last = Array.from(menu.current.querySelectorAll(".menu__item:last-of-type"));
            last.forEach(item => {
                if(item.parentElement.closest(".menu__item:last-of-type") || !item.parentElement.closest(".menu__item")){
                    console.log("the last item", item)
                    item.classList.add("menu__item--last")
                }
            })
        }, 100)
    }

    const content = useMemo(()=>{
        if(!structure) return null;
        const result = renderList(structure, [])
        updateLast();
        return result;
    }, [structure, renderList])

    useEffect(()=>{
        if(!content) return;
        let current = [];
        for(let i= 0; i < currentPath.length; i++){
            const selector = ".menu__" + currentPath.slice(0, i + 1 ).join("-").replace(" ", "-")
            current = current.concat(document.querySelector(selector)||[]);
        }
        current.forEach( element => {
            if(element.classList.contains("menu__item--catalog")){
                element.classList.add("menu__item--open")
            }
            element.classList.add("menu__item--current")
        });
        return () => {
            current.forEach( element => element.classList.remove("menu__item--current"))
        }
    }, [content, currentPath])

    return (
        <aside className="introduction__menu">
            <nav className="menu" ref={menu}>
                {content}
            </nav>
            <Spacer/>
        </aside>
    )
}

export default Menu;