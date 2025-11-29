# Habit Tracking System - Web Version

A modern web application that replicates the functionality of the Java Swing habit tracker, now running directly in your browser!

## Features

- **Daily Habit Tracking**: Set daily goals and track your habits
- **Categories**: Health, Study, and Sports & Hobby categories with different point limits
- **Priority System**: High, Medium, and Low priority habits
- **Daily Challenges**: Random challenges for bonus points
- **Progress Tracking**: Visual progress bar and milestone notifications
- **Statistics**: Comprehensive statistics and streak tracking
- **Badges**: Achievement system (Bronze, Silver, Gold)
- **Theme Toggle**: Switch between light and dark themes
- **Data Persistence**: All data saved locally in your browser

## How to Use

### Getting Started
1. Open `index.html` in Google Chrome (or any modern web browser)
2. Click "Start New Day" to begin
3. Choose from preset goals (Beginner 1,000 pts, Intermediate 2,500 pts, Advanced 4,000 pts) or set a custom goal (1000-9999 points)
4. Add habits using the "Add Habit" button

### Adding Habits
- **Category**: Choose from Health (max 200 pts), Study (max 500 pts), or Sports & Hobby (max 100 pts)
- **Priority**: High, Medium, or Low priority
- **Points**: Points earned when completed (within category limits)

### Daily Workflow
1. Check off completed habits by clicking the checkboxes
2. Monitor your progress with the progress bar
3. Complete daily challenges for bonus points
4. View milestones when you reach 50%, 80%, or 100% completion
5. End the day to save your progress and update streaks

### Features
- **Smart Goal Setting**: Choose from beginner, intermediate, or advanced preset goals, or set a custom target with helpful guidance
- **Statistics**: View overall progress, streaks, and badges
- **Theme Toggle**: Click the sun/moon icon in the header to switch between light and dark themes
- **Data Persistence**: Your data is automatically saved and restored
- **Responsive Design**: Works on desktop and mobile devices

## File Structure

```
habit-tracker-web/
├── index.html      # Main HTML file
├── styles.css      # Styling (modern, responsive design)
├── script.js       # Application logic (replicates Java Swing functionality)
└── README.md       # This file
```

## Browser Compatibility

Works in all modern browsers:
- Google Chrome (recommended)
- Firefox
- Safari
- Edge

## Data Storage

All data is stored locally in your browser using LocalStorage. Your habits, progress, statistics, and theme preference will persist between sessions.

## Differences from Java Version

- **Web-based**: Runs in browser instead of desktop application
- **Responsive**: Adapts to different screen sizes
- **Modern UI**: Clean, modern interface with smooth animations
- **Touch-friendly**: Works on tablets and phones
- **No installation**: Just open the HTML file

## Technical Details

- **Frontend**: Pure HTML/CSS/JavaScript (no frameworks required)
- **Data Storage**: Browser LocalStorage
- **Responsive**: CSS Grid and Flexbox
- **Animations**: CSS transitions and keyframes

## Future Enhancements

Potential improvements for the future:
- User accounts and cloud sync
- Habit templates and presets
- Detailed analytics and charts
- Social features and sharing
- Mobile app versions

## License

This project replicates the functionality of the original Java Swing application for web deployment.
