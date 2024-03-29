const express = require('express');
const cors = require('cors');

const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

const accountSid = 'AC7cf807c27afa203f92341832db23bba6'; 
const authToken = 'Redacted'; 
const messagingServiceSid = 'MG5c11f9e0c95f52b268a9a2af06195fd7';
const twilioClient = require('twilio')(accountSid, authToken); 


app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.send('Your Server Is Running..!!!');
});

app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;

    if(type === 'message.new') {
        members
            .filter((member) => member.user_id !== sender.id)
            .forEach(({ user }) => {
                if(!user.online) {
                    twilioClient.messages.create({
                        body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    })
                        .then(() => console.log('Message sent!'))
                        .catch((err) => console.log(err));
                }
            })

            return res.status(200).send('Message sent!');
    }

    return res.status(200).send('Not a new message request');
});

app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));