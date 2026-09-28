require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] } });

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
connectDB();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/scholarships', require('./routes/scholarships'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/work-study', require('./routes/workstudy'));
app.use('/api/payment-plans', require('./routes/paymentPlans'));
app.use('/api/payments', require('./routes/payments'));

io.on('connection', (socket) => {
  console.log('⚡ User connected');
  socket.on('join_user', (userId) => socket.join(userId));
  socket.on('disconnect', () => console.log('User disconnected'));
});
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));