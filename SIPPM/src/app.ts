import express, { Application } from 'express';
import cors from 'cors';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Nanti kita akan pasang routes di sini

export default app;