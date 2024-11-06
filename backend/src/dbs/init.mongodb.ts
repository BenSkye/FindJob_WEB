import mongoose from 'mongoose';
import { countConnect } from '../helpers/check.connect';
import config from '../configs/config.mongodb';
const { user, host, password, name } = config.db;
const connectString = `mongodb+srv://${user}:${password}@${host}/${name}?retryWrites=true&w=majority&appName=Cluster0`;
console.log('connectString', connectString);
class Database {
  private static instance: Database;

  constructor() {
    this.connect();
  }
  //connect
  connect(type = 'mongodb') {
    // if (1 === 1) {
    //   mongoose.set('debug', true);
    //   mongoose.set('debug', { color: true });
    // }

    mongoose
      .connect(connectString, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
      })
      .then((_) => {
        countConnect();
        console.log('Connected to MongoDB');
      })
      .catch((err) => console.error('Error connecting to MongoDB!', err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongodb = Database.getInstance();

export default instanceMongodb;
