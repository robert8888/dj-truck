import ZoomRenderer from "./ZoomRenderer";

export default class ZoomRendererPlugin{

    static create(params) {
        return {
            name: 'zoom',
            deferInit: params && params.deferInit ? params.deferInit : false,
            params: params,
            staticProps: {},
            instance: ZoomRenderer
        };
    }


    constructor(params, ws) {
        this.ws = ws;
        this.style = ws.util.style;
        ws.params.waveColor = "red";
        ws.params.renderer = ZoomRenderer;

        const Drawer = function (){};
        Drawer.prototype =  Object.create(ws.Drawer.prototype);//prototype.constructor.prototype;

        console.log("protot", ws.Drawer.prototype)
        ws.Drawer = ZoomRenderer;
        console.log("zoom", ws.params)
    }
    init() {
        // this.wavesurfer.drawer = class extends this.wavesurfer .Drawer{
        //     initDrawer(){
        //         console.log(this)
        //     }
        // }
        console.log("in init", this.ws)
    }

    destroy(){
        console.log("destroy")
    }
}