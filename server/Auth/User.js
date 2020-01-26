class User{
    constructor(email, password, firstName, lastName) {
        this._email = email;
        // Password in clear, this is bad. In a real world app, this would be hashed with a salt.
        this._password = password;
        this._firstName = firstName;
        this._lastName = lastName;
        this._boxes = {};
    }

    get email(){
        return this._email;
    }

    get password(){
        return this._password;
    }

    get firstName(){
        return this._firstName;
    }

    get lastName(){
        return this._lastName;
    }

    get boxes(){
        return this._boxes;
    }

    registerBox(boxId, address){
        this._boxes[boxId] = address;
    }
}

class PostMan extends User{
    constructor(email, passwordHash, salt, firstName, lastName, company) {
        super(email, passwordHash, salt, firstName, lastName);
        this._company = company;
        this._deliveryService = true;
    }

    get company(){
        return this._company;
    }

    get deliveryService(){
        return this._deliveryService;
    }
}

let users = {};
let usersToken = {};

function newUser(email, password, firstName, lastName){
    users[email] = new User(email, password, firstName, lastName);
}

function registerMailbox(email, boxId, address){
    users[email].registerBox(boxId, address);
}

function newPostMan(email, password, firstName, lastName, company){
    users[email] = new PostMan(email, password, firstName, lastName, company);
}

function logIn(email, password){
    if(users[email] && users[email].password === password){
        let user = users[email];
        return {email: user.email, firstName: user.firstName, lastName: user.lastName, boxes: user.boxes, company: user.company, deliveryService: user.deliveryService}
    }
}

function registerToken(email, token){
    if(users[email]){
        usersToken[email] = token;
    }
}

function tokenLogIn(email, token){
    if(usersToken[email] === token){
        let user = users[email];
        return {email: user.email, firstName: user.firstName, lastName: user.lastName, boxes: user.boxes, company: user.company, deliveryService: user.deliveryService}
    }
}

//Demo users
newUser('xxxxx', 'XXXXX', 'xxxxx', 'xxxxxx');
newPostMan('xxxxx', 'XXXXX', 'xxxxxx', 'xxxxx', 'xxxxx');
registerMailbox('xxxxxx', '61ajWQE5hMpZvzA/r6+LR6LI5ykEMQ06ixwz+IrCue8=', '1450 Rue Guy, Montréal, QC H3H 0A1');

export default {
    logIn: (email, password)=>{return logIn(email, password)},
    tokenLogIn: (email, token)=>{return tokenLogIn(email, token)},
    registerToken: (email, token)=>{registerToken(email, token)}
}


