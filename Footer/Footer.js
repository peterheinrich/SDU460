import { MessageBus } from '../../tools/MessageBus.js';

class Footer extends HTMLElement {
    constructor() {
        super();

        fetch("./Footer/Footer.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.oat = 0;
        this.gmt = "00:00:00";
        new MessageBus().subscribe("temperature-degc", this.update.bind(this));
        new MessageBus().subscribe("gmt-string", this.update.bind(this));

    }

    update(type, message) {
        if (type === "temperature-degc") {
            this.oat = Math.round(message);
        }
        else if (type === "gmt-string") {
            this.gmt = message;
        }
        this.renderUI();
    }

    renderUI() {
        let oat = this.getElementsByTagName("svg")[0].getElementById('oat');
        oat.innerHTML = this.oat + "°C";
        let gmt = this.getElementsByTagName("svg")[0].getElementById('gmt');
        gmt.innerHTML = this.gmt;  
    }
}

customElements.define("sdu-footer", Footer);