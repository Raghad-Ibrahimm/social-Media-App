import mongoose from "mongoose";
export var GenderType;
(function (GenderType) {
    GenderType["male"] = "male";
    GenderType["female"] = "female";
})(GenderType || (GenderType = {}));
export var RoleType;
(function (RoleType) {
    RoleType["admin"] = "admin";
    RoleType["user"] = "user";
})(RoleType || (RoleType = {}));
const userSchema = new mongoose.Schema({
    fName: { type: String, required: true, minLength: 2, maxLength: 10, trim: true },
    lName: { type: String, required: true, minLength: 2, maxLength: 10, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    age: { type: Number, minLength: 18, maxLength: 60, required: true },
    gender: { type: String, enum: GenderType, default: GenderType.female },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: RoleType, default: RoleType.user },
    otp: { type: String },
    confirmed: { type: Boolean, default: false },
    changeCredentials: Date,
    createdAt: Date,
    updatedAt: Date,
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
userSchema.virtual("fullName").set(function (value) {
    const [fName, lName] = value.split(" ");
    this.set({ fName, lName });
}).get(function () {
    return this.fName + " " + this.lName;
});
const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
