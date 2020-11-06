import store from "./../../../../../store";
import {MAPPING} from "../../../../../actions";

export default class Controller{
    constructor(type) {
        this.type = type;
        this.storeRefreshInterval = 2000;
    }

    get state(){
        return store.getState().control;
    }

    commit(action){
        store.dispatch(action)
    }

    _getMappingMode(){
        return this.state.mapping;
    }

    _getProfileMap() {
        const state = this.state;
        const id = this.type === "midi"
            ? state.currentMidiProfileId
            : state.currentKbdProfileId;

        if(!id) return null;

        return state.profiles[id].map;
    }

    _getActions(){
        return this.state.actions;
    }

    _getAction(key){
        const map = this._getProfileMap();
        const actions = this._getActions();
        if(!map) return null;
        const actionId = map.toAction[key];
        if(!actionId) return null;
        if(!actions[actionId.split("-")[0]]) return null;
        return {
            reference: MAPPING[actions[actionId.split("-")[0]].fullName].action,
            method: actionId.split("-")[1] || "set"
        };
    }

}