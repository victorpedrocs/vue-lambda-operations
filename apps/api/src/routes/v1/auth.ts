import express from 'express';
import { login } from '../../controller/auth/postLogin';
import { signup } from '../../controller/auth/postSignup';
import { asyncHandler } from '../../middleware/errorHandler';

export const authRouter = express.Router();

authRouter.post('/login', asyncHandler(login));
authRouter.post('/signup', asyncHandler(signup));
