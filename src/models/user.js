const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,   
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is not valid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    //foreignField is the field on the thing you want to associate with that you use to identify with (in this case we want 
    //to associate with Task and the field on Task we want to use to identify with is owner). The localField is the field 
    //with the matching data for the foreignField. (in this case the User _id field contains the ID that 
    // will match up with the Task owner field which is also an id).
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

//adds a method that can be called on a specific user
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET); //Add the user Id to the hash. jwt expect the id to be a string
    
    user.tokens = user.tokens.concat({ token });
    await user.save();
    
    return token;
}

//Delete certain items from the User model before sending the JSON file before sending back to the client
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject() //gives back an object with just our user data and not all the extra stuff mongoose puts on the object

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar

    return userObject;
}

//adds a method that can be called on the User group
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if(!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

//Hash the plaintext password before saving
userSchema.pre('save', async function(next) {
    //Must use standard function notation to preserve this value
    //this accesses the individual user we are about to save
    const user = this;

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next() //Lets mongoose know we have finished running code and to go ahead and save the user
});

//delete user's task when user is deleted
userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id })
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;