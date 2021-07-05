var express = require('express');
var router = express.Router()
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var database = require('../private/js/database');
var userIsLoggedIn = require('../middleware/routeProtectors').userIsLoggedIn;
const { Console } = require('console');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/uploads")
  },
  filename: function (req, file, cb) {
    let fileExt = file.mimetype.split('/')[1];
    let randomName = crypto.randomBytes(22).toString("hex");
    cb(null, `${randomName}.${fileExt}`);
  }
});

var uploader = multer({ storage: storage });

router.get("/search", userIsLoggedIn, (req, res, next) => {
  let searchTerm = req.query.term;
  console.log(searchTerm);
  if (!searchTerm) {
    req.flash("error", "Search term must not be empty.");
    res.redirect("/home");
  } else {
    database.getPostsBySearchTerm(searchTerm)
      .then((posts) => {
        if (posts && posts.length > 0) {
          res.render("home", {
            title: "Home",
            results: posts
          });
        } else {
          req.flash("error", "No posts found.");
          res.redirect("/home");
        }
      })
      .catch((error) => next(error));
  }
});

router.get(`/:id`, userIsLoggedIn, (req, res, next) => {

  //This logic should be moved to another function.
  if ((UUID_REGEX.exec(req.params.id)) == null) {
    console.log(`PostID ${req.params.id} is not a valid uuid.`);
    return next();
  }

  var post = database.getPostWithComments(req.params.id)
    .then((post) => {
      if (post) {
        console.log(`Fetched post. ${post.id}`);
        res.render("imagepost", {
          title: "Image Post",
          currentPost: post
        });
      } else {
        throw new Error(`PostID ${req.params.id} not found.`);
      }
    })
    .catch((e) => {
      console.log(e.message);
      req.flash("error", e.message);
      res.redirect("/home");
    });
});

router.post(`/:id/createcomment`, userIsLoggedIn, (req, res, next) => {
  if ((UUID_REGEX.exec(req.params.id)) == null) {
    console.log(`PostID ${req.params.id} is not a valid uuid.`);
    return next();
  }

  let fk_postid = req.params.id;
  let fk_userid = req.session.userid;
  let text = req.body.text;

  if (text) {
    database.createComment(fk_postid, fk_userid, text)
      .then((comment) => {
        if (comment) {
          req.flash("success", "Comment created successfully.");
          res.redirect(`/posts/${req.params.id}`);
        } else {
          throw new Error("Error creating comment.", "/home", 200);
        }
      })
      .catch((e) => {
        req.flash("error", e.message);
        res.redirect("/home")
      });
  } else {
    req.flash("error", "Comment cannot be blank.");
    res.redirect(`/posts/${req.params.id}`);
  }
});

router.post('/createpost', userIsLoggedIn, uploader.single("imageUploadFile"), (req, res, next) => {
  let title = req.body.title;
  let description = req.body.description;
  let imagePath = req.file.path.split("\\").join("/");
  let thumbnailName = `thumbnail-${req.file.filename}`;
  let thumbnailPath = req.file.destination + "/" + thumbnailName;
  let fk_userid = req.session.userid;

  sharp(imagePath)
    .resize(200, 200, {
      fit: sharp.fit.cover,
    })
    .toFile(thumbnailPath)
    .then(() => {
      return database.createPost(title, description, imagePath, thumbnailPath, fk_userid);
    })
    .then((post) => {
      if (post) {
        req.flash("success", "Post created successfully.");
        res.redirect("/home");
      } else {
        throw new Error("Error creating post.", "/postimage", 200);
      }
    })
    .catch((e) => {
      console.log(e.message);
      req.flash("error", e.message);
      res.redirect("/home");
    });

});

router.use((req, res) => {
  console.log(`posts.js::errorTrap ${req.url}`);
  req.flash("error", "Couldn't find anything there.");
  res.redirect("/");
});

module.exports = router;