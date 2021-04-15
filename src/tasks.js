const express = require('express')
const Model=require('../models/user')
const taskModel=Model.Task
const router = express.Router()
const authMe=require('../middleware/verifytoken')
const {ObjectId} = require('mongoose').Types
// router.get('/addtask',(req,res)=>{
//     res.render('addtask')
// })
router.post('/addtask',authMe,(req,res)=>{
    let data={
        ...req.body,
        owner: req.user._id
    }
    let todo=new taskModel(data)
    todo.save().then(()=> { 
          res.status(200).send({
              status:true,
              data:todo,
              message:"task has been added successfully"
          })}).catch(e=> res.status(400).send({
            status:false,
            error:e.message,
            message:"task can't be added"
        }))
})
router.get('/showall',authMe ,async(req,res)=>{
    try{
        // let todos= await req.user.populate('userTask').execPopulate()
        let todos= await taskModel.find({owner:req.user._id})
        if(todos.length == 0 ) res.status(200).send({
            status:true,
            data:'this user no todos'
        })
        else
        res.status(200).send({
            status:true,
            data:todos
        })
    }
    catch(e){res.status(400).send({error:e.message})}
})
router.get('/guest',async(req,res)=>{
    try{
        // let todos= await req.user.populate('userTask').execPopulate()
        let todos= await taskModel.find()
        if(todos.length == 0 ) res.status(200).send({
            status:true,
            data:'there is no todos todos'
        })
        else{
            let tasks=todos.map(todo =>{
                let obj={}
                obj['title']=todo.title
                obj['description']=todo.description
                return obj
            })
            res.status(200).send({
                status:true,
                data:tasks
            })
        }
        
    }
    catch(e){res.status(400).send({error:e.message})}
})

router.get('/showall/:id',authMe ,async(req,res)=>{
    try{
        let{id}=req.params
        let todo=await taskModel.findOne({_id:id , owner:req.user._id})
        if(!todo) throw new Error('task is not exits')
        res.status(200).send({
            status:true,
            data:todo,
            message:'task has been retreived correctly'
        })
    }
    catch(e){res.status(400).send({error:e.message})}
})
router.patch('/showall/:id',authMe,async(req,res)=>{
    try{
        let heads=['title','description']
        let reqheads=Object.keys(req.body)
        let valid=reqheads.every(head=> heads.includes(head))
        console.log(valid)
        if(!valid) res.status(500).redirect('/error')
        else {
            // let user =await userModel.findByIdAndUpdate(req.params.id,req.body,{
            //     runValidators:true , new:true})
            let task =await taskModel.findById(req.params.id)
            if(!task)  throw new Error ('task not found')
            else if((task.owner).toString() === (req.user._id).toString()) {
                reqheads.forEach(head=>{
                    task[head]=req.body[head]
                })
                await task.save()
                res.status(200).send({
                    status:true,
                    data:task,
                    message:'task has been updated'
                })
            }
            else throw new Error ('user is unauthorized to edit task')
        }   
    }
    catch(e){
        res.status(404).send({
            status:false,
            error:e.message,
            message:'task can not be updatd'
    
        })
    }
    })

router.delete('/showall/:id',authMe,async(req,res)=>{
        try{
                let task =await taskModel.findById(req.params.id)
                if(!task)  throw new Error ('task not found')
                else if((task.owner).toString() === (req.user._id).toString()) {
                     let todo=await taskModel.deleteOne({_id:req.params.id})
                    // await task.save()
                    res.status(200).send({
                        status:true,
                        data:todo,
                        message:'task has been removed'
                    })
                }
                else throw new Error ('user is unauthorized to delete task')  
        }
        catch(e){
            res.status(404).send({
                status:false,
                error:e.message,
                message:'task can not be updatd'
        
            })
        }
        })
    

module.exports=router
