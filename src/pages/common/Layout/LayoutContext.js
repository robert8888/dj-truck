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
        const modes = ["tablet", "mobile", "desktop"];
        if(["md", "lg"].includes(screen)){
            return modes[0]
        } else if(["xs", "sm"].includes(screen)){
            return modes[1]
        } else
            return modes[2]
    }, [screen])


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