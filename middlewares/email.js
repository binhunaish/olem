if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
var nodeoutlook = require('nodejs-nodemailer-outlook')

module.exports = {
    sendEmail: (to, content, cb) => nodeoutlook.sendEmail({
        auth: {
            user: process.env.EMAIL_ADRESS,
            pass: process.env.EMAIL_PASSWORD
        },
        from: process.env.EMAIL_ADRESS,
        to,
        subject: 'سجل دخولك الأن الى منصة عُلِم',
        html: content,
        onError: (e) => cb(e, null),
        onSuccess: (i) => cb(null, i)
    }),
};