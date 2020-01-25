// app.js
// https://ourcodeworld.com/articles/read/286/how-to-execute-a-python-script-and-retrieve-output-data-and-errors-in-node-js

import {PythonShell} from 'python-shell';
import io from 'socket.io-client';
import debug from 'debug';
try {
    import keys from './2keys.js';
} catch (e) {
    console.error("Need to generate key pair!")
    console.error("node keygen.js")
    process.exit()
}

const socket = io('http://18.188.99.138/mailbox');
const dbg = debug('embedded');

dbg("----");

socket.on('connect', () => {
    dbg("Connection with C&C Server established.");
    socket.emit('box_id', keys.publicKey, keys.secretKey)
    dbg(keys.publicKey);
    dbg("Identification sent.");
});

socket.on('open', () => {
    dbg('Open Sesame!');

    let options = {
        pythonOptions: ['-u'], // get print results in real-time
        args: ['test']
    };

    var ps = new PythonShell('test.py', options);
    ps.on('message', function (message) {
        dbg("Output from script:", message);
    });

    ps.end(function (err) {
        if (err){
            throw err;
        };
    });
});
