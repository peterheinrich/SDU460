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
import { OSModule } from '../tools/OSModule.js';
import { MessageBus } from '../../tools/MessageBus.js';

class CDICOMPASS extends OSModule {
    constructor() {
        super("./PFD/CDICompass.svg");

        this.heading = 0;
        this.track = 0;

        new MessageBus().subscribe("indicated-heading-deg", this.update.bind(this));
        new MessageBus().subscribe("indicated-track-true-deg", this.updateTrack.bind(this));
    }

    update(type, message) {
        if (type === "indicated-heading-deg") {
            this.heading = message;
        }
        this.renderUI();
    }

    updateTrack(type, message) {
        if (type === "indicated-track-true-deg") {
            this.track = Math.round(message);
        }
        this.renderTrack();
    }

    renderTrack() {
        let c = this.getLocalElementByID('trk-text');
        c.innerHTML = this.track + "°";
    }

    renderUI() {
        let c = this.getLocalElementByID('compass');
        c.setAttribute("transform", "rotate(" + (-1)*this.heading + ",0,0)");
        c = this.getLocalElementByID('comp_N');
        c.setAttribute("transform", "rotate(" + this.heading + ",0,-94)");
        c = this.getLocalElementByID('comp_E');
        c.setAttribute("transform", "rotate(" + this.heading + ",94,0)");
        c = this.getLocalElementByID('comp_S');
        c.setAttribute("transform", "rotate(" + this.heading + ",0,94)");
        c = this.getLocalElementByID('comp_W');
        c.setAttribute("transform", "rotate(" + this.heading + ",-94,0)");

        c = this.getLocalElementByID('comp_3');
        c.setAttribute("transform", "rotate(" + this.heading + ",47,-81.4)");
        c = this.getLocalElementByID('comp_6');
        c.setAttribute("transform", "rotate(" + this.heading + ",81.4,-47)");
        c = this.getLocalElementByID('comp_12');
        c.setAttribute("transform", "rotate(" + this.heading + ",81.4,47)");
        c = this.getLocalElementByID('comp_15');
        c.setAttribute("transform", "rotate(" + this.heading + ",47,81.4)");
        c = this.getLocalElementByID('comp_21');
        c.setAttribute("transform", "rotate(" + this.heading + ",-47,81.4)");
        c = this.getLocalElementByID('comp_24');
        c.setAttribute("transform", "rotate(" + this.heading + ",-81.4,47)");
        c = this.getLocalElementByID('comp_30');
        c.setAttribute("transform", "rotate(" + this.heading + ",-81.4,-47)");
        c = this.getLocalElementByID('comp_33');
        c.setAttribute("transform", "rotate(" + this.heading + ",-47,-81.4)");
        
    }
}

customElements.define("pfd-cdi-compass", CDICOMPASS);