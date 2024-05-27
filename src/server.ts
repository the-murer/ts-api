import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/user_routes';
import chatRoutes from './routes/chat_routes';

dotenv.config();
const port: string | undefined = process.env.PORT;
const mongoUri: string = process.env.MONGO_URI as string;

const corsOptions = {
  origin: ['http://localhost:5173']
};

const app: Application = express();
app.use(express.json());
app.use(cors(corsOptions));

app.get('/test', (req, res) => { res.send('Tudo em ordem!') });

app.use('/users', userRoutes);
app.use('/chats', chatRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}!`);
});


mongoose.connect(mongoUri, { })
  .then(() => { console.log('Conectado ao mongo'); })
  .catch((error) => { console.error('Falha ao estabelecer conexão com mongo:', error); });