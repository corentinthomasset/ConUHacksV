// app.js
// https://ourcodeworld.com/articles/read/286/how-to-execute-a-python-script-and-retrieve-output-data-and-errors-in-node-js
import sleep from 'sleep';
import {PythonShell} from 'python-shell';
import io from 'socket.io-client';
import debug from 'debug';
import crypto from 'asymmetric-crypto';
import fs from 'fs';
import keys from './2keys.js';
import im from 'imagemagick';
import request from 'request';

const socket = io('http://18.188.99.138:8080/');
const spycamIp = 'https://18.188.99.138:9999/';
const dbg = debug('embedded');
const dbgOpen = debug('embedded:open');

let takePicsTask;
let picsTaken = 0;

const takePic = () => {
    let cameraOptions = {
        args: [picsTaken+1]
    };
    dbgOpen("Taking picture", picsTaken+1, " in 3 seconds.");
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
    if (takePicsTask !== null) {
        dbgOpen("Open event while already in Open sequence ??")
        return;
    }
    dbg('Open Sesame!');

    let options = {
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

    let options = {
        args: ['1']
    };
    var ps2 = new PythonShell('../hw_control/leds.py', options);
    ps2.on('message', function (message) {
        dbg("Output from script: ", message);
    });
    ps2.end(function (err) {
        if (err){
            throw err;
        };
    });

    // Clean images before starting a new process.
    fs.readdirSync('.').filter(fn => fn.endsWith('.jpg')).forEach(i => fs.unlinkSync(i));
    
    takePic();
    takePicsTask = setInterval(takePic, 5000);
});

socket.on('getOTT', (msg) => {
    dbg('Generating One Time Token!');
    dbg('OTP Msg: ', msg);
    const sig = crypto.sign(msg, keys.secretKey);
    socket.emit('OTT', msg, sig);
});


socket.on('ON_SINGLE_BUZZ', () => {
    dbg('Single Buzz Requested!');
    socket.emit('OTT', msg, sig);

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

socket.on('VALIDATE_DELIVERY', () => {
    clearInterval(takePicsTask);
    takePicsTask = null;
    sleep.sleep(3); // Because sometimes a picture cant be written to disk fast enough before the convert happens? MAYBE
    dbgOpen(picsTaken, "pictures taken.");
    im.convert(['-delay', '80', '-loop', '0', '*.jpg', 'res.gif'], // delay = x/100 of a second apparently
            function(err, stdout){
                if (err) {dbg(err);process.exit();}
            }
    );
    dbgOpen("Gif Generated.");
    
    request.post({url:'http://172.30.191.200:9999/upload/'+encodeURIComponent(keys.publicKey), formData: formData}, (err, res, body) => {
    	if (err) {
        	dbgOpen("Error on upload", err);
    	} else {
	    	dbgOpen('Gif uploaded');
	}
    });




    // POST GIF

    // Emit with GIF name (To associate close event with GIF )
});

