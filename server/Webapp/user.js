function login(email, password){
    return new Promise((resolve, reject)=>{
       setTimeout(()=>{
           resolve({id: email});
       }, 500);
    });
}

function registerToken(id, token) {

}

function getLoggedUser(id, token){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({id:'test@test.fr'});
        }, 500);
    });
}

export default {
    login: (email, password)=>{return login(email, password)},
    registerToken: (id, token)=>{registerToken(id, token)},
    getLoggedUser: (id, token)=>{return getLoggedUser(id, token)}
}
