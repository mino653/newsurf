import {
    getDB,
    getState,
    showMessage,
    redirect,
    fetchWithTimeout,
    fetchData,
    logout
} from './util.js';
import './script.js';

EQuery(function () {
    const loader = EQuery('#fullscreen-loader');
    const profileSidebar = EQuery('#profile-sidebar');
    const personalSection = EQuery('#personal-information');
    const achievementSection = EQuery('#achievements');
    const statsSection = EQuery('#server-stats');

    const profileStats = {
        rank: profileSidebar.find('#rank'),
        level: profileSidebar.find('#level'),
        coins: profileSidebar.find('#coins'),
        playtime: profileSidebar.find('#playtime'),
        joinDate: profileSidebar.find('#join-date')
    };
    const changeAvatarBtn = profileSidebar.find('.avatar-change-btn');
    const editBtn = profileSidebar.find('#rank');
    const changePswBtn = profileSidebar.find('#rank');
    const settingsBtn = profileSidebar.find('#rank');
    const logoutBtn = profileSidebar.find('#rank');

    const emailInput = personalSection.find('#email');
    const minecraftUsernameInput = personalSection.find('#minecraftUsername');
    const usernameInput = personalSection.find('#username');
    const bioInput = personalSection.find('#bio');
    const saveBtn = personalSection.find('button[type=submit]');

    const serverStats = {
        playtime2: statsSection.find('#playtime'),
        blocksPlaced: statsSection.find('#block-placed'),
        blocksMined: statsSection.find('#blocks-mined'),
        deaths: statsSection.find('#deaths'),
        mobsKilled: statsSection.find('#mob-kills'),
        achievements: statsSection.find('#achievement')
    };

    getDB(state => {
        if (state === undefined && state.userdata === undefined) redirect('./');
        update();
    });

    for (const key in serverStats) {
        serverStats[key].click(function () {
            const closeBtn = EQuery.elemt('button', null, 'close-modal');
            closeBtn.html('&times');
            const icon = EQuery(this).find('span').getAttr('class');
            const number = EQuery(this).find('.server-stat-number').text();
            const label = EQuery(this).find('.server-stat-label').text();
            const modal = EQuery.elemt('div', [
                EQuery.elemt('div', [
                    EQuery.elemt('div', [EQuery.elemt('h3', 'Server Stats'), closeBtn], 'modal-header'),
                    EQuery.elemt('div', [EQuery.elemt('div', [
                        EQuery.elemt('div', EQuery.elemt('span', null, icon), 'server-stat-icon'),
                        EQuery.elemt('div', number, 'server-stat-number'),
                        EQuery.elemt('div', label, 'server-stat-label'),
                    ], 'server-stat-card-modal')], 'modal-body')
                ], 'modal-content')
            ], 'modal', {id: 'server-stat-model'}, 'display: block');

            EQuery(document.documentElement).click(e => {
                const exceptions = (() => {
                    let arr = []
                    EQuery('#server-stat-model *, #server-stats *').each((i, elt) => {
                        arr.push(elt);
                    });
                    return arr;
                })();

                if (e.path) {
                    let elts = e.path;
                    for (let i = 0;i < elts.length;i++) {
                        if (exceptions.indexOf(elts[i]) === -1) modal.remove();
                        break;
                    }
                } else {
                    if (exceptions.indexOf(e.target) === -1) modal.remove();
                }
            });

            closeBtn.click(function () {
                modal.remove();
                EQuery(document.documentElement).off('click');
            });

            EQuery('body').append(modal);
        });
    }

    saveBtn.click(async function () {
        const raw = {
            'email': emailInput.val(),
            'username': usernameInput.val(),
            'bio': bioInput.val()
        };
        sendPayload('', raw, refresh);
    });

    async function update() {
        await fetchData();
        const state = getState();
        achievementSection.find('.achievement-grid').removeChildren()

        emailInput.val(state.userdata.email);
        usernameInput.val(state.userdata.username);
        bioInput.val(state.userdata.bio);
        minecraftUsernameInput.val(state.mc.username);

        for (const key in profileStats) {
            profileStats[key].text(state.mc[key]);
        }
        
        for (const key in serverStats) {
            profileStats[key].text(state.mc[key]);
        }

        state.mc.achievements.forEach(achievement => {
            const elt = EQuery.elemt('div', [
                EQuery.elemt('div', EQuery.elemt('span', null, `fl-${achievement.icon}`), 'achievement-icon'),
                EQuery.elemt('div', achievement.title, 'achievement-title'),
                EQuery.elemt('div', achievement.desc, 'achievement-desc'),
            ], 'achievement-item');

            elt.click(function () {
                const closeBtn = EQuery.elemt('button', null, 'close-modal');
                closeBtn.html('&times');
                const modal = EQuery.elemt('div', [
                    EQuery.elemt('div', [
                        EQuery.elemt('div', [EQuery.elemt('h3', 'Server Stats'), closeBtn], 'modal-header'),
                        EQuery.elemt('div', [EQuery.elemt('div', [
                            EQuery.elemt('div', EQuery.elemt('span', null, achievement.icon), 'achievement-icon'),
                            EQuery.elemt('div', achievement.title, 'achievement-title'),
                            EQuery.elemt('div', achievement.desc, 'achievement-desc'),
                            EQuery.elemt('div', `Only ${achievement.aggregate} has obtained this achievement`, 'achievement-aggregate')
                        ], 'achievement-card-modal')], 'modal-body')
                    ], 'modal-content')
                ], 'modal', {id: 'achievement-model'}, 'display: block');

                EQuery(document.documentElement).click(e => {
                    const exceptions = (() => {
                        let arr = []
                        EQuery('#achievement-model *, #achievements *').each((i, elt) => {
                            arr.push(elt);
                        });
                        return arr;
                    })();

                    if (e.path) {
                        let elts = e.path;
                        for (let i = 0;i < elts.length;i++) {
                            if (exceptions.indexOf(elts[i]) === -1) modal.remove();
                            break;
                        }
                    } else {
                        if (exceptions.indexOf(e.target) === -1) modal.remove();
                    }
                });

                closeBtn.click(function () {
                    modal.remove();
                    EQuery(document.documentElement).off('click');
                });

                EQuery('body').append(modal);
            });

            achievementSection.find('.achievement-grid').append(elt);
        });

    }

    async function sendPayload(endpoint, requestJSON, cb) {
        loader.addClass('active').find('.spinner-container').spinner();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const raw = JSON.stringify(requestJSON);
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetchWithTimeout(`/${endpoint}`, requestOptions);
            spinner.find('.e-spinner').remove();

            if (response.detail === undefined) {
                if (cb) cb(response);
            } else {
                showMessage(response.detail.error || 'An error occured while processing your request', 'error');
            }
            EQuery(this).css('cursor: default').attr({disbled: false});
        } catch (e) {
            showMessage(`Failed to send payload: ${e}`, 'error');
        }
        loader.removeClass('active').find('.spinner-container').removeChildren();
    }

    
});