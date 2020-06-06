import React, {useMemo, useCallback} from "react";
import { Button } from "react-bootstrap"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faTwitter, faGoogle, faReddit } from "@fortawesome/free-brands-svg-icons";
import "./social.scss";

const SocialButton = ({type, resorce, text}) => {
    const urls = {
        facebook : (url) => `https://www.facebook.com/sharer/sharer.php?u='${url}'&t='${url}'`,
        twitter : (url, text) => `https://twitter.com/intent/tweet?text=${text}':${url}`,
        google: (url) => `https://plus.google.com/share?url=${url}`,
        reddit: (url, text) => `http://www.reddit.com/submit?url=${url}&title=${text}`
    };

    const getUrl = useCallback((type, url, text) => {
        url = encodeURIComponent(url);
        text = encodeURIComponent(text);
        return urls[type](url, text);
    }, [urls]);

    const url = useMemo(()=> getUrl(type, resorce, text),
    [getUrl, type, resorce, text]);

    const icon = useMemo(()=>{
        switch(type){
            case 'facebook': return faFacebook;
            case 'twitter' : return faTwitter;
            case 'goggle' : return faGoogle;
            case 'reddit' : return faReddit;
            default: return null;
        }
    }, [type])

    const clickHandle = useCallback((url)=>{
        window.open(url);
    }, [])
  
    const btn = useMemo(()=>{
        return (
            <Button onClick={clickHandle.bind(null, url)} className={"social-btn social" + type}>
                <FontAwesomeIcon icon={icon}/> <span className="btn-content">{type}</span>
            </Button>
        )
    }, [url, icon, type, clickHandle])

    return (btn)
}

export default SocialButton;