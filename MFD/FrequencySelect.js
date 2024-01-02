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
   //     new MessageBus().subscribe("id-code", this.updateIdCode.bind(this));
   //     new MessageBus().subscribe("ident", this.updateIdent.bind(this));
   //     new MessageBus().subscribe("knob-mode", this.updateKnobMode.bind(this));
    }

    

    updateUI() {
      if (!this.initCompleted) return;
    /*    let btn_stby = this.querySelector("#btn_stby");
        let btn_on = this.querySelector("#btn_on");
        let btn_alt = this.querySelector("#btn_alt");
*/
let inputText = this.getLocalElementByID("xpdr_id_input");

        inputText.innerHTML = this.currentInput;
/*
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
*/
        /*  console.log(btn_stby.getAttribute("on"));
          console.log(btn_on.getAttribute("on"));
          console.log(btn_alt.getAttribute("on"));*/

    }

    hasLoaded() {
        //  FlightSimInterface.readProperty("")
        this.initCompleted = true;
        this.updateUI();
    }

    buttonPressed(event) {
        let id = event.target.getAttribute('id');
        switch (id) {
            case "btn_0":
            case "btn_1":
            case "btn_2":
            case "btn_3":
            case "btn_4":
            case "btn_5":
            case "btn_6":
            case "btn_7":
            case "btn_8":
            case "btn_9":
                if (this.currentInput.length == 3) {
                    this.currentInput += ".";
                }
                else if (this.currentInput.length == 7) {
                    this.currentInput = "";
                }
                this.numberButtonInput(id.split("_")[1]);
                break;
            case "btn_vfr":
                this.currentInput = "7000";
                break;

            case "btn_delete":
                if (this.currentInput.length >= 1) {
                    this.currentInput = this.currentInput.slice(0, -1);
                }
                break;

            case "btn_stby":
            //    FlightSimInterface.getInstance().writeProperty("instrumentation/transponder/inputs/knob-mode", 1);
                break;

            case "btn_on":
            //    FlightSimInterface.getInstance().writeProperty("instrumentation/transponder/inputs/knob-mode", 4);
                break;
            case "btn_alt":
            //    FlightSimInterface.getInstance().writeProperty("instrumentation/transponder/inputs/knob-mode", 5);
                break;

            case "btn_back":
                this.throwParentEvent();

                break;

            case "btn_ident":
                /* FlightSimInterface.getInstance().writeProperty("instrumentation/transponder/ident", true).then(
                     () => {
                         console.log("TRUE");
                     }
                 );
 */
                break;

            case "btn_enter":
                //              FlightSimInterface.getInstance().writeProperty("instrumentation/transponder/id-code", this.currentInput);
                this.throwParentEvent();
                break;

            default:
                console.error("Unknown button pressed!");
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