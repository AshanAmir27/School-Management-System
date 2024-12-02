const bcrypt = require("bcrypt");
const db = require("../config/db");

const getLeave = (req, res) => {
    const { teacher_id, leave_start_date, leave_end_date, leave_reason } =
      req.body;
  
    const query = `INSERT INTO leave_requests (teacher_id, leave_start_date, leave_end_date, leave_reason) 
                   VALUES (?, ?, ?, ?)`;
  
    db.query(
      query,
      [teacher_id, leave_start_date, leave_end_date, leave_reason],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .send("Error occurred while submitting the leave request");
        }
        res.status(200).send("Leave request submitted successfully");
      }
    );
  };
  

module.exports = {
    getLeave
}