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
import { AbstractButton } from '../../Common/AbstractButton.js';
class BackspaceButton extends AbstractButton {
    constructor() {
        super("./Common/BackspaceButton.svg", "background","grad_btn","grad_btn_pressed");
    }
}
customElements.define("common-backspacebutton", BackspaceButton);