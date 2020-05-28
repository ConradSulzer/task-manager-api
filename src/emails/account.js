const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sulzer.conrad@gmail.com',
        subject: 'Thanks for joinging in!',
        text: `Welcome to the app, ${name}! Let me know how you get along with the app. Thanks!`
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sulzer.conrad@gmail.com',
        subject: 'For realz?',
        text: `I hate to see you go, ${name}! Goodluck!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}