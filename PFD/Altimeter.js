import { MessageBus } from '../../tools/MessageBus.js';

class ALTIMETER extends HTMLElement {
    constructor() {
        super();

        this.altitude = 0;

        fetch("./PFD/Altimeter.html").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        new MessageBus().subscribe("indicated-altitude-ft", this.update.bind(this));
    }

    update(type, message) {
        if (type === "indicated-altitude-ft") {
            this.altitude = message;
        }
        this.renderUI();
    }

    renderUI() {

        let tape5 = this.getElementsByTagName("svg")[0].getElementById('digit5_tape');
        let tape4 = this.getElementsByTagName("svg")[0].getElementById('digit4_tape');
        let tape3 = this.getElementsByTagName("svg")[0].getElementById('digit3_tape');
        let tape12 = this.getElementsByTagName("svg")[0].getElementById('digit12_tape');

        // blank if leading digit is zero
        if (Math.floor(this.altitude / 10000) === 0) {
            this.scrollAltitudeDigit(tape5, -64);
        }
        else {
            this.scrollAltitudeDigit(tape5, Math.floor(this.altitude / 10000) * 32);
        }

        let digit4 = ((this.altitude % 10000) - (this.altitude % 1000)) / 1000;

        if (Math.floor(this.altitude / 10000) === 0 && Math.floor(this.altitude / 1000) === 0) {
            this.scrollAltitudeDigit(tape4, -64);
        }
        else {
            this.scrollAltitudeDigit(tape4, Math.floor(digit4) * 32);
        }

        let digit3 = ((this.altitude % 1000) - (this.altitude % 100)) / 100;
        this.scrollAltitudeDigit(tape3, Math.floor(digit3) * 25);
        let digit12 = (this.altitude % 100) / 20;

        this.scrollAltitudeDigit(tape12, digit12 * 25);

        let nearest = Math.round(this.altitude / 100) * 100
        let distance = this.altitude - nearest;
        let tape = this.getElementsByTagName("svg")[0].getElementById('altimeter_tape');
        let u3t = this.getElementsByTagName("svg")[0].getElementById('alt_upper_3t');
        let u3 = this.getElementsByTagName("svg")[0].getElementById('alt_upper_3');
        let u2t = this.getElementsByTagName("svg")[0].getElementById('alt_upper_2t');
        let u2 = this.getElementsByTagName("svg")[0].getElementById('alt_upper_2');
        let u1t = this.getElementsByTagName("svg")[0].getElementById('alt_upper_1t');
        let u1 = this.getElementsByTagName("svg")[0].getElementById('alt_upper_1');
        let ct = this.getElementsByTagName("svg")[0].getElementById('alt_centert');
        let c = this.getElementsByTagName("svg")[0].getElementById('alt_center');
        let l1t = this.getElementsByTagName("svg")[0].getElementById('alt_lower_1t');
        let l1 = this.getElementsByTagName("svg")[0].getElementById('alt_lower_1');
        let l2t = this.getElementsByTagName("svg")[0].getElementById('alt_lower_2t');
        let l2 = this.getElementsByTagName("svg")[0].getElementById('alt_lower_2');
        let l3t = this.getElementsByTagName("svg")[0].getElementById('alt_lower_3t');
        let l3 = this.getElementsByTagName("svg")[0].getElementById('alt_lower_3');
        u3t.innerHTML = Math.floor((nearest + 300) / 1000);
        u3.innerHTML = ('000' + Math.floor(nearest + 300) % 1000).substr(-3);
        u2t.innerHTML = Math.floor((nearest + 200) / 1000);
        u2.innerHTML = ('000' + Math.floor(nearest + 200) % 1000).substr(-3);
        u1t.innerHTML = Math.floor((nearest + 100) / 1000);
        u1.innerHTML = ('000' + Math.floor(nearest + 100) % 1000).substr(-3);
        ct.innerHTML = Math.floor((nearest) / 1000);
        c.innerHTML = ('000' + Math.floor(nearest) % 1000).substr(-3);
        l1t.innerHTML = Math.floor((nearest - 100) / 1000);
        l1.innerHTML = ('000' + Math.floor(nearest - 100) % 1000).substr(-3);
        l2t.innerHTML = Math.floor((nearest - 200) / 1000);
        l2.innerHTML = ('000' + Math.floor(nearest - 200) % 1000).substr(-3);
        l3t.innerHTML = Math.floor((nearest - 300) / 1000);
        l3.innerHTML = ('000' + Math.floor(nearest - 300) % 1000).substr(-3);
        tape.setAttribute("transform", "translate(0," + (distance / 100 * 60) + ")");
    }


    scrollAltitudeDigit(digit_tape, value) {
        digit_tape.setAttribute("transform", "translate(0," + value + ")");
    }

}

customElements.define("pfd-altimeter", ALTIMETER);