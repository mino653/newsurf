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

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json()
    } catch (error) {
        clearTimeout(id);

        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        } else throw error;
    }
}

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

export { getState, getDB, clear, setState, redirect, reload, fetchWithTimeout };