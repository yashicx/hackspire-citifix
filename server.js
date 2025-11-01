import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './utils/db.js';
import issuesRoutes from './routes/issues.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// connect to MongoDB
connectDB();

app.use('/api/issues', issuesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
