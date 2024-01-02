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

class OILPSI extends OSModule {
    constructor() {
        super("./EIS/OilPSI.svg");
        this.psi = 0;
        this.initCompleted = false;
        new MessageBus().subscribe("oil-pressure-psi", this.update.bind(this));
    }

    update(type, message) {
        if (type === "oil-pressure-psi") {
            this.psi = message;
        }
        this.renderUI();
    }

    renderUI() {

        if(!this.initCompleted) {
            this.initCompleted = true;

            let high_attr = this.getAttribute("high");
            let low = this.getAttribute("low") / high_attr * 130;
            let green1 = this.getAttribute("green1") / high_attr * 130;
            let green2 = this.getAttribute("green2") / high_attr * 130; 
            let high = 130;

            let dash2 = this.getLocalElementByID('dash2');
            let dash3 = this.getLocalElementByID('dash3');
            let dash4 = this.getLocalElementByID('dash4');

            let line1 = this.getLocalElementByID('line1');
            let line2 = this.getLocalElementByID('line2');
            let line3 = this.getLocalElementByID('line3');
            let line4 = this.getLocalElementByID('line4');

            dash2.setAttribute("x1", low);
            dash2.setAttribute("x2", low);
            dash3.setAttribute("x1", green1);
            dash3.setAttribute("x2", green1);
            dash4.setAttribute("x1", green2);
            dash4.setAttribute("x2", green2);
            line1.setAttribute("x1", 0);
            line1.setAttribute("x2", low);
            line2.setAttribute("x1", low);
            line2.setAttribute("x2", green1);
            line3.setAttribute("x1", green1);
            line3.setAttribute("x2", green2);
            line4.setAttribute("x1", green2);
            line4.setAttribute("x2", 130);
        }

        let c = this.getLocalElementByID('oilpsi');
        if (this.psi < 0) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.psi > this.getAttribute("high")) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.psi) / this.getAttribute("high") * 130 + ",0)");
        }
        c = this.getLocalElementByID('oilpsivalue');
        c.innerHTML = Math.round(this.psi);
    }
}

customElements.define("eis-oilpsi", OILPSI);