#!/usr/bin/env node
import Debug from 'debug';
import Mailbox from "./Mailbox";

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const dbg = Debug('mailbox');

app.get('/', (req, res)=>{
    res.send('Server running');
});

io.on('connection', (socket)=>{
    socket.on('box_id', (publicKey, privateKey)=>{
       Mailbox.newBox(publicKey, privateKey, socket);
    });
});

http.listen(8080, ()=>{
    dbg(`Listening on *:8080`);
});
