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

class ADI extends OSModule {
    static observedAttributes = ["fullscreen"];

    constructor() {
        super("./PFD/ADI.svg");
        this.roll = 0;
        this.pitch = 0;

       new MessageBus().subscribe("indicated-roll-deg", this.updateRoll.bind(this));
       new MessageBus().subscribe("indicated-pitch-deg", this.updatePitch.bind(this));

    }

    attributeChangedCallback(name, oldValue, newValue) {

        let svg = this.getLocalElementByID("container");
        let viewPort = this.getLocalElementByID('viewport');

        if(newValue === "false") {
            svg.setAttribute("viewBox", "0 0 550 710");
            svg.setAttribute("width", "550");

            viewPort.setAttribute("transform","translate(280,200)");
        }
        else {
            svg.setAttribute("viewBox", "0 0 1100 710");
            svg.setAttribute("width", "1100");
            viewPort.setAttribute("transform","translate(550,200)");
        }
      }
    
    updateRoll(type, message) {
        if (type === "indicated-roll-deg") {
            this.roll = -message;
        }
        this.renderUI();
    }

    updatePitch(type, message) {
        if (type === "indicated-pitch-deg") {
            this.pitch = message;
        }
        this.renderUI();
    }

    renderUI() {
        let horizon = this.getLocalElementByID('horizon');
        horizon.setAttribute("transform", "rotate(" + this.roll + ",0,0)  translate(0," + 14.5 * this.pitch + ")");
        let pitchbar = this.getLocalElementByID('pitch');
        pitchbar.setAttribute("transform", "translate(0," + 14.5 * this.pitch + ")");
        let bank_indicator = this.getLocalElementByID('bank_indicator');
        bank_indicator.setAttribute("transform", "rotate(" + this.roll + ",0,0)  ");
    }

}

customElements.define("pfd-adi", ADI);