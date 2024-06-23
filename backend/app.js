import express from 'express';
import connectDB from './db.js';
import dotenv from 'dotenv';
import events from './routes/events.js';
import users from './routes/users.js';

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/events', events);
app.use('/api/users', users);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ msg: 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});