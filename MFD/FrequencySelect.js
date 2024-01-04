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
import { MessageBus } from '../../tools/MessageBus.js';
import { OSModule } from '../../tools/OSModule.js';
import { FlightSimInterface } from '../../SimInterface/FlightSimInterface.js';

class MFDFrequencySelect extends OSModule {
    constructor() {
        super("./MFD/FrequencySelect.html");
        this.addEventListener('button', this.buttonPressed);
        this.initCompleted = false;
        this.currentInput = "";
        this.ident = false;
        this.knobMode = 0;
    }

    hasLoaded() {
        this.initCompleted = true;
    }

    updateUI() {
        if (!this.initCompleted) return;
        let inputText = this.getLocalElementByID("frequency-input");
        inputText.innerHTML = this.currentInput;
    }

    buttonPressed(event) {
        let id = this.stripLocalID(event.target.getAttribute('id'));
        switch (id) {
            case "btn-0":
            case "btn-1":
            case "btn-2":
            case "btn-3":
            case "btn-4":
            case "btn-5":
            case "btn-6":
            case "btn-7":
            case "btn-8":
            case "btn-9":
                if (this.currentInput.length == 3) {
                    this.currentInput += ".";
                }
                else if (this.currentInput.length == 7) {
                    this.currentInput = "";
                }
                this.numberButtonInput(id.split("-")[1]);
                break;
            case "btn-delete":
                if (this.currentInput.length >= 1) {
                    this.currentInput = this.currentInput.slice(0, -1);
                }
                break;
            case "btn-back":
                this.throwParentEvent();
                break;
            case "btn-enter":
                FlightSimInterface.getInstance().setCOM1StbyFrequency(this.currentInput);
                this.throwParentEvent();
                break;

            // Currently unimplemented
            case "btn-find":
                break;

            case "btn-squelch":
                break;
            case "btn-monitor":
                break;
            default:
                console.error("Unknown button pressed!" + id);
                break;
        }
        this.updateUI();
    }

    throwParentEvent() {
        this.dispatchEvent(
            new CustomEvent('closerequest', {
                bubbles: true,
            })
        );
    }

    numberButtonInput(value) {
        this.currentInput = this.currentInput + value;
    }
}
customElements.define("mfd-frequencyselect", MFDFrequencySelect);