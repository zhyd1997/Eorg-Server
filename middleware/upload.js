const multer = require("multer");
const fs = require("fs");
const User = require("../models/User");

const storage = multer.diskStorage({
	destination: async (req, file, cb) => {
		const user = await User.findById(req.user.id);
		const { username } = user;
		const dir = `./latex/${username}/images`;
		fs.mkdirSync(dir, { recursive: true });
		cb(null, dir);
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const imageFileFilter = (req, file, cb) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
		return cb(new Error("You can upload only image files!"), false);
	}
	cb(null, true);
};

const upload = multer({
	storage,
	fileFilter: imageFileFilter,
});

exports.multerUpload = upload.single("test");
