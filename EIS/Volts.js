import { MessageBus } from '../../tools/MessageBus.js';

class VOLTS extends HTMLElement {
    constructor() {
        super();

        fetch("./EIS/Volts.html").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.volts = 0;
        new MessageBus().subscribe("volts", this.update.bind(this));
    }

    update(type, message) {
        if (type === "volts") {
            this.volts = message;
        }
        this.renderUI();
    }

    renderUI() {
        let c = this.getElementsByTagName("svg")[0];
        if(this.volts < 8) {
            c = this.getElementsByTagName("svg")[0].getElementById('volts');
            c.setAttribute("transform", "translate(0,0)");
            c = this.getElementsByTagName("svg")[0].getElementById('voltsbackground');
            c.setAttribute("fill", "#FF0000");
            c = this.getElementsByTagName("svg")[0].getElementById('voltslabel');
            c.setAttribute("fill", "black");
            c = this.getElementsByTagName("svg")[0].getElementById('voltsvalue');
            c.setAttribute("fill", "black");
        }
        else if(this.volts >=8 && this.volts < 11) {
            c = this.getElementsByTagName("svg")[0].getElementById('volts');
            c.setAttribute("transform", "translate(0,0)");
            c = this.getElementsByTagName("svg")[0].getElementById('voltsbackground');
            c.setAttribute("fill", "#FF0000");
            c = this.getElementsByTagName("svg")[0].getElementById('voltslabel');
            c.setAttribute("fill", "black");
            c = this.getElementsByTagName("svg")[0].getElementById('voltsvalue');
            c.setAttribute("fill", "black");
            c = this.getElementsByTagName("svg")[0].getElementById('volts');
            c.setAttribute("transform", "translate(" + (this.volts-8)/8.1*130 + ",0)");
       
        } else if(this.volts >=11 && this.volts < 12.5) {
            c = this.getElementsByTagName("svg")[0].getElementById('voltsbackground');
            c.setAttribute("fill", "#FFFF00");
            c = this.getElementsByTagName("svg")[0].getElementById('voltslabel');
            c.setAttribute("fill", "black");
            c = this.getElementsByTagName("svg")[0].getElementById('voltsvalue');
            c.setAttribute("fill", "black");
            c = this.getElementsByTagName("svg")[0].getElementById('volts');
            c.setAttribute("transform", "translate(" + (this.volts-8)/8.1*130 + ",0)");
        } else {
            c = this.getElementsByTagName("svg")[0].getElementById('voltsbackground');
            c.setAttribute("fill", "black");
            c = this.getElementsByTagName("svg")[0].getElementById('voltslabel');
            c.setAttribute("fill", "white");
            c = this.getElementsByTagName("svg")[0].getElementById('voltsvalue');
            c.setAttribute("fill", "white");
            c = this.getElementsByTagName("svg")[0].getElementById('volts');
            c.setAttribute("transform", "translate(" + (this.volts-8)/8.1*130 + ",0)");
        }
        c = this.getElementsByTagName("svg")[0].getElementById('voltsvalue');
        c.innerHTML = Math.round(this.volts*10)/10;
    }
}

customElements.define("eis-volts", VOLTS);