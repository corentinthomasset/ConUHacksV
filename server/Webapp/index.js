#!/usr/bin/env node
import Debug from 'debug';
import Auth from './auth';
import User from './user';
import Token from './token';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const dbg = Debug('webapp');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

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
    res.send('Logged in')
});

io.on('connection', (socket)=>{

});

http.listen(80, ()=>{
    dbg(`Listening on *:80`);
});
