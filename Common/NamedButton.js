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
import { AbstractButton } from '../../Common/AbstractButton.js';

class NamedButton extends AbstractButton {
    constructor() {
        super("./Common/NamedButton.svg", "background","url(#grad_btn)","url(#grad_btn_pressed)");
    }
    hasLoaded() {
        let c = this.getElementsByTagName("svg")[0].getElementById("label");
        c.innerHTML = this.getAttribute("label");
    }
}
customElements.define("common-namedbutton", NamedButton);