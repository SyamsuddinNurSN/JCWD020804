import { Model, DataTypes } from 'sequelize';

export default class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    User.hasMany(models.Transaction);
    User.hasMany(models.Property);
    User.hasMany(models.Review);
  }
}

export const init = (sequelize) => {
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      isTenant: { type: DataTypes.BOOLEAN, defaultValue: false },
      no_ktp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      foto_ktp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      firebaseUID: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },

    {
      sequelize,
      modelName: 'User',
    },
  );
};
