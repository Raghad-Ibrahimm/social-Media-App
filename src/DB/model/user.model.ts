import mongoose, { Types } from "mongoose";


export enum GenderType{
    male="male",
    female="female"
}

export enum RoleType{
    admin="admin",
    user="user"
}
export enum Provider{
    google="google",
    system="system"
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
    provider?:Provider,
    otp?:string,
    profileImage?:string,
    coverImages?:string,
    tempProfileImage?:string,
    confirmed?:boolean,
    deletedAt?:Date,
    deletedBy?:Types.ObjectId,
    restoredAt?:Date,
    restoredBy?:Types.ObjectId,
    changeCredentials:Date,
    friends?:Types.ObjectId[],
    createdAt:Date,
    updatedAt:Date

}

const userSchema = new mongoose.Schema<Iuser>({
       fName:{type:String ,required:true,minLength:2,maxLength:10, trim:true},
    lName:{type:String,required:true,minLength:2,maxLength:10,trim:true},
    email:{type:String,required:true,unique:true, trim:true},
    password:{type:String,required:
        function (){
        return this.provider === Provider.google ?false:true
    }
},
    age:{type:Number,minLength:18,maxLength:60,required:        function (){
        return this.provider === Provider.google ?false:true
    }},
    gender:{type:String,enum:GenderType,default:GenderType.female},
    phone:{type:String},
    friends:[{type:Types.ObjectId,ref:"User"}]
    coverImages:{type:String},
   profileImage:{type:String},
   tempProfileImage:{type:String},
   address:{type:String},
   deletedAt:{type:Date},
   restoredAt:{type:Date},
   deletedBy:{type:Types.ObjectId,ref:"User"},
   restoredBy:{type:Types.ObjectId,ref:"User"},
    role:{type:String ,enum:RoleType,required:        function (){
        return this.provider === Provider.google ?false:true
    }},
    provider:{type:String ,enum:Provider,default:Provider.system},
    otp:{type:String},
    confirmed:{type:Boolean,default:false},
    changeCredentials:{type:Date},

   
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

userSchema.pre(["findOne","updateOne"],async function () {
    const query = this.getQuery();
    const {paranoid,...rest}=query;
    if (paranoid == false) {
        this.setQuery({...rest}) //all users with out soft delete user
    }else{
        this.setQuery({...rest,deletedAt:{$exists:false}}) // all users with soft delete user

    }
})


















const userModel =mongoose.models.User || mongoose.model<Iuser>("User",userSchema) 
export default userModel