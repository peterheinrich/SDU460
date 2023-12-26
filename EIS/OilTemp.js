import { MessageBus } from '../../tools/MessageBus.js';

class OILTEMP extends HTMLElement {
    constructor() {
        super();

        fetch("./EIS/OilTemp.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.temp = 0;
        this.max = 0;
        this.initCompleted = false;

        new MessageBus().subscribe("oil-temperature-degf", this.update.bind(this));
    }

    update(type, message) {
        if (type === "oil-temperature-degf") {
            this.temp = message;
        }
        this.renderUI();
    }

    renderUI() {

        if(!this.initCompleted) {
            this.initCompleted = true;
            let dash2 = this.getElementsByTagName("svg")[0].getElementById('dash2');
            let dash3 = this.getElementsByTagName("svg")[0].getElementById('dash3');
            let line1 = this.getElementsByTagName("svg")[0].getElementById('line1');
            let high = Math.round(this.getAttribute("high"));
            let low = Math.round(this.getAttribute("low"));
            this.max = Math.round(high) + 20;

            dash2.setAttribute("x1", low/this.max * 130);
            dash2.setAttribute("x2", low/this.max * 130);
            dash3.setAttribute("x1", high/this.max * 130);
            dash3.setAttribute("x2", high/this.max * 130);
            line1.setAttribute("x1", low/this.max * 130);
            line1.setAttribute("x2", high/this.max * 130);
            
        }

        let c = this.getElementsByTagName("svg")[0].getElementById('oilf');
        if (this.temp < 0) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.temp > this.max) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.temp) / this.max * 130 + ",0)");
        }
        c = this.getElementsByTagName("svg")[0].getElementById('oilfvalue');
        c.innerHTML = Math.round(this.temp);
    }
}

customElements.define("eis-oiltemp", OILTEMP);