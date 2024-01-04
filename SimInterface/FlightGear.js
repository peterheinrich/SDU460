/*
 * Copyright (C) 2024, Peter Heinrich <peter@open-simulations.ch>
 * 
 * This file is part of OS3X-Touch, a visual look alike of a well
 * known avionics system for use in desktop flight simulators.
 * 
 * OS3X-Touch is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 * 
 * OS3X-Touch is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the 
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License 
 * along with Foobar. If not, see <https://www.gnu.org/licenses/>.
 */
import { MessageBus } from '../tools/MessageBus.js';
import { FlightSimInterface } from './FlightSimInterface.js';

export class FlightGear {

    /* Singleton pattern for FlightGearInterface */
    constructor() {
        if (FlightGear._instance) {
            return FlightGear._instance;
        }
        FlightGear._instance = this;
        this.hasConnection = false;
    }

    connect() {
        var attach = function (ws, path) {
            ws.send(JSON.stringify({
                command: 'addListener',
                node: path
            }));
        }

        var ws = new WebSocket('ws://localhost:8080/PropertyListener')
        var stream_properties = [
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
        ];
        var poll_properties = [
            'instrumentation/transponder/id-code',
            'instrumentation/transponder/ident',
            'instrumentation/transponder/inputs/knob-mode',
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
        var high_speed_poll_properties = [
            'sim/time/gmt-string',
        ];

        ws.onopen = function (ev) {
            stream_properties.forEach(element => {
                attach(ws, element);
            });
            poll_properties.forEach(element => {
                attach(ws, element);
            });
            FlightSimInterface.getInstance().hasConnection = true;
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
            this.hasConnection = false;
        }

        ws.onerror = function (ev) {
            console.log("Com Error");
            this.hasConnection = false;
            setTimeout(FlightSimInterface.getInstance().connect, 10000);
            console.log("reconnecting ...")
        }

        /* read all parameters initially from sim */
        var rereadAll = function (propertiesList) {
            if (!FlightSimInterface.getInstance().hasConnection) {
                return;
            }
            propertiesList.forEach(element => {
                if (!FlightSimInterface.getInstance().hasConnection) return;
                fetch("http://localhost:8080/json/" + element).then((response) => {
                    return response.json();
                }).then((data) => {
                    new MessageBus().publish(element.split("/")[element.split("/").length - 1], data.value);
                });
            });
        }
        setInterval(() => rereadAll(poll_properties), 1000);
        setInterval(() => rereadAll(high_speed_poll_properties), 100);
        rereadAll(stream_properties);
    }

    async readProperty(path) {
        return fetch("http://localhost:8080/json/" + path).then((response) => {
            return response.json();
        });
    };

    async writeProperty(path, val) {
        fetch("http://localhost:8080/json/" + path, { method: "POST", body: JSON.stringify({ value: val }) }).then((data) => {
        });
    };

    async readStbyFrequency() {
        return this.readProperty("instrumentation/comm/frequencies/standby-mhz-fmt").then((data) => {
            return data.value;
        });
    }
    
    setCOM1StbyFrequency(value) {
        value = value.replace(".", "");
        if (value.length == 3) value = value + "000";
        if (value.length == 4) value = value + "00";
        if (value.length == 5) value = value + "0";
        let channel = Math.round((value - 118000) / 6.25);
        this.writeProperty("instrumentation/comm/frequencies/standby-channel-width-khz", "8.33").then(() => {
            this.writeProperty("instrumentation/comm/frequencies/standby-channel", channel);
        })
    }

    swapCOM1Frequencies() {
        debugger;
        this.readProperty("instrumentation/comm/frequencies/selected-channel").then((selected) => {
            this.readProperty("instrumentation/comm/frequencies/standby-channel").then((standby) => {
                this.writeProperty("instrumentation/comm/frequencies/standby-channel-width-khz", "8.33").then(() => {
                    this.writeProperty("instrumentation/comm/frequencies/selected-channel-width-khz", "8.33").then(() => {
                        this.writeProperty("instrumentation/comm/frequencies/selected-channel", standby.value);
                        this.writeProperty("instrumentation/comm/frequencies/standby-channel", selected.value);
                    });
                });
            });
        });
    }

}