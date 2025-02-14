const express = require("express");
const userModel = require("../models/user");
const hisaabModel = require("../models/hisaab");
const { authenticateJWT } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        const username = user ? user.name : "User";

        let { filterDate, sortOrder, encryptionFilter } = req.query;
        const query = { createdBy: userId };

        if (filterDate) {
            const date = new Date(filterDate);
            query.createdOn = { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) };
        }

        if (encryptionFilter === "encrypted") {
            query.encrypt = true;
        } else if (encryptionFilter === "non-encrypted") {
            query.encrypt = false;
        }

        const sortOptions = sortOrder === "oldest" ? { createdOn: 1 } : { createdOn: -1 };
        const hisaabs = await hisaabModel.find(query).sort(sortOptions);

        res.render("dashboard", { username, hisaabs, filterDate, sortOrder, encryptionFilter });
    } catch (error) {
        console.error("Error fetching Hisaabs:", error);
        res.status(500).send("Error fetching data from the database");
    }
});

module.exports = router;
