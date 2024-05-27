import express from 'express';
import { createMessage, getMessages } from '../controllers/message_controllers';

const router = express.Router();

router.post('/create', createMessage);
router.get('/:chatId', getMessages);

export default router;