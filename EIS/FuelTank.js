import { MessageBus } from '../../tools/MessageBus.js';

class FUELTANK extends HTMLElement {
    constructor() {
        super();
        debugger
        fetch("./EIS/FuelTank.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.initCompleted = false;
        this.max = 0;
        this.left = 0;
        this.right = 0;
        new MessageBus().subscribe("indicated-level-gal_us_left", this.update.bind(this));
        new MessageBus().subscribe("indicated-level-gal_us_right", this.update.bind(this));

    }

    update(type, message) {
        if (type === "indicated-level-gal_us_left") {
            this.left = message;
        }
        else if (type === "indicated-level-gal_us_right") {
            this.right = message;
        }
        this.renderUI();
    }

    renderUI() {

        if(!this.initCompleted) {
            this.initCompleted = true;
            this.max = Math.round(this.getAttribute("max")*10)/10;
        }
        let c = this.getElementsByTagName("svg")[0].getElementById('fuelmarker_left');
        if (this.left < 0) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.left > this.max) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.left)/this.max * 130 + ",0)");
        }

        c = this.getElementsByTagName("svg")[0].getElementById('fuelmarker_right');
        if (this.right < 0) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.right > this.max) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.right)/this.max * 130 + ",0)");
        }

        c = this.getElementsByTagName("svg")[0].getElementById('fuelleft');
        c.innerHTML = Math.round(this.left * 10) / 10;
        c = this.getElementsByTagName("svg")[0].getElementById('fuelright');
        c.innerHTML = Math.round(this.right * 10) / 10;
    }
}

customElements.define("eis-fueltank", FUELTANK);