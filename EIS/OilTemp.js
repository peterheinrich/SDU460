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

class OILTEMP extends OSModule {
    constructor() {
        super("./EIS/OilTemp.svg");
        this.temp = 0;
        this.max = 0;
        this.initCompleted = false;
        new MessageBus().subscribe("oil-temperature-degf", this.update.bind(this));
    }

    update(type, message) {
        if (type === "oil-temperature-degf") {
            this.temp = message;
        }
        this.renderUI();
    }

    renderUI() {

        if(!this.initCompleted) {
            this.initCompleted = true;
            let dash2 = this.getLocalElementByID('dash2');
            let dash3 = this.getLocalElementByID('dash3');
            let line1 = this.getLocalElementByID('line1');
            let high = Math.round(this.getAttribute("high"));
            let low = Math.round(this.getAttribute("low"));
            this.max = Math.round(high) + 20;

            dash2.setAttribute("x1", low/this.max * 130);
            dash2.setAttribute("x2", low/this.max * 130);
            dash3.setAttribute("x1", high/this.max * 130);
            dash3.setAttribute("x2", high/this.max * 130);
            line1.setAttribute("x1", low/this.max * 130);
            line1.setAttribute("x2", high/this.max * 130);
            
        }

        let c = this.getLocalElementByID('oilf');
        if (this.temp < 0) {
            c.setAttribute("transform", "translate(0,0)");
        }
        else if (this.temp > this.max) {
            c.setAttribute("transform", "translate(130,0)");
        }
        else {
            c.setAttribute("transform", "translate(" + (this.temp) / this.max * 130 + ",0)");
        }
        c = this.getLocalElementByID('oilfvalue');
        c.innerHTML = Math.round(this.temp);
    }
}

customElements.define("eis-oiltemp", OILTEMP);