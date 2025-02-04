// 3. Exercices en JavaScript natif : Authentification & Filtrage

function filter(array, key, searchValue, mode = 'searchStrict') {
    switch (mode) {
        case 'searchStrict':
            return array.filter(item => item[key] === searchValue);
        case 'search':
            return array.filter(item => item[key].toLowerCase().includes(searchValue.toLowerCase()));
        case 'valueUnder':
            return array.filter(item => item[key] < searchValue);
        case 'valueOver':
            return array.filter(item => item[key] > searchValue);
        default:
            throw new Error('Mode de recherche non pris en charge ou incorrect\nModes disponibles: searchStrict, search, valueUnder, valueOver');
    }
} 

module.exports = {
    filter
};