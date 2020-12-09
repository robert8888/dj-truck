import store from "./../../../../../store";
import {setKbdMapValue} from "actions";
import Controller from "./controller";

const selectMappingMode = state => state.control.mapping;

export default class KbdController extends Controller{
    constructor() {
        super("kbd")
        this.keyDown = this.onKeyDown.bind(this)
        window.addEventListener("keydown", this.keyDown);
    }

    onKeyDown(event){
        if(document.activeElement.matches("input, textarea") || event.repeat) return;
        event.preventDefault();
        const keyId = this.getKeyId(event);
        const mappingMode = selectMappingMode(store.getState());
        if(mappingMode === "kbd"){
            this.commit(setKbdMapValue(keyId))
            return;
        }

        const {action, actionOff, method} = this._getAction(keyId) || {};
        if(action && actionOff){
           this.commit(action())
           const that = this;
           window.addEventListener("keyup", function keyup(){
               that.commit(actionOff());
               window.removeEventListener("keyup", keyup);
           })
           return;
        }

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
