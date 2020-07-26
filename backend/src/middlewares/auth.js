const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json');
const response = require('../util/response');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send(response(null, "Token não informado"));
    }

    const parts = authHeader.split(' ');

    if (!parts.length === 2) {
        return res.status(401).send(response(null, "Token errado"));
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send(response(null, "Token mal formado"));
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send(response(err, "Token inválido"));
        }

        req.userId = decoded.id;

        return next();
    })
}