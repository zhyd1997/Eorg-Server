const cors = require("cors");

const whitelist = [
	"http://139.196.180.153:3000",
	"http://139.196.180.153",
	"http://localhost:3000",
	"http://localhost:8080",
	"http://139.196.180.153:8080",
	"http://139.196.180.153:80",
];

const corsOptionsDelegate = (req, callback) => {
	let corsOptions;
	// console.log(req.header("Origin"));
	if (whitelist.indexOf(req.header("Origin")) !== -1) {
		corsOptions = { origin: true };
	} else {
		corsOptions = { origin: false };
	}
	callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
