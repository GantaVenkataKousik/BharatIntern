//express package
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const colors = require('colors')
const path = require('path')
const ejs = require('ejs')
const { log, time } = require('console')

const bodyParser = require('body-parser')

//rest object
//create an instance of an Express application using Node.js
const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//middlewares
// Enables Cross-Origin Resource Sharing for your server.
app.use(cors())
// Parses JSON data in incoming requests.
app.use(express.json())
// Logs HTTP requests in a developer-friendly format.
app.use(morgan('dev'))
// used to parse incoming data from HTML forms that are submitted via the application/x-www-form-urlencoded format
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const uri = 'mongodb+srv://vk:Bhavani1201@cluster0.kslyn8z.mongodb.net/'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri)
    console.log(
      `Connected to MongoDB Successfully ${conn.connection.host} `.bgGreen.white
    )
  } catch (err) {
    console.log(`Error connecting to MongoDB`.bgWhite.re)
  }
}
connectDB()

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: Number,
      default: 0
    }
  },
  { timeStamps: true }
)

const users = new mongoose.model('users', usersSchema)

var userid = ''
var role = 0

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await users.findOne({ email: email })
    if (user) {
      if (password === user.password) {
        userid = user._id
        console.log(userid)
        if(user.role == 1){
            res.redirect("/manager");
        }
        else{
            res.redirect("/member");
        }
      } else {
        res.send({ message: "Password didn't match" })
      }
    } else {
      res.redirect('/register')
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Server error' })
  }
})

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const existingusers = await users.findOne({ email: email }) // Use email1, not email

    if (existingusers) {
      res.redirect('/login')
    } else {
      const newusers = new users({
        name,
        email,
        password,
        role: 0
      })

      await newusers.save()
      res.redirect('/login')
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Server error' })
  }
})

app.get('/register', async (req, res) => {
  res.render('register') // Assuming your EJS file is in a "views" folder
})
app.get('/login', async (req, res) => {
  res.render('login') // Assuming your EJS file is in a "views" folder
})



const taskSchema  = new mongoose.Schema({
    email : String,
    task:String,
    description:String,
    completed : {
        type : Boolean,
        default : false
    }
})

const tasks = mongoose.model('tasks',taskSchema);

app.post('/addtask',async(req,res) => {
    try{
        const { task, description, email } = req.body;
        const user = await users.findOne({ email: email })
        if(user){
            try{
                const newtask = new tasks({
                    email,
                    task,
                    description
                });
    
                await newtask.save();
                res.render('uploadsuccess')
            }
            catch(err){
                console.error(err)
                res.status(500).send({ message: 'Server error' })
            }
        }
        else{
            res.status(200).send({ message: 'User not found' })
        }
    }
    catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Server error' })
  }
})


app.get('/',(req,res)=>{
    res.redirect("/login");
})

app.get('/tasksassigned',async (req,res)=>{
    try{
        const t = await tasks.find({});
        if(tasks){
            try{
                const data  = {
                    heading : "Tasks Assigned",
                    t
                }
                res.render('tasksassigned',{data});
            }
            catch(err){
                console.error(err);
            }
        }
    }
    catch(err){
        console.error(err)
        res.status(500).send({ message: 'Server error' })
    }
});


app.get('/completed',async (req,res)=>{
    try{
        const t = await tasks.find({completed:true});
        if(tasks){
            try{
                const data  = {
                    heading : "Tasks Completed",
                    t
                }
                res.render('tasksassigned',{data});
            }
            catch(err){
                console.error(err);
            }
        }
    }
    catch(err){
        console.error(err)
        res.status(500).send({ message: 'Server error' })
    }
});


app.get('/inprogress',async (req,res)=>{
    try{
        const t = await tasks.find({completed:false});
        if(tasks){
            try{
                const data  = {
                    heading : "In Progress",
                    t
                }
                res.render('inprogress',{data});
            }
            catch(err){
                console.error(err);
            }
        }
    }
    catch(err){
        console.error(err)
        res.status(500).send({ message: 'Server error' })
    }
});


app.get("/manager",async(req,res)=>{
    try{
        res.render('manager');

    }
    catch(err){
        console.error(err)
        res.status(500).send({ message: 'Server error' })
    }
});

app.get("/member",async(req,res)=>{
    try{
        const user = await users.findOne({_id:userid});
        console.log(user);
        const it = await tasks.find({email:user.email,completed:false});
        console.log(it);
        const ct = await tasks.find({email:user.email,completed:true});
        
        console.log(ct);
            try{
                const data  = {
                    name : user.name,
                    it,
                    ct
                }
                res.render('member',{data});
            }
            catch(err){
                console.error(err);
            }
    }
    catch(err){
        console.error(err)
        res.status(500).send({ message: 'Server error' })
    }
});
app.get("/update", async(req, res) => {
   console.log("I am update route");
   const i = req.query.id;

    try{
        const task = await tasks.findOne({_id:i});
        
        if(task){
            
           await  tasks.updateOne({ _id: i }, { $set: { completed: true } })
            console.log(task);  
            res.redirect("/member");
        }
    }
    catch(err){ 
        console.error(err)
        res.status(500).send({ message: 'Server error' })
    }
});


 app.listen(9002, () => {
  console.log('BE started at port 9002');
})
