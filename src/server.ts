import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { connect, JSONCodec } from "nats";
import message_model from './models/message_model';
import chat_model from './models/chat_model';

import userRoutes from './routes/user_routes';
import chatRoutes from './routes/chat_routes';
import messageRoutes from './routes/message_routes';
import { userValidateAndCreate } from './controllers/user_controllers';

dotenv.config();
const port: string | undefined = process.env.PORT;
const mongoUri: string = process.env.MONGO_URI as string;
const natsServers: string = process.env.NATS_SERVER as string;

const corsOptions = {
  origin: ['http://localhost:5173']
};

const app: Application = express();
app.use(express.json());
app.use(cors(corsOptions));

app.get('/test', (req, res) => { res.send('Tudo em ordem!') });

app.use('/users', userRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}!`);
});

mongoose.connect(mongoUri, { })
.then(() => { console.log('Conectado ao mongo'); })
.catch((error) => { console.error('Falha ao estabelecer conexão com mongo:', error); });


connect({ servers: natsServers }).then(async (nc) => {
  console.log(`Conectado ao NATS ${nc.getServer()}`);

  const jc = JSONCodec();
  nc.subscribe("message:create", {
    callback: async (err, msg) => {
      const notification = jc.decode(msg.data);
      if (err) {
        console.log("Falha ao criar", err.message);
        return;
      }
      const message = await message_model.create(notification);  
      nc.publish("notifications", jc.encode({...message, type: "message"}));
      msg.respond(jc.encode(message));
    },
  });
  
  nc.subscribe("chat:create", {
    callback: async (err, msg) => {
      const notification = jc.decode(msg.data) as { userId: string, receiverId: string };
      if (err) {
        console.log("Falha ao criar chat", err.message);
        return;
      }
      const message = await chat_model.create({ participants: [notification.userId, notification.receiverId] });
      nc.publish("notifications", jc.encode({ ...message, type: "chat" }));
      msg.respond(jc.encode(message));
    },
  });
  nc.subscribe("user:create", {
    callback: async (err, msg) => {
      const notification = jc.decode(msg.data) as { email: string, name: string, password: string };
      if (err) {
        console.log("Falha no user", err.message);
        return;
      }
      const user = await userValidateAndCreate(notification);
      msg.respond(jc.encode(user));
    },
  });
});





