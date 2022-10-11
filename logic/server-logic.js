
const USER_RECONNECT_DELAY_MSEC = 30000;

class Player {
    constructor(sessionID, name) {
        this.sessionID = sessionID;
        this.name = name;
        this.socket = null;

        this.isAlive = true;
        this.needRemove = false;
    }

    linkSocket(socket) {
        this.socket = socket;
        this.isAlive = true;
        // this.socket.emit("Name", {userName : this.name});
    }


    setAlived(isAlive) {
        this.isAlive = isAlive;
    }

    loadMessage(message){
        console.log("loadMessage");
        console.log("socket - ",this.socket);
        if (this.socket) {
            console.log("socket.emit");
            this.socket.emit("loadMessage", {userName: this.name, newMessage: message});
        }
    }

    waitReconnect(session) {
        if (this.needRemove) {
            return;
        }
        this.setAlived(false);
        setTimeout(() => {
            if (!this.isAlive) {
                session.destroy();
                this.socket = null;
                this.needRemove = true;
            }
        }, USER_RECONNECT_DELAY_MSEC);
    }

}




class LogicServer {
    constructor() {
        this.players = new Map(); //(sessionID, name, socket);

    }

    addPlayer(sessionID, name) {
        this.players.set(sessionID, new Player(sessionID, name));
    }

    disconnect(sessionID){
        this.players.delete(sessionID);
    }

    linkSocketToPlayer(sessionID, socket) {
        console.log("get socket");
       if (this.players.has(sessionID)){
           this.players.get(sessionID).linkSocket(socket);
       }

        //result.socket = socket;
    } 

    hasplayer(sessionID) {
            return this.players.has(sessionID);
    }

    getName(sessionID) {
        if (this.players.has(sessionID)){
            return this.players.get(sessionID).name;
        }
    }

    getMessage(sessionID, message){
        console.log("get message");
        if (this.players.has(sessionID)){
            this.players.get(sessionID).loadMessage(message);
        }
    }

}


module.exports = LogicServer;