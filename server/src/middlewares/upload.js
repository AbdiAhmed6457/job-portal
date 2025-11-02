import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure uploads folder exists
const uploadPath = path.join("uploads", "cvs");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },  
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
}); 

export const upload = multer({ storage });
