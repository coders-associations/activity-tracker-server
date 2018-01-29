const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = Schema({
    local: {
        email: {
            type: String,
            required: true,
            unique: true,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

userSchema.pre('save', function (next) {
    bcrypt.hash(this.local.password, 10, (err, hash) => {
        if (err) {
            next(err);
        }

        this.local.password = hash;
        next();
    })
});

userSchema.methods.comparePassword = function (passwordCandidate) {
    let password = this.local.password;

    return new Promise((resolve, reject) => {
        bcrypt.compare(passwordCandidate, password, (err, success) => {
            if (err) {
                reject(err);
            }

            if (success) {
                resolve(success);
            }

            reject();
        })
    })
};

module.exports = mongoose.model('User', userSchema);
