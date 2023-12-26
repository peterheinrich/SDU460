import { MessageBus } from './tools/MessageBus.js';


class SDU460 extends HTMLElement {
    constructor() {
        super();
        this.template = "";
        fetch("./SDU460.html").then(r => r.text()).then(t => {
            this.innerHTML = t;
        });
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
            console.log("Lost connection");
        }

        ws.onerror = function (ev) {
            console.log("Com Error");
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
}

customElements.define("g3x-sdu460", SDU460);