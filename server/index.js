import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// Convert __filename and __dirname to work with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check and create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
} else {
    console.log('Uploads directory already exists');
}

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// CORS configuration to allow requests from your React app
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}));

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Could not connect to MongoDB:', err);
});

// Serve files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/feed', postRoutes); // Post routes
app.use('/api/announcements', announcementRoutes); // Announcement routes
app.use('/api/events', eventRoutes); // Event routes
app.use('/api/profile', profileRoutes); // Profile routes

// Fallback route for undefined paths
app.use((req, res) => {
    res.status(404).send({ message: "Route not found" });
});

// Listen on the specified port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
