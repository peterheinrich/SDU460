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

class ComButton extends OSModule {
    constructor() {
        super("./Header/ComButton.svg");
        this.selectedFrequency = "";
        this.addEventListener('click',this.click);
        new MessageBus().subscribe(this.getAttribute("property"), this.update.bind(this));

    }

    update(type, message) {
        if (type === this.getAttribute("property")) {
            this.selectedFrequency = message;
        }
        this.renderUI();
    }

    renderUI() {
        let c = this.getLocalElementByID("frequency");
        c.innerHTML = this.selectedFrequency;
        c.setAttribute("fill", this.getAttribute("textcolor"));
        c = this.getLocalElementByID("label");
        c.innerHTML = this.getAttribute("label");
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
customElements.define("sdu-combtn", ComButton);