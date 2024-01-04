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

export class PFD extends OSModule {
    static get observedAttributes() {
        return ['fullscreen'];
    }
    constructor() {
        super("./PFD/PFD.html")
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name === "fullscreen") {
            this.isFullsceen = newValue;
        }
        this.updateUI();
    }

    updateUI() {
        let adi = this.getElementsByTagName("pfd-adi")[0];
        let altimeter = this.getElementsByTagName("pfd-altimeter")[0];
        let asi = this.getElementsByTagName("pfd-asi")[0];
        let cdi = this.getElementsByTagName("pfd-cdi-compass")[0];
        let vsi = this.getElementsByTagName("pfd-vsi")[0];
        
        if(this.isFullsceen === "true") {
            adi.setAttribute("fullscreen", "true");
            adi.setAttribute("style", "position:absolute; top: 65px; left: 180px;");
            altimeter.setAttribute("style", "position:absolute; top: 100px; left: 940px");
            asi.setAttribute("style", "position:absolute; top: 100px; left: 440px;");
            cdi.setAttribute("style", "position:absolute; top: 425px; left: 530px;");
            vsi.setAttribute("style", "position:absolute; top: 140px; left: 1038px;");
        }
        else {
            adi.setAttribute("fullscreen", "false");
            adi.setAttribute("style", "position:absolute; top: 65px; left: 180px;");
            altimeter.setAttribute("style", "position:absolute; top: 100px; left: 590px");
            asi.setAttribute("style", "position:absolute; top: 100px; left: 240px;");
            cdi.setAttribute("style", "position:absolute; top: 425px; left: 290px;");
            vsi.setAttribute("style", "position:absolute; top: 140px; left: 688px;");
        }
    }
}

customElements.define("sdu460-pfd", PFD);
