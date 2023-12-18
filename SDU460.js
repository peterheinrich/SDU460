import {MessageBus} from './tools/MessageBus.js';


class SDU460 extends HTMLElement {
    constructor() {
        super();
        this.template = "";
        fetch("./SDU460.html").then(r => r.text()).then(t => {
            this.innerHTML = t;
        });
        this.rpm = 1000;
        this.oildegf = 75;
        this.oilpsi = 0;
        this.volts = 0;
        this.egt = 0;
        this.cht = 0;
        this.roll = 0;
        this.pitch = 0;
        this.alt = 0;
        this.airspeed = 0;
        this.gs = 0;
        this.fullscreen = false;

        setInterval(() => {
            new MessageBus().publish("rpm", this.rpm++);
        }, 100);
        setInterval(() => {
            new MessageBus().publish("oil-temperature-degf", this.oildegf++);
        }, 100);
        setInterval(() => {
            new MessageBus().publish("oil-pressure-psi", this.oilpsi++);
        }, 100);
        setInterval(() => {
            new MessageBus().publish("volts", this.volts+=0.1);
        }, 100);
        setInterval(() => {
            new MessageBus().publish("amps", this.volts+=0.1);
        }, 100);
        setInterval(() => {
            new MessageBus().publish("egt-degf", this.egt++);
        }, 100);
        setInterval(() => {
            new MessageBus().publish("cht-degf", this.cht++);
        }, 100);
        setInterval(() => {
            new MessageBus().publish("indicated-pitch-deg", Math.sin(this.roll+=0.01) * 20);
        }, 100);
        setInterval(() => {
            new MessageBus().publish("indicated-roll-deg", Math.cos(this.pitch+=0.01) * 30);
        }, 100);

        setInterval(() => {
            new MessageBus().publish("indicated-altitude-ft", this.alt+=10);
        }, 100);

        setInterval(() => {
            new MessageBus().publish("indicated-speed-kt", this.airspeed++);
        }, 100);
        setInterval(() => {
            new MessageBus().publish("groundspeed-kt", this.gs++);
        }, 100);
        setInterval(() => {
            new MessageBus().publish("indicated-heading-deg", this.gs++);
        }, 100);
        setInterval(() => {
            new MessageBus().publish("indicated-track-true-deg", this.gs / 10);
        }, 100);
        setInterval(() => {
            new MessageBus().publish("latitude-deg", 47.078733 + this.gs / 10000);
        }, 100);
        setInterval(() => {
            new MessageBus().publish("longitude-deg", 9.064843);
        }, 100);
        
    }
    
    connectedCallback() {
        document.addEventListener('click', (event) => {
                this.fullscreen = !this.fullscreen;
            
            if(this.fullscreen) {
                let adi = document.getElementsByTagName("mfd-map")[0].setAttribute("style", "visibility: hidden; position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
                document.getElementsByTagName("pfd-adi")[0].setAttribute("fullscreen", "true");
                document.getElementsByTagName("pfd-altimeter")[0].setAttribute("style","position:absolute; top: 100px; left: 940px;");
                document.getElementsByTagName("pfd-asi")[0].setAttribute("style","position:absolute; top: 100px; left: 440px;");
                document.getElementsByTagName("pfd-cdi-compass")[0].setAttribute("style","position:absolute; top: 425px; left: 530px;");
            }
            else {
                let adi = document.getElementsByTagName("mfd-map")[0].setAttribute("style", "position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
                document.getElementsByTagName("pfd-adi")[0].setAttribute("fullscreen", "false");
                document.getElementsByTagName("pfd-altimeter")[0].setAttribute("style","position:absolute; top: 100px; left: 615px;");
                document.getElementsByTagName("pfd-asi")[0].setAttribute("style","position:absolute; top: 100px; left: 240px;");
                document.getElementsByTagName("pfd-cdi-compass")[0].setAttribute("style","position:absolute; top: 425px; left: 290px;");
            }
        });
    }


    clickEvent() {
        console.log("Click Click");
    }

}

customElements.define("g3x-sdu460", SDU460);