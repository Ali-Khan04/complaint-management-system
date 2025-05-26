export const complaintsQueries = {
  createComplaint: `
    INSERT INTO Complaints (userId, description, Time)
    VALUES (@userId, @description, @Time);
    SELECT SCOPE_IDENTITY() AS complaintId;
  `,

  getComplaintsByUser: `
    SELECT complaintId, description, isReviewed, Time 
    FROM Complaints 
    WHERE userId = @userId 
    ORDER BY Time DESC
  `,

  checkComplaintOwnership: `
    SELECT complaintId
    FROM Complaints
    WHERE complaintId = @complaintId AND userId = @userId
  `,

  updateComplaint: `
    UPDATE Complaints
    SET description = @description
    WHERE complaintId = @complaintId AND userId = @userId
  `,

  deleteComplaint: `
    DELETE FROM Complaints 
    WHERE complaintId = @complaintId AND userId = @userId
  `,

  getAllComplaints: `
    SELECT * FROM Complaints 
    ORDER BY complaintId DESC
  `,

  markAsReviewed: `
    UPDATE Complaints 
    SET isReviewed = 1 
    WHERE complaintId = @complaintId
  `,
};

export const userQueries = {
  registerUser: `
    INSERT INTO User_table (userId, name, email) 
    VALUES (@userId, @name, @email)
  `,
};

// Admin Queries
export const adminQueries = {
  registerAdmin: `
    INSERT INTO Admin (adminId, name) 
    VALUES (@adminId, @name)
  `,
};
