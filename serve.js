const express = require("express");
const request = require("request");
const multer = require("multer");
const { createProxyMiddleware } = require("http-proxy-middleware");
const crypto = require("crypto");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("./public/"));

app.use(
  "/api",
  createProxyMiddleware({
    target: "https://www.storkapp.me",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
  })
);

app.get("/proxy", (req, res) => {
  const url = req.query.url; // 获取传入的URL参数
  if (!url || !/^https?:\/\/.+/.test(url)) {
    return res.status(400).send("Invalid URL!");
  }
  // 向目标地址发送GET请求，并将返回结果写入response流中
  request({ uri: url }).pipe(res);
});

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

app.post("/uploadPdf", (req, res) => {
  try {
    console.log(req.body);
    // res.json({
    //   code: 200,
    //   msg: "上传成功",
    //   data: `/upload/${req.file.filename}`,
    // });
  } catch (error) {
    console.log(error);
  }
});

app.listen(8000, () => {
  console.log("the serve is running at port 8000");
});
