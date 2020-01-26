import jwt from 'jsonwebtoken';

const _SECRET_ = 'V#7Fo~UA*MSEo{O:iwu1A,1)!*p{%3KO';

function generateAuthToken(user){
    return jwt.sign(user, _SECRET_);
}

function verify(token) {
    return jwt.verify(token, _SECRET_);
}

export default {
    generateAuthToken: (user)=>{return generateAuthToken(user)},
    verify: (token)=>{return verify(token)}
}
