const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); // <-- ADD THIS
const documentRoutes = require('./routes/documentRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Body Parser Middleware
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Define Routes
app.use('/api/users', userRoutes); // <-- AND ADD THIS
app.use('/api/documents', documentRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));