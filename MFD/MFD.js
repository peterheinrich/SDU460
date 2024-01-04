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

export class MFD extends OSModule {
    static get observedAttributes() {
        return ['mfdpage', 'overlay'];
    }
    constructor() {
        super("./MFD/MFD.html")
        this.currentPage = "map";
        this.overlay = null;
        this.initCompleted = false;

    }

    hasLoaded() {
        this.initCompleted = true;
        this.updateUI();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "mfdpage") {
            this.currentPage = newValue;
        }
        else if (name === "overlay") {
            this.overlay = newValue;
        }
        this.updateUI();
    }

    updateUI() {
        if (!this.initCompleted) return;
        if (this.overlay == null || this.overlay === "") {
            this.getLocalElementByID("transponder").setAttribute("style", "display: none; position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
            this.getLocalElementByID("frequencyselect").setAttribute("style", "display: none; position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
        }
        else if (this.overlay === "transponder") {
            this.getLocalElementByID("map").setAttribute("style", "display: none; position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
            this.getLocalElementByID("frequencyselect").setAttribute("style", "display: none; position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
            this.getLocalElementByID("transponder").setAttribute("style", "position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
            return;
        }
        else if (this.overlay === "frequency") {
            this.getLocalElementByID("map").setAttribute("style", "display: none; position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
            this.getLocalElementByID("frequencyselect").setAttribute("style", "position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
            this.getLocalElementByID("transponder").setAttribute("style", "display: none; position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
            return;
        }

        switch (this.currentPage) {
            case "map":
                this.getLocalElementByID("map").setAttribute("style", "position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
                break;
            case "hidden":
                this.getLocalElementByID("map").setAttribute("style", "display: none; position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
                break;
            default:
                console.error("Unknown view " + this.currentPage + "requested");
                break;
        }
    }
}
customElements.define("sdu460-mfd", MFD);
