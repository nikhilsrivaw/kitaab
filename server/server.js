const pool = require('./config/db')
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

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

const dashboardRoutes = require('./routes/dashboard');






app.use('/api/auth', authRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/expenses', authMiddleware, expenseRoutes);
app.use('/api/incomes', authMiddleware, incomeRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);

app.use('/api/dashboard', authMiddleware, dashboardRoutes);


app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running"
  })
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  
    console.log("backend is running")
  
})