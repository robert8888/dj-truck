import React, { useCallback, useRef } from "react";
import Advantage from "./Advantage";
import "./advantages.scss";

const Advantages = () => {
    
    const counter = useRef();
    const side = useCallback(()=>{
        if(!counter.current) counter.current = 0;
        counter.current++;
        return (counter.current % 2 === 0) ? "left" : "right";
    }, [counter])

    return (
        <>
            <Advantage
                side={side()}
                header={{
                    bold: "Quick & Simple",
                    normal: " find track on your favorite music source"
                }}
                text={`Build playlist with your favorite tracks is really easy. 
                Just pick music source and enter title or artist and then press 
                "Enter" button on your keyboard. Now just select what you were looking for.`}
                link={{
                    to: "./my/playlist",
                    text: "Start building playlist"
                }}
                image="/advantages/advantage-playlist.png"
                />
            <Advantage
                side={side()}
                header={{
                    bold: "Bpm, Sync & Pitch band - ",
                    normal: "beat matching never was so easy"
                }}
                text={`Analyzer calculate track bpm, you can manually adjust best 
                position and tempo or just click sync button. Now you are ready
                to make transition between tracks.`}
                link={{
                    to: "./introduction#bpm-matching",
                    text: "Learn more"
                }}
                image="/advantages/advantage-sync.png"
                />
            <Advantage
                side={side()}
                header={[{
                        bold: "2 channels ",
                        normal: "effector with "
                    }, {
                        bold: "7 build in ",
                        normal: "effects"
                    }
                ]}
                text={`Console have builded two channels effector. 
                To your dysposition you have : Reverb, Delaye, Dub Delay,
                PinPon Delay, Flagler, Distortion, Quadrafuzz. What more 
                you cane use two effect in the same time on one channel. `}
                link={{
                    to: "./introduction#effects",
                    text: "Learn using effects"
                }}
                image="/advantages/advantage-effector.png"
                />
            <Advantage
                side={side()}
                header={{
                    bold: "Mixer with cue and low & high pass filter - ",
                    normal: "all what you need"
                }}
                text={`Two channels mixer with cue section, three band 
                equalization and build in filters with resonans adjust. 
                Each channel have own level peak meter that will 
                help you control loudnes.`}
                link={{
                    to: "./introduction",
                    text: "Read mixer description"
                }}
                image="/advantages/advantage-mixer.png"
                />
            <Advantage
                side={side()}
                header={{
                    bold: "Synchronized looper - ",
                    normal: "now your track will never end"
                }}
                text={`You can get in to loop in any moment 
                without afraid that track will lose synchronization,
                you can change loop length during looper active as well.`}
                link={{
                    to: "./introduction",
                    text: "Lern more about looper"
                }}
                image="/advantages/advantage-loop.png"
                />
            <Advantage
                side={side()}
                header={{
                    bold: "Recorder with dynamic compressor - ",
                    normal: "just push button"
                }}
                text={`Type in name of your record and just press record button. 
                For more advanced user is available dynamic compores witch
                ensure that your record will be always on the maximum loudness level.`}
                link={{
                    to: "./console",
                    text: "Record your first set"
                }}
                image="/advantages/advantage-recorder.png"
                />

        </>
    )
}

export default Advantages;