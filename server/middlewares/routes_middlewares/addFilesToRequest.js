const multer = require("multer");
module.exports = (fieldName = "image") => {
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + "-" + file.originalname);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("only support png,jpeg and jpg :("), false);
    }
  };

  return multer({ storage, fileFilter, limits: { fileSize: 99999 } }).single(
    fieldName
  );
};
