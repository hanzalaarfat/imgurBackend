var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var mongoose = require("mongoose");
let User = require("./models/registe");
let Image = require("./models/image"); //collection
let env = require("dotenv");
var cors = require("cors");
// require("dotenv").config();

const multer = require("multer");
const checkauth = require("./middleware/auth");
const userRoutes = require("./router/userRouter");
const ImageRoutes = require("./router/image.Router");
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
let upload = multer({ storage: storage });
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/user", userRoutes);
app.use("/image", ImageRoutes);

var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;

// dotenv.config({ path: "./config.env" });
// const Db = process.env.DATABASE;
env.config();
// mongoose.set("useCreateIndex", true);

////////////////////////////// mongoose connection  /////////////////////

mongoose.connect(
  process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.log("Error in connecting mongoose", err);
      return;
    }
    console.log("MongoDB Connected");
  }
);

app.get("/", function (req, res) {
  //console.log(` cookies value :${req.cookies.jwt}`);
  console.log(req.userData);
  res.status(200).json({ message: "Home page" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login Page" });
});

// sigup route get form
app.get("/signup", (req, res) => {
  res.render("signup", { title: "Signup Page" });
});

app.get("/new", checkauth, (req, res) => {
  res.send("user data input page ");
});
//////////////////////////////////////// new post image data   addd ///////////////

app.post(
  "/newpost",
  upload.single("insert_img"),

  async function (req, res) {
    console.log(req.file);

    const { img_url, des, comment } = req.body;

    const imag = new Image({
      img_url: req.file.originalname,
      des,
      comment,
    });

    let imageResult = await imag
      .save()
      .then((doc) => {
        return res.status(200).send(" image data sucessfull inserted");
      })
      .catch((err) => {
        res.json(err);
      });
  }
);
/////////////////////////////////// get all image data  or view //////////////////

app.get("/getall", async function (req, res) {
  let get_all_img = await Image.find({}, (err, img_data) => {
    let imag_map = {};
  });
  console.log(get_all_img);
  res.send(get_all_img);
});
//////////////////////  get single data ///////////////////////////////////////////
app.get("/getsingle/:id", checkauth, async (req, res) => {
  let id = req.params.id;
  try {
    let single_data = await Image.findOne({ _id: req.params.id });
    res.send(single_data);
  } catch (err) {
    res.status(500).send(`error message :${err}`);
  }
});

//////////////////////////////////// delet ////////////////////////////////////

app.get("/delete/:id", checkauth, async (req, res) => {
  let id = req.params.id;
  try {
    let deleted_data = await Image.deleteOne({
      _id: id,
    });
    res.send(deleted_data);
  } catch (err) {
    res.status(500).send(`error message :${err}`);
  }
});

////////////////////////// Edit  or uptate//////////////////////

//// its throw same error

app.put("/edit/:id", checkauth, async (req, res) => {
  /// pending for testing
  let id = req.params.id; // updated deta ko le ke update krna h
  try {
    let updated_data = await Image.findOneAndUpdate(
      {
        _id: id,
      },
      req.body, //  all properties can be updated
      {
        new: true,
        runValidators: true,
      }
    );

    res.send(updated_data);
  } catch (err) {
    res.status(500).send(`error message :${err}`);
  }
});
/////////////////////////// like image    ////////////////////////////////////

app.post("/onLiked/:id", checkauth, async (req, res) => {
  let id = req.params.id;
  console.log(id);
  try {
    let likedImage = await Image.findById({ _id: id });
    likedImage.like = likedImage.like + 1;
    console.log(likedImage.like);
    await likedImage.save();
    res.status(200).send("Image liked by ", likedImage.like);
  } catch (err) {
    res.status(400).send(err);
  }
});

/////////////////////// comment /////////////
app.post("/onComment/:id", async (req, res) => {
  try {
    let comment_data = req.body;
    let id = req.params.id;
    console.log(comment_data.comment);
    console.log(id);

    let commentedImage = await Image.findById({ _id: id });
    commentedImage.push({ comment: comment_data });
    // let commentLength = commentedImage.comment.length;
    // console.log("length", commentLength);
    // let allcom = commentedImage.comment.push(comment_data);
    // console.log("all", allcom);
    // commentedImage.commentCount = commentedImage.commentCount + 1;
    // commentedImage.comment[commentCount] = comment;
    await commentedImage.save();
    res.status(200).send(commentedImage);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listining at port :  ${server_port} `);
});
