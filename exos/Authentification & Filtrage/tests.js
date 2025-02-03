// test for generateToken

let user = {
    username: "le lutin",
    password: "malicieux"
};

function testGenerateToken(user) {
    let token = generateToken(user);
    if (token) {
        console.log("Token généré: " + token);
    } else {
        console.log("Erreur lors de la génération du token");
    }
    return token;
}

// test for verifyToken
function testVerifyToken(token) {
    let user = verifyToken(token);
    if (user.username === "le lutin" && user.password === "malicieux") {
        console.log("Token vérifié: " + user.username);
    } else {
        console.log("Erreur lors de la vérification du token");
    }
    return user;
}

let token = testGenerateToken(user);

testVerifyToken(token);