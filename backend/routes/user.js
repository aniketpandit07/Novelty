const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./userAuth")

//sign up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        //check username length
        if (username.length < 4) {
            return res.status(400).json({ message: "username at least 4 length" });
        }

        //check username already exist or not
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exist" });
        }

        //check email already exist or not
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exist" });
        }

        //check passwords length
        if (password.length <= 5) {
            return res
                .status(400)
                .json({ message: "Password length must be greater than 5" });
        }
        const hashPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            address: address,
        });

        await newUser.save();
        res.status(200).json({ message: "Sign-up Successfull" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//sign-in
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            res.status(400).json({ message: "Invalid credentials" });
        }
        await bcrypt.compare(password, existingUser.password, (err, data) => {
            if (data) {
                const authClaims = [
                    {name:existingUser.username},
                    {role: existingUser.role}
                ];
                const token = jwt.sign({authClaims}, "bookstore123", {expiresIn: "30d"})
                res.status(200).json({ id: existingUser._id, role : existingUser.role, token: token });
            } else {
                res.status(400).json({ message: "Invalid password" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//get user info
router.get("/get-user-information",authenticateToken,  async (req, res)=>{
    try {
        const {id} = req.headers;
        const data = await User.findById(id).select("-password")
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

//update address
router.put("/update-address", authenticateToken, async (req, res)=>{
    try {
        const {id} = req.headers;
        const {address} = req.body;
        await User.findByIdAndUpdate(id, {address: address})
        res.status(200).json({message: "Address Updated!"})
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
        
    }
})
module.exports = router;
