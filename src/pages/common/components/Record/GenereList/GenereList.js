import React from "react";
import "./genere-list.scss";
import {Link} from "react-router-dom"
import UUID from "uuidjs"

const GenereList = ({list}) =>{

    if(!list || !list.length){
        return null;
    }

    return (
            <ul className="genere-list">
                {list.map( genere => {
                    return (
                        <li key={UUID.genV1()}> 
                            <Link to={"/records/generes/" + genere.name.toLowerCase()}>{genere.name}</Link> 
                        </li>
                     )
                })}
            </ul>
    )
}

export default GenereList