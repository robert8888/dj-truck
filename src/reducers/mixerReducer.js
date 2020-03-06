

const channel = {
    volume: 100,

    low: 100,
    mid : 100,
    high : 100,
    gain: 100,
}

const initState = {
    channels : {
        A : {
            ...channel,
        },
        B : {
            ...channel,
        },
        fader : {
            position : 50 //A: 0 <-> B:100
        }
    }
};

export default function mixerReducer(state = initState, action){
    switch(action.type){
        default: return state;
    }
}