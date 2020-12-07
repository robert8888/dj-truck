import {useCallback} from "react";
import {useDispatch} from "react-redux";
import {setFooterType} from "actions";

export default function(){
    const dispatch = useDispatch()
    const setFooter = useCallback((type)=>{
         dispatch(setFooterType((type)))
    }, [dispatch])

    return [setFooter];
}