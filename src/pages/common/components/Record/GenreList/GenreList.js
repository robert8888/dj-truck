import React from "react";
import "./genre-list.scss";
import {Link} from "react-router-dom"
import UUID from "uuidjs"

const GenreList = ({list}) =>{

    if(!list || !list.length){
        return null;
    }

    return (
            <ul className="genre-list">
                {list.map( genre => {
                    return (
                        <li key={UUID.genV1()}> 
                            <Link to={"/records/genres/" + genre.name.toLowerCase()}>{genre.name}</Link> 
                        </li>
                     )
                })}
            </ul>
    )
}

export default GenreList