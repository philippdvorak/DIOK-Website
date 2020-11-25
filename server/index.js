const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const _ = require("lodash");
const path = require('path');

const app = express();

app.use(fileUpload({
    createParentPath: true
}));

app.use(express.static(__dirname + '/uploads'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;

//Upload Event Images sorted by Comment
app.post('/images/upload/events/', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: "No File to Upload"
            });
        } else {
            let data = [];
            let komID = 10; //Get id of last Comment send to db
            let eID = 1020; //Get id of event from Comment ID

            _.forEach(
                _.keysIn(req.files.uploaded), key => {
                    let img = req.files.uploaded[key];

                    img.mv("./uploads/events/" + eID + "/comment" + komID + "/" + img.name);

                    data.push({
                        name: img.name,
                        mimetype: img.mimetype,
                        size: img.size
                    });
                }
            );
            res.redirect(301, "http://localhost:3000/events/" + eID);
        }
    } catch (err) {
        console.log(err);
    }
});

app.post('/images/upload/projects/', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: "No File to Upload"
            });
        } else {
            let data = [];
            let komId = 10; //Get ID from last inserted Comment
            let pId = 1;    //Get ID from project, where comment belongs

            _.forEach(
                _.keysIn(req.files.uploaded), key => {
                    let img = req.files.uploaded[key];

                    img.mv("./uploads/projects/" + pId + "/comment" + komID + "/" + img.name);

                    data.push({
                        name: img.name,
                        mimetype: img.mimetype,
                        size: img.size
                    });
                }
            );
            res.redirect(301, "http://localhost:3000/events/" + pID);
        }
    } catch (err) {
        console.log(err);
    }
});

//Upload News Images
app.post('/images/upload/news/', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: "No File to Upload"
            });
        } else {
            let data = [];
            let ID = req.query.id; //Get id from News

            _.forEach(
                _.keysIn(req.files.uploaded), key => {
                    let img = req.files.uploaded[key];

                    img.mv("./uploads/news/" + ID + "/" + img.name);

                    data.push({
                        name: img.name,
                        mimetype: img.mimetype,
                        size: img.size
                    });
                }
            );
            res.redirect(301, "http://localhost:3000/news/" + ID);
        }
    } catch (err) {
        console.log(err);
    }
});

//Upload Product Images
app.post('/images/upload/products/', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: "No File to Upload"
            });
        } else {
            let data = [];
            let ID = req.query.id; //Get id from GET Parameter

            _.forEach(
                _.keysIn(req.files.uploaded), key => {
                    let img = req.files.uploaded[key];

                    img.mv("./uploads/products/" + ID + "/" + img.name);

                    data.push({
                        name: img.name,
                        mimetype: img.mimetype,
                        size: img.size
                    });
                }
            );
            res.redirect(301, "http://localhost:3000/products/" + ID);
        }
    } catch (err) {
        console.log(err);
    }
});

//Upload Product Images
app.post('/images/upload/mitglied/', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: "No File to Upload"
            });
        } else {
            let data = [];
            let ID = req.query.id; //Get id from GET Parameter

            _.forEach(
                _.keysIn(req.files.uploaded), key => {
                    let img = req.files.uploaded[key];

                    if(img.name.contains("portrait")) {
                        img.mv("./uploads/mitglied/" + ID + "/" + img.name);
                    } else {
                        //TODO: Rename image to portrati.fileEnding ...
                    }

                    data.push({
                        name: img.name,
                        mimetype: img.mimetype,
                        size: img.size
                    });
                }
            );
            res.redirect(301, "http://localhost:3000/products/" + ID);
        }
    } catch (err) {
        console.log(err);
    }
});

// Get Images in Folder and Subfolders
app.get("/images", async (req, res) => {

    filewalker(__dirname + "/" + req.query.path, (err, success) => {

        if (err) {
            res.status(404);
            console.log(err);
        }

        res.send({
            status: true,
            message: "Success",
            data: success
        });
    });
});

app.get("/newsletter/unsubscribe", async (req, res) => {
    if(req.query.mail) {
        //Update Newsletter DB and remove given mail address
        //Remove this mail from any Mailverteiler

        res.status(200);
        res.send({
           success: true,
           message: "Sie wurden erfolgreich vom Newsletter abgemeldet."
        });
    } else {
        res.status(404);
        res.send({
            success: false,
            message: "Es konnte keine Mail Adresse gefunden werden."
        });
    }
})

app.listen(PORT, () => {
    console.log("App is Running on " + PORT);
});

const fs = require('fs');

function filewalker(dir, done) {
    let results = [];

    fs.readdir(dir, function (err, list) {
        if (err) return done(err);

        var pending = list.length;

        if (!pending) return done(null, results);

        list.forEach(function (file) {
            file = dir + "/" + file;

            fs.stat(file, function (err, stat) {
                // If directory, execute a recursive call
                if (stat && stat.isDirectory()) {
                    // Add directory to array [comment if you need to remove the directories from the array]
                    //results.push(file);

                    filewalker(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(path.relative(process.cwd(), file).replace("\\", "/"));

                    if (!--pending) done(null, results);
                }
            });
        });
    });
}