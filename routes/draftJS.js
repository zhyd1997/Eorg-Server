const express = require("express");

const router = express.Router();
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const fs = require("fs");
const { finished } = require("stream");
const { promisify } = require("util");

const finishedAsync = promisify(finished);
const archiver = require("archiver");
const path = require("path");
const { exec } = require("child_process");

const jwt = require("jsonwebtoken");
const auth = require("../auth");
const User = require("../models/user");

function getUserId(request) {
  const userToken = request.headers.authorization;
  const token = userToken.split(" ");
  const decoded = jwt.verify(token[1], process.env.secretKey);
  const userId = decoded._id;

  return userId;
}

function findUser(request) {
  return User.findOne({ _id: getUserId(request) });
}

function sendFile(request, response, fileExtension, contentType) {
  findUser(request).then((user) => {
    // Do something with the user
    const { username } = user;

    console.log(`sending ${fileExtension}...\n`);
    const tempFile = `./latex/${username}/main/main.${fileExtension}`;
    fs.readFile(tempFile, (err, data) => {
      response.contentType(contentType);
      response.send(data);
    });
    console.log("\nsent done...\n");
    // return res.send(200);
  });
}

/**
 * 1. get raw latex code
 * 2. write it into `.tex` file
 * 3. compile it
 * 4. return the `pdf` file
 */

/* GET users listing. */
router.get("/zip", auth.verifyUser, (req, res) => {
  findUser(req).then((user) => {
    const { username } = user;
    console.log("sending zip archive...\n");
    const output = fs.createWriteStream(`./latex/${username}/main.zip`);
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });
    output.on("close", () => {
      console.log(`${archive.pointer()} total bytes`);
      console.log(
        "archiver has been finalized and the output file descriptor has closed."
      );
    });
    output.on("end", () => {
      console.log("Data has been drained");
    });
    archive.pipe(output);
    archive.directory(`./latex/${username}/main`, false);
    archive.finalize();
    fs.readFile(`./latex/${username}/main.zip`, (err, data) => {
      res.contentType("application/zip");
      res.send(data);
    });
    console.log("\nsending done...\n");
  });
});

router.get("/pdf", auth.verifyUser, (req, res, next) => {
  sendFile(req, res, "pdf", "application/pdf");
});

router.get("/tex", auth.verifyUser, (req, res, next) => {
  sendFile(req, res, "tex", "application/x-tex");
});

router.post("/tex", auth.verifyUser, (req, res) => {
  const { body } = req;
  console.log(body);

  findUser(req).then((user) => {
    // Do something with the user
    const { username } = user;
    fs.mkdirSync(`./latex/${username}`, { recursive: true });

    fs.writeFile(`./latex/${username}/main.bib`, "", (err) => {
      if (err) {
        console.log("new file err", err);
        return;
      }
      console.log("writing...");
    });

    for (const item of Object.values(body)) {
      console.log("hhhhhhhhh, Sync.........");
      try {
        fs.appendFileSync(
          `./latex/${username}/main.bib`,
          `${item}\r\n` + "\r\n"
        );
      } catch (err) {
        console.log("append err", err);
        return;
      }
    }

    res.json({
      status: "success",
      body,
    });
  });
});

