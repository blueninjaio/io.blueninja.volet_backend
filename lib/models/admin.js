const bcrypt = require('bcryptjs');
const { Schema, model } = require('mongoose');

const schema = new Schema({
    password: String,
    email: String,
    date_created: {
        type: Date,
        default: Date.now
    }
});

schema.pre('save', function (next) {
    let admin = this;
    if (admin.isModified('password')) {
        admin.password = bcrypt.hashSync(admin.password, 8);
    }
    next();
});
schema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = model('Admin', schema);