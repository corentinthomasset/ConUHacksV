class Mailbox{
    constructor(id, socket) {
        this._id = id;
        this._socket = socket;
    }
}

let mailboxes = {};

function newBox(id, socket){
    mailboxes[id] = new Mailbox(id, socket);
}

export default {
    newBox: (id, socket)=>{newBox(id, socket)}
}
