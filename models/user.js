import mongoose from "mongoose";

const userSchema= mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique: true
    },
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    type:{
        type:String,
        require:true,
        default:"customer"
    },
    profilePic:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fpremium-vector%2Fdefault-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_134086038.htm&psig=AOvVaw3XoZ-iWo5gp5QX9gNiJHCc&ust=1732539858728000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKjPpZOE9YkDFQAAAAAdAAAAABAE"
    }
});
const user = mongoose.model("user", userSchema);

export default user