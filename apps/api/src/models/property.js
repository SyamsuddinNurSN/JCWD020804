import { Model, DataTypes } from 'sequelize';

export default class Property extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Property.hasMany(models.Room)
    Property.hasMany(models.Review)
    Property.belongsTo(models.User)
    Property.belongsTo(models.Location)
    Property.belongsTo(models.Property_category)

  }
}

export const init = (sequelize) => {
  Property.init({
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true},
    picture: {type: DataTypes.STRING, allowNull: true}
  }, {
    sequelize,
    modelName: 'Property',
  });
};