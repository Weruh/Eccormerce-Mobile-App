import express from 'express';
import "dotenv/config";
import type { Request, Response, } from 'express';
import cors from "cors";
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express'

const app = express();

// connect to database
try {
    await connectDB();
} catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
}




// Middleware
app.use(cors())
app.use(express.json());
app.use(clerkMiddleware())

const port = process.env.PORT || 3000;


app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});