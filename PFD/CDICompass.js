import { MessageBus } from '../../tools/MessageBus.js';

class CDICOMPASS extends HTMLElement {
    constructor() {
        super();

        this.heading = 0;
        this.track = 0;

        fetch("./PFD/CDICompass.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        new MessageBus().subscribe("indicated-heading-deg", this.update.bind(this));
        new MessageBus().subscribe("indicated-track-true-deg", this.updateTrack.bind(this));
        
    }


    update(type, message) {
        if (type === "indicated-heading-deg") {
            this.heading = message;
        }
        this.renderUI();
    }

    updateTrack(type, message) {
        if (type === "indicated-track-true-deg") {
            this.track = Math.round(message);
        }
        this.renderTrack();
    }

    renderTrack() {
        let c = this.getElementsByTagName("svg")[0].getElementById('trk-text');
        c.innerHTML = this.track + "°";
    }

    renderUI() {
        let c = this.getElementsByTagName("svg")[0].getElementById('compass');
        c.setAttribute("transform", "rotate(" + (-1)*this.heading + ",0,0)");
        c = this.getElementsByTagName("svg")[0].getElementById('comp_N');
        c.setAttribute("transform", "rotate(" + this.heading + ",0,-94)");
        c = this.getElementsByTagName("svg")[0].getElementById('comp_E');
        c.setAttribute("transform", "rotate(" + this.heading + ",94,0)");
        c = this.getElementsByTagName("svg")[0].getElementById('comp_S');
        c.setAttribute("transform", "rotate(" + this.heading + ",0,94)");
        c = this.getElementsByTagName("svg")[0].getElementById('comp_W');
        c.setAttribute("transform", "rotate(" + this.heading + ",-94,0)");

        c = this.getElementsByTagName("svg")[0].getElementById('comp_3');
        c.setAttribute("transform", "rotate(" + this.heading + ",47,-81.4)");
        c = this.getElementsByTagName("svg")[0].getElementById('comp_6');
        c.setAttribute("transform", "rotate(" + this.heading + ",81.4,-47)");
        c = this.getElementsByTagName("svg")[0].getElementById('comp_12');
        c.setAttribute("transform", "rotate(" + this.heading + ",81.4,47)");
        c = this.getElementsByTagName("svg")[0].getElementById('comp_15');
        c.setAttribute("transform", "rotate(" + this.heading + ",47,81.4)");
        c = this.getElementsByTagName("svg")[0].getElementById('comp_21');
        c.setAttribute("transform", "rotate(" + this.heading + ",-47,81.4)");
        c = this.getElementsByTagName("svg")[0].getElementById('comp_24');
        c.setAttribute("transform", "rotate(" + this.heading + ",-81.4,47)");
        c = this.getElementsByTagName("svg")[0].getElementById('comp_30');
        c.setAttribute("transform", "rotate(" + this.heading + ",-81.4,-47)");
        c = this.getElementsByTagName("svg")[0].getElementById('comp_33');
        c.setAttribute("transform", "rotate(" + this.heading + ",-47,-81.4)");
        
    }
}



customElements.define("pfd-cdi-compass", CDICOMPASS);