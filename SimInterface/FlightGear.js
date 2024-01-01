/*
 * Copyright (C) 2023, Peter Heinrich <peter@open-simulations.ch>
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
        if(FlightGear._instance) {
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
            'instrumentation/transponder/id-code',
            'instrumentation/transponder/ident',
            'instrumentation/transponder/inputs/knob-mode',
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
        var rereadAll = function () {
            if(!FlightSimInterface.getInstance().hasConnection) {
                return;
            }
            properties.forEach(element => {
                if(!FlightSimInterface.getInstance().hasConnection) return;
                fetch("http://localhost:8080/json/" + element).then((response) => {
                    return response.json();
                }).then((data) => {
                    new MessageBus().publish(element.split("/")[element.split("/").length - 1], data.value);
                });
            });
        }
        setInterval(rereadAll, 1000);
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
}