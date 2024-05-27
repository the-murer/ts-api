import { Request, Response } from 'express';
import messageModel from '../models/message_model';
import dotenv from 'dotenv';
dotenv.config();


const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId, userId, content } = req.body;    
    const message = await messageModel.create({ chatId, userId, content });

    res.status(200).json(message);
    return;
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).send({ error: 'Falha ao criar mensagem', message: error.message });
      } else {
        res.status(500).send({ error: 'Falha ao criar mensagem', message: 'Erro desconhecido' });
      }  
    }
};

const getMessages = async (req: Request, res: Response): Promise<void> => {
    const messages = await messageModel.find({ chatId: req.params.chatId });

    res.status(200).json(messages);
}

export  {
    createMessage,
    getMessages,
};
