import express from 'express';
import supabase from '../DB/supabase.js';
import {connectMongo} from '../DB/mongodb.js';
import{BodyInsertionTest, EntryConfirmation,checkBody1,checkBody2} from '../middleware/validation.js'
import {reversText} from '../utils/revers.js'


const apiRouter = express();

export const db = await connectMongo({
    uri: process.env.URI,
    dbName: process.env.DBNAME
});


apiRouter.post('/auth/register',BodyInsertionTest, async (req,res) => {
    try{
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


apiRouter.post('/messages/encrypt', EntryConfirmation,checkBody1,async (req,res) => {
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



apiRouter.post('/messages/decrypt', EntryConfirmation,checkBody2,async (req,res) => {
    try{
        const {messageId} = req.body;
        const { data, error } = await supabase
        .from('messages')
        .select()
        .eq('id', messageId)
        const text = data[0].encrypted_text
        const fixText = reversText(text.toLowerCase())
        if (fixText){return res.status(200).json({id: messageId, decryptedText: fixText})}
        else{ return res.status(200).json({id: messageId, decryptedText: null, error: "CANNOT_DECRYPT"})}
    } catch(err) {
        console.error(err);
        res.status(500).json({nessage: "The server could not connect."})
    }
})



apiRouter.get('/users/me', EntryConfirmation, async (req,res) => {
    try{
    const name = req.headers['x-username'];
    const data = await db.collection('users').find({username: name}).toArray();
    res.status(200).json({username: data[0].username,encryptedMessagesCount : data[0].encryptedMessagesCount })
    } catch (err) {
        console.error(err);
        res.status(500).json({message:"The server could not connect."})
    }
})


export default apiRouter;