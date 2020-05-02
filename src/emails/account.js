const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SEND_GRID_API_KEY)

// sgMail.send({
//     to: 'a7medgamalelwaziry@gmail.com',
//     from: 'ahmedgamal1452@gmail.com',
//     subject: 'First Email by Me',
//     text: 'Please respond on this.'
    
// })
const sendWelcomeEmail = (email , name )=>{
    sgMail.send({
        to: email,
        from: 'a7medgamalelwaziry@gmail.com',
        subject: 'Welcome to the Task App',
        text: 'Hey' + name + 'in Task App'
    })
}
const sendcancelationEmail = (email , name )=>{
    sgMail.send({
        to: email,
        from: 'a7medgamalelwaziry@gmail.com',
        subject: 'Delete your email from a Task App',
        text: 'Good Bye' + name  
    })
}
module.exports = {
    sendWelcomeEmail,
    sendcancelationEmail
}