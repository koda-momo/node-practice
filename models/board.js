"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Board.belongsTo(models.User);
    }
  }
  Board.init(
    {
      userId: DataTypes.INTEGER,
      message: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Board",
    }
  );
  return Board;
};
