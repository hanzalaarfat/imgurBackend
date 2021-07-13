const bcrypt = require("bcrypt");
const User = require("../models/registe");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

////////////////////////////////////////// login /////////////////////////
exports.login = async (req, res) => {
  let { email, password } = req.body;
  let user = await User.find({ email });

  if (user.length != 0) {
    // first  decript password from user collecton then user enterd password mactch
    bcrypt.compare(password, user[0].password, function (err, result) {
      try {
        if (err) {
          res.send("email or password  worng");
        }
        if (result) {
          // genrate token
          let token = jwt.sign(
            {
              email: user[0].email,
              id: user[0]._id,
            },
            "credentials",
            {
              expiresIn: "1h",
            }
          );
          /////////////////////////////  token set on cookies //////
          res.cookie("jwt", token, {
            expires: new Date(Date.now() + 1000 * 60 * 45), // would expire after 45 minutes
            httpOnly: true,
          });
          res.status(200).json({
            message: "Token genrated",
            token: token,
          });
        } else {
          res.send("email or password  worng");
        }
      } catch (err) {
        console.log(err);
      }
    });
  } else {
    //not found mail
    res.send("email or password  worng");
  }
};

/////////////////////////post signup route /////////////////

exports.SignUp = async (req, res) => {
  let { name, email, password } = req.body;

  bcrypt.hash(password, 10, async function (err, hash) {
    if (err) {
      return res.json({ message: err });
    } else {
      const user = new User({
        name,
        email,
        password: hash,
      });
      console.log("password : ", hash);
      let userResult = await user
        .save()
        .then((doc) => {
          return res.status(200).send("data sucessfull inserted");
        })
        .catch((err) => {
          res.json(err);
        });
    }
  });
};
