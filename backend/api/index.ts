import app from '../src/app.js';
import { connectDB } from '../src/db/index.js';

export default async function handler(req: any, res: any) {
  // Ensure DB is connected before handling the request
  await connectDB();
  
  // Forward the request to Express
  return app(req, res);
}
