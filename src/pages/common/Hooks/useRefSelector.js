import {useSelector} from "react-redux";
import {useEffect, useRef} from "react";

export default function useRefSelector(selector){
    const value = useSelector(selector);
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, [value])

    return ref;
}