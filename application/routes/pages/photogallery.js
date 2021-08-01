var express = require('express');
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
const database = require('../../private/js/database');
var router = express.Router();
var routeProtectors = require('../../middleware/routeProtectors');



/*************************************************************************************
 * Logging function for photogallery.js
 *************************************************************************************/
function log(message, type) {
    if (type == 'success') {
        console.log(`photogallery.js:: ${message}`.bgCyan.black);
    } else if (type == "info") {
        console.log(`photogallery.js:: ${message}`.bgCyan.black);
    } else if (type == 'fail') {
        console.log(`photogallery.js:: ${message}`.italic.bgRed.black);
    }
}



var photoUploadPath = "public/images/uploads";
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, photoUploadPath)
    },
    filename: function (req, file, cb) {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});

var uploader = multer({ storage: storage });



router.get('/:photoAlbumId', routeProtectors.userIsLoggedIn, async (req, res, next) => {
    var photos;
    var invitedUsers;
    if (req.params.photoAlbumId) {
        photos = await database.getPhotosByPhotoAlbumId(req.params.photoAlbumId);
        invitedUsers = await database.getInvitedPhotoAlbumUsers(req.params.photoAlbumId);
    }
    res.render("photogallery", {
        layout: 'globetrotter',
        filename: "photogallery",
        title: "Photo Gallery",
        photoAlbumId: req.params.photoAlbumId,
        photos: photos,
        invitedUsers: invitedUsers
    });
});


router.post('/:photoAlbumId/invitedUsers/:username', routeProtectors.userIsLoggedIn, async (req, res, next) => {
    var result = await database.inviteUserToPhotoAlbum(req.params.username, req.params.photoAlbumId);
    res.redirect(`/photogallery/${req.params.photoAlbumId}`);
});


router.post('/:photoAlbumId/invitedUsers/:userId/uninvite', routeProtectors.userIsLoggedIn, async (req, res, next) => {
    var result = await database.uninviteUserFromPhotoAlbum(req.params.photoAlbumId, req.params.userId);
    res.redirect(`/photogallery/${req.params.photoAlbumId}`);
});



router.post('/:photoAlbumId/photo/upload', uploader.single('photogallery-file-picker'), async (req, res, next) => {
    if (req.params.photoAlbumId) {
        let fileName = req.file.filename.split('.')[0];
        let extension = req.file.filename.split('.')[1];
        var photoIdOut = 0;
        try {
        var result = await database.createPhoto(req.session.user.user_id, '/' + photoUploadPath + '/',
            fileName, extension, 'title',
            'description', false, photoIdOut);
        var result = JSON.parse(JSON.stringify(result));
        var photoId = result[1][0]['@photoIdOut'];

        await database.addPhotoToAlbum(req.session.user.user_id, photoId, req.params.photoAlbumId);
        log("Photo successfully uploaded.", "success");
        } catch (error) {
            log('Error uploading file', 'fail');
        }
    } else {
        log("Missing parameters", "fail");
    }
    res.redirect(`/photogallery/${req.params.photoAlbumId}`);
});



/*************************************************************************************
 * Make the router usable from other modules (mainly app.js).
 *************************************************************************************/
module.exports = router;