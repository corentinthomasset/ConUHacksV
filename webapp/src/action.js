import Box from "./store/Models/Box";
import Socket from "./socket";
import User from "./store/Models/User";

function unlock(boxId){
    Box.update({data:{
        id: boxId,
        open: true
    }});
    Socket.emit('unlock', boxId);
}

function lock(boxId){
    let user = User.query().all()[0];
    if(user.deliveryService){
        Box.update({data:{
                id: boxId,
                open: false,
                flag: true
            }});
    } else {
        Box.update({data:{
                id: boxId,
                open: false,
                lastChecked: new Date().getTime(),
                flag: false
            }});
    }
    Socket.emit('lock', boxId);
}

export default {
    lock: (boxId)=>{lock(boxId)},
    unlock: (boxId)=>{unlock(boxId)}
}
