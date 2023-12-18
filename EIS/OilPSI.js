import { MessageBus } from '../../tools/MessageBus.js';

class OILPSI extends HTMLElement {
    constructor() {
        super();

        fetch("./EIS/OilPSI.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.psi = 0;
        new MessageBus().subscribe("oil-pressure-psi", this.update.bind(this));
    }

    update(type, message) {
        if (type === "oil-pressure-psi") {
            this.psi = message;
        }
        this.renderUI();
    }

    renderUI() {
        let c = this.getElementsByTagName("svg")[0].getElementById('oilpsi');
        if (this.psi < 0) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.psi > 90) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.psi) / 90 * 130 + ",0)");
        }
        c = this.getElementsByTagName("svg")[0].getElementById('oilpsivalue');
        c.innerHTML = Math.round(this.psi);
    }
}

customElements.define("eis-oilpsi", OILPSI);