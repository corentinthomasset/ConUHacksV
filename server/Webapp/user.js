import http from 'axios';
import settings from './settings'

let usersSocket = {};

function login(email, password){
    return new Promise((resolve, reject)=>{
        http.get(`${settings.auth_service.api}/user?email=${email}&password=${password}`)
            .then(function (response) {
                // handle success
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error.response.data.error);
            });
    });
}

function registerToken(id, token) {
    // Bad because we don't check that the request succeeded
    http.post(`${settings.auth_service.api}/user`, {id: id, token: token});
}

function jwtLogin(id, token){
    return new Promise((resolve, reject)=>{
        http.get(`${settings.auth_service.api}/user?email=${id}&token=${token}`)
            .then(function (response) {
                // handle success
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error.response.data.error);
            });
    });
}

function registerSocket(email, socket){
    usersSocket[email] = socket;
}


export default {
    login: (email, password)=>{return login(email, password)},
    registerToken: (id, token)=>{registerToken(id, token)},
    jwtLogin: (id, token)=>{return jwtLogin(id, token)},
    registerSocket: (email, socket)=>{registerSocket(email, socket)}
}
