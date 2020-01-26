#!/usr/bin/env node
import Debug from 'debug';
import Auth from './auth';
import User from './user';
import Token from './token';
import axios from 'axios';
import settings from "./settings";
import path from 'path';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const dbg = Debug('webapp');

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.login(email, password);
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'});
        }
        const token = Token.generateAuthToken({user: email});
        User.registerToken(email, token);
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/', Auth, async(req, res) => {
    // View logged in user profile
    res.sendFile(path.join(__dirname + '/static/index.html'));
});
/*
app.all('*', (req, res) => {
    res.redirect("/");
});*/

app.use('/static', express.static('static'));

const io = require('socket.io')(http);
io.sockets.on('connection', Token.authorizeSocket()).on('authenticated', (socket)=> {
    let userEmail = socket.decoded_token.user;
    User.registerSocket(userEmail, socket);
    socket.on('lock', boxId=>{
        axios.post(`${settings.mailbox_service.api}/box`, {boxId: boxId, action: 'lock'}).catch(error=>{
            dbg(`Box ${boxId} unreachable`);
        });

        if(boxId === '61ajWQE5hMpZvzA/r6+LR6LI5ykEMQ06ixwz+IrCue8='){
           let s = User.getSocket('corentin@me.io');
           if(s !== socket){
               s.emit('lock', boxId);
           }
        }
    });

    socket.on('unlock', boxId=>{
        axios.post(`${settings.mailbox_service.api}/box`, {boxId: boxId, action: 'unlock'}).catch(error=>{
            dbg(`Box ${boxId} unreachable`);
        });
    });
});

http.listen(80, ()=>{
    dbg(`Listening on *:80`);
});
