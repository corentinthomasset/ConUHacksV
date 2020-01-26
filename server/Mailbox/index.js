#!/usr/bin/env node
import Debug from 'debug';
import Mailbox from "./Mailbox";

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const dbg = Debug('mailbox');

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.send('Mailbox service running');
});

app.post('/box', (req, res) => {
    let box = Mailbox.getBox(req.body.boxId);
    if(box){
        if(req.body.action === 'lock'){
            box.lock();
        } else {
            box.unlock();
        }
        res.send('Ok');
    } else {
        res.status(404).send('Not found');
    }
});

io.on('connection', (socket)=>{
    socket.on('box_id', (publicKey, userId)=>{
       Mailbox.newBox(publicKey, userId, socket);
    });
});

http.listen(8080, ()=>{
    dbg(`Listening on *:8080`);
});
