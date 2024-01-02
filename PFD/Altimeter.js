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

class ALTIMETER extends OSModule {
    constructor() {
        super("./PFD/Altimeter.svg");
        this.altitude = 0;
        this.qnh = 0;
        new MessageBus().subscribe("indicated-altitude-ft", this.update.bind(this));
        new MessageBus().subscribe("setting-hpa", this.update.bind(this));
    }

    update(type, message) {
        if (type === "indicated-altitude-ft") {
            this.altitude = message;
        }
        else if (type === "setting-hpa") {
            this.qnh = Math.round(message);
        }
        this.renderUI();
    }

    renderUI() {

        let tape5 = this.getLocalElementByID('digit5_tape');
        let tape4 = this.getLocalElementByID('digit4_tape');
        let tape3 = this.getLocalElementByID('digit3_tape');
        let tape12 = this.getLocalElementByID('digit12_tape');

        // blank if leading digit is zero
        if (Math.floor(this.altitude / 10000) === 0) {
            this.scrollAltitudeDigit(tape5, -64);
        }
        else {
            this.scrollAltitudeDigit(tape5, Math.floor(this.altitude / 10000) * 32);
        }

        let digit4 = ((this.altitude % 10000) - (this.altitude % 1000)) / 1000;

        if (Math.floor(this.altitude / 10000) === 0 && Math.floor(this.altitude / 1000) === 0) {
            this.scrollAltitudeDigit(tape4, -64);
        }
        else {
            this.scrollAltitudeDigit(tape4, Math.floor(digit4) * 32);
        }

        let digit3 = ((this.altitude % 1000) - (this.altitude % 100)) / 100;
        this.scrollAltitudeDigit(tape3, Math.floor(digit3) * 25);
        let digit12 = (this.altitude % 100) / 20;

        this.scrollAltitudeDigit(tape12, digit12 * 25);

        let nearest = Math.round(this.altitude / 100) * 100
        let distance = this.altitude - nearest;
        let tape = this.getLocalElementByID('altimeter_tape');
        let u3t = this.getLocalElementByID('alt_upper_3t');
        let u3 = this.getLocalElementByID('alt_upper_3');
        let u2t = this.getLocalElementByID('alt_upper_2t');
        let u2 = this.getLocalElementByID('alt_upper_2');
        let u1t = this.getLocalElementByID('alt_upper_1t');
        let u1 = this.getLocalElementByID('alt_upper_1');
        let ct = this.getLocalElementByID('alt_centert');
        let c = this.getLocalElementByID('alt_center');
        let l1t = this.getLocalElementByID('alt_lower_1t');
        let l1 = this.getLocalElementByID('alt_lower_1');
        let l2t = this.getLocalElementByID('alt_lower_2t');
        let l2 = this.getLocalElementByID('alt_lower_2');
        let l3t = this.getLocalElementByID('alt_lower_3t');
        let l3 = this.getLocalElementByID('alt_lower_3');
        u3t.innerHTML = Math.floor((nearest + 300) / 1000);
        u3.innerHTML = ('000' + Math.floor(nearest + 300) % 1000).substr(-3);
        u2t.innerHTML = Math.floor((nearest + 200) / 1000);
        u2.innerHTML = ('000' + Math.floor(nearest + 200) % 1000).substr(-3);
        u1t.innerHTML = Math.floor((nearest + 100) / 1000);
        u1.innerHTML = ('000' + Math.floor(nearest + 100) % 1000).substr(-3);
        ct.innerHTML = Math.floor((nearest) / 1000);
        c.innerHTML = ('000' + Math.floor(nearest) % 1000).substr(-3);
        l1t.innerHTML = Math.floor((nearest - 100) / 1000);
        l1.innerHTML = ('000' + Math.floor(nearest - 100) % 1000).substr(-3);
        l2t.innerHTML = Math.floor((nearest - 200) / 1000);
        l2.innerHTML = ('000' + Math.floor(nearest - 200) % 1000).substr(-3);
        l3t.innerHTML = Math.floor((nearest - 300) / 1000);
        l3.innerHTML = ('000' + Math.floor(nearest - 300) % 1000).substr(-3);
        tape.setAttribute("transform", "translate(0," + (distance / 100 * 60) + ")");
    
        let qnh = this.getLocalElementByID('qnh');
        qnh.innerHTML = this.qnh;
    }


    scrollAltitudeDigit(digit_tape, value) {
        digit_tape.setAttribute("transform", "translate(0," + value + ")");
    }

}

customElements.define("pfd-altimeter", ALTIMETER);