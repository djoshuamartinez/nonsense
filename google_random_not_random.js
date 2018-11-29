// ==UserScript==
// @name         Google Random not Random
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixed "random" results
// @author       JJ
// @match        *://*/*random*number*
// @match        *://*/*numero*aleatorio*
// @grant        none
// ==/UserScript==

// Usage configuration
// List of desired fixed results
var ns = [10, 20, 30, 40, 50, 1337];

// Hard coded elements
var minInputId = 'UMy8j';
var minInputClass = 'KvQClf gws-csf-randomnumber__minVal';
var maxInputId = 'nU5Yvb';
var maxInputClass = 'KvQClf gws-csf-randomnumber__maxVal';
var minParentDivClass = 'Fsep0b';
var maxParentDivClass = 'jZi29b';
var generateButtonId = 'ZdzlKb';

///////////////////////////////////////////////////////////////////

var guess = 0;
var minFake;
var maxFake;
var minParent = document.getElementsByClassName(minParentDivClass)[0];
var maxParent = document.getElementsByClassName(maxParentDivClass)[0];

function insertAtStart(p, n){
    p.insertBefore(n, p.children[0]);
}
function fakeInput(t){
    var fk = document.createElement('input');
    fk.type = 'hidden';
    if(t=='min'){
        fk.id = minInputId;
        fk.className = minInputClass;
    }
    else{
        fk.id = maxInputId;
        fk.className = maxInputClass;
    }
    return fk;
}

function fake(v){
    minFake.value = v;
    maxFake.value = v;
}

function nextValue(){
    guess++;
    if(guess>=ns.length){
        guess = 0;
    }
    fake(ns[guess]);
}

(function() {
    'use strict';
    ns = [1].concat(ns);

    minFake = fakeInput('min');
    maxFake = fakeInput('max');
    insertAtStart(minParent, minFake);
    insertAtStart(maxParent, maxFake);

    fake(ns[guess]);
    document.getElementById(generateButtonId).onclick=nextValue;
})();
