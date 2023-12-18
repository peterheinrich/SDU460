import { MessageBus } from '../../tools/MessageBus.js';

class ASI extends HTMLElement {
    constructor() {
        super();

        this.ias = 0;
        this.gs = 0;

        fetch("./PFD/ASI.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        new MessageBus().subscribe("indicated-speed-kt", this.updateIAS.bind(this));
        new MessageBus().subscribe("groundspeed-kt", this.updateGS.bind(this));

    }


    updateIAS(type, message) {
        if (type === "indicated-speed-kt") {
            this.ias = message;
        }
        this.renderTapeUI();
    }

    updateGS(type, message) {
        if (type === "groundspeed-kt") {
            this.gs = message;
        }
        this.renderUI();
    }

    renderUI() {
        let gs = this.getElementsByTagName("svg")[0].getElementById('gs');
        gs.innerHTML = Math.round(this.gs);
    }
    

    renderTapeUI() {
        let as_tape = this.getElementsByTagName("svg")[0].getElementById('as_tape');
        as_tape.setAttribute("transform", "translate(0," + (this.ias * 4) + ")");

        let as_digit3_tape = this.getElementsByTagName("svg")[0].getElementById('as_digit3_tape');
        let as_digit2_tape = this.getElementsByTagName("svg")[0].getElementById('as_digit2_tape');
        let as_digit1_tape = this.getElementsByTagName("svg")[0].getElementById('as_digit1_tape');

        // blank if leading digit is zero
        if (Math.floor(this.ias / 100) === 0) {
            this.scrollAirspeedDigit(as_digit3_tape, -2);
            if (Math.floor(this.ias / 10) === 0) {
                this.scrollAirspeedDigit(as_digit2_tape, -2);
            }
            else {
                this.scrollAirspeedDigit(as_digit2_tape, Math.floor((this.ias % 100) / 10));
            }
        }
        else {
            this.scrollAirspeedDigit(as_digit3_tape, Math.floor((this.ias % 1000) / 100));
            this.scrollAirspeedDigit(as_digit2_tape, Math.floor((this.ias % 100) / 10));
        }
        let digit3 = (this.ias % 10);
        this.scrollAirspeedDigit(as_digit1_tape, digit3);
       
    }

    
    scrollAirspeedDigit(digit_tape, value) {
        digit_tape.setAttribute("transform", "translate(0," + (value * 32) + ")");
    }

}



customElements.define("pfd-asi", ASI);