import {useLocation} from "react-router-dom";
import {useMemo} from "react";

export default function useLocationSearchParams(){
    const location = useLocation();

    return useMemo(()=>{
        let search = location.search;
        if(!search || !search.startsWith("?")) return {};
        search = search.substr(1);

        return Object.fromEntries(search.split("&")
            .map(param => ([
                [param.split("=")[0]], param.split("=")[1]
            ])))
    }, [location])
}