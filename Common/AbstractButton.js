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

export class AbstractButton extends OSModule {

    constructor(innerPathURI, backgroundElementName, styleNameReleasedURI, styleNamePressedURI) {
        super(innerPathURI, '<button style="border: none; background: none; outline: none">', '</button>');
        this.addEventListener('click', this.click);
        this.addEventListener('mousedown', this.mousepressed);
        this.addEventListener('touchstart', this.touchstart);
        this.backgroundElementName = backgroundElementName;
        this.styleNameReleasedURI = styleNameReleasedURI;
        this.styleNamePressedURI = styleNamePressedURI;
    }

    mousepressed(event) {
        let c = this.getLocalElementByID(this.backgroundElementName);
        c.setAttribute("fill", this.getLocalSVGDefName(this.styleNamePressedURI));
        document.addEventListener(
            "mouseup",
            (e) => this.mousereleased(c, this.styleNameReleasedURI),
            { once: true }
        );
    }

    mousereleased(element, style) {
        element.setAttribute("fill", this.getLocalSVGDefName(style));
    }

    touchstart(event) {
        let c = this.getLocalElementByID(this.backgroundElementName);
        c.setAttribute("fill", this.getLocalSVGDefName(this.styleNamePressedURI));
        document.addEventListener(
            "touchend",
            (e) => this.mousereleased(c, this.styleNameReleasedURI),
            { once: true }
        );
    }
    touchend(element) {
        element.setAttribute("fill", this.getLocalSVGDefName(style));
    }

    click(event) {
        console.log("clicked");
        event.stopPropagation();
        event.cancleBubble = true;
        this.dispatchEvent(
            new CustomEvent('button', {
                bubbles: true,
            })
        );
    }
}
