import * as comparators from "./comperators";

let prevState; 
export default class Observer{
    constructor(store){
        this.store = store;
        prevState = store.getState();
    }

    check(){
        let state = this.store.getState();
        let diffs = [];
        for( let test of  Object.values(comparators)){
            let response  = test(prevState, state)
            if(response){
               if(response instanceof Array){
                   diffs = [...diffs, ...response];
               }
               else {
                   diffs.push(response);
               }
            }
        }
        prevState = state;
        return diffs;
    } 
    
}