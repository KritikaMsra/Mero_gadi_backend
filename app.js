const express= require("express");
const bodyParser= require("body-parser");
const db = require('./database/db');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io')

const path = require('path');

dotenv.config({
    "path":'./.env'
})


const user_route = require('./routes/user_register_route');
const productRoute = require('./routes/productRoute');
const bookingRoute = require('./routes/bookingRoute');
const giveawayRoute = require('./routes/giveawayRoute')
const chatRoute = require('./routes/chatRoute')
const hireRoute = require('./routes/hireRoute')


const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
 
//initialize the socket //it have two way communications.
io.on("connection",(socket)=>{
 
    socket.on("chatMessage",(chatObj)=>{
        
        io.emit('chatMessage',chatObj)
    })
})

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use('/image',express.static(path.join(__dirname,'/image')));

app.use(user_route);
app.use(productRoute);
app.use(bookingRoute);
app.use(giveawayRoute);
app.use(chatRoute);
app.use(hireRoute)

server.listen(90,()=>{
    console.log("Server is running")
})

