import { Collection } from 'mongodb';
import {connectMongo} from '../DB/mongodb.js';
import {db} from '../routers/api.js'

export function BodyInsertionTest(req,res,next) {
    const {username , password } = req.body;
    if(!username || password === undefined) {return res.status(400).json({error: "MISSING_FIELDS"})};
    if(typeof username !== "string" || typeof password !== "string"){return res.status(400).json({error:"The type is incorrect."})}
    next()
}


export async function EntryConfirmation(req,res,next) {
    const username = req.headers['x-username'];
    const password = req.headers['x-password'];
    console.log(username);
    console.log(typeof password);
    
    
    if(!username || password === undefined) {return res.status(400).json({error: "MISSING_FIELDS"})};
    if(typeof username !== "string" || typeof password !== "string"){return res.status(400).json({error:"The type is incorrect."})}
    
    const data = await db
    .collection('users')
    .find({username:username})
    .toArray()

    if (data.length === 0){return res.status(400).json({message:"user not found"})}
    if (data[0].password !== password){return res.status(400).json({messege:"The code is incorrect" })}
    next()
}


