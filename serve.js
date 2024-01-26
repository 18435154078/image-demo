const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const app = express();

//实例化multer，传递的参数对象，dest表示上传文件的存储路径
const upload = multer({
  dest: "./public/upload",
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/upload");
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.split(".").pop();
      cb(null, crypto.randomUUID() + "." + "jpg");
    },
  }),
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("./public/"));

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.json({
      code: 200,
      msg: "上传成功",
      data: `/upload/${req.file.filename}`,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(8000, () => {
  console.log("the serve is running at port 8000");
});
