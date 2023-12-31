const express = require("express");
const city = require("../functions/city.js");
const common = require("../functions/common.js");
const { jwtDecode } = require('jwt-decode');
const router = express.Router();

router.post("/add", async (req, res) => {  //  cityName

    if (!req.body.cityName) {
        return res.status(400).send({ success: false, message: "City Name is required" })
    }

    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            const payloadData = jwtDecode(req.headers["authorization"]?.split(' ')[1])?.data;

            if (payloadData.role !== "admin") {
                return res.status(403).send({ success: false, message: "Unauthorized access" });
            }

            var result = await city.addCity(req.body);
            return res.send(result);

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

router.put("/edit", async (req, res) => {

    const reqUserData = req.body;  // cityID, cityName
    const { errors, isValid } = city.validateEditCity(reqUserData);

    if (!isValid) {
        return res.status(400).send({ success: false, error: errors })
    }

    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            const payloadData = jwtDecode(req.headers["authorization"]?.split(' ')[1])?.data;

            if (payloadData.role !== "admin") {
                return res.status(403).send({ success: false, message: "Unauthorized access" });
            }

            var result = await city.editCity(req.body)
            return res.send(result)
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
})

router.delete("/remove", async (req, res) => {

    const reqUserData = req.body;  // cityID

    if (!reqUserData.cityID) {
        return res.status(400).send({ success: false, message: 'cityID is required' })
    }

    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            const payloadData = jwtDecode(req.headers["authorization"]?.split(' ')[1])?.data;

            if (payloadData.role !== "admin") {
                return res.status(403).send({ success: false, message: "Unauthorized access" });
            }

            var result = await city.deleteCity(req.body)
            return res.send(result)
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
})

router.get("/allCity", async (req, res) => {
    try {
        // var auth = common.validAuthHeader(req)

        // if (auth.validated == true) {
        var result = await city.getAllCity();
        return res.send(result)
        // } else {
        //     var resmsg = { success: false, message: "Failed auth validation" }
        //     return res.status(401).send(resmsg)
        // }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
});

router.get("/", async (req, res) => {
    const reqUserData = req.body;  // cityID

    if (!reqUserData.cityID) {
        return res.status(400).send({ success: false, message: 'cityID is required' })
    }

    try {
        var auth = common.validAuthHeader(req)

        if (auth.validated == true) {
            var result = await city.getCityDetail(reqUserData.cityID)
            return res.send(result)
        } else {
            var resmsg = { success: false, message: "Failed auth validation" }
            return res.status(401).send(resmsg)
        }
    }
    catch (err) {
        var result = { success: false, error: err }
        return res.send(result)
    }
})

module.exports = router