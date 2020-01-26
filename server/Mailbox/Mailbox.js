import Debug from 'debug';

class Mailbox{
    constructor(publicKey, userId, socket) {
        this._publicKey = publicKey;
        this._socket = socket;
        this._dbg = Debug(`mailbox:${publicKey}`);
        this._userId = userId;

        this._dbg('Connected');

        this._socket.on('disconnect', ()=>{
            this._dbg('Disconnected');
            delete mailboxes[this._publicKey];
        });
    }

    unlock(){
        this._socket.emit('unlock');
        this._dbg(`Unlocking box`);
    }

    lock(){
        this._socket.emit('lock');
        this._dbg(`Locking box`);
    }

    singleBuzz(){
        this._socket.emit('singleBuzz');
        this._dbg(`Quick Buzzing`);
    }

    getToken(id){
        this._socket.emit('getOTT', id);
        return new Promise((resolve, reject)=>{
            let timeout = setTimeout(()=>{
                this._dbg(`Error while generating OTT: Request timed out`);
                this._socket.removeAllListeners('OTT');
                reject('Request timed out');
            }, 10000);

            this._socket.on('OTT', (id, signature)=>{
                let OTT = `${id}:${signature}`;
                this._dbg(`OTT generated: ${OTT}`);
                this._socket.removeAllListeners('OTT');
                clearTimeout(timeout);
               resolve(OTT);
            });
        });
    }
}

let mailboxes = {};

function newBox(publicKey, userId, socket){
    mailboxes[publicKey] = new Mailbox(publicKey, userId, socket);
}

function getBox(publicKey){
    return mailboxes[publicKey];
}

export default {
    newBox: (publicKey, userId, socket)=>{newBox(publicKey, userId, socket)},
    getBox: (publicKey)=>{return getBox(publicKey)}
}
