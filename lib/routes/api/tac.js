const mcache = require("memory-cache");
const fetch = require('node-fetch');
const { isms, transaction_authorization_code } = require("../../config");
const { createTacToken, Type } = require('../tac');
const User = require('../../models/user');

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

const send = async (req, res, type, contact, email) => {
    let tacCode = mcache.get(contact);
    if (tacCode) {
        return res.bad_request("TAC code already sent.");
    }
    let code = "123456";//generateTac(tac.length);
    mcache.put(contact, { type, code, email }, transaction_authorization_code.expiry * 1000);
    let result = false;//await sendSMS(contact, `${code} is your Volet TAC code.`);
    if (result) {
        return res.bad_request(result);
    }
    return res.ok('TAC request successfully sent.');
};

const check = async (res, contact, tac_code) => {
    try {
        let { type, code, email } = mcache.get(contact);
        if (!code) {
            return res.bad_request("TAC code has expired.");
        }
        if (code !== tac_code) {
            return res.bad_request("Invalid TAC code provided.");
        }
        let token = createTacToken(type, contact, tac_code);
        return res.ok('TAC request verified.', { email, token });
    } catch (e) {
        return res.bad_request(e.message);
    }
};

module.exports = {
    sendNewTAC: async (req, res) => {
        let { contact } = req.body;
        if (!contact) {
            return res.bad_request("No mobile number provided.");
        }
        let user = await User.findOne({ contact });
        if (user) {
            return res.bad_request("User already exists.");
        }
        return await send(req, res, Type.NEW_CONTACT, contact);
    },
    sendExistingTAC: async (req, res) => {
        let { contact } = req.body;
        if (!contact) {
            return res.bad_request("No mobile number provided.");
        }
        let user = await User.findOne({ contact });
        if (!user) {
            return res.bad_request("No user registered with that mobile number.");
        }
        return await send(req, res, Type.EXISTING_CONTACT, contact, user.email);
    },
    sendUserTAC: async (req, res) => {
        return await send(req, res, Type.USER_CONTACT, req.user.contact);
    },
    checkTAC: async (req, res) => {
        let { contact, tac_code } = req.body;
        return check(res, contact, tac_code);
    },
    checkUserTAC: async (req, res) => {
        let { tac_code } = req.body;
        return check(res, req.user.contact, tac_code);
    }
};