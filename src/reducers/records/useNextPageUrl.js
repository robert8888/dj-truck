import {useCallback} from "react";

export default function (){
    return useCallback((page, pageSize) => {
        let url = window.location.pathname;
        url += '?pageSize=' + pageSize;
        url += '&page=' + page;
        let search = window.location.search;
        search = search.replace(/pageSize=\d+/, '');
        search = search.replace(/&page=\d+/, '');
        search = search.replace('?', '&');
        url += search;
        url = url.replace(/&{2,}/g, "&");
        return url;
    }, [])
}