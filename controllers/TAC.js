const mcache = require("memory-cache");
const fetch = require('node-fetch');
const { isms, tac } = require("../config/config");
const auth = require('../middlewares/auth');
const User = require('../models/User');

const TAC_TYPE = {
    REGISTER: 0,
    FORGET_PASSWORD: 1,
    RESET_PASSWORD: 2
};
const sendSMS = async (number, message) => {
    let result = await fetch(`http://www.isms.com.my/isms_send.php?un=${isms.username}&pwd=${isms.password}&dstno=${number}&msg=${message}&type=${isms.type}&sendid=${isms.sender_id}&agreedterm=YES`, {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Accept-Encoding': 'identity'
            }
        }
    );
    result = await result.text();
    let index = result.indexOf('=');
    let code = parseInt(result.substr(0, index).trim());
    let msg = result.substr(index + 1).trim();
    if (code !== 2000) {
        return msg;
    }
    return false;
};

const generateTac = (length) => {
    let result           = '';
    let characters       = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

module.exports = {
    send: async (req, res) => {
        let { type, contact } = req.body;
        type = parseInt(type);
        let email;
        if (type === TAC_TYPE.RESET_PASSWORD) {
            let auth_result = await auth.authenticate(req, res, ['user']);
            if (auth_result) {
                return res.bad_request(auth_result);
            }
            contact = req.user.contact;
        } else {
            if (!contact) {
                return res.bad_request("No mobile number provided.");
            }
            let user = await User.findOne({ contact });
            if (type === TAC_TYPE.REGISTER) {
                if (user) {
                    return res.bad_request("User already exists.");
                }
            } else if (type === TAC_TYPE.FORGET_PASSWORD) {
                if (!user) {
                    return res.bad_request("No user registered with that mobile number.");
                }
                email = user.email;
            }
        }
        let tacCode = mcache.get(contact);
        if (tacCode) {
            return res.bad_request("TAC code already sent.");
        }
        let code = "123456";//generateTac(tac.length);
        await mcache.put(contact, code, tac.cache_time);
        let result = false;//await sendSMS(contact, `${code} is your Volet TAC code.`);
        if (result) {
            return res.bad_request(result);
        }
        let token = auth.createToken({ type, contact, email }, 90);
        return res.ok('TAC request successfully sent.', {
            token
        });
    },
    check: async (req, res) => {
        let { token, tac_code } = req.body;
        try {
            let { type, contact, email } = auth.decodeToken(token);
            let cached_tac = mcache.get(contact);
            if (!cached_tac) {
                return res.bad_request("TAC code has expired.");
            }
            if (cached_tac !== tac_code) {
                return res.bad_request("Invalid TAC code provided.");
            }
            token = auth.createToken({ type, contact, tac_code }, 600);
            return res.ok('TAC request verified.', { email, token });
        } catch (e) {
            return res.bad_request(e.message);
        }
    }
};