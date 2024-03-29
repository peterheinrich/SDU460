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

class VSI extends OSModule {

    constructor() {
        super("./PFD/VSI.svg");
        this.vs = 0;
        new MessageBus().subscribe("indicated-speed-fpm", this.updateVSI.bind(this));
    }


    updateVSI(type, message) {
        if (type === "indicated-speed-fpm") {
            this.vs = message;
        }
        this.renderUI();
    }


    renderUI() {
        let vsi = this.getLocalElementByID('vsi');
        let valpx = 0;
        if (this.vs >= -1000 && this.vs <= 1000) {
            valpx = this.vs * 9 / 100;
        }
        else if (this.vs > 1000) {
            valpx = ((this.vs - 1000) * 3 / 100) + 90;
        }
        else {
            valpx = ((this.vs + 1000) * 3 / 100) - 90;
        }
        vsi.setAttribute("transform", "translate(0," + (-1) * (valpx) + ")");
    }

}

customElements.define("pfd-vsi", VSI);