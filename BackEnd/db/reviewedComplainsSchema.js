import sequelize from "./config.js";
import { DataTypes } from "sequelize";
const ReviewedComplaints = sequelize.define(
  "ReviewedComplaints",
  {
    reviewId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    complaintId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Complaints",
        key: "complaintId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Admin",
        key: "adminId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    complaintDescription: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    reviewedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      defaultValue: sequelize.literal("GETDATE()"),
    },
  },
  {
    tableName: "ReviewedComplaints",
    schema: "dbo",
    timestamps: false,
    freezeTableName: true,
  }
);
export default ReviewedComplaints;
