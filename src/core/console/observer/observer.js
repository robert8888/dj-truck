import * as comperators from "./comperators";

let prevState; 
export default class Observer{
    constructor(store){
        this.store = store;
        prevState = store.getState();
    }

    check(){
        let state = this.store.getState();
        let diffs = [];
        for( let test of  Object.values(comperators)){
            let response  = test(prevState, state)
            if(response){
               diffs.push(response);
            }
        }
        prevState = state;
        return diffs;
    } 
    
}