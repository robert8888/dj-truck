import {useRouteMatch} from "react-router-dom";
import {useMemo} from "react";


export default function usePath(){
    let { path: _path, url: _url} = useRouteMatch();

    const path = useMemo(()=>{
        if(!_path || !_url) return [];
        const base = _path.split("/")[1];
        return _url.split("/").filter( slug => slug && slug !== base );
    }, [_path, _url])

    return [path];
}