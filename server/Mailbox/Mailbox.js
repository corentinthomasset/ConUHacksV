import Debug from 'debug';

class Mailbox{
    constructor(publicKey, socket) {
        this._publicKey = publicKey;
        this._socket = socket;
        this._dbg = Debug(`mailbox:${publicKey}`);

        this._dbg('Connected');

        this._socket.on('disconnect', ()=>{
            this._dbg('Disconnected');
            delete mailboxes[this._publicKey];
        });

        setTimeout(()=>{
            this.open();
            this.getToken('test').then(OTT=>{
                console.log(OTT);
            });
        }, 5000);
    }

    open(){
        this._socket.emit('open');
        this._dbg(`Opening box`);
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

function newBox(publicKey, socket){
    mailboxes[publicKey] = new Mailbox(publicKey, socket);
}

function getBox(publicKey){
    return mailboxes[publicKey];
}

export default {
    newBox: (publicKey, socket)=>{newBox(publicKey, socket)},
    getBox: (publicKey)=>{return getBox(publicKey)}
}
