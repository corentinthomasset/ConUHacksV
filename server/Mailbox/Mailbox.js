import Debug from 'debug';

class Mailbox{
    constructor(publicKey, privateKey, socket) {
        this._publicKey = publicKey;
        this._privateKey = privateKey;
        this._socket = socket;
        this._dbg = Debug(`mailbox:${publicKey}`);

        this._dbg('Connected');

        this._socket.on('disconnect', ()=>{
            this._dbg('Disconnected');
            delete mailboxes[this._publicKey];
        });

        setTimeout(()=>{
            this.open();
        }, 5000);
    }

    open(){
        this._socket.emit('open');
        this._dbg(`Opening box`);
    }
}

let mailboxes = {};

function newBox(publicKey, privateKey, socket){
    mailboxes[publicKey] = new Mailbox(publicKey, privateKey, socket);
}

function getBox(publicKey){
    return mailboxes[publicKey];
}

export default {
    newBox: (publicKey, privateKey, socket)=>{newBox(publicKey, privateKey, socket)},
    getBox: (publicKey)=>{return getBox(publicKey)}
}
