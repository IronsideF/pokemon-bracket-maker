export function standardiseText(text) {
    const dashesRemoved = text.replace(/-/g , " ")
    const words = dashesRemoved.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(" ");
}

export function getEnglishLanguageEntries(array) {
    const englishEntries = [];
    for (let i = 0;i<array.length;i++){
        let entry = array[i];
        if (entry.language.name == "en"){
            englishEntries.push(entry);
        }
    }
    return englishEntries;
}

export function convertGenerationString(generation) {
    const dashesRemoved = generation.replace(/-/g , " ")
    const capitalised = dashesRemoved[0].toUpperCase() + dashesRemoved.substr(1);
    const split = capitalised.split(" ");
    switch (split[1]){
        case 'i':
            split[1] = 1;
            break;
        case 'ii':
            split[1] = 2;
            break;
        case 'iii':
            split[1] = 3;
            break;
        case 'iv':
            split[1] = 4;
            break;
        case 'v':
            split[1] = 5;
            break;
        case 'vi':
            split[1] = 6;
            break;
        case 'vii':
            split[1] = 7;
            break;
        case 'viii':
            split[1] = 8;
            break;
        case 'ix':
            split[1] = 9;
            break;
    }
    return split.join(" ");
}