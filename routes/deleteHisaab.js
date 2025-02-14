const express = require("express");
const userModel = require("../models/user");
const hisaabModel = require("../models/hisaab");
const { authenticateJWT } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/delete-hisaab/:id",authenticateJWT, async (req,res)=>{
        try{
            const userId = req.user.id;
            const hisaabId = req.params.id;
            const result = await hisaabModel.findByIdAndDelete(hisaabId);

            if (result) {
                // req.flash("Hisaab deleted");
                console.log("hisaab deleted",hisaabId);
                req.flash("Hisaab deletedjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
                return res.redirect("/dashboard");
            }
        }catch(error){
            console.error("Error deleting Hisaab:", error);
        req.flash("error", "An error occurred while deleting the Hisaab.");
        res.redirect("/dashboard");
        }
});

module.exports = router;