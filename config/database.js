const mongoose = require("mongoose");

const dbConnect = () =>
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => console.log(`Database Connected :${conn.connection.host}`))
    
module.exports = dbConnect;
