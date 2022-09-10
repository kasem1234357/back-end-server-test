const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

const validReaquest = (req,res,next)=>{
  if(Object.keys(req.body).length === 0){
    res.status(500).json({massege:'you dont across data to the backEnd server check your code ,are you stupid?? 🤪🤪'}) 
    return 0
  }
    next()
}
//REGISTER
router.post("/register",validReaquest, async (req, res) => {
  const {password,username,email,...otherProps} = req.body
  
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
       ...otherProps
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err)
    res.status(500).json({massege:'error'})
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    res.status(200).json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

module.exports = router;
