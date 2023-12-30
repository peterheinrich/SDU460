import { MessageBus } from '../tools/MessageBus.js';
export class FlightGearInterface {
    static connect() {
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
            'consumables/fuel/tank[1]/indicated-level-gal_us',
            'instrumentation/comm/frequencies/selected-mhz-fmt',
            'instrumentation/comm/frequencies/standby-mhz-fmt'
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
                if (path === "/consumables/fuel/tank/indicated-level-gal_us") {
                    new MessageBus().publish("indicated-level-gal_us_left", data.value);
                }
                else if (path === "/consumables/fuel/tank[1]/indicated-level-gal_us") {
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

        /* read all parameters initially from sim */
        var rereadAll = function () {
            properties.forEach(element => {
                fetch("http://localhost:8080/json/" + element).then((response) => {
                    return response.json();
                }).then((data) => {
                    new MessageBus().publish(element.split("/")[element.split("/").length - 1], data.value);
                });
            });
        }
        setInterval(rereadAll, 1000);
    }

    static com1SwapFrequencies() {
        fetch("http://localhost:8080/json/instrumentation/comm/frequencies/selected-channel").then((response) => {
                return response.json();
            }).then((freqSelected) => {
                fetch("http://localhost:8080/json/instrumentation/comm/frequencies/standby-channel").then((response) => {
                    return response.json();
                }).then((freqStandBy) => {
                    console.log(JSON.stringify({value:freqSelected.value}));
                    console.log(freqStandBy.value);
                    fetch("http://localhost:8080/json/instrumentation/comm/frequencies/selected-channel", {method:"POST", body:JSON.stringify({value:freqStandBy.value})}).then((data) => {
                        console.log(data);
                    });
                    fetch("http://localhost:8080/json/instrumentation/comm/frequencies/standby-channel", {method:"POST", body:JSON.stringify({value:freqSelected.value})}).then((data) => {
                        console.log(data);
                    });

                });
            });
    }
}