const express = require("express");
const { protect } = require("../middleware/auth");
const { getAllUsersWithPagination } = require("../controllers/admin");
const router = express.Router();


//Chartistt Admin Routes
router.route("/users/:page/:pageSize").get(getAllUsersWithPagination);


module.exports = router;