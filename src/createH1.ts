function createH1(text: string) {
    var h1 = document.createElement('h1');
    h1.textContent = text;
    return h1;
}

export = createH1;
