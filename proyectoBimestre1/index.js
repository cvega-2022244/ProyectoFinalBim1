import { initServer } from "./configs/app.js"
import { connect } from "./configs/mongo.js"
import { defaultAdmin } from "./src/user/user.controller.js"
import { defaultCategory } from "./src/category/category.controller.js"
import { defaultClient } from "./src/user/user.controller.js"



initServer()
connect()
defaultAdmin()
defaultCategory()
defaultClient()
