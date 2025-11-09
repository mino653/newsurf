import './equery.js';
import './music-generator.js';

const apiURL = 'http://localhost:5729';
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
    state.userdata = {};
    reload();
}

async function fetchData() {
    if (state !== undefined && state.userdata !== undefined) {
        try {
            const requestJSON = {
                "id": state.userdata.id
            };
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            const raw = JSON.stringify(requestJSON);
            const options = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            };
            const response = await fetchWithTimeout('https://surfnetwork-api.onrender/user/fetch', options);
            if (response.detail === undefined) {
                state.userdata = response.userdata;
                state.mc = response.mc;
                setState(state);
            } else throw new Error(response.detail.error);
        } catch (e) {
            throw new Error(e);
        }
    } else throw new Error('fetchData cannot be used without an account.');
}

function showMessage(text, type = 'info') {
    const existingMessages = EQuery('.message');
    existingMessages.each((i, msg) => msg.remove());
    const message = EQuery.elemt('div', text, `message ${type}`, null, 'position: fixed;top: 40px;left: 12px;z-index: 9999');
    EQuery('body').prepend(message);
    setTimeout(() => {
        message.remove();
    }, 5000);
}

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(`Timed out: ${timeout}ms`), timeout);

    const response = await fetch(`${apiURL}${url}`, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);

    if (!response.ok) {
        showMessage(`HTTP error! status: ${response.status}`, 'error');
    }
    return response.json();
}

function extractQuery() {
    let arr = {};
    let query = new URLSearchParams(window.location.search);
    query.forEach((v, k) => {
        arr[k] = v;
    });
    return arr;
}

function remainderQuery(d) {
    let query = extractQuery();
    let s = '';
    delete query[d];
    for (let key in query) {
        s += `&${key}=${query[key]}`;
    }
    return s;
}


function reload() {
    save();
    setTimeout(function () {window.location.reload()}, 2000)
};

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

export { apiURL, getState, getDB, clear, setState, redirect, reload, logout, extractQuery, remainderQuery, fetchWithTimeout, showMessage, fetchData };