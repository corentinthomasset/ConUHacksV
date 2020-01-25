#!/usr/bin/env node
import Debug from 'debug';
import Mailbox from "./Mailbox";

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const dbg = Debug('server');

app.get('/', (req, res)=>{
    res.send('Server running');
});

io.of('/mailbox').on('connection', (socket)=>{
    socket.on('box_id', (id)=>{
       Mailbox.newBox(id, socket);
    });
});

io.of('/ui').on('connection', (socket)=>{
    console.log('ui connected');
});

http.listen(80, ()=>{
    dbg(`Listening on *:80`);
});
