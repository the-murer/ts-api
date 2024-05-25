import { Request, Response } from 'express';
import userModel from '../models/user_model';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const createToken = async (_id: string): Promise<string> => {
    const jwtKey = process.env.JWT_KEY as string;
    return jwt.sign({ _id }, jwtKey, { expiresIn: '1d' });
}

const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            res.status(400).send({ error: 'Credenciais inválidas' });
            return;
        }  
        if (!validator.isEmail(email)) {
            res.status(400).send({ error: 'Email inválido' });
            return;
        }  
    
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(400).send({ error: 'Credenciais inválidas' });
            return;
        }  
    
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(400).send({ error: 'Credenciais inválidas' });
            return;
        }
    
        const token = await createToken(user._id.toString());
    
        res.status(200).json({ _id: user._id, name: user.name, email, token });
        return;
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: 'Falha ao autenticar usuário', message: error.message });
            return;
          } else {
            res.status(500).send({ error: 'Falha ao autenticar usuário' });
            return;
          }
    }
}

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;    

    if (!name || !email || !password) {
        res.status(400).send({ error: 'Todos os campos devem ser preenchidos' });
        return;
    }  
    if (!validator.isEmail(email)) {
        res.status(400).send({ error: 'Email inválido' });
        return    
    } 
    if (!validator.isLength(password, { min: 6 })) {
        res.status(400).send({ error: 'Senha inválida' });
        return;
    }  

    const userExists = await userModel.findOne({ email });
    if (userExists) {
        res.status(400).send({ error: 'Este email já esta em uso' });
        return;
    } 

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({ name, email, password: hash });
    console.log("🚀 ~ registerUser ~ email, password:", email, password)
    const token = await createToken(user._id.toString());

    res.status(200).json({ _id: user._id, name, email, token });
    return;
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).send({ error: 'Falha ao criar usuário', message: error.message });
      } else {
        res.status(500).send({ error: 'Falha ao criar usuário', message: 'Erro desconhecido' });
      }  }
};

const getUsers = async (req: Request, res: Response): Promise<void> => {
    const users = await userModel.find();
    res.status(200).json(users);
}

const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await userModel.findOne({ id });
        if (!user) {
            res.status(404).send({ error: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json(user);
        
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: 'Falha ao buscar usuário', message: error.message });
          } else {
            res.status(500).send({ error: 'Falha ao buscar usuário', message: 'Erro desconhecido' });
          }  
        }
    
}

export  {
    registerUser,
    createToken,
    loginUser,
    getUsers,
    getUserById,
};
