var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs'); //This package is used to encrypting and decrypting password.

userSchema=new Schema({
  email:{type:String,required:true},
  password:{type:String,required:true}
});

//userSchema.methods telling that this schema has some methods also. We can call these method from User model object.
userSchema.methods.encryptPassword=function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null); //Encrypting password and putting it into hashmap.
}

userSchema.methods.validPassword=function(password){
  return bcrypt.compareSync(password,this.password); //we are comparing the password with this particulare user password.
}

//Exporting user model
module.exports=mongoose.model("User",userSchema);
