import { extractQuery, fetchWithTimeout, redirect } from './util.js';

// Forum functionality
function  initForum() {
    const newTopicBtn = EQuery('#new-topic-btn');
    const modal = EQuery('#new-topic-modal');
    const closeModalBtn = modal.find('.close-modal');
    const newTopicForm = EQuery('#new-topic-form');

    const query = extractQuery();
    if (query.category !== undefined) {
        loadCategory(query);
    }

    // Show modal
    newTopicBtn.click(() => modal.show());

    // Close modal
    closeModalBtn.click(() => modal.hide());

    setInterval(async () => await updateForumList(), 30000);

    // Close modal when clicking outside
    EQuery(document.documentElement).click(e => {
        const exceptions = (() => {
            let arr = []
            EQuery('#new-topic-modal *, #new-topic-btn').each((i, elt) => {
                arr.push(elt);
            });
            return arr;
        })();

        if (e.path) {
            let elts = e.path;
            for (let i = 0;i < elts.length;i++) {
                if (exceptions.indexOf(elts[i]) === -1) modal.hide();
                break;
            }
        } else {
            if (exceptions.indexOf(e.target) === -1) modal.hide();
        }
    });

    // Handle new topic submission
    newTopicForm.submit(async e => {
        e.preventDefault();
        
        const category = EQuery('#topic-category').val();
        const title = EQuery('#topic-title').val();

        // Clear form and close modal
        newTopicForm[0].reset();
        modal.hide();

        try {
            const requestJSON = {
                'cateory': category,
                'title': title,
                'content': content
            };

            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            const raw = JSON.stringify(requestJSON);
            const options = { method: 'POST', headers: headers, body: raw, redirect: 'follow' };
            let response = await fetchWithTimeout('https:/surfnetwork-api.onrender.com/submit-forum', options);
        
            if (response.error === undefined) {
                showMessage('Topic created successfully!', 'success');
                updateForumList();
            } else {
                showMessage('Failed to create topic: ' + response.error, 'error');
            }
        } catch (e) {
            showMessage('Failed to create topic: ' + e, 'error');
        }
    });
}

function loadCategory(query) {
    if (query.forum_id !== undefined) loadForum(query.forum_id);
    try {
        // TODO: hide forum section element and fetch forum list from api based on query.category
    } catch (e) {

    }
}

function loadForum(forum_id) {
    try {
        // TODO: hide forum section element and fetch entire forum content from api based on forum_id
    } catch (e) {

    }
}

// Show message function
function showMessage(text, type = 'info') {
    // Remove existing messages
    const existingMessages = EQuery('.message');
    existingMessages.each((i, msg) => msg.remove());

    const message = EQuery.elemt('div', text, `message ${type}`, null, 'position: fixed;top: 40px;left: 12px;z-index: 9999');

    // Add to top of page
    EQuery('body').prepend(message);

    // Auto remove after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Function to create a topic element
function createTopicElement(id, category, title, content, timeString, author, replies) {
    const topic = EQuery.elemt('div', null, 'forum-topic');
    topic.html(`<div class="topic-header"><h4>${title}</h4><span class="topic-time">${timeString}</span></div><div class="topic-preview">${content.substring(0, 100)}${content.length > 100 ? '...' : ''}</div><div class="topic-footer"><span class="topic-author">Posted by ${author}</span><span class="topic-stats">${replies} ${replies === 1 ? 'reply' : 'replies'}</span></div>`)
    topic.click(() => redirect(`?forum_id=${id}&category=${category}`));

    return topic;
}

async function updateForumList() {
    try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = { method: 'GET', headers: headers, redirect: 'follow' };
        let response = await fetchWithTimeout('https:/surfnetwork-api.onrender.com/fetch-forum', options);
    
        if (response.error === undefined) {
            appendForumList(response);
        } else {
            showMessage('Failed to fetch forum list: ' + response.error, 'error');
        }
    } catch (e) {
        showMessage('Failed to fetch forum list: ' + e, 'error');
    }
}

function appendForumList(response, index = 3) {
    const forums = {
        announcements: setChunk(0, index, response.announcements)[0],
        help: setChunk(0, index, response.help)[0],
        community: setChunk(0, index, response.community)[0]
    }

    for (let category in forums) {
        forums[category].forEach(q => {
            const categoryList = EQuery(`.forum-category[data-category="${category}"] .topics-list`);
            categoryList.prepend(createTopicElement(q.id, category, q.topic, q.content, q.time, q.author, q.replies));
        });
    }
}

function setChunk(start, count, items) {
    let arr = [];
    
    while (items.length > count) {
        arr.push([...items.splice(start, count)]);
    }

    arr.push([...items]);
    
    return arr;
}

export {updateForumList, initForum}