const express=require('express');
const amqplib=require('amqplib');
const {EmailService}=require('./services');
const {ServerConfig}=require('./config')

async function connectQueue(){
    try {
        const connection=await amqplib.connect("amqp://localhost");
        const channel=await connection.createChannel();

        await channel.assertQueue("noti-queue");
        channel.consume('noti-queue',async (data)=>{
            console.log(`${Buffer.from(data.content)}`);
            const object=JSON.parse(`${Buffer.from(data.content)}`);
            await EmailService.sendEmail(ServerConfig.GMAIL_EMAIL,object.recepientEmail,object.subject,object.text);
            channel.ack(data);
        })
    } catch (error) {
        console.log(error);
    }
}

const apiRoutes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api',apiRoutes);

app.listen(ServerConfig.PORT,async ()=>{
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    connectQueue();
});