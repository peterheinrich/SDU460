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

class FUELTANK extends HTMLElement {
    constructor() {
        super();
        debugger
        fetch("./EIS/FuelTank.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.initCompleted = false;
        this.max = 0;
        this.left = 0;
        this.right = 0;
        new MessageBus().subscribe("indicated-level-gal_us_left", this.update.bind(this));
        new MessageBus().subscribe("indicated-level-gal_us_right", this.update.bind(this));

    }

    update(type, message) {
        if (type === "indicated-level-gal_us_left") {
            this.left = message;
        }
        else if (type === "indicated-level-gal_us_right") {
            this.right = message;
        }
        this.renderUI();
    }

    renderUI() {

        if(!this.initCompleted) {
            this.initCompleted = true;
            this.max = Math.round(this.getAttribute("max")*10)/10;
        }
        let c = this.getElementsByTagName("svg")[0].getElementById('fuelmarker_left');
        if (this.left < 0) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.left > this.max) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.left)/this.max * 130 + ",0)");
        }

        c = this.getElementsByTagName("svg")[0].getElementById('fuelmarker_right');
        if (this.right < 0) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.right > this.max) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.right)/this.max * 130 + ",0)");
        }

        c = this.getElementsByTagName("svg")[0].getElementById('fuelleft');
        c.innerHTML = Math.round(this.left * 10) / 10;
        c = this.getElementsByTagName("svg")[0].getElementById('fuelright');
        c.innerHTML = Math.round(this.right * 10) / 10;
    }
}

customElements.define("eis-fueltank", FUELTANK);