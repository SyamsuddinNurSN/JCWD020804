import { Model, DataTypes } from 'sequelize';

export default class Review extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Review.belongsTo(models.User);
    Review.belongsTo(models.Property);
    Review.belongsTo(models.Transaction);
  }
}

export const init = (sequelize) => {
  Review.init(
    {
      rating: { type: DataTypes.INTEGER, allowNull: false },
      user_review: { type: DataTypes.STRING, allowNull: true },
      tenant_reply: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Review',
    },
  );
};
