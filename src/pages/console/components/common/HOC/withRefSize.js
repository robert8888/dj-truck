import React from "react";
import { produce } from "imer"


const withRefSize = (WrappedComponent) => {

    return class extends React.Component{

        constructor(...args){
            super(...args);
            this.state={ 
                size: {}
            }    
            this.references={};

        }

        componentDidMount() {
            let size = {};
            for(let [name, element] of Object.entries(this.references)){
                const {width, height} = element.getBoundingClientRect();
                size[name] = {
                    width,
                    height
                }
            }
            this.setState(produce(this.state, draft => draft.size = size))
        }

        importRef = ( name, ref) => {
            this.references[name] = ref;
        }

        render(){
            return <WrappedComponent {...this.props} size={this.state.size}  exportRef={this.importRef}/>
        }
    } 

}

export default withRefSize;