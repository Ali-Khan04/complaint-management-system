import User from "./userSchema.js";
import Complaint from "./complainSchema.js";
import ReviewedComplaints from "./reviewedComplainsSchema.js";
import Admin from "./adminSchema.js";

Complaint.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
});

User.hasMany(Complaint, {
  foreignKey: "userId",
  sourceKey: "userId",
});
Complaint.hasMany(ReviewedComplaints, {
  foreignKey: "complaintId",
  sourceKey: "complaintId",
});

ReviewedComplaints.belongsTo(Complaint, {
  foreignKey: "complaintId",
  targetKey: "complaintId",
});
Admin.hasMany(ReviewedComplaints, {
  foreignKey: "adminId",
  sourceKey: "adminId",
});

ReviewedComplaints.belongsTo(Admin, {
  foreignKey: "adminId",
  targetKey: "adminId",
});

export { User, Complaint, ReviewedComplaints, Admin };
