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
import { OSModule } from '../../tools/OSModule.js';
import { MessageBus } from '../../tools/MessageBus.js';

class MAP extends OSModule {
    constructor() {
        super("./MFD/Map.html");
        this.map = null;

        this.lat = 0;
        this.lon = 0;
        this.track = 0;

        new MessageBus().subscribe("indicated-latitude-deg", this.update.bind(this));
        new MessageBus().subscribe("indicated-longitude-deg", this.update.bind(this));
        new MessageBus().subscribe("indicated-track-true-deg", this.update.bind(this));


    }


    update(type, message) {
        if (type === "indicated-latitude-deg") {
            this.lat = message;
            this.renderUI();
        }
        else if (type === "indicated-longitude-deg") {
            this.lon = message;
            this.renderUI();
        }
        else if(type === "indicated-track-true-deg") {
            this.track = message;
            this.updateMapOrientation();
        }
    }


    renderUI() {
        if(this.lat == 0 || this.lon == 0) return;
        if (this.map == null) {
            this.map = L.map(this.UUID + "map", { rotate: true, zoomControl: false, rotateControl: false, attributionControl: true }).setView([this.lat, this.lon], 11);
            this.map.attributionControl.addAttribution("OpenFlightMaps");
            L.tileLayer('./openflightmaps/clip/merged/512/latest/{z}/{x}/{y}.png', {
                maxZoom: 11,
            }).addTo(this.map);
        }
        this.map.setView([this.lat, this.lon], 11)
    }

    updateMapOrientation() {
        this.map.setBearing(-1 * this.track);
        let northpointer = this.getLocalElementByID("northpointer");
        northpointer.setAttribute("transform", "rotate(" + (-1)*this.track + ",0,-10)");
    }
}

customElements.define("mfd-map", MAP);

