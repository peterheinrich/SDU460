import { MessageBus } from '../../tools/MessageBus.js';

class Com1Button extends HTMLElement {
    constructor() {
        super();

        fetch("./Header/Com1Button.html").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });
        this.addEventListener('click',this.click);

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
customElements.define("sdu-com1btn", Com1Button);