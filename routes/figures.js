const express = require("express");

const { retrieve, upload } = require("../controllers/figures");

const router = express.Router();

const { protect } = require("../middleware/auth");
const { multerUpload } = require("../middleware/upload");

router.get("/:blockKey", protect, retrieve);

router.post("/upload", protect, multerUpload, upload);

module.exports = router;
