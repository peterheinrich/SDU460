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
import { MessageBus } from '../../tools/MessageBus.js';

class TransponderButton extends OSModule {
    constructor() {
        super("./Header/TransponderButton.svg");

        this.squak = "0";
        this.knobMode = 0;
        this.ident = "false";
        this.addEventListener('click', this.click);
        new MessageBus().subscribe("id-code", this.updateIdCode.bind(this));
        new MessageBus().subscribe("ident", this.updateIdent.bind(this));
        new MessageBus().subscribe("knob-mode", this.updateKnobMode.bind(this));
    }

    updateIdCode(type, message) {
        if (type === "id-code") {
            this.squak = message;
        }
        this.updateUI();
    }

    updateKnobMode(type, message) {
        if (type === "knob-mode") {
            this.knobMode = message;
        }
        this.updateUI();
    }

    updateIdent(type, message) {
        if (type === "ident") {
            this.ident = message;
        }
        this.updateUI();
    }

    updateUI() {
        let c = this.getLocalElementByID("squak");
        c.innerHTML = this.squak;
        c = this.getLocalElementByID("mode");
        switch (this.knobMode) {
            case 0:
                c.innerHTML = "OFF";
                break;
            case 1:
                c.innerHTML = "STBY";
                break;
            case 4:
                c.innerHTML = "ON";
                break;
            case 5:
                c.innerHTML = "ALT";
                break;

            default:
                c.innerHTML = OFF;
                break;

        }
        
        
        c = this.getLocalElementByID("colorbar");
        if(this.ident) {
            c.setAttribute("stroke", "#33FF33");
        }
        else {
            c.setAttribute("stroke", "#333333");
        }

    }

    click(event) {
        event.stopPropagation();
        event.cancleBubble = true;
        this.dispatchEvent(
            new CustomEvent('pushed', {
                bubbles: true,
            })
        );
    }
}
customElements.define("sdu-xpdr", TransponderButton);