/*
 * Copyright (C) 2024, Peter Heinrich <peter@open-simulations.ch>
 * 
 * This file is part of SDU460, a visual look alike of a well
 * known avionics system for use in desktop flight simulators.
 * 
 * SDU460 is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 * 
 * SDU460 is distributed in the hope that it will be useful, but 
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
        this.toflag = false;
        this.fromflag = false;
        this.needledeflection = 0.0;
        this.vorbearing = 0.0;


        new MessageBus().subscribe("indicated-heading-deg", this.update.bind(this));
        new MessageBus().subscribe("indicated-track-true-deg", this.updateTrack.bind(this));
        new MessageBus().subscribe("heading-bug-deg", this.updateHdgBug.bind(this));
        new MessageBus().subscribe("from-flag", this.updateVOR.bind(this));
        new MessageBus().subscribe("to-flag", this.updateVOR.bind(this));
        new MessageBus().subscribe("filtered-cdiNAV0-deflection", this.updateVORNeedle.bind(this));
        new MessageBus().subscribe("selected-deg", this.updateVORNeedle.bind(this));
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
    updateVOR(type, message) {
        if (type === "to-flag") {
            this.toflag = message;
        }
        else if (type === "from-flag") {
            this.fromflag = message;
        }
        
        this.renderVORFlags();
    }

    updateVORNeedle(type, message) {
        if (type === "filtered-cdiNAV0-deflection") {
            this.needledeflection = Math.round(message * 10) / 10;
        }
        else if (type === "selected-deg") {
            this.vorbearing = Math.round(message * 10) / 10;
        }
 
        this.renderVORFNeedle();
    }

    updateTrack(type, message) {
        if (type === "indicated-track-true-deg") {
            this.track = Math.round(message);
        }
        this.renderTrack();
    }

    renderVORFlags() {
        let c = this.getLocalElementByID('vor-to');
        c.setAttribute("style", this.toflag ? "" : "display:none");
        c = this.getLocalElementByID('vor-from');
        c.setAttribute("style", this.fromflag ? "" : "display:none");
    }

    renderVORFNeedle() {
        let c = this.getLocalElementByID('needle');
        c.setAttribute("x1", this.needledeflection / 10 * 60);
        c.setAttribute("x2", this.needledeflection / 10 * 60);
        c = this.getLocalElementByID('vor-obs');
        c.setAttribute("transform", "rotate(" + (this.vorbearing) + ",0,0)");
        c = this.getLocalElementByID('crs-text');
        c.innerHTML = this.getDegreeString(this.vorbearing);
    }

    renderTrack() {
        if (!this.initCompleted) return;
        let c = this.getLocalElementByID('trk-text');
        c.innerHTML = this.getDegreeString(this.track);
      /*  c = this.getLocalElementByID('compass-trk-needle');
        c.setAttribute("transform", "rotate(" + (this.track) + ",0,0)");*/

    }

    renderHdgBug() {
        if (!this.initCompleted) return;
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
        if (!this.initCompleted) return;
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