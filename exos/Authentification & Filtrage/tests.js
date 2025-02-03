const { generateToken, verifyToken } = require('./index.js');

// test for generateToken
let user = {
    username: "le lutin",
    password: "malicieux"
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
        if (user.username === "le lutin" && user.password === "malicieux") {
            console.log("Token vérifié: " + user.username);
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