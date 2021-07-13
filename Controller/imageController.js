let Image = require("../models/image"); //collection
const multer = require("multer");

// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "../public/uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });
// let upload = multer({ storage: storage });

// //////////////////////////////////////// new post image data   addd ///////////////
// exports.upload.single("insert_img");
// (exports.AddImage = upload.single("insert_img")),
//   async function (req, res) {
//     console.log(req.file);

//     const { img_url, des, comment } = req.body;

//     const imag = new Image({
//       img_url: req.file.originalname,
//       des,
//       comment,
//     });

//     let imageResult = await imag
//       .save()
//       .then((doc) => {
//         return res.status(200).send(" image data sucessfull inserted");
//       })
//       .catch((err) => {
//         res.json(err);
//       });
//   };
