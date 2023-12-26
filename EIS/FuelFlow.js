import { MessageBus } from '../../tools/MessageBus.js';

class FUELFLOW extends HTMLElement {
    constructor() {
        super();
        debugger
        fetch("./EIS/FuelFlow.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.flowgph = 0;
        this.initCompleted = false;
        this.max = 0;
        new MessageBus().subscribe("fuel-flow-gph", this.update.bind(this));
    }

    update(type, message) {
        if (type === "fuel-flow-gph") {
            this.flowgph = message;
        }
        this.renderUI();
    }

    renderUI() {

        if(!this.initCompleted) {
            this.initCompleted = true;
            this.max = Math.round(this.getAttribute("max"));
        }
        let c = this.getElementsByTagName("svg")[0].getElementById('fuelpsi');
        if (this.flowgph < 0) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.flowgph > this.max) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.flowgph)/this.max * 130 + ",0)");
        }
        c = this.getElementsByTagName("svg")[0].getElementById('fuelpsivalue');
        c.innerHTML = Math.round(this.flowgph * 10) / 10;
    }
}

customElements.define("eis-fuelflow", FUELFLOW);