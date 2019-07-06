const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'crmburrett@gmail.com',
        subject: 'Welcome',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`

    })
    
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'crmburrett@gmail.com',
        subject: 'Our farewell to you',
        text: `Dear ${name}, 
        we are sorry to hear you are leaving. 
        Please tell us how we could have kept you as a client in response to this email.`

    })
    
}


 module.exports = {
     sendWelcomeEmail,
     sendCancelEmail,

 }