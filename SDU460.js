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
import {FlightGearInterface} from './SimInterface/FlightGear.js'
class SDU460 extends HTMLElement {
    constructor() {
        super();
        fetch("./SDU460.html").then(r => r.text()).then(t => {
            this.innerHTML = t;
        });
    }

    connectedCallback() {
        document.addEventListener('pushed', this.mainEventHandler);

        FlightGearInterface.connect();

    }

    mainEventHandler(event) {
        if (event.target.getAttribute('id') === "btnSplit") {

            this.splitScreen = !this.splitScreen;

            if (this.splitScreen) {
                let adi = document.getElementsByTagName("mfd-map")[0].setAttribute("style", "visibility: hidden; position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
                document.getElementsByTagName("pfd-adi")[0].setAttribute("fullscreen", "true");
                document.getElementsByTagName("pfd-altimeter")[0].setAttribute("style", "position:absolute; top: 100px; left: 940px;");
                document.getElementsByTagName("pfd-asi")[0].setAttribute("style", "position:absolute; top: 100px; left: 440px;");
                document.getElementsByTagName("pfd-cdi-compass")[0].setAttribute("style", "position:absolute; top: 425px; left: 530px;");
                document.getElementsByTagName("pfd-vsi")[0].setAttribute("style", "position:absolute; top: 140px; left: 1038px;");

            }
            else {
                let adi = document.getElementsByTagName("mfd-map")[0].setAttribute("style", "position:absolute; top: 65px; left: 730px; width: 550px; height: 700px;")
                document.getElementsByTagName("pfd-adi")[0].setAttribute("fullscreen", "false");
                document.getElementsByTagName("pfd-altimeter")[0].setAttribute("style", "position:absolute; top: 100px; left: 590px;");
                document.getElementsByTagName("pfd-asi")[0].setAttribute("style", "position:absolute; top: 100px; left: 240px;");
                document.getElementsByTagName("pfd-cdi-compass")[0].setAttribute("style", "position:absolute; top: 425px; left: 290px;");
                document.getElementsByTagName("pfd-vsi")[0].setAttribute("style", "position:absolute; top: 140px; left: 688px;");
            }

        }
        else if (event.target.getAttribute('id') === "btnCom1") {
            FlightGearInterface.com1SwapFrequencies();
        }
    }
}

customElements.define("g3x-sdu460", SDU460);