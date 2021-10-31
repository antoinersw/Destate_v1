const chalk = require("chalk");
const mongoose = require("mongoose");


let checkConnection = {
  connected: 0,
};

const dbConnect = async () => {

    const db = await mongoose.connect(
      process.env.URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    
  console.log(chalk.inverse.green("connected to mongoDB"));
};

dbConnect();
