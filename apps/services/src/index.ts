import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Service is running' });
});

// Example route structure, you can drop your services and utils here
// app.use('/api/hepsiburada', hepsiburadaRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
