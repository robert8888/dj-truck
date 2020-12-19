import React, {useMemo} from "react";
import useScreenSize from "./useScreenSize";
import {isMobile, isTablet} from "react-device-detect";

const LayoutContext = React.createContext(null);

export default LayoutContext;

export const LayoutContextProvider = ({children}) => {
    const screen = useScreenSize();

    const device = useMemo(() =>{
        return isMobile ? "mobile" :
            isTablet ? "tablet" :
                "desktop";
    }, [])


    const mode = useMemo(() => {
        const modes = ["mobile", "tablet", "desktop"];
        if(device === "mobile" && ["xs", "sm"].includes(screen)){
            return modes[0]
        } else if(["mobile", "tablet"].includes(device) && ["md", "lg"].includes(screen)){
            return modes[1]
        } else
            return modes[2]
    }, [device, screen])

    return (
        <LayoutContext.Provider value={{
            device,
            screen,
            mode
        }}>
            {children}
        </LayoutContext.Provider>
    )
}