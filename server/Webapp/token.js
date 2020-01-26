import jwt from 'jsonwebtoken';
import socketIoJwt from 'socketio-jwt'

const _SECRET_ = 'V#7Fo~UA*MSEo{O:iwu1A,1)!*p{%3KO';

function generateAuthToken(user){
    return jwt.sign(user, _SECRET_);
}

function verify(token) {
    return jwt.verify(token, _SECRET_);
}

function authorizeSocket(){
    return socketIoJwt.authorize({
        secret: _SECRET_,
        timeout: 15000 // 15 seconds to send the authentication message
    });
}

export default {
    generateAuthToken: (user)=>{return generateAuthToken(user)},
    verify: (token)=>{return verify(token)},
    authorizeSocket: ()=>{return authorizeSocket()}
}
