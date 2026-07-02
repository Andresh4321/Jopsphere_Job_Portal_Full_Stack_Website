import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './database/db';
import { PORT } from './config';
import cors from 'cors';
import path from "path";
import  authRoutes  from './routes/Auth/auth.routes';

const app: Application = express();
app.use(express.static(path.join(__dirname, "../public")));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
  })
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);



export default app;