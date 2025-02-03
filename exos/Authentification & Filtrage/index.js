// 3. Exercices en JavaScript natif : Authentification & Filtrage

function generateToken(user) {
    let token = btoa(JSON.stringify(user));
    return token;
}

function verifyToken(token) {
    let user = JSON.parse(atob(token));
    return user;    
}

module.exports = {
    generateToken,
    verifyToken
};