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

class EISRPM extends OSModule {
    constructor() {
        super("./EIS/RPM.svg");
        this.rpm = 0;
        new MessageBus().subscribe("rpm", this.update.bind(this));
    }

    update(type, message) {
        if (type === "rpm") {
            this.rpm = message;
        }
        this.renderUI();
    }

    renderUI() {
        if (this.rpm < 300) {
            this.rpm = 0;
        }

        else if (this.rpm > 3200) {
            this.rpm = 3200;
        }
        
        let c = this.getLocalElementByID('rpm');
        c.setAttribute("transform", "rotate(" + (211) * (this.rpm - 300) / 2800 + ",0,0)");
        c = this.getLocalElementByID('rpmvalue');
        c.innerHTML = Math.round(this.rpm);

    }
}

customElements.define("eis-rpm", EISRPM);