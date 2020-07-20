import store from "./../../../../../store";
import {setKbdMapValue} from "../../../../../actions";
import Controller from "./controller";

const selectMappingMode = state => state.control.mapping;

export default class KbdController extends Controller{
    constructor() {
        super("kbd")
        this.keyDown = this.onKeyDown.bind(this)
        window.addEventListener("keydown", this.keyDown);
        window.onpopstate = () => {
            console.log("on popo state")
            window.location.text("/console")
                ? window.addEventListener("keydown", this.keyDown)
                : window.removeEventListener("keydown", this.keyDown)
        };
    }

    onKeyDown(event){
        console.log("key down")
        if(document.activeElement.matches("input, textarea")) return;
        event.preventDefault();
        const keyId = this.getKeyId(event);
        const mappingMode = selectMappingMode(store.getState());
        if(mappingMode === "kbd"){
            this.commit(setKbdMapValue(keyId))
            return;
        }

        const {reference: action, method} = this._getAction(keyId) || {};
        let value = null;
        if(method === "up"){
            value = "+10%";
        } else if(method === "down") {
            value = "-10%";
        }
        if(!action) return;
        this.commit(action(value))
    }

    getKeyId(event){
        const special = ["Shift", "Control", "Alt"]
        let {key, altKey, ctrlKey, shiftKey} = event;
        if(special.includes(key)) return key;
        function generateId(arr, ...values){
            return values.map((value, index) => {
                if(index >= special.length) return value;
                return value ? special[index] : ""
            }).filter(value => !!value).join("+")
        }
        return generateId`${shiftKey}${ctrlKey}${altKey}${key}`
    }

}
