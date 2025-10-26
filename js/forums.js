// Forum functionality
document.addEventListener('DOMContentLoaded', function() {
    const newTopicBtn = document.getElementById('new-topic-btn');
    const modal = document.getElementById('new-topic-modal');
    const closeModalBtn = modal.querySelector('.close-modal');
    const newTopicForm = document.getElementById('new-topic-form');

    // Show modal
    newTopicBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modal
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle new topic submission
    newTopicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const category = document.getElementById('topic-category').value;
        const title = document.getElementById('topic-title').value;
        const content = document.getElementById('topic-content').value;

        // Create new topic element
        const topic = createTopicElement(title, content);

        // Add to appropriate category
        const categoryList = document.querySelector(`.forum-category:has([data-category="${category}"]) .topics-list`);
        categoryList.insertBefore(topic, categoryList.firstChild);

        // Clear form and close modal
        newTopicForm.reset();
        modal.style.display = 'none';

        // Show success message
        showMessage('Topic created successfully!', 'success');
    });

    // Function to create a topic element
    function createTopicElement(title, content) {
        const topic = document.createElement('div');
        topic.className = 'forum-topic';
        
        const now = new Date();
        const timeString = now.toLocaleString();

        topic.innerHTML = `
            <div class="topic-header">
                <h4>${title}</h4>
                <span class="topic-time">${timeString}</span>
            </div>
            <div class="topic-preview">${content.substring(0, 100)}${content.length > 100 ? '...' : ''}</div>
            <div class="topic-footer">
                <span class="topic-author">Posted by You</span>
                <span class="topic-stats">0 replies</span>
            </div>
        `;

        return topic;
    }

    // Function to show messages
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
});