import {Schema,model} from 'mongoose'

const userSchema = new Schema({
    email:{
        type:String,
        required:[true,"email is required"],
    },
    password:{
        type:String,
        required:[true,"password is required"],
    }
},{
    timestamps:true,
    strict:"throw",
    versionKey:false
})

export const User = model('user',userSchema)