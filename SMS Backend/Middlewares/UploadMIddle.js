import multer from "multer";
import path from "path";
import fs from "fs";

// Configure dynamic storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => { 
    let folder = "uploads/others"; // default
    // Choose folder based on route or request
    if (req.originalUrl.includes("/student")) folder = "uploads/student";
    else if (req.originalUrl.includes("/teacher")) folder = "uploads/teacher";
    else if (req.originalUrl.includes("/admin")) folder = "uploads/admin";

    // Create folder if it doesn't exist
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext); // unique name
  }
});

// File filter (only images allowed)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|bmp|svg/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only image files are allowed (jpeg, jpg, png, gif, webp, bmp, svg)!"));
  }
};

// Export multer instance
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter
});

export default upload;
