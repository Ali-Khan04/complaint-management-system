import { DataTypes } from "sequelize";
import sequelize from "./config.js";

const Admin = sequelize.define(
  "Admin",
  {
    adminId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "Admin",
    schema: "dbo",
    timestamps: false,
    freezeTableName: true,
  }
);
export default Admin;
