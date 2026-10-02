import express from 'express';
import cors from 'cors';
import chatRouter from './routers/chatRouter.ts';

// Create an instance of the Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api', chatRouter); // Use the chatRouter for /api routes

const PORT: number  = Number(process.env.PORT) || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
