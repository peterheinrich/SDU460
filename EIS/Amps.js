import { MessageBus } from '../../tools/MessageBus.js';

class AMPS extends HTMLElement {
    constructor() {
        super();

        fetch("./EIS/Amps.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.fpsi = 0;
        new MessageBus().subscribe("amps", this.update.bind(this));
        console.log("INIT AMPS");
    }

    update(type, message) {
        if (type === "amps") {
            this.amps = message;
        }
        this.renderUI();
    }

    renderUI() {
        let c = this.getElementsByTagName("svg")[0].getElementById('amps');
        if (this.amps < -60) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.amps > 60) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.amps+60)/120*130 + ",0)");
        }
        c = this.getElementsByTagName("svg")[0].getElementById('ampsvalue');
        if(this.amps > 0) {
            c.innerHTML = '+' + Math.round(this.amps);
        }
        else {
            c.innerHTML = Math.round(this.amps);
        }
    }
}

customElements.define("eis-amps", AMPS);