router.post("/", auth.verifyUser, (req, res, next) => {
  findUser(req).then((user) => {
    // Do something with the user
    const { username } = user;
    let isBib = false;
    fs.mkdirSync(`./latex/${username}`, { recursive: true });

    try {
      if (fs.existsSync(`./latex/${username}/main.bib`)) {
        isBib = true;
        console.log("-----------------main.bib--------------");
      } else {
        isBib = false;
        console.log("--------------no bib here--------------");
      }
    } catch (err) {
      console.error(err);
    }
    console.log(isBib);

    empty(username, isBib);

    setTimeout(() => insertBegin(username, isBib), 3000);
    // return res.send(200);
  });
  /**
   * compile
   * await -> insert `end` template
   * await -> append content
   * await -> insert `begin` template
   * await -> empty `latex` dir
   */
  const { body } = req;
  console.log(body);

  function catchError(error) {
    console.log("error");
    res.json({
      status: "error",
      body: error,
    });
    return null;
  }

  function RenameFiles(user, isBib) {
    const files = isBib
      ? ["main.tex", "main.bib", "main.pdf"]
      : ["main.tex", "main.pdf"];
    files.forEach((file) => {
      fs.rename(
        `./latex/${user}/${file}`,
        `./latex/${user}/main/${file}`,
        (err) => {
          if (err) {
            catchError(err);
          }
          console.log(`Rename ${file} complete!`);
        }
      );
    });
  }

  function empty(user, isBib) {
    console.log("[1/5] empty ...........");
    const dir = `./latex/${user}`;

    fs.readdir(dir, (err, files) => {
      if (err) {
        catchError(err);
      }

      for (const file of files) {
        const filename = path.basename(file);
        console.log(filename);
        if (isBib) {
          if (
            filename !== "main" &&
            filename !== "main.bib" &&
            filename !== "images"
          ) {
            fs.unlink(path.join(dir, file), (err1) => {
              console.log(filename, "has been removed!");
              if (err1) {
                catchError(err1);
              }
            });
          }
        } else if (filename !== "main" && filename !== "images") {
          fs.unlink(path.join(dir, file), (err1) => {
            console.log(filename, "has been removed!");
            if (err1) {
              catchError(err1);
            }
          });
        }
      }
    });
  }

  function insertBegin(user, isBib) {
    console.log("[2/5] insertBegin........");
    console.log("-----------begin-----------\n");

    let readStream;
    const writeStream = fs.createWriteStream(`./latex/${user}/main.tex`);

    if (isBib) {
      readStream = fs.createReadStream("./latex/latexmk_begin_template.tex");
    } else {
      readStream = fs.createReadStream("./latex/xelatex_begin_template.tex");
    }

    (async function run() {
      try {
        readStream.pipe(writeStream);
        await finishedAsync(readStream);
        console.log("Readable is being consumed");

        appendContent(user, isBib);
      } catch (err) {
        console.error("insertBegin error", err);
      }
    })();
  }

  function appendContent(user, isBib) {
    console.log("[3/5] appendContent ............");
    for (let i = 0; i < body.length; i += 1) {
      try {
        fs.appendFileSync(
          `./latex/${user}/main.tex`,
          `${body[i]}\r\n` + "\r\n"
        );
      } catch (err) {
        console.log("append err", err);
        return;
      }
    }
    appendEnd(user, isBib);
  }

  function appendEnd(user, isBib) {
    console.log("[4/5] appendEnd ................\n");
    let end;
    if (isBib) {
      end =
        "\\printbibliography[heading=bibliography,title=参考文献]\r\n\\end{document}";
    } else {
      end = "\\end{document}";
    }
    try {
      fs.appendFileSync(`./latex/${user}/main.tex`, end);
    } catch (err) {
      console.log("end err", err);
      return;
    }
    console.log("\n----------- end -----------\n");
    compileTeX(user, isBib);
  }

  function compileTeX(user, isBib) {
    console.log("[5/5] compile ..................");
    console.log("...xelatex is running...\n");

    isBib
      ? exec(
          `cd ./latex/${user} && latexmk -xelatex main.tex`,
          (error, stdout, stderr) => {
            if (error instanceof Error) {
              catchError(error);
            }
            console.log("stdout: \n", stdout);
            console.log("stderr: \n", stderr);
            console.log("...latexmk finished...\n");
            fs.mkdirSync(`./latex/${user}/main`, { recursive: true });
            RenameFiles(user, isBib);

            res.json({
              status: "success",
              body,
            });
          }
        )
      : exec(
          `cd ./latex/${user} && xelatex main.tex`,
          (error, stdout, stderr) => {
            if (error instanceof Error) {
              catchError(error);
            }
            console.log("stdout: \n", stdout);
            console.log("stderr: \n", stderr);
            console.log("...xelatex finished...\n");
            fs.mkdirSync(`./latex/${user}/main`, { recursive: true });

            RenameFiles(user, isBib);

            res.json({
              status: "success",
              body,
            });
          }
        );
  }
});

module.exports = router;
