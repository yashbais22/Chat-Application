const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat; 
const crypto = require('crypto');



const api_key = "83eyttfyjesc"
const api_secret = "sewuf6hw62yeg2sexxaarh7nq37r2jx2drcpkqg7sp9fmghhrtm7uccb7f98fr5c"
const app_id = "1214745"
 

const signup = async (req, res) => {
    try {
        console.log("api_key ", api_key );

        const { fullName, username, password, phoneNumber } = req.body;

        const userId = crypto.randomBytes(16).toString('hex');

        const serverClient = connect(api_key, api_secret, app_id);

        const hashedPassword = await bcrypt.hash(password, 10);

        const token = serverClient.createUserToken(userId);

        res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error });
    }
};
 
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const serverClient = connect(api_key, api_secret, app_id);
        
        const client = new StreamChat.getInstance(api_key, api_secret);

        const { users } = await client.queryUsers({ name: username });

        if(!users.length) return res.status(400).json({ message: 'User not found' });

        const success = await bcrypt.compare(password, users[0].hashedPassword);

        const token = serverClient.createUserToken(users[0].id);

        if(success) {
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id});
        } else {
            res.status(500).json({ message: 'Incorrect password' });
        }
    } catch (error) {ads
        console.log(error);
 
        res.status(500).json({ message: error });
    }
};

module.exports = { signup, login }