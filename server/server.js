const pool = require('./config/db')
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const http = require('http');
const { initializeSocket } = require('./socket');

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json())


pool.query('SELECT NOW()')
  .then(result => {
    console.log('Database connected')
  })
  .catch(error => {
    console.log('database connection error', error)
  })
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/incomes');
const analyticsRoutes = require('./routes/analytics');
const authMiddleware = require('./middleware/auth');
const aiRoutes = require('./routes/ai');
const chatRoutes = require('./routes/chat');
const channelRoutes = require('./routes/channels');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');

const dashboardRoutes = require('./routes/dashboard');
const clientRoutes = require('./routes/clients');

// Debug middleware - logs ALL requests
  app.use((req, res, next) => {
      console.log(`📥 ${req.method} ${req.path}`);
      next();
  });





app.use('/api/auth', authRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/expenses', authMiddleware, expenseRoutes);
app.use('/api/incomes', authMiddleware, incomeRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/channels', authMiddleware, channelRoutes);
app.use('/api/messages', authMiddleware, messageRoutes);
app.use('/api/upload', authMiddleware, uploadRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);

app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/clients', authMiddleware, clientRoutes);


app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running"
  })
})


const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initializeSocket(server);

server.listen(PORT, () => {
  console.log('backend is running on port', PORT);
  console.log('✅ Socket.io initialized');
});