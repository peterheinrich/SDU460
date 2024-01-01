import { MessageBus } from '../../tools/MessageBus.js';

class TransponderButton extends HTMLElement {
    constructor() {
        super();

        fetch("./Header/TransponderButton.svg").then(t => t.text()).then(r => {
            this.innerHTML = '<button style="border: none; background: none; outline: none">'+r+'</button>';
        });
        this.addEventListener('click',this.click);

    /*    this.selectedFrequency = "";
        new MessageBus().subscribe(this.getAttribute("property"), this.update.bind(this));
    */
    }

    /*
    update(type, message) {
        if (type === this.getAttribute("property")) {
            this.selectedFrequency = message;
        }
        this.renderUI();
    }
    */
    renderUI() {
       /* let c = this.getElementsByTagName("button")[0].getElementsByTagName("svg")[0].getElementsByTagName("g")[0].getElementsByTagName("text")[1];
        c.innerHTML = this.selectedFrequency;
        c.setAttribute("fill", this.getAttribute("textcolor"));
        c = this.getElementsByTagName("button")[0].getElementsByTagName("svg")[0].getElementsByTagName("g")[0].getElementsByTagName("text")[0];
        c.innerHTML = this.getAttribute("label");
        */
    }

    click(event) {
        console.log("click");
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