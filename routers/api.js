import express from 'express';
import supabase from '../DB/supabase.js';
import{BodyInsertionTest} from '../middleware/validation.js'

const apiRouter = express();


apiRouter.post('/auth/register',BodyInsertionTest, async (requestAnimationFrame,res) => {
  
}) 