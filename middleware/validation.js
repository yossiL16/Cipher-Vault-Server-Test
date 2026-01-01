

export function BodyInsertionTest(req,res,next) {
    const {username , password } = req.body;
    if(!username || password === undefined) {return res.status(400).json({error: "MISSING_FIELDS"})};
    if(typeof username !== "string" || typeof password !== "string"){return res.status(400).json({error:"The type is incorrect."})}
    next()
}