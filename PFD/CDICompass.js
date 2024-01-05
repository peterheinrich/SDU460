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
import { OSModule } from '../tools/OSModule.js';
import { MessageBus } from '../../tools/MessageBus.js';

class CDICOMPASS extends OSModule {
    constructor() {
        super("./PFD/CDICompass.svg");

        this.heading = 0;
        this.headingbug = 0;
        this.track = 0;
        this.initCompleted = false;


        new MessageBus().subscribe("indicated-heading-deg", this.update.bind(this));
        new MessageBus().subscribe("indicated-track-true-deg", this.updateTrack.bind(this));
        new MessageBus().subscribe("heading-bug-deg", this.updateHdgBug.bind(this));
    }


    hasLoaded() {
        this.initCompleted = true;
    }

    update(type, message) {
        if (type === "indicated-heading-deg") {
            this.heading = message;
        }

        this.renderUI();
    }

    updateHdgBug(type, message) {
        if (type === "heading-bug-deg") {
            this.headingbug = message;
        }
        this.renderHdgBug();
    }

    updateTrack(type, message) {
        if (type === "indicated-track-true-deg") {
            this.track = Math.round(message);
        }
        this.renderTrack();
    }

    renderTrack() {
        if(!this.initCompleted) return;
        let c = this.getLocalElementByID('trk-text');
        c.innerHTML = this.getDegreeString(this.track);
        c = this.getLocalElementByID('compass-trk-needle');
        c.setAttribute("transform", "rotate(" + (this.track) + ",0,0)");

    }

    renderHdgBug() {
        if(!this.initCompleted) return;
        let c = this.getLocalElementByID('hdg-text');
        c.innerHTML = this.getDegreeString(this.headingbug);
        c = this.getLocalElementByID('hdg-bug');
        c.setAttribute("transform", "rotate(" + (this.headingbug) + ",0,0)");
    }

    getDegreeString(val) {
        if (val < 10) {
            return "00" + Math.round(val) + "°";
        }
        else if (val < 100) {
            return "0" + Math.round(val) + "°";
        }
        else {
            return Math.round(val) + "°";
        }
    }

    renderUI() {
        if(!this.initCompleted) return;
        let c = this.getLocalElementByID('compass');
        c.setAttribute("transform", "rotate(" + (-1) * this.heading + ",0,0)");
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