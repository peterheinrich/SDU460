export class OSModule extends HTMLElement {


    constructor(innerPathURI, startTagString = "", endTagString = "") {
        super();

        fetch(innerPathURI).then(t => t.text()).then(r => {
            this.innerHTML = startTagString + r + endTagString;
        });
    }

    connectedCallback() {
        if(!this.innerHTML) {
            setTimeout(() => {
                this.connectedCallback();
            },"100");
        }
        else {
            console.log("called!")
            this.hasLoaded();
        }
    }

    hasLoaded() {

    }
}
