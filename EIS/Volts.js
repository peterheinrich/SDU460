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

class VOLTS extends HTMLElement {
    constructor() {
        super();

        fetch("./EIS/Volts.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.volts = 0;
        new MessageBus().subscribe("volts", this.update.bind(this));
    }

    update(type, message) {
        if (type === "volts") {
            this.volts = message;
        }
        this.renderUI();
    }

    renderUI() {
        let c = this.getElementsByTagName("svg")[0];
        if(this.volts < 16) {
            c = this.getElementsByTagName("svg")[0].getElementById('volts');
            c.setAttribute("transform", "translate(0,0)");
            c = this.getElementsByTagName("svg")[0].getElementById('voltsbackground');
            c.setAttribute("fill", "#FF0000");
            c = this.getElementsByTagName("svg")[0].getElementById('voltslabel');
            c.setAttribute("fill", "black");
            c = this.getElementsByTagName("svg")[0].getElementById('voltsvalue');
            c.setAttribute("fill", "black");
        }
        else if(this.volts >=16 && this.volts < 20) {
            c = this.getElementsByTagName("svg")[0].getElementById('volts');
            c.setAttribute("transform", "translate(0,0)");
            c = this.getElementsByTagName("svg")[0].getElementById('voltsbackground');
            c.setAttribute("fill", "#FF0000");
            c = this.getElementsByTagName("svg")[0].getElementById('voltslabel');
            c.setAttribute("fill", "black");
            c = this.getElementsByTagName("svg")[0].getElementById('voltsvalue');
            c.setAttribute("fill", "black");
            c = this.getElementsByTagName("svg")[0].getElementById('volts');
            c.setAttribute("transform", "translate(" + (this.volts-16)/16.2*130 + ",0)");
       
        } else if(this.volts >=20 && this.volts < 22) {
            c = this.getElementsByTagName("svg")[0].getElementById('voltsbackground');
            c.setAttribute("fill", "#FFFF00");
            c = this.getElementsByTagName("svg")[0].getElementById('voltslabel');
            c.setAttribute("fill", "black");
            c = this.getElementsByTagName("svg")[0].getElementById('voltsvalue');
            c.setAttribute("fill", "black");
            c = this.getElementsByTagName("svg")[0].getElementById('volts');
            c.setAttribute("transform", "translate(" + (this.volts-16)/16.2*130 + ",0)");
        } else {
            c = this.getElementsByTagName("svg")[0].getElementById('voltsbackground');
            c.setAttribute("fill", "black");
            c = this.getElementsByTagName("svg")[0].getElementById('voltslabel');
            c.setAttribute("fill", "white");
            c = this.getElementsByTagName("svg")[0].getElementById('voltsvalue');
            c.setAttribute("fill", "white");
            c = this.getElementsByTagName("svg")[0].getElementById('volts');
            c.setAttribute("transform", "translate(" + (this.volts-16)/16.2*130 + ",0)");
        }
        c = this.getElementsByTagName("svg")[0].getElementById('voltsvalue');
        c.innerHTML = Math.round(this.volts*10)/10;
    }
}

customElements.define("eis-volts", VOLTS);