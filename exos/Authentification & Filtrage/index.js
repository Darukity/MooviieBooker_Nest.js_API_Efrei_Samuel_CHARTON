// 3. Exercices en JavaScript natif : Authentification & Filtrage

function generateToken(user) {
    let token = btoa(JSON.stringify(user));
    return token;
}

function verifyToken() {
    return
}

module.exports = {
    generateToken,
    verifyToken
};