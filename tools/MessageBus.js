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