const mcache = require("memory-cache");

const { tac } = require("../config");
const { createTacToken, Type } = require('../routes/tac');
const { sendSMS } = require('../middleware/isms');
const { User } = require('../models');
const { BadRequestError } = require("../errors");

const generateTac = (length) => {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return '123456';
};

const send = async (req, type, contact, email) => {
    let tacCode = mcache.get(contact);
    if (tacCode) {
        throw new BadRequestError("TAC code already sent.");
    }
    let code = generateTac(tac.length);
    mcache.put(contact, { type, code, email }, tac.expiry * 1000);
    try {
        //await sendSMS(contact, `${code} is your Volet TAC code.`);
    } catch (e) {
        throw new BadRequestError(e.message);
    }
};

const check = async (contact, tac_code) => {
    let object = mcache.get(contact);
    if (!object) {
        throw new BadRequestError("TAC code has expired.");
    }
    let { type, code, email } = object;
    if (code !== tac_code) {
        throw new BadRequestError("Invalid TAC code provided.");
    }
    try {
        let token = createTacToken(type, contact, tac_code);
        return { email, token };
    } catch (e) {
        throw new BadRequestError(e.message);
    }
};

module.exports = {
    sendNewTAC: async (req) => {
        let { contact } = req.body;
        if (!contact) {
            throw new BadRequestError("No mobile number provided.");
        }
        let user = await User.findOne({ contact });
        if (user) {
            throw new BadRequestError("User already exists.");
        }
        return await send(req, Type.NEW_CONTACT, contact);
    },
    sendExistingTAC: async (req) => {
        let { contact } = req.body;
        if (!contact) {
            throw new BadRequestError("No mobile number provided.");
        }
        let user = await User.findOne({ contact });
        if (!user) {
            throw new BadRequestError("No user registered with that mobile number.");
        }
        return await send(req, Type.EXISTING_CONTACT, contact, user.email);
    },
    sendUserTAC: async (req) => {
        return await send(req, Type.USER_CONTACT, req.user.contact);
    },
    checkTAC: async (req) => {
        let { contact, tac_code } = req.body;
        return check(contact, tac_code);
    },
    checkUserTAC: async (req) => {
        let { tac_code } = req.body;
        return check(req.user.contact, tac_code);
    }
};