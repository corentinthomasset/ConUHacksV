import User from "./store/Models/User";
import Box from "./store/Models/Box";

let userData = localStorage.user;
if (userData) {
    let user = JSON.parse(userData);

    if (user.boxes) {
        Object.keys(user.boxes).forEach(boxId => {
            Box.insert({
                data: {
                    id: boxId,
                    ownerEmail: user.email,
                    address: user.boxes[boxId]
                }
            });
        })
    }

    if (user.email && user.firstName && user.lastName) {
        User.insert({data: user});
    }

    Box.insertOrUpdate({
        data: {
            id: '61ajWQE5hMpZvzA/r6+LR6LI5ykEMQ06ixwz+IrCue8=',
            address: '1450 Rue Guy, Montréal, QC H3H 0A1'
        }
    });
}
