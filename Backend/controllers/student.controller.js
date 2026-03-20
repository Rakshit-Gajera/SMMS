const db = require("../config/db");

function getAllStudents(req,res){
    const sql = `
        SELECT s.*, sm.StaffID as mentorId 
        FROM Student s
        LEFT JOIN StudentMentor sm 
          ON s.StudentID = sm.StudentID 
         AND sm.ToDate IS NULL
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
}

function postStudent(req,res){
    const sql = `INSERT INTO student
                (StudentName, EnrollmentNo, Password, MobileNo, EmailAddress, Description)
                VALUES (?, ?, ?, ?, ?, ?)`;

    const { StudentName, EnrollmentNo, Password, MobileNo, EmailAddress, Description } = req.body;

    db.query(sql, [StudentName, EnrollmentNo, Password, MobileNo, EmailAddress, Description], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: "Student created", id: result.insertId });
    })
}

function getById(req,res){
    const sql = `select * from student
                where EnrollmentNo = ?`;

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json("something went wrong")
        }

        res.json(result);
    })
}

function editByEnroll(req,res){
    const { id } = req.params;

    db.query(
        "SELECT * FROM Student WHERE EnrollmentNo = ?",
        [id],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            if (rows.length === 0)
                return res.status(404).json({ message: "Student not found" });

            const student = rows[0];

            const updatedStudent = {
                StudentName: req.body.StudentName ?? student.StudentName,
                EnrollmentNo: req.body.EnrollmentNo ?? student.EnrollmentNo,
                MobileNo: req.body.MobileNo ?? student.MobileNo,
                EmailAddress: req.body.EmailAddress ?? student.EmailAddress,
                Password: req.body.Password ?? student.Password,
                Description: req.body.Description ?? student.Description
            };

            const sql = `
                UPDATE Student SET
                    StudentName = ?,
                    EnrollmentNo = ?,
                    MobileNo = ?,
                    EmailAddress = ?,
                    Password = ?,
                    Description = ?,
                    Modified = CURRENT_TIMESTAMP
                WHERE EnrollmentNo = ?
            `;

            db.query(
                sql,
                [
                    updatedStudent.StudentName,
                    updatedStudent.EnrollmentNo,
                    updatedStudent.MobileNo,
                    updatedStudent.EmailAddress,
                    updatedStudent.Password,
                    updatedStudent.Description,
                    id
                ],
                (err2) => {
                    if (err2) return res.status(500).json(err2);

                    res.json({ message: "Student updated successfully" });
                }
            );
        }
    );
}

function deleteByEnroll(req,res){
    const sql = `delete from student
                 where EnrollmentNo = ?`;

    db.query(sql , [req.params.enrollment] , (err,result)=>{
        if(err){
            res.status(500).json(err);
        }
        res.json(`${req.params.enrollment} is deleted`);
    })
}

function individualMentorDetailsOfStudent(req,res){
    const sql = `select s.*, sm.*, stu.* from staff s
                 join studentmentor sm
                 on s.StaffID = sm.StaffID
                 join student stu
                 on sm.StudentID = stu.StudentID
                 where stu.EnrollmentNo = ? AND sm.ToDate IS NULL`;

    db.query(sql , [req.params.enrollment] , (err,result)=>{
        if(err){
            return res.status(500).json(err);
        }

        res.json(result);
    })
}

function completeMentoringHistoryOfStudent(req,res){
    const sql = `select smg.*, sm.*, stu.*, st.StaffName from studentmentoring smg
                join studentmentor sm
                on smg.StudentMentorID = sm.StudentMentorID
                join student stu
                on stu.StudentID = sm.StudentID
                join staff st
                on sm.StaffID = st.StaffID
                where stu.EnrollmentNo = ?
                order by smg.DateOfMentoring DESC`;

    db.query(sql , [req.params.enrollment], (err,result)=>{
        if(err){
            return res.status(500).json(err);
        }
        res.json(result);
    })
}

module.exports = {getAllStudents , postStudent , getById , editByEnroll , deleteByEnroll , individualMentorDetailsOfStudent , completeMentoringHistoryOfStudent}