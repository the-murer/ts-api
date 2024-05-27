import { Request, Response } from 'express';
import chatModel from '../models/chat_model';
import dotenv from 'dotenv';
dotenv.config();


const createChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, receiverId } = req.body;    
    const chat = await chatModel.create({ participants: [userId, receiverId] });

    res.status(200).json({ _id: chat._id });
    return;
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).send({ error: 'Falha ao criar chat', message: error.message });
      } else {
        res.status(500).send({ error: 'Falha ao criar chat', message: 'Erro desconhecido' });
      }  }
};

const getChats = async (req: Request, res: Response): Promise<void> => {
    const chats = await chatModel.find({ participants: { $in: [req.params.userId] } });
    res.status(200).json(chats);
}

export  {
    createChat,
    getChats,
};
