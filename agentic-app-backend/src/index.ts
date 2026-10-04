import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.route.ts';
import customerRoutes from './routes/customer.route.ts';
import orderRoutes from './routes/order.route.ts';
import weatherRoutes from './routes/weather.route.ts';

// Create an instance of the Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes); // Use the chatRouter for /api routes

const PORT: number  = Number(process.env.PORT) || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/weather', weatherRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
