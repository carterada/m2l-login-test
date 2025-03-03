const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.register = async (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur serveur');
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            });
        }

        if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        // ✅ Hachage du mot de passe
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log("Hashed Password:", hashedPassword);

        // ✅ Insertion de l'utilisateur dans la base de données
        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Erreur lors de l\'enregistrement');
            }

            console.log("Utilisateur ajouté:", results);
            return res.render('register', {
                message: 'User registered successfully'
            });
        });
    });
};
