import { MessageBus } from '../../tools/MessageBus.js';

class VSI extends HTMLElement {

    constructor() {
        super();
        this.vs = 0;

        fetch("./PFD/VSI.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

       new MessageBus().subscribe("indicated-speed-fpm", this.updateVSI.bind(this));

    }

    
    updateVSI(type, message) {
        if (type === "indicated-speed-fpm") {
            this.vs = message;
        }
        this.renderUI();
    }


    renderUI() {
        let vsi = this.getElementsByTagName("svg")[0].getElementById('vsi');
        let valpx = 0;
        if(this.vs >= -1000 && this.vs <=1000) {
            valpx = this.vs * 9 / 100;
        }
        else if(this.vs > 1000) {
            valpx = ((this.vs - 1000) * 3 / 100) + 90;
        }
        else {
            valpx = ((this.vs + 1000) * 3 / 100) - 90;
        }
        vsi.setAttribute("transform", "translate(0," + (-1)*(valpx) + ")");    
    }

}

customElements.define("pfd-vsi", VSI);