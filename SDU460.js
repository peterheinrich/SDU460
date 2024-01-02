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
import { FlightSimInterface } from '../SimInterface/FlightSimInterface.js'
class SDU460 extends HTMLElement {
    constructor() {
        super();
        this.splitScreen = false;
        this.transponderDialog = false;
        this.frequencyDialog = false;
        fetch("./SDU460.html").then(r => r.text()).then(t => {
            this.innerHTML = t;
        });
    }

    connectedCallback() {
        document.addEventListener('pushed', this.mainEventHandler);
        document.addEventListener('closerequest', this.closeOverlay);

        FlightSimInterface.getInstance().connect();

    }

    mainEventHandler(event) {
        if (event.target.getAttribute('id') === "btnSplit") {

            this.splitScreen = !this.splitScreen;

            if (this.splitScreen) {
                document.getElementsByTagName("sdu460-pfd")[0].setAttribute("fullscreen", "true");
                document.getElementsByTagName("sdu460-mfd")[0].setAttribute("mfdpage", "hidden");
                document.getElementsByTagName("sdu460-mfd")[0].setAttribute("overlay", "");
            }
            else {
                document.getElementsByTagName("sdu460-pfd")[0].setAttribute("fullscreen", "false");
                document.getElementsByTagName("sdu460-mfd")[0].setAttribute("mfdpage", "map");
                document.getElementsByTagName("sdu460-mfd")[0].setAttribute("overlay", "");
            }
        }
        else if (event.target.getAttribute('id') === "btnCom1Stby") {
            this.frequencyDialog = !this.frequencyDialog;
            if (this.frequencyDialog) {
                document.getElementsByTagName("sdu460-mfd")[0].setAttribute("overlay", "frequency");
            }
            else {
                document.getElementsByTagName("sdu460-mfd")[0].setAttribute("overlay", "");
            }
        }
        else if (event.target.getAttribute('id') === "xpdr") {
            this.transponderDialog = !this.transponderDialog;
            if (this.transponderDialog) {
                document.getElementsByTagName("sdu460-mfd")[0].setAttribute("overlay", "transponder");
            }
            else {
                document.getElementsByTagName("sdu460-mfd")[0].setAttribute("overlay", "");
            }
        }

    }
    closeOverlay() {
        document.getElementsByTagName("sdu460-mfd")[0].setAttribute("overlay", "");
    }
}

customElements.define("g3x-sdu460", SDU460);