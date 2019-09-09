const bcrypt = require('bcryptjs');
const { Schema, model } = require('mongoose');

const schema = new Schema({
    contact: String,
    f_name: String,
    l_name: String,
    email: String,
    password: String,
    photo_url: String,
    address: String,
    push_token: String,
    credits: {
        type: Number,
        default: 0
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});
schema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        user.password = bcrypt.hashSync(user.password, 8);
    }
    next();
});
schema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = model('Merchant', schema);