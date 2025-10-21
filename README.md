# SurfNetwork Minecraft Server Website

A modern, animated website for the SurfNetwork Minecraft server featuring custom music, interactive store, and engaging animations.

## 🚀 Features

### ✨ Visual Design
- **Modern Dark Theme**: Sleek dark design with neon accents
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: CSS animations and transitions throughout
- **Particle Effects**: Dynamic background particles
- **Gradient Backgrounds**: Beautiful color gradients

### 🎵 Music System
- **Custom Music Generator**: Creates copyright-free music using Web Audio API
- **Multiple Tracks**: 5 different themed tracks
- **Music Player**: Play/pause, next track, volume control
- **Now Playing Popup**: Shows current track with smooth animations
- **Auto-play**: Music starts automatically after user interaction

### 🛒 Interactive Store
- **Product Categories**: Ranks, Coins, Cosmetics, Boosters
- **Shopping Cart**: Add/remove items with real-time updates
- **Smooth Animations**: Hover effects and transitions
- **Checkout Process**: Simulated payment system

### 🎮 Gaming Features
- **Server IP Button**: One-click copy to clipboard
- **Live Player Count**: Animated counter with realistic changes
- **Server Stats**: Online players, uptime, rating
- **Contact Form**: Working contact form with validation

### 🎨 Human-Like Touches
- **Random Tips**: Helpful messages appear periodically
- **Welcome Messages**: Personalized greetings
- **Easter Eggs**: Hidden features (try the Konami code!)
- **Typing Effect**: Hero title types out character by character
- **Dynamic Content**: Player count changes, random tips

## 📁 File Structure

```
surfnetwork-website/
├── index.html              # Main HTML file
├── styles.css              # All CSS styles and animations
├── script.js               # Main JavaScript functionality
├── music-generator.js      # Custom music generation
├── favicon.svg             # Website favicon
├── logo.png.html           # Logo placeholder
├── server-screenshot.png.html # Server screenshot placeholder
└── README.md               # This file
```

## 🛠️ Setup Instructions

### 1. Basic Setup
1. Download all files to your web server directory
2. Ensure all files are in the same directory
3. Open `index.html` in a web browser

### 2. Customization

#### Server Information
- **Server IP**: Change `play.surfnetwork.com` in `index.html` and `script.js`
- **Server Name**: Update "SurfNetwork" throughout the files
- **Contact Info**: Update email and Discord links in the contact section

#### Images
- Replace `logo.png.html` with your actual logo (PNG format, 200x200px recommended)
- Replace `server-screenshot.png.html` with your server screenshot (800x450px recommended)
- Convert `favicon.svg` to `favicon.ico` for better browser support

#### Colors and Branding
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #00d4ff;    /* Your primary color */
    --secondary-color: #ff6b35; /* Your secondary color */
    --accent-color: #7b2d98;    /* Your accent color */
}
```

#### Store Products
Update the products object in `script.js`:
```javascript
const products = {
    'your-product': { name: 'Your Product', price: 9.99, category: 'ranks' },
    // Add more products...
};
```

### 3. Music Customization

#### Adding New Tracks
In `music-generator.js`, add new track generators:
```javascript
generateYourTheme() {
    // Your custom track logic
    return track;
}
```

#### Track Names
Update the `musicTracks` array in `script.js`:
```javascript
const musicTracks = [
    { name: 'Your Track Name', generator: 'yourTheme' },
    // Add more tracks...
];
```

## 🎯 Key Features Explained

### Music System
The website uses Web Audio API to generate copyright-free music in real-time. Each track is procedurally generated with different themes:
- **Surf Theme**: Wave-like sounds
- **Adventure Theme**: Ascending melodies
- **Mining Theme**: Repetitive rhythms
- **Crafting Theme**: Simple melodies
- **End Dimension**: Mysterious tones

### Store System
The store includes:
- **Category Filtering**: Filter products by type
- **Shopping Cart**: Add/remove items
- **Price Calculation**: Automatic total calculation
- **Checkout Process**: Simulated payment

### Animations
- **Scroll Animations**: Elements fade in as you scroll
- **Hover Effects**: Interactive elements respond to mouse hover
- **Loading States**: Smooth transitions for all interactions
- **Particle System**: Dynamic background particles

## 🌐 Browser Support

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Responsive design works on all devices

## 🔧 Technical Details

### Dependencies
- **Font Awesome**: Icons
- **Google Fonts**: Orbitron and Roboto fonts
- **Web Audio API**: Music generation
- **CSS Grid/Flexbox**: Layout system

### Performance
- **Optimized CSS**: Efficient animations and transitions
- **Lazy Loading**: Images load as needed
- **Minimal JavaScript**: Lightweight and fast
- **Responsive Images**: Optimized for different screen sizes

## 🎨 Customization Tips

### Adding Your Brand Colors
1. Update CSS variables in `styles.css`
2. Test color combinations for accessibility
3. Ensure good contrast ratios

### Adding New Sections
1. Add HTML structure in `index.html`
2. Style with CSS in `styles.css`
3. Add JavaScript functionality in `script.js`
4. Update navigation menu

### SEO Optimization
- Update meta tags in `index.html`
- Add alt text to images
- Use semantic HTML structure
- Add structured data markup

## 🚀 Deployment

### GitHub Pages
1. Upload files to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Your site will be available at `username.github.io/repository-name`

### Traditional Web Hosting
1. Upload all files to your web server
2. Ensure proper file permissions
3. Test all functionality

### CDN Integration
Consider using a CDN for:
- Font Awesome icons
- Google Fonts
- Static assets

## 🐛 Troubleshooting

### Music Not Playing
- Check browser autoplay policies
- Ensure Web Audio API is supported
- Check browser console for errors

### Animations Not Working
- Verify CSS is properly linked
- Check for JavaScript errors
- Ensure modern browser support

### Mobile Issues
- Test responsive design
- Check touch interactions
- Verify viewport meta tag

## 📞 Support

For issues or questions:
- Check browser console for errors
- Verify all files are properly linked
- Test in different browsers
- Ensure web server is configured correctly

## 🎉 Enjoy Your New Website!

Your SurfNetwork Minecraft server website is now ready! The site includes all the features you requested:
- ✅ Modern, animated design
- ✅ Interactive store with cart functionality
- ✅ Custom music system with multiple tracks
- ✅ Music player with now playing popup
- ✅ Server IP copy button
- ✅ Human-like touches and personalization
- ✅ Responsive design for all devices
- ✅ Smooth animations throughout

The website is designed to look professional while maintaining a personal touch that shows it was custom-built for your server. All animations are smooth, the music system creates copyright-free tracks, and the store provides a complete e-commerce experience.

**Made with ❤️ for SurfNetwork Minecraft Server**
