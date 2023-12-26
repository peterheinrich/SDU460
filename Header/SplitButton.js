import { MessageBus } from '../../tools/MessageBus.js';

class SplitButton extends HTMLElement {
    constructor() {
        super();

        fetch("./Header/SplitButton.svg").then(t => t.text()).then(r => {
            this.innerHTML = `<button style="border: none; background: none; outline: none">`+r+`</button>`;
            console.log(this.innerHTML);
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
customElements.define("sdu-splitbutton", SplitButton);