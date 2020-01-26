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

//const MAIN_URL = 'http://172.30.191.200';
const MAIN_URL = 'http://18.188.99.138';

const socket = io(MAIN_URL+':8080/');

const dbg = debug('embedded');
const dbgOpen = debug('embedded:open');

let takePicsTask = null;
let cameraTaken = false;
let picsTaken = 0;

//let modec = new PythonShell('../hw_control/motion-2.py')
//modec.on('message', (msg) => {
//    if (msg == "Mo!") {
//	takePic();
//    }
//});

function leds(arg) {
    let options = {
        args: [arg]
    };
    var ps = new PythonShell('../hw_control/leds.py', options);
    ps.end(function (err) {
        if (err){
            throw err;
        };
    });
}

function door(arg) {
    let options = {
        args: [arg]
    };

    var ps = new PythonShell('../hw_control/servo.py', options);
    ps.end(function (err) {
        if (err){
            throw err;
        };
    });
}

function single_buzz() {
    var ps = new PythonShell('../hw_control/single_buzz.py');
    ps.end(function (err) {
        if (err){
            throw err;
        };
    });
}

function takePic() {
    if (cameraTaken) return;
    cameraTaken = true;
    let cameraOptions = {
        args: [picsTaken+1]
    };
    dbgOpen("Taking picture", picsTaken+1, " in 3... 2... 1... SNAP");
    var cameraShell = new PythonShell('../hw_control/camera.py', cameraOptions);
    cameraShell.end(function (err) {
        if (err) {
            throw err;
        };
        picsTaken = picsTaken + 1;
        cameraTaken = false
    });
};

dbg("----");

socket.on('connect', () => {
    dbg("Connection with C&C Server established.");
    socket.emit('box_id', keys.publicKey, "corentin@me.io");
    dbg("Pub Key Sent: ", keys.publicKey);
});

socket.on('unlock', () => {
    if (takePicsTask !== null || cameraTaken) {
        dbgOpen("Open event while already in Open sequence ??")
        return;
    }
    dbg('Open Sesame!');

    door(0);
    leds(1);
    single_buzz();

    // Clean images before starting a new process.
    picsTaken = 0;
    fs.readdirSync('.').filter(fn => fn.endsWith('.jpg')).forEach(i => fs.unlinkSync(i));
    
    takePic();
    takePicsTask = setInterval(takePic, 6000);
});

socket.on('getOTT', (msg) => {
    dbg('Generating One Time Token!');
    dbg('OTP Msg: ', msg);
    const sig = crypto.sign(msg, keys.secretKey);
    socket.emit('OTT', msg, sig);
});

socket.on('singleBuzz', () => {
    dbg('Single Buzz Requested!');
    single_buzz();
});

socket.on('lock', () => {
    dbgOpen("Validating Delivery");
    clearInterval(takePicsTask);
    takePicsTask = null;
    
    door(1);
    single_buzz();
    sleep.sleep(2); //Because lights stay on if too quick after door(1) + Because sometimes a picture cant be written to disk fast enough before the convert happens? MAYBE
    leds(0);

    dbgOpen(picsTaken, "pictures taken.");
    im.convert(['-delay', '90', '-loop', '500', '*.jpg', 'res.gif'], // delay = x/100 of a second apparently
            function(err, stdout){
                if (err) {dbg(err);process.exit();}
		dbgOpen("Gif Generated.");
    		sleep.sleep(2);
		dbgOpen("Sending gif...");
 		const formData = {
			spycam: fs.createReadStream('res.gif'),
		};
    		request.post({url:MAIN_URL+':9999/upload/'+encodeURIComponent(keys.publicKey), formData: formData}, (err, res, body) => {
    			if (err) {
        			dbgOpen("Error on upload", err);
		    	} else {
			    	dbgOpen('Gif uploaded');
				socket.emit("lock");
			}
    		});
	    }
    );
    
    // POST GIF
    // Emit with GIF name (To associate close event with GIF )
});

