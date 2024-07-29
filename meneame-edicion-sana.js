// ==UserScript==
// @name         Menéame.net - Edición Sana
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Derivado de https://greasyfork.org/es/scripts/490085-men%C3%A9ame-net-edici%C3%B3n-autista Ya hay suficiente estupidez en la vida, no hace falta meterla en tu casa.
// @author       ᵒᶜʰᵒᶜᵉʳᵒˢ, gnusuari0
// @match        *://*.meneame.net/*
// @run-at       document-end
// @icon         https://www.meneame.net/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://raw.githubusercontent.com/gnusuari0/meneame-edicion-sana/main/meneame-edicion-sana.js
// @updateURL https://raw.githubusercontent.com/gnusuari0/meneame-edicion-sana/main/meneame-edicion-sana.js
// @grant        GM_log
// ==/UserScript==

const NewsToHide = [];

const UsersToHide = [];

const normNews = NewsToHide.map(item =>
    item[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
);

const normUsers = UsersToHide.map(user =>
    user[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
);

normUsers.push('(Expresion Regular)')

const regexNews = new RegExp(normNews.join('|'), 'i');
const regexUsers = new RegExp(normUsers.join('|'), 'i');

const attrObsConfig = { attributes: true, childList: false, subtree: false};

/*Elements with all the classes*/
var buttons = document.getElementsByClassName("tablinks");
var tabContents = document.getElementsByClassName("tab-content");

const attrObsCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === "attributes") {
            applyFilter();
        }
    }
};

const attrObserver = new MutationObserver(attrObsCallback);

function disableItem(item, regex) {
    const normalizedText = item.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (regex.test(normalizedText)) {
        item.style.display = 'none';
    }
}



addEventListener("load",applyFilter);

Array.prototype.forEach.call(buttons, function(btn) {
    btn.addEventListener("click",applyFilter);
});

Array.prototype.forEach.call(tabContents, function(tc) {
    //tc.addEventListener("animationend",applyFilter);
    attrObserver.observe(tc,attrObsConfig);
});


function applyFilter() {
    /*Elements with at least one of the classes*/
    document.querySelectorAll('.news-summary, .link, .comment-body, .content-comment, .content-post, .featured-comments-container').forEach(object => {
        const normalizedText = object.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (object.matches('.news-summary, .link')) {
            if (regexNews.test(normalizedText) || regexUsers.test(normalizedText)) {
                object.style.display = 'none';
            }
        } else if (object.matches('.comment-body, .content-comment, .content-post, .featured-comments-container')) {
            if (regexUsers.test(normalizedText)) {
                object.style.display = 'none';
            }
        }
    });
}
