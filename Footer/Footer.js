import { MessageBus } from '../../tools/MessageBus.js';

class Footer extends HTMLElement {
    constructor() {
        super();

        fetch("./Footer/Footer.html").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.rpm = 0;
        new MessageBus().subscribe("rpm", this.update.bind(this));
    }

    update(type, message) {
        if (type === "rpm") {
            this.rpm = message;
        }
        this.renderUI();
    }

    renderUI() {
    /*    if (this.rpm < 300) {
            this.rpm = 0;
        }

        else if (this.rpm > 3200) {
            this.rpm = 3200;
        }
        
        let c = this.getElementsByTagName("svg")[0].getElementById('rpm');
        c.setAttribute("transform", "rotate(" + (211) * (this.rpm - 300) / 2800 + ",0,0)");
        c = this.getElementsByTagName("svg")[0].getElementById('rpmvalue');
        c.innerHTML = Math.round(this.rpm);
*/
    }
}

customElements.define("sdu-footer", Footer);