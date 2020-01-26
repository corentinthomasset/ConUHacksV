// app.js
// https://ourcodeworld.com/articles/read/286/how-to-execute-a-python-script-and-retrieve-output-data-and-errors-in-node-js

import {PythonShell} from 'python-shell';
import io from 'socket.io-client';
import debug from 'debug';
import crypto from 'asymmetric-crypto';
import fs from 'fs';
import keys from './2keys.js';
import {Buffer} from 'buffer';
import GifLib from 'node-gif';

const socket = io('http://18.188.99.138:8080/');
const dbg = debug('embedded');
let takePicsTask;
let picsTaken = 0;
let takePic = () => {
    let cameraOptions = {
        args: [picsTaken+1]
    };
    // Generate pic    
    dbg("Taking picture ", picsTaken+1, ".");
    var cameraShell = new PythonShell('../hw_control/camera.py', cameraOptions);
    cameraShell.end(function (err) {
        picsTaken = picsTaken + 1;
        if (err) {
            throw err;
        };
    });
};

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
    
    takePic();
    takePicsTask = setInterval(takePic, 8000);
    
    // Test Code
    dbg("Stopping in 20 seconds");
    let stop = setTimeout(() => {
        clearInterval(takePicsTask);
        dbg(picsTaken, "pictures taken.");
        var chunkDirs = fs.readdirSync('.').sort().filter(
            function (f) {
                return /^image_/.test(f)
            }
        );
        
        dbg("Generating GIF...");
        var animatedGif = new GifLib.AnimatedGif(1280,720);
        
        chunkDirs.forEach(function (file) {
            dbg(file);
            var rgb = fs.readFileSync(file); // returns buffer
            animatedGif.push(rgb, 0, 0, 1280, 720);
        });
        animatedGif.endPush();
        var gif = animatedGif.getGif();
        fs.writeFileSync('animated.gif', gif.toString('binary'), 'binary');
    }, 20000);
});

socket.on('getOTT', (msg) => {
    dbg('Generating One Time Token!');
    dbg('OTP Msg: ', msg);
    const sig = crypto.sign(msg, keys.secretKey);
    socket.emit('OTT', msg, sig);
});

socket.on('VALIDATE_DELIVERY', () => {
    clearInterval(takePicsTask)

    // Get all the pics
    // From count
    // Look at ../hw_control/image_[1:count].jpg

    // Generate GIF

    // POST GIF

    // Emit with GIF name (To associate close event with GIF )
});