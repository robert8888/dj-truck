import React, {useCallback, useEffect, useRef, useState} from "react";
import Advantage from "./Advantage";
import "./advantages.scss";

const getAdvantages = () => require.context('./advantages', true, /\.json$/).keys();

const Advantages = () => {
    const [advantages, setAdvantages] = useState();

    const counter = useRef();
    const side = useCallback(()=>{
        if(!counter.current) {
            counter.current = 0;
        }
        counter.current++;
        return (counter.current % 2 === 0) ? "left" : "right";
    }, [counter])

    const advantagesJsons = useCallback(() => getAdvantages().map(file => {
        return import("./advantages" + file.substr(1, file.length));
    }), []);

    useEffect(() => {
        if (!advantagesJsons) return;
        Promise.all(advantagesJsons())
            .then(jsons => jsons.map(module => module.default))
            .then(advantages => {
                setAdvantages(advantages)
            })
    }, [advantagesJsons, setAdvantages])

    if(!advantages) return null;

    return (
        <>
            {advantages.map( (data, index) => <Advantage key={"advantages-"+index} side={side()} {...data} />)}
        </>
    )
}

export default Advantages;