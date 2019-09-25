const { User, Bank, BankAccount } = require('../../models');
const auth = require('../auth');
const { BadRequestError, UnauthorizedError } = require('../../errors');

module.exports = {
  getUsers: async () => {
    const users = await User.find({});
    return {
      users: users
    };
  },
  registerUser: async (req) => {
    const { facebook_id, google_id, f_name, l_name, email, password } = req.body;
    const contact = req.contact;
    const existingUser = await User.findOne({ $or: [{ email }, { contact }] });
    if (existingUser) {
      throw new BadRequestError(email === existingUser.email
        ? 'User already exists with that email.'
        : 'User already exists with that phone number.'
      );
    }
    const user = await User.create({
      contact,
      facebook_id,
      google_id,
      f_name,
      l_name,
      email,
      password
    });
    return {
      user
    };
  },
  loginUser: async (req) => {
    const { login_input, password, push_token } = req.body;
    const user = await User.findOne({ $or: [{ email: login_input }, { contact: login_input }] });
    if (!user || !user.verifyPassword(password)) {
      throw new UnauthorizedError('Invalid login credentials.');
    }
    if (push_token && push_token !== user.push_token) {
      user.push_token = push_token;
      await user.save();
    }
    const token = auth.createAuthToken(user);
    return {
      token,
      user
    };
  },
  forgetUserPassword: async (req) => {
    const contact = req.contact;
    const user = await User.findOne({ contact });
    if (!user) {
      throw new BadRequestError('User not found.');
    }
    user.password = 'abcd1234';
    await user.save();
    return {
      email: user.email
    };
  },
  resetUserPassword: async (req) => {
    const { old_password, new_password } = req.body;
    const user = req.user;
    if (!user.verifyPassword(old_password)) {
      throw new UnauthorizedError('User password does not match.');
    }
    user.password = new_password;
    await user.save();
  },
  getUserById: async (req) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id }).select('contact f_name l_name photo_url');
    if (!user) {
      throw new BadRequestError('User not found.');
    }
    return {
      user
    };
  },
  getUserInfo: async (req) => {
    const user = await User.findOne({ _id: req.user._id })
      .populate('notifications')
      .populate({
        path: 'notifications',
        populate: {
          path: 'payment',
          model: 'Payment'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'voucher',
          model: 'Voucher'
        }
      });
    return {
      user: user
    };
  },
  editSavingsPlan: async (req) => {
    const { active, amount } = req.body;
    const user = req.user;
    user.savings_active = active;
    user.monthly_savings = amount;
    await user.save();
  },
  getUsersByMobile: async (req) => {
    const { contacts } = req.body;
    const users = await User.find({ 'contact': { $in: contacts } }).select('contact f_name l_name photo_url');
    return {
      users
    };
  },
  editUserInfo: async (req) => {
    const { f_name, l_name, email, address } = req.body;
    const image = req.file;
    const user = req.user;
    user.f_name = f_name;
    user.l_name = l_name;
    user.email = email;
    user.address = address;
    user.photo_url = image.filename;
    user.save();
    return {
      user
    };
  },
  addBank: async (req) => {
    const { name, number, bank } = req.body;
    const bankModel = await Bank.findOne({ name: bank });
    if (!bankModel) {
      throw new BadRequestError('Bank not found.');
    }
    const bankAccount = await BankAccount.create({
      name,
      number,
      bankModel
    });
    req.user.bank_accounts.push(bankAccount._id);
    await req.user.save();
  },
  getUserAgents: async () => {
    const users = await User.find({ account_type: 'UserAgent', is_visible: true }).select('contact f_name l_name photo_url gps_coordinates');
    return {
      users: users
    };
  },
  applyAgent: async (req) => {
    const user = req.user;
    if (user.account_type === 'UserAgent') {
      throw new BadRequestError('You are already a user agent.');
    }
    if (user.agent.applied) {
      throw new BadRequestError('You already have a pending application.');
    }
    user.agent.applied = true;
    await user.save();
  },
  toggleAgent: async (req) => {
    const user = req.user;
    if (user.account_type === 'UserAgent') {
      throw new BadRequestError('You are already a user agent.');
    }
    user.agent.is_visible = !user.agent.is_visible;
    await user.save();
    return {
      visible: user.is_visible
    };
  },
  clearNotifications: async (req) => {
    const user = req.user;
    user.notifications = [];
    await user.save();
  },
  updateCoordinates: async (req) => {
    const { coordinates } = req.body;
    const user = req.user;
    user.gps_coordinates = coordinates;
    await user.save();
  },
};
