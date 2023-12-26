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
export class MessageBus {
    constructor() {
        if(MessageBus._instance) {
            return MessageBus._instance;
        }
        MessageBus._instance = this;
        this.clients = [];
    }

    publish(type, message) {
        this.clients.forEach(element => {
            if(element.type === type) {
                element.callback(type, message);
            }
        });
    }

    subscribe(type, callback) {
        this.clients.push(new Message(type,callback));
    }
}

class Message {
    constructor(type, callback) {
        this.type = type;
        this.callback = callback;
    }
}