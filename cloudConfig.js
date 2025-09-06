// const cloudinary = require("cloudinary");
// const cloudinaryStorage  = require("multer-storage-cloudinary");

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// const storage = cloudinaryStorage({
//   cloudinary: cloudinary,
//   folder: "wanderlust_DEV",
//   allowedFormats: ["jpg", "png", "jpeg"],

// });

// module.exports = {
//   cloudinary,
//   storage,
// };

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
