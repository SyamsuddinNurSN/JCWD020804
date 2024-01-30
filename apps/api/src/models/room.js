import { Model, DataTypes } from 'sequelize';

export default class Room extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Room.hasMany(models.Transaction);

    // Definisi relasi Room ke Property
    Room.belongsTo(models.Property);
    // Definisi relasi Room ke Room_disable
    Room.hasOne(models.Room_disable);
    Room.hasOne(models.Price_increase);
  }
}

export const init = (sequelize) => {
  Room.init(
    {
     
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Room',
    },
  );
};
