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

class Footer extends OSModule {
    constructor() {
        super("./Footer/Footer.svg");
        this.oat = 0;
        this.gmt = "00:00:00";
        new MessageBus().subscribe("temperature-degc", this.update.bind(this));
        new MessageBus().subscribe("gmt-string", this.update.bind(this));
    }

    update(type, message) {
        if (type === "temperature-degc") {
            this.oat = Math.round(message);
        }
        else if (type === "gmt-string") {
            this.gmt = message;
        }
        this.renderUI();
    }

    renderUI() {
        let oat = this.getLocalElementByID('oat');
        oat.innerHTML = this.oat + "°C";
        let gmt = this.getLocalElementByID('gmt');
        gmt.innerHTML = this.gmt;  
    }
}

customElements.define("sdu-footer", Footer);