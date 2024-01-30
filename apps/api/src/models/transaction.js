import { Model, DataTypes } from 'sequelize';

export default class Transaction extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Transaction.belongsTo(models.User);
    Transaction.belongsTo(models.Room);
    Transaction.hasOne(models.Review);
  }
}

export const init = (sequelize) => {
  Transaction.init(
    {
      checkIn: { type: DataTypes.DATEONLY, allowNull: false },
      checkOut: { type: DataTypes.DATEONLY, allowNull: false },
      total_price: { type: DataTypes.INTEGER, allowNull: false },
      total_night: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM(
          'menunggu pembayaran',
          'menunggu konfirmasi',
          'pembayaran berhasil',
          'transaksi dibatalkan',
        ),
        allowNull: true,
      },
      payment_method: {
        type: DataTypes.ENUM('bank transfer', 'otomatis'),
        allowNull: true,
      },
      bukti_pembayaran: { type: DataTypes.STRING, allowNull: true },
      isReminder: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'Transaction',
    },
  );
};
