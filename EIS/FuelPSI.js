import { MessageBus } from '../../tools/MessageBus.js';

class FUELPSI extends HTMLElement {
    constructor() {
        super();

        fetch("./EIS/FuelPSI.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.fpsi = 0;
        new MessageBus().subscribe("fuel-pressure-psi", this.update.bind(this));
    }

    update(type, message) {
        if (type === "fuel-pressure-psi") {
            this.fpsi = message;
        }
        this.renderUI();
    }

    renderUI() {
        let c = this.getElementsByTagName("svg")[0].getElementById('fuelpsi');
        if (this.fpsi < 0) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.fpsi > 90) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.fpsi-3.5) * 10 + ",0)");
        }
        c = this.getElementsByTagName("svg")[0].getElementById('fuelpsivalue');
        c.innerHTML = Math.round(this.fpsi * 10) / 10;
    }
}

customElements.define("eis-fuelpsi", FUELPSI);