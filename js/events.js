// Event join functionality
document.addEventListener('DOMContentLoaded', function() {
    const eventButtons = document.querySelectorAll('.event-card .minecraft-btn');
    
    // Create popup template
    const popup = document.createElement('div');
    popup.className = 'event-popup';
    popup.innerHTML = `
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
    `;
    document.body.appendChild(popup);

    const closePopup = popup.querySelector('.close-popup');
    closePopup.addEventListener('click', () => {
        popup.classList.remove('show');
    });

    // Event join handler
    eventButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventCard = this.closest('.event-card');
            const eventName = eventCard.querySelector('h3').textContent;
            const eventTime = eventCard.querySelector('.event-time').textContent;
            
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
                popup.querySelector('.event-name').textContent = eventName;
                popup.querySelector('.event-time').textContent = eventTime;
                
                // Show popup
                popup.classList.add('show');
                
                // Update button state
                this.textContent = 'Joined';
                this.disabled = true;
                this.classList.add('joined');
            }
        });
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
});