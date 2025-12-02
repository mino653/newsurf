import { fetchWithTimeout, getState, showMessage } from "./util.js";

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// Event join functionality
async function initEvents() {
    const eventsGrid = EQuery('.events-grid');
    let events = [];
    
    try {
        const requestJSON = {'order': 'desc', 'count': eventsGrid.getAttr('data-count') || 4};
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const raw = JSON.stringify(requestJSON);
        const requestOptions = { method: 'POST', headers: headers, body: raw, redirect: 'follow' };
        const response = await fetchWithTimeout(`/events/get-events`, requestOptions);
        if (response.detail !== undefined) {
            showMessage(`Failed to fetch events: ${response.detail}`, 'error');
        } else {
            if (response.length == 0) return;
            events = response;
        }
    } catch (e) {
        showMessage(`Failed to fetch events: ${e}`, 'error');
        return;
    }

    eventsGrid.removeChildren();

    events.forEach(event => {
        const joined = getState().joinedEvents || {}
        const hasJoined = joined[event.id] !== undefined || joined[event.id].active;
        const datetime = new Date(event.datetime);
        const btn = hasJoined ? EQuery.elemt('button', 'Joined', 'minecraft-btn joined', {disabled: true}) : EQuery.elemt('button', 'Join Event', 'minecraft-btn')
        const image = EQuery.elemt('div', [
            EQuery.elemt('img').attr({src: event.imgSrc, alt: event.imgAlt}),
            EQuery.elemt('div', [EQuery.elemt('span', datetime.getDay(), 'day'), EQuery.elemt('span', months[datetime.getMonth()], 'month')], 'event-date')
        ], 'event-imaeg');
        const content = EQuery.elemt('div', [
            EQuery.elemt('h3', event.title),
            EQuery.elemt('p', [EQuery.elemt('span', 'scedule', 'material-symbols-outline'), `${datetime.getHours()}:${datetime.getMinutes()} GMT+00:00`], 'event-time'),
            EQuery.elemt('p', event.details), btn
        ], 'event-content');
        const card = EQuery.elemt('div', [image, content], 'event-card');

        btn.click(async function () {
            let state = getState();
            if (state.userdata == undefined) 
                { showMessage('You must be logged in to join an event!', 'error'); return; }
            try {
                const requestJSON = {id: event.id, user_id: state.userdata.id};
                const headers = new Headers();
                headers.append('Content-Type', 'application/json');
                const raw = JSON.stringify(requestJSON);
                const requestOptions = { method: 'POST', headers: headers, body: raw, redirect: 'follow' };
                const response = await fetchWithTimeout(`/events/join`, requestOptions);
                if (response.detail !== undefined) {
                    showMessage(`Failed to fetch events: ${response.detail}`, 'error');
                } else {
                    popup({header: 'Event Joined!', body: [EQuery.elemt('p', 'You\'ve successfult joined the event! A reminder will be send before the event starts.'), EQuery.elemt('div', [EQuery.elemt('p', event.title, 'event-name'), EQuery.elemt('p', datetime.toISOString())])]})
                    btn.addClass('joined').attr({disabled: true}).text('Joined');
                    if (state.joinedEvents == undefined) state.joinedEvents = {};
                    state.joinedEvents[event.id] = {eventId: event.id, name: event.name, datetime: datetime};
                    setState(state);
                }
            } catch (e) {
                showMessage(`Failed to process your request: ${e}`, 'error');
            }
        });

        eventsGrid.append(card);
    });
};

export { initEvents };