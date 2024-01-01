import { MessageBus } from '../../tools/MessageBus.js';

class TransponderButton extends HTMLElement {
    constructor() {
        super();

        fetch("./Header/TransponderButton.svg").then(t => t.text()).then(r => {
            this.innerHTML = '<button style="border: none; background: none; outline: none">' + r + '</button>';
        });

        this.squak = "0";
        this.knobMode = 0;
        this.ident = "false";
        this.addEventListener('click', this.click);
        new MessageBus().subscribe("id-code", this.updateIdCode.bind(this));
        new MessageBus().subscribe("ident", this.updateIdent.bind(this));
        new MessageBus().subscribe("knob-mode", this.updateKnobMode.bind(this));
    }

    updateIdCode(type, message) {
        if (type === "id-code") {
            this.squak = message;
        }
        this.updateUI();
    }

    updateKnobMode(type, message) {
        if (type === "knob-mode") {
            this.knobMode = message;
        }
        this.updateUI();
    }

    updateIdent(type, message) {
        if (type === "ident") {
            this.ident = message;
        }
        this.updateUI();
    }

    updateUI() {
        let c = this.querySelector("#squak");
        c.innerHTML = this.squak;
        c = this.querySelector("#mode");
        switch (this.knobMode) {
            case 0:
                c.innerHTML = "OFF";
                break;
            case 1:
                c.innerHTML = "STBY";
                break;
            case 4:
                c.innerHTML = "ON";
                break;
            case 5:
                c.innerHTML = "ALT";
                break;

            default:
                c.innerHTML = OFF;
                break;

        }
        
        
        c = this.querySelector("#colorbar");
        if(this.ident) {
            c.setAttribute("stroke", "#33FF33");
        }
        else {
            c.setAttribute("stroke", "#333333");
        }

    }

    click(event) {
        event.stopPropagation();
        event.cancleBubble = true;
        this.dispatchEvent(
            new CustomEvent('pushed', {
                bubbles: true,
            })
        );
    }
}
customElements.define("sdu-xpdr", TransponderButton);