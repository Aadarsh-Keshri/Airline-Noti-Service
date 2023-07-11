/**
 * to run "dev" in script of package.json, $'use npm run dev'
 */


const express=require('express');

const {ServerConfig}=require('./config');   
const apiRoutes = require('./routes');

const mailsender=require('./config/email-config');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api',apiRoutes);

app.listen(ServerConfig.PORT,async ()=>{
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    try {
        const response=await mailsender.sendMail({
            from: ServerConfig.GMAIL_EMAIL,
            to: 'aadarshcodes@gmail.com',
            subject: 'Is the service working?',
            text: 'Haawww Yeahhhhh!!!!'
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
});