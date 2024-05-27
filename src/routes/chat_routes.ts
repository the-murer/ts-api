import express from 'express';
import { createChat, getChats } from '../controllers/chat_controllers';

const router = express.Router();

router.post('/create', createChat);
router.get('/:userId', getChats);
// router.get('/get/:chatId', listMessages);


export default router;