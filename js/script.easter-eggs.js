// Pumpkin Easter Egg Pattern
let pumpkinPattern = '';
document.addEventListener('keydown', (e) => {
    pumpkinPattern += e.key.toLowerCase();
    if (pumpkinPattern.length > 11) {
        pumpkinPattern = pumpkinPattern.slice(-11);
    }
    
    if (pumpkinPattern === '31halloween') {
        triggerPumpkinEasterEgg();
    }
});

// Function to trigger pumpkin Easter egg
function triggerPumpkinEasterEgg() {
    // Create pumpkin element
    const pumpkin = document.createElement('div');
    pumpkin.style.cssText = `
        position: fixed;
        width: 100px;
        height: 100px;
        background: url('./assets/icon.pumpkin.png') no-repeat center/contain;
        z-index: 99999;
        transform: translate(-50%, -50%) scale(0.1);
        top: 50%;
        left: 50%;
        filter: drop-shadow(0 0 10px #ff6600);
        pointer-events: none;
        transition: transform 3s cubic-bezier(0.2, 0, 0.8, 1);
    `;
    document.body.appendChild(pumpkin);

    // Play spooky laugh sound
    const audio = new Audio('./assets/evil-laugh.mp3');
    audio.volume = 0.5;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => console.log("Audio playback error:", error));
    }

    // Animate pumpkin
    requestAnimationFrame(() => {
        pumpkin.style.transform = 'translate(-50%, -50%) scale(50)';
    });

    // Reload page after animation
    setTimeout(() => {
        window.location.reload();
    }, 3000);
}

// Export for use in other modules if needed
export { triggerPumpkinEasterEgg };