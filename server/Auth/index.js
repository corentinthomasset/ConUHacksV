#!/usr/bin/env node
import Debug from 'debug';
import User from './User';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const dbg = Debug('authentication');

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get('/user', (req, res) => {
    let user;

    if(req.query.email && req.query.password){
        user = User.logIn(req.query.email, req.query.password);
    } else if(req.query.email && req.query.token) {
        user = User.tokenLogIn(req.query.email, req.query.token);
    }

    if(user){
        dbg(`${user.email} logged-in successfully`);
        res.send(user);
    } else {
        dbg(`Login failed! Check authentication credentials`);
        res.status(401).send({error: 'Login failed! Check authentication credentials'});
    }
});

app.post('/user', (req, res) => {
    User.registerToken(req.body.id, req.body.token);
    res.send('Ok');
});

http.listen(80, ()=>{
    dbg(`Listening on *:80`);
});
