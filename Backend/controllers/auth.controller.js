const db = require('../config/db');
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "smms_super_secret_key";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@darshan.ac.in";

function login(req, res) {
    const { email, password, role } = req.body;
    let sql;

    if (role === "admin" || role === "staff" || role === "mentor") {
        sql = "SELECT * FROM Staff WHERE EmailAddress=?";
    } else if (role === "student") {
        sql = "SELECT * FROM Student WHERE EmailAddress=?";
    } else {
        return res.status(400).json({ message: "Invalid role" });
    }

    db.query(sql, [email], (err, rows) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (rows.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = rows[0];

        if (password !== user.Password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        if (role === "admin" && email !== ADMIN_EMAIL) {
            return res.status(403).json({
                message: "You are not authorized as admin"
            });
        }

        let payload;
        let userData;

        if (role === "admin" || role === "staff" || role === "mentor") {
            // JWT role must be 'staff' for backend middleware (routes use allowRoles("staff"))
            // or 'admin' for admin. Frontend gets the display role separately.
            const displayRole = (email === ADMIN_EMAIL) ? "admin" : "mentor";
            const jwtRole = (email === ADMIN_EMAIL) ? "admin" : "staff";
            payload = { id: user.StaffID, role: jwtRole };
            userData = {
                id: user.StaffID,
                name: user.StaffName,
                email: user.EmailAddress,
                role: displayRole,
                department: user.Description || "Staff"
            };
        } else if (role === "student") {
            payload = { id: user.EnrollmentNo, role: "student" };
            userData = {
                id: user.EnrollmentNo,
                name: user.StudentName,
                email: user.EmailAddress,
                role: "student",
                department: user.Description || "Student"
            };
        }

        const token = jwt.sign(payload, SECRET, { expiresIn: "8h" });

        res.json({
            message: "Login successful",
            token,
            user: userData
        });
    });
}

module.exports = { login };