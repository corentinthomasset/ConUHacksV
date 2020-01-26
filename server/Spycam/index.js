#!/usr/bin/env node
import Debug from 'debug';
import Spycam from "./Spycam";
import multer from 'multer';


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let sc = Spycam.getSpycam(req.params.pk);
      cb(null, sc.saveDest());
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.gif');
    }
})

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const dbg = Debug('spycam');

app.post('/upload/:pk', multer({ storage: storage }).single('spycam'), (req, res)=>{
    let sc = Spycam.getSpycam(req.params.pk);
    sc.add(req.file.destination + req.file.filename);
    res.send(200);
});

app.get('/spycam/:pk', (req, res) =>{
    res.send(Spycam.getSpygif(req.params.pk));
});

app.use("/users/", express.static('users'));

http.listen(9999, ()=>{
    dbg(`Listening on *:9999`);
});
