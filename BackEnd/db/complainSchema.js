import sequelize from "./config.js";
import { DataTypes } from "sequelize";

const Complaint = sequelize.define(
  "Complaint",
  {
    complaintId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: "User_table",
        key: "userId",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    Time: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "Time",
      defaultValue: DataTypes.NOW,
    },
    isReviewed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "Complaints",
    schema: "dbo",
    freezeTableName: true,
    timestamps: false,
  }
);

export default Complaint;
