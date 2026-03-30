import express, { Application } from 'express';
import cors from 'cors';
import sdmRoutes from './routes/sdmRoutes';
import authRoutes from './routes/authRoutes';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Ini API Backend SIPPM LPPM!');
});

app.use('/api/sdm', sdmRoutes);
app.use('/api/auth', authRoutes);

export default app;