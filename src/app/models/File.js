import Sequelize, { Model } from 'sequelize';

class File extends Model {
  // This method is called from database/index.js
  // to initialize the models.
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      {
        // The connections that was created at database/index.js
        sequelize,
      }
    );

    return this;
  }
}

export default File;
