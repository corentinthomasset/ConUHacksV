import Debug from 'debug';
import path from 'path';
import Token from './token';
import User from './user';

const dbg = Debug('webapp');

async function auth(req, res, next) {
    try {
        const token = req.query.token;
        const data = Token.verify(token);
        const user = await User.jwtLogin(data.user, token);
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        dbg('Unauthenticated user redirected to login form');
        res.status(401).sendFile(path.join(__dirname + '/static/login.html'));
    }
}

export default auth;
