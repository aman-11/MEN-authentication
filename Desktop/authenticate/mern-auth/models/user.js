const mongoose = require('mongoose');
const { isEmail } = require("validator");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,'Please enter an email!'],//custom error msg if it fails
        unique: true,
        lowercase: true,
        validate:[isEmail,'Please enter a valid email!'],
    },
    password: {
        type: String,
        required: [true,'Please enter a Password!'],
        minlength: [6,'Minimum password 6 charachter!']
    },
});


//fire a function after the documet are saved or delete in db
/*userSchema.post('save', function (doc,next) {
    console.log('new user was created and saved', doc);
    next();
});*/


//firefunct before the doc saved
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//static method to login
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

const User = mongoose.model('user', userSchema);
module.exports = User;
