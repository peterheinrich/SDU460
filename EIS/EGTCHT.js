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

class EGTCHT extends HTMLElement {

    constructor() {
        super();

        fetch("./EIS/EGTCHT.svg").then(t => t.text()).then(r => {
            this.innerHTML = r;
        });

        this.cht = 0;
        this.egt = 0;

        new MessageBus().subscribe("cht-degf", this.updateCHT.bind(this));
        new MessageBus().subscribe("egt-degf", this.updateEGT.bind(this));

    }

    updateCHT(type, message) {
        if (type === "cht-degf") {
            this.cht = message;
        }
        this.renderUI();
    }

    updateEGT(type, message) {
        if (type === "egt-degf") {
            this.egt = message;
        }
        this.renderUI();
    }

    renderUI() {

     

        let egt = this.getElementsByTagName("svg")[0].getElementById('egtvalue');
        egt.innerHTML = Math.round(this.egt);
        
        let egtval = 0;
        if(this.egt < 1000) {
            egtval = 1000;
        }
        else {
            egtval = this.egt;
        }
        let tpixel = 95 - ((egtval * 1.00 - 1000) / 500) * 80;
        let c1_egt = this.getElementsByTagName("svg")[0].getElementById('C1_EGT');
        c1_egt.setAttribute("y2", tpixel);
        tpixel = 95 - ((egtval * 1.01 - 1000) / 500) * 80;
        let c2_egt = this.getElementsByTagName("svg")[0].getElementById('C2_EGT');
        c2_egt.setAttribute("y2", tpixel);
        tpixel = 95 - ((egtval * 0.99 - 1000) / 500) * 80;
        let c3_egt = this.getElementsByTagName("svg")[0].getElementById('C3_EGT');
        c3_egt.setAttribute("y2", tpixel);
        tpixel = 95 - ((egtval * 1.00 - 1000) / 500) * 80;
        let c4_egt = this.getElementsByTagName("svg")[0].getElementById('C4_EGT');
        c4_egt.setAttribute("y2", tpixel);

        let cht = this.getElementsByTagName("svg")[0].getElementById('chtvalue');
        cht.innerHTML = Math.round(this.cht);


        let chtval = 0;
        if(this.cht < 240) {
            chtval = 240;
        }
        else {
            chtval = this.cht;
        }

        tpixel = 60 - ((chtval * 1.00 - 240) / 160) * 28;
        let c1_cht = this.getElementsByTagName("svg")[0].getElementById('C1_CHT');
        c1_cht.setAttribute("y", tpixel);

        tpixel = 60 - ((chtval * 1.02 - 240) / 160) * 28;
        let c2_cht = this.getElementsByTagName("svg")[0].getElementById('C2_CHT');
        c2_cht.setAttribute("y", tpixel);

        tpixel = 60 - ((chtval * 1.03 - 240) / 160) * 28;
        let c3_cht = this.getElementsByTagName("svg")[0].getElementById('C3_CHT');
        c3_cht.setAttribute("y", tpixel);

        tpixel = 60 - ((chtval * 0.95 - 240) / 160) * 28;
        let c4_cht = this.getElementsByTagName("svg")[0].getElementById('C4_CHT');
        c4_cht.setAttribute("y", tpixel);
    }
}

customElements.define("eis-egtcht", EGTCHT);