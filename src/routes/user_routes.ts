import express from 'express';
import { loginUser, registerUser, getUsers, getUserById } from '../controllers/user_controllers';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/list', getUsers);
router.get('/get/:userId', getUserById);


export default router;