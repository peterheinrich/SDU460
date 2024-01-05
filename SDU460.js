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
import { OSModule } from './tools/OSModule.js';
import { FlightSimInterface } from '../SimInterface/FlightSimInterface.js'

class SDU460 extends OSModule {
    constructor() {
        super("./SDU460.html");
        this.splitScreen = false;
        this.transponderDialog = false;
        this.frequencyDialog = false;
    }

    connectedCallback() {
        document.addEventListener('pushed', this.mainEventHandler);
        document.addEventListener('closerequest', this.closeOverlay);

        FlightSimInterface.getInstance().connect();

    }

    mainEventHandler(event) {
        let eventId = event.target.getAttribute('id').split("_")[1];
        if (eventId === "btnSplit") {

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
        else if (eventId === "btnCom1Stby") {
            this.frequencyDialog = !this.frequencyDialog;
            if (this.frequencyDialog) {
                document.getElementsByTagName("sdu460-mfd")[0].setAttribute("overlay", "frequency");
            }
            else {
                document.getElementsByTagName("sdu460-mfd")[0].setAttribute("overlay", "");
            }
        } 
        else if (eventId == "btnCom1") {
            FlightSimInterface.getInstance().swapCOM1Frequencies();
        }
        else if (eventId === "xpdr") {
            this.transponderDialog = !this.transponderDialog;
            if (this.transponderDialog) {
                document.getElementsByTagName("sdu460-mfd")[0].setAttribute("overlay", "transponder");
            }
            else {
                document.getElementsByTagName("sdu460-mfd")[0].setAttribute("overlay", "");
            }
        }
        else {
            console.log("Unknown Button with id " + event.target.getAttribute('id') + "pressed");
        }

    }
    closeOverlay() {
        document.getElementsByTagName("sdu460-mfd")[0].setAttribute("overlay", "");
    }

    
}

customElements.define("sdu460-instrument", SDU460);