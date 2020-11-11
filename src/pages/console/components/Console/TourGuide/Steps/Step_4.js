import React, {useMemo} from "react";
import {Step} from "react-rtg";

export default function useStep_4(){
    return useMemo(() => (
        <Step  key={"Step_4"} placement={"right"} selector={".explorer-tree"}>
            <p>In playlist explorer is created new playlist.</p>
            <p>
                Playlist explorer allows crate and store playlist in folders structure
            </p>
            <p>
                You can rename your playlist using context menu
            </p>
        </Step>
    ), [])
}
