import mongoose, { Schema } from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "PLEASE ENTER NAME"],
            trim: true,
            maxlength: [50, " NAME CANNOT BE MORE THAN 50 WORDS"]
        },
        email: {
            type: String,
            required: [true, "EMAIL IS REQUIRED"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, " PASSWORD IS REQUIRED"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false //whether a field should be returned (selected) in queries by default or not.
        },
        createdAt: {
            type: Date,
            default: Date.now
        }

    }, {
    timestamps: true
}
)


UserSchema.pre('save', async function (next) {
    if (!this.ismodified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

UserSchema.methods.matchPassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
}

