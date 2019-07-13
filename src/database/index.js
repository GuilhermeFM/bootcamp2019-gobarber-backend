import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Create the connection
    this.connection = new Sequelize(databaseConfig);

    // Run through every model and call 'static init'
    // and 'static associate' (if defined) methods defined
    // on each model passing the connection above.
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
