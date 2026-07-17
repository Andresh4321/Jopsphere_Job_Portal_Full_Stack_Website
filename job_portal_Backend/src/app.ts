import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './database/db';
import { PORT } from './config';
import cors from 'cors';
import path from "path";
import  authRoutes  from './routes/Auth/auth.routes';
import jobRoutes from './routes/PostJob/job.routes';
import companyRoutes from './routes/company/company.routes';
import salaryRoutes from './routes/salaryexplorer/salary.route';
import applicationRoutes from './routes/application/application.route';
import jobSeekerRoutes from './routes/Auth/jobseeker.route';
import savedJobRoutes from './routes/savedjobs/savedjob.routes';
import offerRoutes from './routes/offer/offer.routes';
const app: Application = express();
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
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
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/salary-explorer", salaryRoutes);
app.use("/api", applicationRoutes);
app.use("/api/job-seekers", jobSeekerRoutes);
app.use("/api", savedJobRoutes);
app.use("/api", offerRoutes);

export default app;