/// <reference path="refs/jquery.d.ts"/>

import $ = require("jquery");

import createH1 = require("createH1");

function helloMain(name: string) {
    $('body').append(createH1('hello, ' + name + '!'));
}

export = helloMain;
