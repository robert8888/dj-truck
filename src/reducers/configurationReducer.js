import { ACTIONS } from "../actions";

const initState = {
    mixer: {
        externalChannels : 2,
        low: {
            frequency: 250
        },
        mid: {
            Q: 1.04,// around 0,33db // 20log10(q)
            frequency: 1000
        },
        hi: {
            frequency: 2500
        }
    },

    effector: {
        channels : 2,
    }
}

function configuraionReducer(state = initState, action){
    switch(action.type){

        
        default : return state;
    }
}

export default configuraionReducer;
