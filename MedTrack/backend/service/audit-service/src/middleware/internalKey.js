module.exports = (req, res, next) => {
    const key = req.headers['x-internal-key'];
    const expected = '14a0e9f7c4d11fd15df8d5ed2761c6e4';

    if (key !== expected) {
        return res.status(403).send({ message: "Неправильный JWT ключ." });
    }
    next();
};