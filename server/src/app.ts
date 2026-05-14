import express, { Application } from 'express';
import cors from 'cors';
import sdmRoutes from './routes/sdmRoutes';
import authRoutes from './routes/authRoutes';
import publikasiRoutes from './routes/publikasiRoutes';
import reviewerRoutes from './routes/reviewerRoutes';
import "reflect-metadata";
import { connectDB } from './config/database';

const app: Application = express();

connectDB();

const routeSdm = '/api/sdm';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Ini API Backend SIPPM LPPM!');
});

app.use(routeSdm, sdmRoutes);
app.use(routeSdm, publikasiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviewer', reviewerRoutes);


export default app;
