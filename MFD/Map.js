import { MessageBus } from '../../tools/MessageBus.js';

class MAP extends HTMLElement {
    constructor() {
        super();
        this.map = null;

        fetch("./MFD/Map.html").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

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
        if (this.map == null) {
            this.map = L.map("map", { rotate: true, zoomControl: false, rotateControl: false, attributionControl: true }).setView([47.078733, 9.064843], 11);
            this.map.attributionControl.addAttribution("OpenFlightMaps");
            L.tileLayer('./openflightmaps/clip/merged/512/latest/{z}/{x}/{y}.png', {
                maxZoom: 11,
            }).addTo(this.map);
        }
        this.map.setView([this.lat, this.lon], 11)

    }

    updateMapOrientation() {
        this.map.setBearing(-1 * this.track);
        let northpointer = this.getElementsByClassName("northpointer")[0];
        northpointer.setAttribute("transform", "rotate(" + (-1)*this.track + ",0,-10)");
    }
}

customElements.define("mfd-map", MAP);

