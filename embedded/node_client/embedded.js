// app.js
// https://ourcodeworld.com/articles/read/286/how-to-execute-a-python-script-and-retrieve-output-data-and-errors-in-node-js

import {PythonShell} from 'python-shell';
import io from 'socket.io-client';
import debug from 'debug';
import crypto from 'asymmetric-crypto';
import fs from 'fs';
import keys from './2keys.js';
import GIFEncoder from 'gifencoder';
import { createCanvas } from 'canvas';
import im from 'imagemagick';

const socket = io('http://18.188.99.138:8080/');
const dbg = debug('embedded');
let takePicsTask;
let picsTaken = 0;
const takePic = () => {
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

const generateGif = (imagePathsArray) => {
    const encoder = new GIFEncoder(1280, 720);
    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext('2d');
    const img = new CanvasImage();
    img.onload = () => ctx.drawImage(img, 0, 0)
    img.onerror = err => { throw err }
    encoder.createReadStream().pipe(fs.createWriteStream('result.gif'))
    encoder.start();
    encoder.setRepeat(1);
    encoder.setDelay(750);
    encoder.setQuality(10);
    for (let path of imagePathsArray ) {
        try {
            img.src = path
            encoder.addFrame(ctx)
        } catch (err) {
            if (err) {
                console.log(err)
                return
            }
        }
    }
    encoder.finish();
}

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
    dbg("Stopping in 10 seconds");
    let stop = setTimeout(() => {
        clearInterval(takePicsTask);
        dbg(picsTaken, "pictures taken.");

	    dbg("Converting to PNGs.");
        var pics = fs.readdirSync('.').sort().filter(
            function (f) {
                return /.jpg$/.test(f)
            }
        );
        pics.forEach(p => {
            dbg("Converting", p);
            im.convert(
                [p, p+'.png'], 
                function(err, stdout){
                    if (err) {dbg(err);process.exit()}
                }
            );
        });
        
        dbg("Generating GIF...");
        var pngs = fs.readdirSync('.').sort().filter(
            function (f) {
                return /.png$/.test(f)
            }
        );
        generateGif(pngs)
    }, 10000);
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

