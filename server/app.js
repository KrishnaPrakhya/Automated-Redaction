const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const app=express()
app.use(cors())
app.use(express.json())
app.use("/upload",express.static("upload"));
const multer  = require('multer')
require('dotenv').config();
const mongoDBURI=process.env.MONGO_API

mongoose.connect(mongoDBURI,{
  useNewUrlParser:true,
})
.then(()=>{
  console.log("Connected To Database")
})
.catch((e)=>{
  console.log(e)
})

const fileSchema=new mongoose.Schema({
  title:String,
  originalFile:String,
  redactedFile:String
},{collection:"files"})
const File=mongoose.model("files",fileSchema)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
  
    const uniqueSuffix = Date.now() 
    cb(null, uniqueSuffix+file.originalname)
  }
})

const upload = multer({ storage: storage });

app.post(
  "/uploadFiles",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "redacted", maxCount: 1 },
  ]),
  async (req, res) => {
    const title = req.body.title;
    const originalFile = req.files.file?.[0]?.filename;
    const redactedFile = req.files.redacted?.[0]?.filename;
    if (!originalFile || !redactedFile) {
      return res.status(400).json({ message: "Both files are required" });
    }

    try {
      await File.create({
        title,
        originalFile,
        redactedFile,
      });
      res.status(200).json({ message: "Files uploaded successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading files", error });
    }
  }
);

app.get('/getFiles',async(req,res)=>{
  const data=await File.find({});
  const body=data.map((item)=>(
      {
        originalFile:item.originalFile,
        title:item.title,
        redactedFile:item.redactedFile
      }
  )
  )
  res.status(200).json({message:"files",files:body})
})


app.listen(4000,()=>{
  console.log("Server has been Started")
})
