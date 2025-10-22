import './equery.js';
import './music-generator.js';

let localDB = new EQuery.Storage('surfnetwork-localdb');
let state, dbReady = false, onDBReady = [];
localDB.init(() => {
    dbReady = true;
    localDB.get(fromDB);
    for (let i = 0;i < onDBReady.length;i++) localDB.get(onDBReady[i]);
    onDBReady = [];
});

function fromDB(_state) {
    if (_state === undefined) _state = {};
    state = _state;
    save(state);
}

function getDB(cb) {
    if (dbReady) localDB.get(cb);
    else onDBReady.push(cb);
}

function getState() {
    return state;
}

function setState(newState, cb) {
    state = newState;
    save(state, cb);
}

function logout() {
    state.logged_in = false;
    reload();
};


function reload() {
    save();
    setTimeout(function () {window.location.reload()}, 2000)};

function save(state, cb) {
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        localDB.set(state);
        if (cb) cb()
    }, 200);
};

function clear() {
    localDB.clear();
};

function redirect(href) {
    setTimeout(() => window.location = href, 500);
}

export { getState, getDB, clear, setState, redirect, reload };