import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Create the connection
    this.connection = new Sequelize(databaseConfig);

    // Run through every model and call the 'static init'
    // method defined on each model passing the connection
    // above.
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
