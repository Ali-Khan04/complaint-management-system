import User from "./userSchema.js";
import Complaint from "./complainSchema.js";

Complaint.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
});

User.hasMany(Complaint, {
  foreignKey: "userId",
  sourceKey: "userId",
});

export { User, Complaint };
