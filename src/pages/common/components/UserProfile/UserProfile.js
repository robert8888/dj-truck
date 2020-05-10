import React from "react";
import {connect} from "react-redux";

const UserProfile  = ({nickname}) =>{


    return (
        <div className="user-profile">
            <div className="user-piture">

            </div>
            <div className="user-nickname">

            </div>
            <div className="user-description">
                <p>Profile descirption, i'm a dj not a cat</p>
            </div>
            <div className="user-record-stat">
                <span>2 records</span>
                <span>230 minut of miusic</span>
            </div>
            <div className="generes">
                <span>Generes:</span>
                <ul>
                    <li>Techno</li>
                    <li>Minimal</li>
                </ul>
            </div>
        </div>
    )
}

const mapStateToProps = state = ({

})

export default connect(mapStateToProps)(UserProfile);

