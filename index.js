/* 
    Está clase es la más importante del Backend, pues aquí se despliega el servidor haciendo uso de
    Express, el cual para cuestiones de desarrollo correra en el localhost:3000.
    Para cuestiones de comunicación entre BACKEND y FRONTED se hace uso de la libreria cors.
*/

const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const originSources = ['http://localhost:5001'];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || originSources.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(authRoutes);

const http = require('http').createServer(app);
const mongoose = require('mongoose');
const socketio = require('socket.io');
const { callbackify } = require('util');
const io = socketio(http);
const mongoDB = "mongodb+srv://juandaviduarte911:<password>@tesorosenlinea.6yyvsgk.mongodb.net/?retryWrites=true&w=majority&appName=TesorosEnLinea";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('connected')).catch(err => console.log(err))
const {addUser, getUser, removeUser} = require('./helper');
const PORT = process.env.PORT || 5001
const Room = require('./models/Auction');
const Message = require('./models/Message')

app.get('/set-cookies', (req, res) => {
    res.cookie('isAuthenticated', true, { maxAge: 24 * 60 * 60 * 1000 });
    res.send('cookies are set');
})

app.get('/get-cookies', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    res.json(cookies);
})

io.on('connection', (socket) => {
    console.log(socket.id);

    Auction.find().then(result =>{
        console.log('output-rooms', result)
        socket.emit('output-rooms', result)
    })
    
    socket.on('create-room', name => {
        //console.log('Sala: ', name)
        const auction = new auction({ name });
        auction.save().then(result =>{
            io.emit('room-created', result)
        })
    })
    socket.on('join', ({ name, auction_id, user_id }) => {
        const { error, user } = addUser({
            socket_id: socket.id,
            name,
            auction_id,
            user_id
        })
        socket.join(auction_id);
        if (error) {
            console.log('Error de ingreso', error)
        } else {
            console.log('Ingreso', user)
        }
    })
    socket.on('sendMessage', (message, auction_id, callback)=>{
        const user = getUser(socket.id);
        const msgToStore = {
            name:user.name,
            user_id:user.user_id,
            auction_id,
            text:message
        }
        console.log('message', msgToStore)
        const msg = new Message(msgToStore);
        msg.save().then(result=>{
            io.to(room_id).emit('message', result)
            callback()
        })
        
    })
    socket.on('get-messages-history', auction_id => {
        Message.find({ auction_id }).then(result => {
            socket.emit('output-messages', result)
        })
    })
    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id);
    })
});

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});