const chalk = require("chalk");
const mongoose = require("mongoose");


let checkConnection = {
  connected: 0,
};

const dbConnect = async () => {
  if (checkConnection.connected === 1) {
    return;
  } else {
    const db = await mongoose.connect(
      process.env.URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    checkConnection.connected = db.connections[0]._readyState;
    
  }

  console.log(chalk.inverse.green("connected to mongoDB"));
};

dbConnect();
