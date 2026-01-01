import express from 'express';
import supabase from '../DB/supabase.js';
import {connectMongo} from '../DB/mongodb.js';
import{BodyInsertionTest, EntryConfirmation} from '../middleware/validation.js'
import { ObjectId } from 'mongodb';
import {reversText} from '../utils/revers.js'


const apiRouter = express();

export const db = await connectMongo({
    uri: process.env.URI,
    dbName: process.env.DBNAME
});


apiRouter.post('/auth/register',BodyInsertionTest, async (req,res) => {
    try{
        console.log("aaa");
        
        const {username, password} = req.body

        const data = await db.collection('users').find({username: username}).toArray();
        if(data.length > 0) {return res.status(400).json({message: "The user name has already been found."})}
        const result = await db .collection('users').insertOne({
            username, 
            password,
            encryptedMessagesCount : 0,
            createdAt: new Date().toISOString()
        })
        res.status(201).json({id:result.insertedId, username:username})
    } catch(err){
        console.error(err);
        res.status(500).json({message: "The server could not connect."})   
    }
}) 


apiRouter.post('/messages/encrypt', EntryConfirmation,async (req,res) => {
    const {message, cipherType} = req.body;
    const username = req.headers['x-username']
    if(cipherType === "revers"){
        const textRevers = reversText(message)
        const result = await supabase
        .from('messages')
        .insert({
            username,
            cipher_type : cipherType,
            encrypted_text : textRevers.toUpperCase(),
            inserted_at : new Date().toISOString()
        })
        .select()
        // await db.collection('users').updateOne({username:username}, {$set: {encryptedMessagesCount : encryptedMessagesCount++}})
        res.status(201).json({id: result.data[0].id, cipherType: result.data[0].cipher_type, encryptedText: result.data[0].encrypted_text })
    } else{
        res.status(400).json({messege: "you can only revers"})
    }
})



apiRouter.post('/messages/decrypt', EntryConfirmation,async (req,res) => {

})



export default apiRouter;