import Debug from 'debug';
import path from 'path';
import Token from './token';
import User from './user';

const dbg = Debug('webapp:authentication');

async function auth(req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = Token.verify(token);
        const user = await User.getLoggedUser(data.id, token);
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        dbg(`User logged-in ${user.id}`);
        next()
    } catch (error) {
        dbg('Unauthenticated user redirected to login form');
        res.status(401).sendFile(path.join(__dirname + '/static/login.html'));
    }
}

export default auth;
