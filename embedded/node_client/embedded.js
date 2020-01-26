// app.js
// https://ourcodeworld.com/articles/read/286/how-to-execute-a-python-script-and-retrieve-output-data-and-errors-in-node-js

import {PythonShell} from 'python-shell';
import io from 'socket.io-client';
import debug from 'debug';
import crypto from 'asymmetric-crypto';
import keys from './2keys.js';

const socket = io('http://18.188.99.138:8080/');
const dbg = debug('embedded');

dbg("----");

socket.on('connect', () => {
    dbg("Connection with C&C Server established.");
    dbg("Pub Key: ", keys.publicKey);
    socket.emit('box_id', keys.publicKey)
    dbg("Identification sent.");
});

socket.on('open', () => {
    dbg('Open Sesame!');

    let options = {
        pythonOptions: ['-u'], // get print results in real-time
        args: ['0']
    };

    var ps = new PythonShell('../hw_control/servo.py', options);
    ps.on('message', function (message) {
        dbg("Output from script: ", message);
    });

    ps.end(function (err) {
        if (err){
            throw err;
        };
    });
});

socket.on('getOTT', (msg) => {
    dbg('Generating One Time Token!');
    dbg('OTP Msg: ', msg);
    const sig = crypto.sign(msg, keys.secretKey);
    socket.emit('OTT', msg, sig);
});
