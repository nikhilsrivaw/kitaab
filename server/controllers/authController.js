const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const pool = require("../config/db")


const register = async(req , res)=>{
   const { email, name, password } = req.body;


    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password , saltRounds)

        const result = await pool.query(
            'INSERT INTO users(email , password , name )  VALUES ($1, $2, $3) RETURNING *',
            [email , hashedPassword , name]
        )

        const newUser = result.rows[0];
        res.status(201).json({
            message: 'User registered succesfully',
            user:{id:newUser.id , email:newUser.email , name:newUser.name}
        })

    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({error:"registration Failed"})
        
    }




}


const login = async(req,res)=>{
    const {email , password} = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if(result.rows.length ===0){
            return res.status(404).json({error:"user not found"})

        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password , user.password)

        if(!isMatch){
            return res.status(401).json({error:"Password is incorrect"})
        }

        const token = jwt.sign({userId:user.id} , process.env.JWT_SECRET,{expiresIn : '24h'})


        res.status(200).json({
            message:"Succefully logged in",
            token : token ,
            user:{id:user.id , email:user.email , name:user.name}
        })
    } catch (error) {
        console.error('Login error', error);
        res.status(500).json({error:'LOGIN FAILED'});
        
    }

}

module.exports = {register , login};