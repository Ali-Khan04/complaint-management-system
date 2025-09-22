import User from "./userSchema.js";
import Complaint from "./complainSchema.js";
import ReviewedComplaints from "./reviewedComplainsSchema.js";

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

export { User, Complaint, ReviewedComplaints };
