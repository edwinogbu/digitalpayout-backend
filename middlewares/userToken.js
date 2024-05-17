const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].replace('Bearer ', '');
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Set HTTP-only cookie with the token and strict sameSite attribute
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });

        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }
};


// const jwt = require('jsonwebtoken');
// const { promisify } = require('util');

// module.exports = async (req, res, next) => {
//     try {
//         const token = req.headers['authorization'].replace('Bearer ', '');
//         const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//         req.user = decoded;

//         next();
//     } catch (error) {
//         res.status(401).json({ status: 'fail', message: 'Unauthorized' });
//     }
// };
