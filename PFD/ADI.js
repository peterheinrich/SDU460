import { MessageBus } from '../../tools/MessageBus.js';

class ADI extends HTMLElement {
    static observedAttributes = ["fullscreen"];

    constructor() {
        super();
        this.roll = 0;
        this.pitch = 0;

        fetch("./PFD/ADI.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

       new MessageBus().subscribe("indicated-roll-deg", this.updateRoll.bind(this));
       new MessageBus().subscribe("indicated-pitch-deg", this.updatePitch.bind(this));

    }

    attributeChangedCallback(name, oldValue, newValue) {

        let svg = this.getElementsByTagName("svg")[0];
        let viewPort = svg.getElementById('viewport');

        if(newValue === "false") {
            svg.setAttribute("viewBox", "0 0 550 710");
            svg.setAttribute("width", "550");

            viewPort.setAttribute("transform","translate(280,200)");
        }
        else {
            svg.setAttribute("viewBox", "0 0 1100 710");
            svg.setAttribute("width", "1100");
            viewPort.setAttribute("transform","translate(550,200)");
        }
      }
    
    updateRoll(type, message) {
        if (type === "indicated-roll-deg") {
            this.roll = -message;
        }
        this.renderUI();
    }

    updatePitch(type, message) {
        if (type === "indicated-pitch-deg") {
            this.pitch = message;
        }
        this.renderUI();
    }

    renderUI() {
        let horizon = this.getElementsByTagName("svg")[0].getElementById('horizon');
        horizon.setAttribute("transform", "rotate(" + this.roll + ",0,0)  translate(0," + 14.5 * this.pitch + ")");
        let pitchbar = this.getElementsByTagName("svg")[0].getElementById('pitch');
        pitchbar.setAttribute("transform", "translate(0," + 14.5 * this.pitch + ")");
        let bank_indicator = this.getElementsByTagName("svg")[0].getElementById('bank_indicator');
        bank_indicator.setAttribute("transform", "rotate(" + this.roll + ",0,0)  ");
    }

}

customElements.define("pfd-adi", ADI);