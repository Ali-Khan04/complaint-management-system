import { DataTypes } from "sequelize";
import sequelize from "../db/config.js";

const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "User_table",
    schema: "dbo",
    timestamps: true,
    freezeTableName: true,
  }
);

export default User;
