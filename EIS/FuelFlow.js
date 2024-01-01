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

class FUELFLOW extends HTMLElement {
    constructor() {
        super();
        fetch("./EIS/FuelFlow.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.flowgph = 0;
        this.initCompleted = false;
        this.max = 0;
        new MessageBus().subscribe("fuel-flow-gph", this.update.bind(this));
    }

    update(type, message) {
        if (type === "fuel-flow-gph") {
            this.flowgph = message;
        }
        this.renderUI();
    }

    renderUI() {

        if(!this.initCompleted) {
            this.initCompleted = true;
            this.max = Math.round(this.getAttribute("max"));
        }
        let c = this.getElementsByTagName("svg")[0].getElementById('fuelpsi');
        if (this.flowgph < 0) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.flowgph > this.max) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.flowgph)/this.max * 130 + ",0)");
        }
        c = this.getElementsByTagName("svg")[0].getElementById('fuelpsivalue');
        c.innerHTML = Math.round(this.flowgph * 10) / 10;
    }
}

customElements.define("eis-fuelflow", FUELFLOW);