const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        required: true,
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'Invalid email format.'
        }
    },
    password: {
        required: true,
        type: String,
    },
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: (value) => validator.isMobilePhone(value, 'any', { strictMode: true }),
            message: 'Invalid phone number.'
        }
    },
    address: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'seller'],
        default: 'user'
    },
    
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
