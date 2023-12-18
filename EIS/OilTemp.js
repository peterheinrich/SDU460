import { MessageBus } from '../../tools/MessageBus.js';

class OILTEMP extends HTMLElement {
    constructor() {
        super();

        fetch("./EIS/OilTemp.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.temp = 0;
        new MessageBus().subscribe("oil-temperature-degf", this.update.bind(this));
    }

    update(type, message) {
        if (type === "oil-temperature-degf") {
            this.temp = message;
        }
        this.renderUI();
    }

    renderUI() {
        let c = this.getElementsByTagName("svg")[0].getElementById('oilf');
        if (this.temp < 75) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.temp > 240) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.temp - 75) / 165 * 130 + ",0)");
        }
        c = this.getElementsByTagName("svg")[0].getElementById('oilfvalue');
        c.innerHTML = Math.round(this.temp);
    }
}

customElements.define("eis-oiltemp", OILTEMP);