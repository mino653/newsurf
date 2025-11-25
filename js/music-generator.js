// Custom Music Generator for SurfNetwork
// This creates copyright-free music using Web Audio API

class MusicGenerator {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentTrack = null;
        this.masterGain = null;
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.setValueAtTime(0.9, this.audioContext.currentTime); // Lower volume
            return true;
        } catch (error) {
            console.log('Web Audio API not supported');
            return false;
        }
    }

    // Generate a simple melody
    generateMelody() {
        const notes = [
            { freq: 261.63, duration: 0.5 }, // C4
            { freq: 293.66, duration: 0.5 }, // D4
            { freq: 329.63, duration: 0.5 }, // E4
            { freq: 349.23, duration: 0.5 }, // F4
            { freq: 392.00, duration: 0.5 }, // G4
            { freq: 440.00, duration: 0.5 }, // A4
            { freq: 493.88, duration: 0.5 }, // B4
            { freq: 523.25, duration: 1.0 }  // C5
        ];
        return notes;
    }

    // Play a single note
    playNote(frequency, duration, startTime = 0) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime + startTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + startTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + startTime + duration);
        
        oscillator.start(this.audioContext.currentTime + startTime);
        oscillator.stop(this.audioContext.currentTime + startTime + duration);
    }

    // Generate and play a track
    async playTrack(trackName) {
        if (!this.audioContext) return;

        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.stopTrack();

        const melody = this.generateMelody();
        let currentTime = 0;

        // Play melody multiple times with variations
        for (let repeat = 0; repeat < 4; repeat++) {
            if (this.isPlaying) {
                melody.forEach((note, index) => {
                    const variation = Math.random() * 0.1 - 0.05; // Small pitch variation
                    const freq = note.freq * (1 + variation);
                    this.playNote(freq, note.duration, currentTime);
                    currentTime += note.duration;
                });
                currentTime += 0.5; // Pause between repeats
            }
        }

        this.currentTrack = setTimeout(() => {
            if (this.isPlaying) {
                this.playTrack(trackName);
            }
        }, currentTime * 1000);
    }

    stopTrack() {
        if (this.currentTrack && this.isPlaying) {
            clearTimeout(this.currentTrack);
            this.currentTrack = null;
        }
    }

    // Generate different track styles
    generateSurfTheme() {
        // Surf-themed track with wave-like sounds
        const track = [];
        const baseFreq = 220; // A3
        
        // Create wave pattern
        for (let i = 0; i < 16; i++) {
            const waveFreq = baseFreq + Math.sin(i * 0.5) * 50;
            track.push({ freq: waveFreq, duration: 0.25 });
        }
        
        return track;
    }

    generateAdventureTheme() {
        // Adventure-themed track with ascending notes
        const track = [];
        const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
        
        scale.forEach(freq => {
            track.push({ freq: freq, duration: 0.4 });
        });
        
        return track;
    }

    generateMiningTheme() {
        // Mining-themed track with repetitive rhythm
        const track = [];
        const baseFreq = 196; // G3
        
        for (let i = 0; i < 8; i++) {
            track.push({ freq: baseFreq, duration: 0.2 });
            track.push({ freq: baseFreq * 1.25, duration: 0.2 });
        }
        
        return track;
    }
}

// Initialize music generator
const musicGen = new MusicGenerator();

// Create audio files (simulated)
function createAudioFiles() {
    const audioFiles = {
        'surfnetwork-theme': musicGen.generateSurfTheme(),
        'adventure-awaits': musicGen.generateAdventureTheme(),
        'mining-melody': musicGen.generateMiningTheme(),
        'crafting-symphony': musicGen.generateMelody(),
        'end-dimension': musicGen.generateAdventureTheme()
    };

    return audioFiles;
}

// Export for use in main script
window.MusicGenerator = MusicGenerator;
window.musicGen = musicGen;
