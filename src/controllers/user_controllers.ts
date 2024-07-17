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

export async function userLogin (data: { email: string, password: string }): Promise<{ _id: string, name: string, email: string, token: string }> {
    try {
        const { email, password } = data;
        if (!email || !password) {
            throw Error('Credenciais inválidas'); 
        }  
        if (!validator.isEmail(email)) {
            throw Error('Email inválido'); 
        } 
    
        const user = await userModel.findOne({ email });
        if (!user) {
            throw Error('Credenciais inválidas'); 
        }  
    
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw Error('Credenciais inválidas'); 
        }
    
        const token = await createToken(user._id.toString());
    
        return { _id: user._id.toString(), name: user.name, email, token };
        
    } catch (error) {
        throw Error('Falha ao autenticar usuário'); 
    }
}

export async function  userValidateAndCreate (data: { name: string, email: string, password: string }): Promise<{ _id: string, name: string, email: string, token: string }> {
    const { name, email, password } = data;
    if (!name || !email || !password) {
        throw Error('Todos os campos devem ser preenchidos'); 
    }  
    if (!validator.isEmail(email)) {
        throw Error('Email inválido'); 
    } 
    if (!validator.isLength(password, { min: 3 })) {
        throw Error('Senha inválida');
    }  

    const userExists = await userModel.findOne({ email });
    if (userExists) {
        throw Error('Email em uso'); 
    } 

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({ name, email, password: hash });
    const token = await createToken(user._id.toString());
    return { _id: user._id.toString(), name, email, token };
}