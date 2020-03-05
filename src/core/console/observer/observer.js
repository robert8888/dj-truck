import * as checkers from "./checkers";

let prevState; 
export default class Observer{
    constructor(store){
        this.store = store;
        prevState = store.getState().console;
    }

    check(){
        let state = this.store.getState().console;
        let diffs = [];
        for( let test of  Object.values(checkers)){
            let response  = test(prevState, state)
            if(response){
               diffs.push(response);
            }
        }
        prevState = state;
        return diffs;
    } 
    
}