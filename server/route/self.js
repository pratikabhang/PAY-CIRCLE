const express = require("express");
const router = express.Router();

const {getSelf, addEntry, roundUp} = require("../controller/Self");
const {auth} = require("../middleware/authMiddleware");

router.get("/",auth,getSelf);
router.post("/:selfId",auth,addEntry);
router.post("/roundup/:id",auth,roundUp);

module.exports = router;
