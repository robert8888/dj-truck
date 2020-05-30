import { formatRelative as DateFormatRelative, toDate } from "date-fns";
import * as locales from 'date-fns/locale';
import { useCallback, useMemo } from "react";

export function useFormatRelative() {

    const timezoneOffset = useMemo(() => {
        return new Date().getTimezoneOffset() * 1000;
    }, [])

    const getLocal = useCallback(() => {
        let lang = "";

        if (navigator.languages !== undefined){
            lang =  navigator.languages[0];
        }
        else{
            lang =  navigator.language;
        }
        
        lang = lang.substr(0,2);
        return locales[lang];
    }, [])

    const formatRelative = useCallback((timestamp, { timezone, local } = {}) => {
        const time = timezone ? timestamp - timezoneOffset : timestamp;
        const opt = local ? {locale: getLocal()} : {};
        const now = new Date();
        let formated = "";
        try{
            formated = DateFormatRelative(toDate(time), now , opt);
        } catch(err){
            console.log("Can't format time in relative way")
        }
        return formated;
    },[timezoneOffset, getLocal])

    return [formatRelative]
}