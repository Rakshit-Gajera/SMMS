const db = require("../config/db");

// Get all tasks assigned to a specific student (by EnrollmentNo)
function getTasksByStudent(req, res) {
    const { enrollmentNo } = req.params;
    console.log(`[Task] getTasksByStudent: enrollmentNo=${enrollmentNo}`);

    const sql = `
        SELECT t.*, 
               s.StaffName as assignedByName
        FROM Task t
        LEFT JOIN Staff s ON t.AssignedByStaffID = s.StaffID
        WHERE t.AssignedToEnrollmentNo = ?
        ORDER BY t.CreatedAt DESC
    `;

    db.query(sql, [enrollmentNo], (err, rows) => {
        if (err) {
            console.error('[Task] getTasksByStudent error:', err);
            return res.status(500).json(err);
        }
        console.log(`[Task] getTasksByStudent: found ${rows.length} tasks`);
        res.json(rows);
    });
}

// Get all tasks assigned BY a specific mentor (by StaffID)
function getTasksByMentor(req, res) {
    const { staffId } = req.params;
    console.log(`[Task] getTasksByMentor: staffId=${staffId}`);

    const sql = `
        SELECT t.*, 
               stu.StudentName as assignedToName
        FROM Task t
        LEFT JOIN Student stu ON t.AssignedToEnrollmentNo = stu.EnrollmentNo
        WHERE t.AssignedByStaffID = ?
        ORDER BY t.CreatedAt DESC
    `;

    db.query(sql, [staffId], (err, rows) => {
        if (err) {
            console.error('[Task] getTasksByMentor error:', err);
            return res.status(500).json(err);
        }
        console.log(`[Task] getTasksByMentor: found ${rows.length} tasks`);
        res.json(rows);
    });
}

// Create a new task
function createTask(req, res) {
    const { title, description, dueDate, priority, assignedToEnrollmentNo, assignedByStaffID } = req.body;
    console.log('[Task] createTask:', req.body);

    if (!title || !assignedToEnrollmentNo || !assignedByStaffID) {
        return res.status(400).json({ message: "title, assignedToEnrollmentNo, and assignedByStaffID are required" });
    }

    const sql = `
        INSERT INTO Task (Title, Description, DueDate, Priority, Status, AssignedToEnrollmentNo, AssignedByStaffID)
        VALUES (?, ?, ?, ?, 'pending', ?, ?)
    `;

    db.query(sql, [title, description || '', dueDate || null, priority || 'medium', assignedToEnrollmentNo, assignedByStaffID], (err, result) => {
        if (err) {
            console.error('[Task] createTask error:', err);
            return res.status(500).json(err);
        }
        console.log('[Task] createTask: inserted TaskID=', result.insertId);
        res.status(201).json({ message: "Task created", TaskID: result.insertId });
    });
}

// Update a task's status (e.g., student marks it complete)
function updateTask(req, res) {
    const { taskId } = req.params;
    const allowed = ['Title', 'Description', 'DueDate', 'Priority', 'Status'];
    const fields = [];
    const values = [];

    allowed.forEach(key => {
        if (req.body[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(req.body[key]);
        }
    });

    if (fields.length === 0) return res.status(400).json({ message: "No valid fields to update" });

    values.push(taskId);
    const sql = `UPDATE Task SET ${fields.join(', ')}, UpdatedAt = CURRENT_TIMESTAMP WHERE TaskID = ?`;

    db.query(sql, values, (err) => {
        if (err) {
            console.error('[Task] updateTask error:', err);
            return res.status(500).json(err);
        }
        res.json({ message: "Task updated" });
    });
}

// Delete a task
function deleteTask(req, res) {
    const { taskId } = req.params;
    db.query("DELETE FROM Task WHERE TaskID = ?", [taskId], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Task deleted" });
    });
}

module.exports = { getTasksByStudent, getTasksByMentor, createTask, updateTask, deleteTask };
