import { Model, DataTypes } from 'sequelize';

export default class Property_category extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Property_category.hasOne(models.Property)
  }
}

export const init = (sequelize) => {
  Property_category.init({
    categories: {type: DataTypes.STRING, allowNull: false}
  }, {
    sequelize,
    modelName: 'Property_category',
  });
};