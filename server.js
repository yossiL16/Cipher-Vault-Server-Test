import express from 'express';
import supabase from './DB/supabase.js';



const app = express();
app.use(express.json());
const port = process.env.PORT || 3002;


app.use('/api', apiRouter)




app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})