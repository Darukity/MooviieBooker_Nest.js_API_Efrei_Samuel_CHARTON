const { generateToken, verifyToken } = require('./index.js');

// test for generateToken
let user = {
    username: "le lutin",
    password: "malicieux",
    email: "lelutinmalicieux@malice.maléfique"
};

function testGenerateToken(user) {
    let token = generateToken(user);
    try {
        if (token) {
            console.log("Token généré: " + token);
        } else {
            throw new Error("Erreur lors de la génération du token");
        }
    } catch (e) {
        console.log(e);
        return null;
    }
    return token;
}

// test for verifyToken
function testVerifyToken(token) {
    let user = verifyToken(token);
    try {
        if (user.username === "le lutin" && user.password === "malicieux" && user.email === "lelutinmalicieux@malice.maléfique") {
            console.log("Token vérifié: " + user.username + ", " + user.password + ", " + user.email);
        } else {
            throw new Error("Erreur lors de la vérification du token");
        }
    } catch (e) {
        console.log(e);
        return null;
    }
    return user;
}

let token = testGenerateToken(user);

testVerifyToken(token);