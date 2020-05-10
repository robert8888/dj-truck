import React from "react";

const EmptyListInfo = props => {
    const renderNotOpen = () => {
        if(props.empty === true){
            return (<div className="playlist-text-info">
                        <span>No playlist is currently open, use explorer 
                            to open or create a new playlist.</span>
                    </div>)
        }
        return null
    }

    return (renderNotOpen())
}

export default EmptyListInfo;