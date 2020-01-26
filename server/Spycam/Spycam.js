import Debug from 'debug';
import fs from 'fs';
let spycams = {};

class Spycam{
    constructor(publicKey) {
        this._publicKey = publicKey;
        this._dbg = Debug(`spycam:${publicKey}`);
        this._queue = [];
        spycams[publicKey] = [];
        
    }

    saveDest(){
        const filesafe = this._publicKey.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const dir = 'users/'+filesafe+'/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return dir;
    }

    add(url) {
        this._dbg('Adding', url);
		this._queue.push(url);
    }

    urls(){
        let res = this._queue;
        this._queue = [];
        return res;
    }
}

function getSpycam(publicKey){
    if (publicKey in spycams) {
        return spycams[publicKey];
    } else {
        return spycams[publicKey] = new Spycam(publicKey);
    }
}

function getSpygif(publicKey){
    if (publicKey in spycams) {
        return spycams[publicKey].urls();
    } else { 
        return undefined;
    }     
}

export default {
    getSpycam: (publicKey)=>{return getSpycam(publicKey)},
    getSpygif: (publicKey)=>{return getSpygif(publicKey)}
}
