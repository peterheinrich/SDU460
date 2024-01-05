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

class ASI extends OSModule {
    constructor() {
        super("./PFD/ASI.svg");

        this.ias = 0;
        this.gs = 0;
        this.tas = 0;
        this.initCompleted = false;

        new MessageBus().subscribe("indicated-speed-kt", this.updateIAS.bind(this));
        new MessageBus().subscribe("groundspeed-kt", this.updateGS.bind(this));
        new MessageBus().subscribe("airspeed-kt", this.updateTAS.bind(this));

    }


    updateIAS(type, message) {
        if (type === "indicated-speed-kt") {
            this.ias = message;
        }
        this.renderUI();
    }

    updateTAS(type, message) {
        if (type === "airspeed-kt") {
            this.tas = message;
        }
        this.renderTapeUI();
    }

    updateGS(type, message) {
        if (type === "groundspeed-kt") {
            this.gs = message;
        }
        this.renderUI();
    }

    renderUI() {
        let gs = this.getLocalElementByID('gs');
        gs.innerHTML = Math.round(this.gs);
        let tas = this.getLocalElementByID('tas');
        tas.innerHTML = Math.round(this.tas);
    }


    renderTapeUI() {

        if (!this.initCompleted) {
            this.initCompleted = true;

            let greenLine = this.getLocalElementByID('greenLine');
            let whiteLine = this.getLocalElementByID('whiteLine');
            let yellowLine = this.getLocalElementByID('yellowLine');
            let redLine = this.getLocalElementByID('redLine');

            greenLine.setAttribute("y1", (-1) * this.getAttribute("green1") * 4 + 170);
            greenLine.setAttribute("y2", (-1) * this.getAttribute("green2") * 4 + 170);
            whiteLine.setAttribute("y1", (-1) * this.getAttribute("white1") * 4 + 170);
            whiteLine.setAttribute("y2", (-1) * this.getAttribute("white2") * 4 + 170);
            yellowLine.setAttribute("y1", (-1) * this.getAttribute("yellow1") * 4 + 170);
            yellowLine.setAttribute("y2", (-1) * this.getAttribute("yellow2") * 4 + 170);
            redLine.setAttribute("y1", (-1) * this.getAttribute("red1") * 4 + 170);
            redLine.setAttribute("y2", (-1) * 300 * 4 + 170);

        }

        let as_tape = this.getLocalElementByID('as_tape');
        as_tape.setAttribute("transform", "translate(0," + (this.ias * 4) + ")");

        let as_digit3_tape = this.getLocalElementByID('as_digit3_tape');
        let as_digit2_tape = this.getLocalElementByID('as_digit2_tape');
        let as_digit1_tape = this.getLocalElementByID('as_digit1_tape');

        // blank if leading digit is zero
        if (Math.floor(this.ias / 100) === 0) {
            this.scrollAirspeedDigit(as_digit3_tape, -2);
            if (Math.floor(this.ias / 10) === 0) {
                this.scrollAirspeedDigit(as_digit2_tape, -2);
            }
            else {
                this.scrollAirspeedDigit(as_digit2_tape, Math.floor((this.ias % 100) / 10));
            }
        }
        else {
            this.scrollAirspeedDigit(as_digit3_tape, Math.floor((this.ias % 1000) / 100));
            this.scrollAirspeedDigit(as_digit2_tape, Math.floor((this.ias % 100) / 10));
        }
        let digit3 = (this.ias % 10);
        this.scrollAirspeedDigit(as_digit1_tape, digit3);



    }


    scrollAirspeedDigit(digit_tape, value) {
        digit_tape.setAttribute("transform", "translate(0," + (value * 32) + ")");
    }

}



customElements.define("pfd-asi", ASI);