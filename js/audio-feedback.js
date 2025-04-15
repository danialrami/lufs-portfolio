// Audio Feedback for Interactive Elements
document.addEventListener('DOMContentLoaded', function() {
    // Create audio elements
    const hoverSound = new Audio('audio/hover.mp3');
    const clickSound = new Audio('audio/click.mp3');
    
    // Set volume
    hoverSound.volume = 0.2;
    clickSound.volume = 0.3;
    
    // Get audio toggle state
    function isAudioEnabled() {
        return !document.getElementById('toggle-audio').classList.contains('muted');
    }
    
    // Add hover sound to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .category');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (isAudioEnabled()) {
                // Reset sound to beginning and play
                hoverSound.currentTime = 0;
                hoverSound.play().catch(e => console.log('Audio play error:', e));
            }
        });
        
        element.addEventListener('click', () => {
            if (isAudioEnabled()) {
                // Reset sound to beginning and play
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log('Audio play error:', e));
            }
        });
    });
    
    // Add special interaction for category sections
    const categories = document.querySelectorAll('.category');
    
    categories.forEach(category => {
        // Create unique sound for each category
        const categorySound = new Audio();
        categorySound.volume = 0.4;
        
        // Assign different sounds based on category
        if (category.id === 'sound-design-category') {
            categorySound.src = 'audio/sound-design-interaction.mp3';
        } else if (category.id === 'music-composition-category') {
            categorySound.src = 'audio/music-composition-interaction.mp3';
        } else if (category.id === 'technical-audio-category') {
            categorySound.src = 'audio/technical-audio-interaction.mp3';
        }
        
        // Play category-specific sound on focus
        category.addEventListener('mouseenter', () => {
            if (isAudioEnabled()) {
                categorySound.currentTime = 0;
                categorySound.play().catch(e => console.log('Audio play error:', e));
            }
        });
    });
    
    // Add audio feedback for audio player interactions
    const audioPlayers = document.querySelectorAll('audio');
    
    audioPlayers.forEach(player => {
        // Play interface sound when audio player controls are used
        player.addEventListener('play', () => {
            if (isAudioEnabled()) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log('Audio play error:', e));
            }
        });
        
        player.addEventListener('pause', () => {
            if (isAudioEnabled()) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log('Audio play error:', e));
            }
        });
    });
});
