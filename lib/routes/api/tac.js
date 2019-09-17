const mcache = require("memory-cache");

const { tac } = require("../../config");
const { createTacToken, Type } = require('../tac');
const { sendSMS } = require('../../middleware/isms');
const { User } = require('../../models');

const generateTac = (length) => {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const send = async (req, res, type, contact, email) => {
    let tacCode = mcache.get(contact);
    if (tacCode) {
        return res.badRequest("TAC code already sent.");
    }
    let code = generateTac(tac.length);
    mcache.put(contact, { type, code, email }, tac.expiry * 1000);
    try {
        await sendSMS(contact, `${code} is your Volet TAC code.`);
        return res.ok('TAC request successfully sent.');
    } catch (e) {
        return res.badRequest(e.message);
    }
};

const check = async (res, contact, tac_code) => {
    try {
        let object = mcache.get(contact);
        if (!object) {
            return res.badRequest("TAC code has expired.");
        }
        let { type, code, email } = object;
        if (code !== tac_code) {
            return res.badRequest("Invalid TAC code provided.");
        }
        let token = createTacToken(type, contact, tac_code);
        return res.ok('TAC request verified.', { email, token });
    } catch (e) {
        return res.badRequest(e.message);
    }
};

module.exports = {
    sendNewTAC: async (req, res) => {
        let { contact } = req.body;
        if (!contact) {
            return res.badRequest("No mobile number provided.");
        }
        let user = await User.findOne({ contact });
        if (user) {
            return res.badRequest("User already exists.");
        }
        return await send(req, res, Type.NEW_CONTACT, contact);
    },
    sendExistingTAC: async (req, res) => {
        let { contact } = req.body;
        if (!contact) {
            return res.badRequest("No mobile number provided.");
        }
        let user = await User.findOne({ contact });
        if (!user) {
            return res.badRequest("No user registered with that mobile number.");
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