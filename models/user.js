const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
    mongoose.connect('mongodb://127.0.0.1:27017/users',{
        useCreateIndex:true,
        useFindAndModify:true,
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
 let userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:20
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        validate(value){
            if(!(validator.isEmail(value))) throw new Error ('This email is not valid');
        }
    },
    password:{
        type:String,
        trim:true,
        required:true,
       //  match:/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8, 20}$/,
        validate(value){
            if(value.includes('123')) throw new Error('this password is not allowed')
        }
    },
    age:{
        type:Number,
        required:true,
        validate(value){
            if (value< 21 ) throw new Error ('Your not allowed to access')
        }
    },
    status:{
        type:Boolean,
        default:false,
    },
    token:{
        type:String,
        trim:true
    },
    tokens:[{
        token:{type:String , trim:true}
    }]
})
userSchema.virtual('userTask',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})
userSchema.pre('save',async function(){
    let user=this
    if(user.isModified('password'))   user.password= await bcrypt.hash(user.password,10)
    console.log('hashed')
})
// userSchema.methods.toJSON=async function{
//     let user=this
//     delete user.password
//     return user
// }
let User =mongoose.model('User',userSchema)

let Task =mongoose.model('Task',{
   title:{
       type:String,
       required:true,
       trim:true,
       unique:true,
   },
   description:{
       type:String,
       trim:true,
       required:true
   },
   owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
   },
   status:{
       type:Boolean,
       default:false,
   }
})


 
 module.exports={User,Task}
    

   