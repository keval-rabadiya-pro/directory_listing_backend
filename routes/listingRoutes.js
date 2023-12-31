const express = require("express");
const common = require("../functions/common.js");
const listing = require("../functions/listing.js");
const { jwtDecode } = require('jwt-decode');

const router = express.Router();


router.post("/add", async (req, res) => {    // requird - title, category, description   // Note: need to add array/obj type check and it's content validation from frontend side.
    const reqUserData = req.body;
    const { errors, isValid } = await listing.validateAddListingFields(reqUserData);

    if (!isValid) {
        return res.status(400).json({ success: false, error: errors });
    }

    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            reqUserData.userID = auth.userID
            let result = await listing.addListing(reqUserData)
            return res.send(result)
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    } catch (err) {
        return res.send({ success: false, error: err })
    }
});


router.put("/edit", async (req, res) => {

    // if (req.body && Object.keys(req.body).length == 0) {
    //     return res.send({ success: false, message: "Records doesn't update" });
    // }

    const reqUserData = req.body;
    const { errors, isValid } = await listing.validateEditListingFields(reqUserData);

    if (!isValid) {
        return res.status(400).json({ success: false, error: errors });
    }
    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            reqUserData.userID = auth.userID
            let result = await listing.editListing(reqUserData)
            return res.send(result)
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    } catch (err) {
        return res.send({ success: false, error: err })
    }

});


