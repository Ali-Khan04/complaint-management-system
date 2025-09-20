import { DataTypes } from "sequelize";
import sequelize from "./config.js";

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
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "User_table",
    schema: "dbo",
    timestamps: false,
    freezeTableName: true,
  }
);
User.sync({ alter: true })
  .then(() => {
    console.log("User table synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing User table:", error);
  });
export default User;
