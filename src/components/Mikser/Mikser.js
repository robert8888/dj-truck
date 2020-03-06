import React from "react";
import Knob from  "./Knob/Knob";

class Mikser extends React.Component{

    render(){
        return (
            <div className="mikser">
                <br/>
                <Knob className="klasy"  showValue scale={30} quantize={0.5} onChange={ value => console.log(value)}/>
            </div>
        )
    }
}


export default Mikser;