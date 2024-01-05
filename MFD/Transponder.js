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
import { MessageBus } from '../../tools/MessageBus.js';
import { OSModule } from '../../tools/OSModule.js';
import { FlightSimInterface } from '../../SimInterface/FlightSimInterface.js';

class MFDTransponder extends OSModule {
    constructor() {
        super("./MFD/Transponder.html");
        this.addEventListener('button', this.buttonPressed);
        this.initCompleted = false;
        this.currentInput = "";
        this.transponderId = "0";
        this.ident = false;
        this.knobMode = 0;
        new MessageBus().subscribe("id-code", this.updateIdCode.bind(this));
        new MessageBus().subscribe("ident", this.updateIdent.bind(this));
        new MessageBus().subscribe("knob-mode", this.updateKnobMode.bind(this));
    }

    updateIdCode(type, message) {
        if (type === "id-code") {
            this.transponderId = message;
        }
        this.updateUI();
    }
    updateIdent(type, message) {
        if (type === "ident") {
            this.ident = message;
        }
        this.updateUI();
    }
    updateKnobMode(type, message) {
        if (type === "knob-mode") {
            this.knobMode = message;
        }
        this.updateUI();
    }


    updateUI() {
        if (!this.initCompleted) return;
        let btn_stby = this.getLocalElementByID("btn-stby");
        let btn_on = this.getLocalElementByID("btn-on");
        let btn_alt = this.getLocalElementByID("btn-alt");
        let inputText = this.getLocalElementByID("xpdr-id-input");


        inputText.innerHTML = this.currentInput;

        switch (this.knobMode) {
            case 0:
                btn_stby.setAttribute("on", "false");
                btn_on.setAttribute("on", "false");
                btn_alt.setAttribute("on", "false");
                break;
            case 1:
                btn_stby.setAttribute("on", "true");
                btn_on.setAttribute("on", "false");
                btn_alt.setAttribute("on", "false");
                break;
            case 4:
                btn_stby.setAttribute("on", "false");
                btn_on.setAttribute("on", "true");
                btn_alt.setAttribute("on", "false");
                break;
            case 5:
                btn_stby.setAttribute("on", "false");
                btn_on.setAttribute("on", "false");
                btn_alt.setAttribute("on", "true");
                break;
            default:
                btn_stby.setAttribute("on", "false");
                btn_on.setAttribute("on", "false");
                btn_alt.setAttribute("on", "false");
                break;
        }

    }

    hasLoaded() {
        //  FlightSimInterface.readProperty("")
        this.initCompleted = true;
        this.updateUI();
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
                if (this.currentInput.length == 4) {
                    this.currentInput = "";
                }

                this.numberButtonInput(id.split("-")[1]);
                break;
            case "btn-vfr":
                this.currentInput = "7000";
                break;

            case "btn-delete":
                if (this.currentInput.length >= 1) {
                    this.currentInput = this.currentInput.slice(0, -1);
                }
                break;

            case "btn-stby":
                FlightSimInterface.getInstance().writeProperty("instrumentation/transponder/inputs/knob-mode", 1);
                break;

            case "btn-on":
                FlightSimInterface.getInstance().writeProperty("instrumentation/transponder/inputs/knob-mode", 4);
                break;
            case "btn-alt":
                FlightSimInterface.getInstance().writeProperty("instrumentation/transponder/inputs/knob-mode", 5);
                break;

            case "btn-back":
                this.throwParentEvent();

                break;

            case "btn-ident":
                FlightSimInterface.getInstance().writeProperty("instrumentation/transponder/ident", true).then(
                    () => {
                        console.log("TRUE");
                    }
                );

                break;

            case "btn-enter":
                FlightSimInterface.getInstance().writeProperty("instrumentation/transponder/id-code", this.currentInput);
                this.throwParentEvent();
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
customElements.define("mfd-transponder", MFDTransponder);