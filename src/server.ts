import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/user_routes';

dotenv.config();
const port: string | undefined = process.env.PORT;
const mongoUri: string = process.env.MONGO_URI as string;

const app: Application = express();
app.use(express.json());

app.get('/test', (req, res) => { res.send('Tudo em ordem!') });

app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}!`);
});


mongoose.connect(mongoUri, { })
  .then(() => { console.log('Conectado ao mongo'); })
  .catch((error) => { console.error('Falha ao estabelecer conexão com mongo:', error); });