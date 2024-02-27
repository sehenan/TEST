const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const { redirect } = require('express/lib/response');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('inscription'));
app.use(express.static('connexion'));

// voir mes fihcier
app.use(express.static(path.join(__dirname, 'inscription')));
app.use(express.static(path.join(__dirname, 'connexion')));

// Configuration de la connexion à la base de données MySQL
const bdd = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testp'
});

// Connexion à la base de données
bdd.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données MySQL:', err);
    } else {
        console.log('Connecté à la base de données MySQL');
    }
});

// Middleware pour analyser les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint pour la soumission du formulaire d'inscription
app.post('/inscription', (req, res) => {
    const { nom, prenom, email, mdp } = req.body;

    // Requête SQL pour insérer un nouvel utilisateur
    const sql = 'INSERT INTO utilisateur (nom, prenom, email,mdp) VALUES (?, ?, ?,?)';

    // Exécution de la requête
    bdd.query(sql, [nom, prenom, email, mdp], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'inscription dans la base de données:', err);
            res.status(500).send('Erreur lors de l\'inscription');
        } else {
            console.log('Utilisateur inscrit avec succès');
            res.send('Inscription réussie');
            res.redirect('../index.html');
        }
    });
});

// Endpoint pour la soumission du formulaire de connexion
app.post('/connexion', (req, res) => {
    const { email, mdp } = req.body;

    // Requête SQL pour vérifier si l'utilisateur existe
    const sql = 'SELECT * FROM utilisateur WHERE email = ? AND mdp = ?';

    // Exécution de la requête
    bdd.query(sql, [email, mdp], (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'utilisateur dans la base de données:', err);
            res.status(500).send('Erreur lors de la connexion');
        } else {

            if (results.length > 0) {
                // rediriger vers page bienvenue
                res.redirect('index.html');
                res.send('ok');
            } else {
                // L'utilisateur n'existe pas, redirigez-le vers la page d'inscription
                res.redirect('/inscritption/inscription.html');
            } 
            
            app.post('/connexion', (req, res) => {
                const { email, mdp } = req.body;

                // Requête SQL pour vérifier si l'utilisateur existe
                const sql = 'SELECT * FROM utilisateur WHERE email = ? AND mdp = ?';

                // Exécution de la requête
                bdd.query(sql, [email, mdp], (err, results) => {
                    if (err) {
                        console.error('Erreur lors de la vérification de l\'utilisateur dans la base de données:', err);
                        res.status(500).send('Erreur lors de la connexion');
                    } else {
                        if (results.length > 0) {
                            // L'utilisateur existe, rediriger vers la page bienvenue
                            res.redirect('index.html');
                        } else {
                            // L'utilisateur n'existe pas, redirigez-le vers la page d'inscription
                            res.redirect('/inscription/inscription.html');
                        }
                    }
                });
            });

        }
    });
});


// Port d'écoute du serveur
const port = 4000;
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
