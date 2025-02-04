const { generateToken, verifyToken } = require('./Auth.js');

// 1. Auth
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

// 2. Filtrage
// test for fillter
const { filter } = require('./Filter.js');

let userArray = [
    { username: "le lutin", password: "malicieux", email: "lelutinmalicieux@malice.maléfique" },
    { username: "le nain", password: "malicieux", email: "lenainmalicieux@malice.maléfique" },
    { username: "le troll", password: "malicieux", email: "letrollmalcieux@malice.troll" },
    { username: "le gobelin", password: "malicieux", email: "legobelinmalicieux@malice.lutin" }
];

let articleArray = [
    { articleName: "Abeilles", articlePrice: 100, articleStock: 200 },
    { articleName: "Cote de boeuf", articlePrice: 200, articleStock: 230 },
    { articleName: "Pommes", articlePrice: 300, articleStock: 100 },
    { articleName: "Cote de porc", articlePrice: 40, articleStock: 125 }
];

function testFilter(array, key, searchValue, mode) {
    let result = filter(array, key, searchValue, mode);
    try {
        if (result.length > 0) {
            console.log("Résultat du filtre: " + JSON.stringify(result));
        } else {
            throw new Error("Erreur lors du filtrage");
        }
    } catch (e) {
        console.log(e);
        return null;
    }
    return result;
}

// in searchStrict mode
testFilter(userArray, "username", "le lutin");
testFilter(articleArray, "articleName", "Cote de boeuf");

// in search mode
testFilter(userArray, "email", "troll", "search");
testFilter(articleArray, "articleName", "cote", "search");

// in valueUnder mode
testFilter(articleArray, "articlePrice", 200, "valueUnder");

// in valueOver mode
testFilter(articleArray, "articleStock", 200, "valueOver");