router.put("/remove", async (req, res) => {  // this will only change listing  "isListingExists"  status from  exists to  notExists.  // not delete the record/listing from listing table.       
    if (!req.body?.listingID) {
        return res.status(400).send({ success: false, message: "listingID is required" })
    }

    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            var result = await listing.deleteListing(req.body?.listingID)
            return res.json(result)
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).json(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.get("/allListing", async (req, res) => {      // for admin   // listing with owner few details
    // including 'Approved', 'Rejected', 'Pending','exists', 'notExists'
    // try {
    //     let listingsData = await listing.getAllListing();
    //     listingsData.success = true
    //     return res.send(listingsData);
    // }
    // catch (err) {
    //     var result = { success: false, error: err }
    //     return res.send(result)
    // }

    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            const payloadData = jwtDecode(req.headers["authorization"]?.split(' ')[1])?.data;

            if (payloadData.role !== "admin") {
                return res.status(403).send({ success: false, message: "Unauthorized access" });
            }

            let listingsData = await listing.getAllListing();
            listingsData.success = true;
            return res.send(listingsData);

        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.get("/allApprovedExistsListing", async (req, res) => {     // user 
    try {
        let listingsData = await listing.getAllApprovedExistsListing();
        listingsData.success = true
        return res.send(listingsData);
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.get("/myListing", async (req, res) => {     // not include deleted
    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            let listingsData = await listing.getMyListing(auth.userID);
            return res.send(listingsData);
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.get("/myPendingListing", async (req, res) => {     // not include deleted
    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            let listingsData = await listing.getMyPendingListing(auth.userID);
            return res.send(listingsData);
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.get("/myApprovedListing", async (req, res) => {     // not include deleted
    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            let listingsData = await listing.getMyApprovedListing(auth.userID);
            return res.send(listingsData);
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.get("/myRejectedListing", async (req, res) => {     // not include deleted
    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            let listingsData = await listing.getMyRejectedListing(auth.userID);
            return res.send(listingsData);
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.get("/myFavourites", async (req, res) => {  // myFavourites with listing details   // not include notExists
    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            let favListingsData = await listing.getMyFavouritesWithDetails(auth.userID);
            return res.send(favListingsData);
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.get("/myFavouritesIds", async (req, res) => {  // myfavourite listing's IDs   // including notExists
    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            let favListingsIds = await listing.getMyFavouritesListingsIDs(auth.userID);
            return res.send(favListingsIds);
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.get("/myListingReviews", async (req, res) => {  // not include notExists
    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            let resObj = await listing.myListingReviews(auth.userID);
            return res.send(resObj);
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err.toString() }
        return res.send(result)
    }
});


router.get("/myGivenReviews", async (req, res) => {   // not include notExists/deleted
    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            let resObj = await listing.myGivenReviews(auth.userID);
            return res.send(resObj);
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err.toString() }
        return res.send(result)
    }
});


router.get("/filter", async (req, res) => {       // only Approved, exists

    const { category, city } = req.body;

    if (!category && !city) {
        return res.status(400).send({ success: false, message: "city or category field required" });
    }

    try {
        let result = await listing.getListingFilterWise(req.body)
        return res.json(result)
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.json(result)
    }
});


router.get("/categoryfilter", async (req, res) => {     // only Approved, exists

    if (!req.body.category) {
        return res.send({ success: false, message: "category field required" });
    }

    try {
        let result = await listing.getListingCategoryWise(req.body);
        return res.json(result);
    }
    catch (err) {
        var result = { success: false, error: err };
        return res.json(result);
    }
});


router.get("/cityfilter", async (req, res) => {     // only Approved, exists

    if (!req.body.city) {
        return res.send({ success: false, message: "city field required" });
    }

    try {
        let result = await listing.getListingCityWise(req.body);
        return res.json(result);
    }
    catch (err) {
        var result = { success: false, error: err };
        return res.json(result);
    }
});


router.get("/:id", async (req, res) => {            // api/listing/:id    // only Approved, exists
    try {
        let listingID = req.params?.id;
        let result = await listing.getListing(listingID);
        return res.send(result);
    } catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.post("/addToFavourite", async (req, res) => {

    if (!req.body?.listingID) {
        return res.status(400).send({ success: false, message: "listingID is required" });
    }

    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            var result = await listing.addToFavourite(auth?.userID, req.body?.listingID);
            return res.json(result);
        } else {
            var resmsg = { success: false, message: "Failed auth validation" };
            return res.status(401).json(resmsg);
        }
    }
    catch (err) {
        var result = { success: false, error: err };
        return res.send(result);
    }
});


router.put("/removeFromFavourite", async (req, res) => {

    if (!req.body.listingID) {
        return res.status(400).send({ success: false, message: "listingID is required" })
    }

    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            var result = await listing.removeFromFavourite(auth?.userID, req.body?.listingID)
            return res.json(result)
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).json(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.post("/:id/review", async (req, res) => {          // user can only able to add one review to every listing of someone

    const { errors, isValid } = await listing.validateAddReviewFields(req.body);

    if (!isValid) {
        return res.status(400).json({ success: false, error: errors });
    }

    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            let resObj = await listing.addReview(auth.userID, req.params.id, req.body);
            return res.send(resObj);
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.put("/:id/review", async (req, res) => {

    const { errors, isValid } = await listing.validateEditReviewFields(req.body);

    if (!isValid) {
        return res.status(400).json({ success: false, error: errors });
    }

    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            let resObj = await listing.editReview(auth.userID, req.params.id, req.body);
            return res.send(resObj);
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.put("/statusChange", async (req, res) => {

    const { errors, isValid } = await listing.validateListingStatusChangeFields(req.body);

    if (!isValid) {
        return res.status(400).json({ success: false, error: errors });
    }

    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            const payloadData = jwtDecode(req.headers["authorization"]?.split(' ')[1])?.data;
            const adminID = payloadData.userID

            if (payloadData.role !== "admin") {
                return res.status(403).send({ success: false, message: "Unauthorized access" });
            }

            let resObj = await listing.statusChange(req.body.listingID, req.body.listingStatus, adminID);
            return res.send(resObj);

        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


router.post("/numOfListingInEachCategory", async (req, res) => {  // only Approved, exists
    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            const payloadData = jwtDecode(req.headers["authorization"]?.split(' ')[1])?.data;

            if (payloadData.role !== "admin") {
                return res.status(403).send({ success: false, message: "Unauthorized access" });
            }

            let resObj = await listing.numOfListingInEachCategory();
            return res.send(resObj);

        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});


module.exports = router;