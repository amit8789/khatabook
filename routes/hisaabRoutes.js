const express = require("express");
const hisaabModel = require("../models/hisaab");
const { authenticateJWT } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Hisaab
router.get("/create-hisaab", authenticateJWT, (req, res) => {
    res.render("create-hisaab");
});

router.post("/create-hisaab", authenticateJWT, async (req, res, next) => {
    const { title, details, encrypt, shareable, editPermissions } = req.body;
    const userId = req.user.id;

    try {
        const newHisaab = await hisaabModel.create({
            title,
            details,
            encrypt: encrypt === "true",
            shareable: shareable === "true",
            editPermissions: editPermissions === "true",
            createdBy: userId,
            createdOn: new Date(),
        });

        console.log("New Hisaab created:", newHisaab);
        res.redirect("/dashboard");
    } catch (err) {
        next(err);
    }
});

// View Hisaab
router.get("/view-hisaab/:id", authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const hisaabId = req.params.id;
        const hisaab = await hisaabModel.findOne({ _id: hisaabId, createdBy: userId });

        if (!hisaab) {
            req.flash("error", "Hisaab not found or you do not have access.");
            return res.redirect("/dashboard");
        }

        res.render("view-hisaab", { hisaab });
    } catch (error) {
        console.error("Error fetching Hisaab:", error);
        req.flash("error", "An error occurred while fetching the Hisaab.");
        res.redirect("/dashboard");
    }
});

module.exports = router;
