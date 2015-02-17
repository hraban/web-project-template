import createH1 = require("createH1");

function helloMain(name: string) {
    document.body.appendChild(createH1('hello, ' + name + '!'));
}

export = helloMain;
