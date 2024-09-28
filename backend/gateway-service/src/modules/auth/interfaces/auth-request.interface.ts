import { Request } from 'express';

interface User {
  id: string;
}

export interface AuthRequest extends Request {
  user: User;
}
