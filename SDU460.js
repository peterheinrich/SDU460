import { MessageBus } from './tools/MessageBus.js';


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
        this.splitScreen = false;
        /*
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
                    new MessageBus().publish("volts", this.volts += 0.1);
                }, 100);
                setInterval(() => {
                    new MessageBus().publish("amps", this.volts += 0.1);
                }, 100);
                setInterval(() => {
                    new MessageBus().publish("egt-degf", this.egt++);
                }, 100);
                setInterval(() => {
                    new MessageBus().publish("cht-degf", this.cht++);
                }, 100);
                setInterval(() => {
                    new MessageBus().publish("indicated-pitch-deg", Math.sin(this.roll += 0.01) * 20);
                }, 100);
                setInterval(() => {
                    new MessageBus().publish("indicated-roll-deg", Math.cos(this.pitch += 0.01) * 30);
                }, 100);
        
                setInterval(() => {
                    new MessageBus().publish("indicated-altitude-ft", this.alt += 10);
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
        */
    }


    connectedCallback() {
        document.addEventListener('pushed', this.mainEventHandler);
        var attach = function (ws, path) {
            ws.send(JSON.stringify({
                command: 'addListener',
                node: path
            }));
        }
        var ws = new WebSocket('ws://localhost:8080/PropertyListener')
        var properties = [
            'instrumentation/altimeter/indicated-altitude-ft',
            'instrumentation/attitude-indicator/indicated-pitch-deg',
            'instrumentation/attitude-indicator/indicated-roll-deg',
            'instrumentation/airspeed-indicator/indicated-speed-kt',
            'velocities/groundspeed-kt',
            'velocities/airspeed-kt',
            'instrumentation/gps/indicated-latitude-deg',
            'instrumentation/gps/indicated-longitude-deg',
            'instrumentation/gps/indicated-track-true-deg',
            'instrumentation/vertical-speed-indicator/indicated-speed-fpm',
            'instrumentation/heading-indicator/indicated-heading-deg',
            'engines/engine/rpm',
            'engines/engine/egt-degf',
            'engines/engine/cht-degf',
            'engines/engine/fuel-flow-gph',
            'engines/engine/oil-pressure-psi',
            'engines/engine/oil-temperature-degf',
            'instrumentation/altimeter/setting-hpa',
            'systems/electrical/volts',
            'systems/electrical/amps',
            'environment/temperature-degc',
            'sim/time/gmt-string',
            'consumables/fuel/tank/indicated-level-gal_us',
            'consumables/fuel/tank[1]/indicated-level-gal_us'
        ];
        console.log(ws);
        ws.onopen = function (ev) {
            properties.forEach(element => {
                attach(ws, element);
            });
        }
        ws.onmessage = function (ev) {
            try {
                var data = JSON.parse(ev.data);
                var path = data.path;
                if(path === "/consumables/fuel/tank/indicated-level-gal_us") {
                    new MessageBus().publish("indicated-level-gal_us_left", data.value);
                }
                else if(path === "/consumables/fuel/tank[1]/indicated-level-gal_us") {
                    new MessageBus().publish("indicated-level-gal_us_right", data.value);
                }
                else {
                    new MessageBus().publish(data.name, data.value);
                }
            } catch (e) {
                console.log('Exception in onmessage:' + e)
            }
        }
        ws.onclose = function (ev) {
            var msg = 'Lost connection to FlightGear.'
            console.log(msg);
        }

        ws.onerror = function (ev) {
            var msg = 'Error communicating with FlightGear.'
            console.log(msg);
        }

        properties.forEach(element => {
            fetch("http://localhost:8080/json/" + element).then((response) => {
                return response.json();
            }).then((data) => {
                new MessageBus().publish(element.split("/")[element.split("/").length-1], data.value);
            });
        });

    }

    mainEventHandler(event) {
        if (event.target.getAttribute('id') === "btnSplit") {

            this.splitScreen = !this.splitScreen;

            if (this.splitScreen) {
                let adi = document.getElementsByTagName("mfd-map")[0].setAttribute("style", "visibility: hidden; position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
                document.getElementsByTagName("pfd-adi")[0].setAttribute("fullscreen", "true");
                document.getElementsByTagName("pfd-altimeter")[0].setAttribute("style", "position:absolute; top: 100px; left: 940px;");
                document.getElementsByTagName("pfd-asi")[0].setAttribute("style", "position:absolute; top: 100px; left: 440px;");
                document.getElementsByTagName("pfd-cdi-compass")[0].setAttribute("style", "position:absolute; top: 425px; left: 530px;");
                document.getElementsByTagName("pfd-vsi")[0].setAttribute("style", "position:absolute; top: 140px; left: 1038px;");

            }
            else {
                let adi = document.getElementsByTagName("mfd-map")[0].setAttribute("style", "position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
                document.getElementsByTagName("pfd-adi")[0].setAttribute("fullscreen", "false");
                document.getElementsByTagName("pfd-altimeter")[0].setAttribute("style", "position:absolute; top: 100px; left: 590px;");
                document.getElementsByTagName("pfd-asi")[0].setAttribute("style", "position:absolute; top: 100px; left: 240px;");
                document.getElementsByTagName("pfd-cdi-compass")[0].setAttribute("style", "position:absolute; top: 425px; left: 290px;");
                document.getElementsByTagName("pfd-vsi")[0].setAttribute("style", "position:absolute; top: 140px; left: 688px;");
            }

        }
    }


    clickEvent() {
        console.log("Click Click");
    }

}

customElements.define("g3x-sdu460", SDU460);