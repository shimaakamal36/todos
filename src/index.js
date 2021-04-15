const express=require('express')
const path=require('path')
const hbs=require('hbs')
const publicDir=path.join(__dirname,'../public')
const viewDir=path.join(__dirname,'../template/views')
const partialDir=path.join(__dirname,'../template/layouts')
const app=express()
const auth=require('./auth')
const tasks=require('./tasks')

app.use(express.json())
app.use(express.static(publicDir))
app.use(express.urlencoded())
app.set('view engine','hbs')
app.set('views',viewDir)
app.use('/auth', auth)
app.use('/todos', tasks)

hbs.registerPartials(partialDir)
app.get('/',(req,res)=>{
    try{
        res.status(200).send('this is the root')
    }
    catch(e){
        res.status(404).render('error',{error:e.message})
    }
})

app.get('/error',(req,res)=>{
    res.status(400).send('resource is not found')
})
app.get('*',(req,res)=>{
    res.redirect('/error')
})
app.listen(3000)

