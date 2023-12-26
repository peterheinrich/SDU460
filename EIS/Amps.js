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
import { MessageBus } from '../../tools/MessageBus.js';

class AMPS extends HTMLElement {
    constructor() {
        super();

        fetch("./EIS/Amps.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.fpsi = 0;
        new MessageBus().subscribe("amps", this.update.bind(this));
    }

    update(type, message) {
        if (type === "amps") {
            this.amps = message;
        }
        this.renderUI();
    }

    renderUI() {
        let c = this.getElementsByTagName("svg")[0].getElementById('amps');
        if (this.amps < -60) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.amps > 60) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.amps+60)/120*130 + ",0)");
        }
        c = this.getElementsByTagName("svg")[0].getElementById('ampsvalue');
        if(this.amps > 0) {
            c.innerHTML = '+' + Math.round(this.amps);
        }
        else {
            c.innerHTML = Math.round(this.amps);
        }
    }
}

customElements.define("eis-amps", AMPS);