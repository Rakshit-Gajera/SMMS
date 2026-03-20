const db = require('./config/db');

const sql = `
    INSERT INTO StudentMentor
    (StudentID, StaffID, FromDate, ToDate, Description)
    VALUES (?, ?, ?, ?, ?)
`;

db.query(
    sql,
    [ 1, 'STAFF002', '2026-03-19', null, null ],
    (err, res) => {
        if (err) {
            console.error('MySQL Error:', err.message, err.code);
        } else {
            console.log('Success!', res);
        }
        process.exit();
    }
);
