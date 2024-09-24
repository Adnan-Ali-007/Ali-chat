const express=require('express');
const chats = require('./data');
const dotenv=require('dotenv');
const { connect } = require('mongoose');
const connectDB=require('./config/db');
const app=express();
const userRoutes=require('./routes/userRoutes');
const chatRoutes=require('./routes/chatRoutes');
const messageRoutes=require('./routes/messageRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
dotenv.config();
connectDB(); 
app.use(express.json()); //telling server to accept json data
app.get('/',(req,res)=>{
    res.send('Server is ready');
})
// app.get('/api/chat',(req,res)=>{ testing the api
//    res.send(chats)
// })
// app.get('/api/chat/:id',(req,res)=>{
//  const singleChat=chats.find((c)=>c._id===req.params.id);
//  res.send(singleChat);
// })
app.use('/api/chat',chatRoutes);
app.use('/api/user',userRoutes);
app.use("/api/message",messageRoutes)
app.use(notFound);
app.use(errorHandler);
const PORT=process.env.PORT || 5000;
app.listen(5000,()=>console.log(`Server Running ${PORT}`));