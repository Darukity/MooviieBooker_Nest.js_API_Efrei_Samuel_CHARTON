// 3. Exercices en JavaScript natif : Authentification & Filtrage

function filter(array, key, searchValue) {
    return array.filter(item => item[key] === searchValue);
} 

module.exports = {
    filter
};