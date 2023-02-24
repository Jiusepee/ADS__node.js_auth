const mongoose = require('mongoose');

const ad = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        text: {
            type: String,
            required: [true, 'Please enter your ad text']
        },
        description: {
            type: String,
            required: [true, 'Please enter your ad description']
        },
        price: {
            type: String,
            required: [true, 'Please enter your ad price Eur']
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Ad', ad);