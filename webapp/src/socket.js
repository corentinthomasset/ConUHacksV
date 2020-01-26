import io from 'socket.io-client';
import Settings from './settings';
import Box from "./store/Models/Box";
import Alert from "./store/Models/Alert";
import axios from 'axios';

let socket = io.connect(`${Settings.api.url}`);
let token = localStorage.token;

socket.on('connect',()=>{
    socket
        .emit('authenticate', {token: token})
        .on('authenticated', ()=> {
            socket.on('lock', (boxId)=>{
                Box.update({data:{
                        id: boxId,
                        open: false,
                        flag: true
                }});

                setTimeout(()=>{
                    axios.get('http://18.188.99.138:9999/spycam/' + encodeURIComponent(boxId)).then((response) => {
                        let path = response.data[0];
                        let attachment = `http://18.188.99.138:9999/${path}`;
                        Alert.insert({data:{
                                boxId: boxId,
                                date: new Date().getTime(),
                                attachment: attachment
                            }});
                    });
                }, 15000);
            });
        })
        .on('unauthorized', (msg) => {
            console.log(msg);
            window.location.href = "http://18.188.99.138";
        });
});

export default {
    emit: (...args)=>{socket.emit(...args)}
}
