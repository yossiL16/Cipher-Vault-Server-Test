import express from 'express';
import apiRouter from './routers/api.js'
import 'dotenv/config'


const app = express();
app.use(express.json());
const port = process.env.PORT;
console.log(port);



app.use('/api', apiRouter)




app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})