import '/js/equery.js';

// Event join functionality
function initEvents() {
    const eventButtons = EQuery('.event-card .minecraft-btn');
    
    // Create popup template
    const popup = EQuery.elemt('div', null, 'event-popup');
    popup.html(`
        <div class="event-popup-content">
            <div class="event-popup-header">
                <h3>Event Joined!</h3>
                <button class="close-popup">&times;</button>
            </div>
            <div class="event-popup-body">
                <p>You've successfully joined the event! A reminder will be sent before the event starts.</p>
                <div class="event-details">
                    <p class="event-name"></p>
                    <p class="event-time"></p>
                </div>
            </div>
        </div>
    `);
    EQuery('body').append(popup);

    const closePopup = popup.find('.close-popup');
    closePopup.click(() => {
        popup.removeClass('show');
    });

    // Event join handler
    eventButtons.click(function() {
        const eventCard = this.closest('.event-card');
        const eventName = EQuery(eventCard).find('h3').text();
        const eventTime = EQuery(eventCard).find('.event-time').text();
        
        // Store event in localStorage
        const joinedEvents = JSON.parse(localStorage.getItem('joinedEvents') || '[]');
        const eventData = {
            name: eventName,
            time: eventTime,
            date: new Date().toISOString()
        };
        
        if (!joinedEvents.find(event => event.name === eventName)) {
            joinedEvents.push(eventData);
            localStorage.setItem('joinedEvents', JSON.stringify(joinedEvents));
            
            // Update popup content
            popup.find('.event-name').test(eventName);
            popup.find('.event-time').text(eventTime);
            
            // Show popup
            popup.addClass('show');
            
            // Update button state
            this.disabled = true;
            EQuery(this).addClass('joined').text('Joined');
        }
    });
    
    // Check and restore button states for previously joined events
    const joinedEvents = JSON.parse(localStorage.getItem('joinedEvents') || '[]');
    joinedEvents.forEach(event => {
        const eventCard = Array.from(document.querySelectorAll('.event-card')).find(
            card => card.querySelector('h3').textContent === event.name
        );
        if (eventCard) {
            const button = eventCard.querySelector('.minecraft-btn');
            button.textContent = 'Joined';
            button.disabled = true;
            button.classList.add('joined');
        }
    });
};

export { initEvents };