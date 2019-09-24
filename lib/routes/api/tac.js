const mcache = require('memory-cache');

const { tac } = require('../../config');
const { createTacToken, Type } = require('../tac');
const { sendSMS } = require('../../middleware/isms');
const { User } = require('../../models');

const generateTac = (length) => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const send = async (req, res, type, contact, email) => {
  const tacCode = mcache.get(contact);
  if (tacCode) {
    return res.badRequest('TAC code already sent.');
  }
  const code = generateTac(tac.length);
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
    const { type, code, email } = mcache.get(contact);
    if (!code) {
      return res.badRequest('TAC code has expired.');
    }
    if (code !== tac_code) {
      return res.badRequest('Invalid TAC code provided.');
    }
    const token = createTacToken(type, contact, tac_code);
    return res.ok('TAC request verified.', { email, token });
  } catch (e) {
    return res.badRequest(e.message);
  }
};

module.exports = {
  sendNewTAC: async (req, res) => {
    const { contact } = req.body;
    if (!contact) {
      return res.badRequest('No mobile number provided.');
    }
    const user = await User.findOne({ contact });
    if (user) {
      return res.badRequest('User already exists.');
    }
    return await send(req, res, Type.NEW_CONTACT, contact);
  },
  sendExistingTAC: async (req, res) => {
    const { contact } = req.body;
    if (!contact) {
      return res.badRequest('No mobile number provided.');
    }
    const user = await User.findOne({ contact });
    if (!user) {
      return res.badRequest('No user registered with that mobile number.');
    }
    return await send(req, res, Type.EXISTING_CONTACT, contact, user.email);
  },
  sendUserTAC: async (req, res) => {
    return await send(req, res, Type.USER_CONTACT, req.user.contact);
  },
  checkTAC: async (req, res) => {
    const { contact, tac_code } = req.body;
    return check(res, contact, tac_code);
  },
  checkUserTAC: async (req, res) => {
    const { tac_code } = req.body;
    return check(res, req.user.contact, tac_code);
  }
};