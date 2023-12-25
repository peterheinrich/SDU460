import { MessageBus } from '../../tools/MessageBus.js';

class OILPSI extends HTMLElement {
    constructor() {
        super();

        fetch("./EIS/OilPSI.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.psi = 0;
        this.initCompleted = false;
        new MessageBus().subscribe("oil-pressure-psi", this.update.bind(this));
    }

    update(type, message) {
        if (type === "oil-pressure-psi") {
            this.psi = message;
        }
        this.renderUI();
    }

    renderUI() {

        if(!this.initCompleted) {
            this.initCompleted = true;

            let high_attr = this.getAttribute("high");
            let low = this.getAttribute("low") / high_attr * 130;
            let green1 = this.getAttribute("green1") / high_attr * 130;
            let green2 = this.getAttribute("green2") / high_attr * 130; 
            let high = 130;

            let dash2 = this.getElementsByTagName("svg")[0].getElementById('dash2');
            let dash3 = this.getElementsByTagName("svg")[0].getElementById('dash3');
            let dash4 = this.getElementsByTagName("svg")[0].getElementById('dash4');

            let line1 = this.getElementsByTagName("svg")[0].getElementById('line1');
            let line2 = this.getElementsByTagName("svg")[0].getElementById('line2');
            let line3 = this.getElementsByTagName("svg")[0].getElementById('line3');
            let line4 = this.getElementsByTagName("svg")[0].getElementById('line4');

            dash2.setAttribute("x1", low);
            dash2.setAttribute("x2", low);
            dash3.setAttribute("x1", green1);
            dash3.setAttribute("x2", green1);
            dash4.setAttribute("x1", green2);
            dash4.setAttribute("x2", green2);
            line1.setAttribute("x1", 0);
            line1.setAttribute("x2", low);
            line2.setAttribute("x1", low);
            line2.setAttribute("x2", green1);
            line3.setAttribute("x1", green1);
            line3.setAttribute("x2", green2);
            line4.setAttribute("x1", green2);
            line4.setAttribute("x2", 130);
        }

        let c = this.getElementsByTagName("svg")[0].getElementById('oilpsi');
        if (this.psi < 0) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.psi > this.getAttribute("high")) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.psi) / this.getAttribute("high") * 130 + ",0)");
        }
        c = this.getElementsByTagName("svg")[0].getElementById('oilpsivalue');
        c.innerHTML = Math.round(this.psi);
    }
}

customElements.define("eis-oilpsi", OILPSI);