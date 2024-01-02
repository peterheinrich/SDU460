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
export class OSModule extends HTMLElement {
    constructor(innerPathURI, startTagString = "", endTagString = "") {
        super();
        let UUID = "OS"+Math.round(Math.random() * 10000000) + "_";
        this.UUID = UUID;
        fetch(innerPathURI).then(t => t.text()).then(r => {
            //Make all IDs unique on instantiation
            r = this.replaceAll(r,"id=\"","id=\"" + UUID);
            //Point all ID references to correct instantiations
            r = this.replaceAll(r,"url(#","url(#" + UUID);
            r = this.replaceAll(r,"href=\"#","href=\"#" + UUID)
            this.innerHTML = startTagString + r + endTagString;
        });
    }

    connectedCallback() {
        if(!this.innerHTML) {
            setTimeout(() => {
                this.connectedCallback();
            },"100");
        }
        else {
            this.hasLoaded();
        }
    }

    hasLoaded() {

    }

    stripLocalID(idname) {
        if(idname.split("_").size <2) return;
        return idname.split("_")[1];
    }

    getLocalElementByID(idname) {
        return this.querySelector("#" + this.UUID + idname);
    }

    getLocalSVGDefName(defID) {
        return "url(#" + this.UUID + defID + ")";
    }

    // Adapted from https://stackoverflow.com/questions/1144783/how-do-i-replace-all-occurrences-of-a-string-in-javascript
    replaceAll(input, find, replace) {
        find = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return input.replace(new RegExp((find), 'g'), replace);
    }
}
