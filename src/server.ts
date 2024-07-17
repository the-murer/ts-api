import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { connect, JSONCodec, StringCodec } from "nats";

import { userLogin, userValidateAndCreate } from './controllers/user_controllers';
import userModel from './models/user_model';
import messageModel from './models/message_model';
import chatModel from './models/chat_model';

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


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}!`);
});

mongoose.connect(mongoUri, { })
.then(() => { console.log('Conectado ao mongo'); })
.catch((error) => { console.error('Falha ao estabelecer conexão com mongo:', error); });


connect({ servers: natsServers }).then(async (nc) => {
  console.log(`Conectado ao NATS ${nc.getServer()}`);

  const jc = JSONCodec();
  const sc = StringCodec();
  nc.subscribe("message:create", {
    callback: async (err, msg) => {
      const notification = jc.decode(msg.data);
      if (err) {
        console.log("Falha ao criar", err.message);
        return;
      }
      const message = await messageModel.create(notification);  
      nc.publish("notifications", jc.encode({...message, type: "message"}));
      msg.respond(jc.encode(message));
    },
  });
  nc.subscribe("messages", {
    callback: async (err, msg) => {
      if (err) { console.log("Falha ao buscar mensagens", err.message); return; }
      msg.respond(jc.encode(await messageModel.find({ chatId: sc.decode(msg.data) })));
    },
  });
  
  nc.subscribe("c:create", {
    callback: async (err, msg) => {
      const notification = jc.decode(msg.data) as { userId: string, receiverId: string };
      if (err) {
        console.log("Falha ao criar chat", err.message);
        return;
      }
      const message = await chatModel.create({ participants: [notification.userId, notification.receiverId] });
      nc.publish("notifications", jc.encode({ ...message, type: "chat" }));
      msg.respond(jc.encode(message));
    },
  });
  nc.subscribe("chats", {
    callback: async (err, msg) => {
      if (err) { console.log("Falha ao buscar chats", err.message); return; }
      msg.respond(jc.encode(await chatModel.find({ participants: { $in: [sc.decode(msg.data)] } })));
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
  nc.subscribe("user:login", {
    callback: async (err, msg) => {
      const notification = jc.decode(msg.data) as { email: string, name: string, password: string };
      if (err) {
        console.log("Falha no user", err.message);
        return;
      }
      const user = await userLogin(notification);
      msg.respond(jc.encode(user));
    },
  });
  nc.subscribe("user", {
    callback: async (err, msg) => {
      const request = sc.decode(msg.data);
      if (err) {
        console.log("Falha no user", err.message);
        return;
      }
      msg.respond(jc.encode(await userModel.findById(request)));
    },
  });
  nc.subscribe("users", {
    callback: async (err, msg) => {
      if (err) { console.log("Falha no user", err.message); return; }
      msg.respond(jc.encode(await userModel.find()));
    },
  });

});





