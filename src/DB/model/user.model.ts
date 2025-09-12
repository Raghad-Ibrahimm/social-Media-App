import mongoose, { Types } from "mongoose";







export enum GenderType{
    male="male",
    female="female"
}

export enum RoleType{
    admin="admin",
    user="user"
}

export interface Iuser {
    _id:Types.ObjectId,
    fName:string,
    lName:string,
    fullName?:string,
    email:string,
    password:string,
    age:number,
    gender:GenderType,
    phone?:string,
    address?:string
    role?:RoleType,
    otp?:string,
    confirmed?:boolean,
    changeCredentials:Date,
    createdAt:Date,
    updatedAt:Date

}

const userSchema = new mongoose.Schema<Iuser>({
       fName:{type:String ,required:true,minLength:2,maxLength:10, trim:true},
    lName:{type:String,required:true,minLength:2,maxLength:10,trim:true},
    email:{type:String,required:true,unique:true, trim:true},
    password:{type:String,required:true},
    age:{type:Number,minLength:18,maxLength:60,required:true},
    gender:{type:String,enum:GenderType,default:GenderType.female},
    phone:{type:String},
    address:{type:String},
    role:{type:String ,enum:RoleType,default:RoleType.user},
    otp:{type:String},
    confirmed:{type:Boolean,default:false},
    changeCredentials:Date,
    createdAt:Date,
    updatedAt:Date,
   
},{
    timestamps:true,
    toObject:{virtuals:true},//to show virtuals in log js
    toJSON:{virtuals:true}//to show virtuals in postman and anothr env
})
userSchema.virtual("fullName").set(function (value) {
    const [fName,lName]=value.split(" ")
  this.set({fName,lName})
}).get(function (){
    return this.fName + " " + this.lName
})


const userModel =mongoose.models.User || mongoose.model<Iuser>("User",userSchema) 
export default userModel