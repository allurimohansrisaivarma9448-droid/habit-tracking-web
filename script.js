// Habit Tracking System - Web Version
// Replicating the Java Swing application functionality

class HabitTracker {
    constructor() {
        this.habits = [];
        this.dailyChallenge = null;
        this.dailyGoal = 0;
        this.currentPoints = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.badges = new Set();
        this.history = [];
        this.dayStarted = false;
        this.activeDays = 0;
        this.shownMilestones = new Set();

        this.initializeEventListeners();
        this.initializeTheme();
        this.loadFromLocalStorage();
    }

    initializeEventListeners() {
        // Welcome screen buttons
        document.getElementById('start-day-btn').addEventListener('click', () => this.showGoalModal());
        document.getElementById('view-stats-btn').addEventListener('click', () => this.showStatsScreen());

        // Daily screen buttons
        document.getElementById('add-habit-btn').addEventListener('click', () => this.showHabitModal());
        document.getElementById('edit-habit-btn').addEventListener('click', () => this.editHabit());
        document.getElementById('remove-habit-btn').addEventListener('click', () => this.removeHabit());
        document.getElementById('refresh-btn').addEventListener('click', () => this.refreshHabitsTable());

        document.getElementById('take-break-btn').addEventListener('click', () => this.takeBreak());
        document.getElementById('end-day-btn').addEventListener('click', () => this.endDay());
        document.getElementById('back-home-btn').addEventListener('click', () => this.showWelcomeScreen());

        // Stats screen
        document.getElementById('back-from-stats-btn').addEventListener('click', () => this.showWelcomeScreen());

        // Goal modal interactions
        document.getElementById('goal-ok-btn').addEventListener('click', () => this.startNewDay());
        document.getElementById('goal-cancel-btn').addEventListener('click', () => this.hideGoalModal());

        // Goal preset selection
        document.querySelectorAll('.goal-preset-card').forEach(card => {
            card.addEventListener('click', () => this.selectGoalPreset(card));
        });

        // Custom goal input validation
        document.getElementById('custom-goal-input').addEventListener('input', (e) => {
            this.validateCustomGoal(e.target.value);
        });

        document.getElementById('habit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveHabit();
        });
        document.getElementById('habit-cancel-btn').addEventListener('click', () => this.hideHabitModal());

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    }

    // Screen navigation
    showWelcomeScreen() {
        this.setActiveScreen('welcome-screen');
    }

    showDailyScreen() {
        this.setActiveScreen('daily-screen');
    }

    showStatsScreen() {
        this.setActiveScreen('stats-screen');
        this.updateStatsDisplay();
    }

    setActiveScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    // Modal management
    showGoalModal() {
        // Reset modal state
        document.querySelectorAll('.goal-preset-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.getElementById('custom-goal-input').value = '';
        document.getElementById('goal-ok-btn').disabled = true;

        document.getElementById('goal-modal').classList.add('active');
    }

    hideGoalModal() {
        document.getElementById('goal-modal').classList.remove('active');
        // Reset state
        this.selectedGoal = null;
        document.querySelectorAll('.goal-preset-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.getElementById('custom-goal-input').value = '';
    }

    selectGoalPreset(card) {
        // Remove selected class from all cards
        document.querySelectorAll('.goal-preset-card').forEach(c => {
            c.classList.remove('selected');
        });

        // Add selected class to clicked card
        card.classList.add('selected');

        const goal = card.dataset.goal;

        if (goal === 'custom') {
            // Handle custom goal
            document.getElementById('custom-goal-input').focus();
            this.selectedGoal = null;
            document.getElementById('goal-ok-btn').disabled = true;
        } else {
            // Handle preset goal
            this.selectedGoal = parseInt(goal);
            document.getElementById('goal-ok-btn').disabled = false;
            document.getElementById('custom-goal-input').value = ''; // Clear custom input
        }
    }

    validateCustomGoal(value) {
        const customCard = document.querySelector('.goal-preset-card.custom');
        const okButton = document.getElementById('goal-ok-btn');

        if (!value) {
            customCard.classList.remove('selected');
            this.selectedGoal = null;
            okButton.disabled = true;
            return;
        }

        const numValue = parseInt(value);
        if (numValue >= 1000 && numValue <= 9999) {
            customCard.classList.add('selected');
            this.selectedGoal = numValue;
            okButton.disabled = false;
        } else {
            customCard.classList.remove('selected');
            this.selectedGoal = null;
            okButton.disabled = true;
        }
    }

    showHabitModal(habit = null) {
        if (!this.dayStarted) {
            alert('Please start a day first!');
            return;
        }

        const modal = document.getElementById('habit-modal');
        const form = document.getElementById('habit-form');
        const title = document.getElementById('habit-modal-title');

        if (habit) {
            title.textContent = 'Edit Habit';
            document.getElementById('habit-category').value = habit.category;
            document.getElementById('habit-name').value = habit.name;
            document.getElementById('habit-priority').value = habit.priority;
            document.getElementById('habit-points').value = habit.points;
            form.dataset.editIndex = this.habits.indexOf(habit);
        } else {
            title.textContent = 'Add New Habit';
            form.reset();
            delete form.dataset.editIndex;
        }

        modal.classList.add('active');
        document.getElementById('habit-name').focus();
    }

    hideHabitModal() {
        document.getElementById('habit-modal').classList.remove('active');
    }

    showMilestone(message) {
        const modal = document.getElementById('milestone-modal');
        const messageElement = document.getElementById('milestone-message');

        messageElement.textContent = message;
        modal.classList.add('active');

        // Add celebration effect
        this.createConfetti();

        setTimeout(() => {
            modal.classList.remove('active');
        }, 3000);
    }

    createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

            confettiContainer.appendChild(confetti);
        }

        document.body.appendChild(confettiContainer);

        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 5000);
    }

    showFormError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        formGroup.classList.add('error');
        formGroup.classList.remove('success');

        let errorElement = formGroup.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'form-error';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;

        inputElement.focus();

        setTimeout(() => {
            formGroup.classList.remove('error');
            if (errorElement) errorElement.remove();
        }, 3000);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Core functionality
    startNewDay() {
        if (!this.selectedGoal) {
            this.showToast('Please select a daily goal first!', 'error');
            return;
        }

        this.habits = [];
        this.shownMilestones.clear();
        this.dailyGoal = this.selectedGoal;
        this.currentPoints = 0;
        this.dailyChallenge = new RandomChallenge();
        this.dayStarted = true;
        this.activeDays++;

        this.refreshHabitsTable();
        this.updateProgress();
        this.hideGoalModal();
        this.showDailyScreen();

        this.showToast(`New day started!\nDaily Challenge: ${this.dailyChallenge.getDescription()}`, 'success');
    }

    saveHabit() {
        const category = document.getElementById('habit-category').value;
        const name = document.getElementById('habit-name').value.trim();
        const priority = document.getElementById('habit-priority').value;
        const points = parseInt(document.getElementById('habit-points').value);

        // Clear previous errors
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
            const error = group.querySelector('.form-error');
            if (error) error.remove();
        });

        let hasErrors = false;

        if (!name) {
            this.showFormError(document.getElementById('habit-name'), 'Habit name cannot be empty!');
            hasErrors = true;
        }

        const maxPoints = this.getMaxPointsForCategory(category);
        if (isNaN(points) || points < 1 || points > maxPoints) {
            this.showFormError(document.getElementById('habit-points'), `Points must be between 1 and ${maxPoints}`);
            hasErrors = true;
        }

        if (hasErrors) return;

        const habitData = { name, category, priority, points, completed: false };
        const form = document.getElementById('habit-form');

        if (form.dataset.editIndex !== undefined) {
            // Edit existing habit
            const index = parseInt(form.dataset.editIndex);
            this.habits[index] = habitData;
            this.showToast('Habit updated successfully!', 'success');
        } else {
            // Add new habit
            this.habits.push(habitData);
            this.showToast('Habit added successfully!', 'success');
        }

        this.habits.sort(this.compareHabits.bind(this));
        this.refreshHabitsTable();
        this.hideHabitModal();
        this.saveToLocalStorage();
    }

    editHabit() {
        const selectedRow = document.querySelector('.habits-table tbody tr.selected');
        if (!selectedRow) {
            alert('Please select a habit to edit!');
            return;
        }

        const index = parseInt(selectedRow.dataset.index);
        const habit = this.habits[index];
        this.showHabitModal(habit);
    }

    removeHabit() {
        const selectedRow = document.querySelector('.habits-table tbody tr.selected');
        if (!selectedRow) {
            alert('Please select a habit to remove!');
            return;
        }

        if (!confirm('Are you sure you want to remove this habit?')) {
            return;
        }

        const index = parseInt(selectedRow.dataset.index);
        this.habits.splice(index, 1);
        this.refreshHabitsTable();
        this.updateProgress();
        this.saveToLocalStorage();
        alert('Habit removed successfully!');
    }

    refreshHabitsTable() {
        const tbody = document.getElementById('habits-table-body');
        tbody.innerHTML = '';

        this.habits.forEach((habit, index) => {
            const row = document.createElement('tr');
            row.dataset.index = index;

            const categoryClass = `category-${habit.category.toLowerCase().replace('_', '-')}`;
            const priorityClass = `priority-${habit.priority.toLowerCase()}`;

            row.innerHTML = `
                <td><input type="checkbox" ${habit.completed ? 'checked' : ''} onchange="app.toggleHabit(${index})"></td>
                <td>${habit.name}</td>
                <td><span class="category-badge ${categoryClass}">${this.formatCategory(habit.category)}</span></td>
                <td><span class="${priorityClass}">${habit.priority}</span></td>
                <td><strong>${habit.points}</strong></td>
            `;

            row.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    document.querySelectorAll('.habits-table tbody tr').forEach(r => r.classList.remove('selected'));
                    row.classList.add('selected');
                }
            });

            tbody.appendChild(row);
        });
    }

    toggleHabit(index) {
        const habit = this.habits[index];
        habit.completed = !habit.completed;
        this.updateProgress();
        this.saveToLocalStorage();
    }

    updateProgress() {
        this.currentPoints = this.habits
            .filter(habit => habit.completed)
            .reduce((sum, habit) => sum + habit.points, 0);

        if (this.dailyChallenge) {
            this.dailyChallenge.checkChallenge(this.habits, this.currentPoints);
            if (this.dailyChallenge.completed) {
                this.currentPoints += this.dailyChallenge.bonusPoints;
            }
        }

        const percentage = Math.min(100, (this.currentPoints * 100) / this.dailyGoal);

        // Update displays
        document.getElementById('points-display').textContent = `Points: ${this.currentPoints}/${this.dailyGoal}`;
        document.getElementById('progress-fill').style.width = `${percentage}%`;
        document.getElementById('progress-text').textContent = `Progress: ${percentage.toFixed(2)}%`;
        document.getElementById('streak-display').textContent = `Streak: ${this.currentStreak} days | Best: ${this.bestStreak} days`;

        if (this.dailyChallenge) {
            const status = this.dailyChallenge.completed ? '[COMPLETED]' : '[In Progress]';
            document.getElementById('challenge-display').textContent =
                `Daily Challenge: ${this.dailyChallenge.getDescription()} ${status}`;
        }

        // Check milestones
        this.checkMilestones(percentage);
    }

    checkMilestones(percentage) {
        if (percentage >= 50 && !this.shownMilestones.has('50')) {
            this.shownMilestones.add('50');
            this.showMilestone('50% Milestone Reached!');
        }

        if (percentage >= 80 && !this.shownMilestones.has('80')) {
            this.shownMilestones.add('80');
            this.showMilestone('80% Milestone Reached!');
        }

        if (percentage >= 100 && !this.shownMilestones.has('100')) {
            this.shownMilestones.add('100');
            this.showMilestone('100% Goal Achieved!');
        }
    }

    takeBreak() {
        const options = ['Resume', 'End Day', 'Close App'];
        const choice = confirm('Taking a break...\n\nClick OK to Resume or Cancel to End Day');

        if (!choice) {
            this.endDay();
        }
    }

    endDay() {
        if (!this.dayStarted) {
            alert('No active day to end!');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        this.history.push({
            date: today,
            pointsEarned: this.currentPoints,
            goalPoints: this.dailyGoal
        });

        if (this.currentPoints >= this.dailyGoal) {
            this.currentStreak++;
            if (this.currentStreak > this.bestStreak) {
                this.bestStreak = this.currentStreak;
            }

            if (this.currentStreak === 3 && !this.badges.has('BRONZE')) this.badges.add('BRONZE');
            if (this.currentStreak === 7 && !this.badges.has('SILVER')) this.badges.add('SILVER');
            if (this.currentStreak === 14 && !this.badges.has('GOLD')) this.badges.add('GOLD');
        } else {
            this.currentStreak = 0;
        }

        let summary = 'Day Complete!\n\n';
        summary += `Points Earned: ${this.currentPoints}/${this.dailyGoal}\n`;
        summary += `Completion: ${(Math.min(100, (this.currentPoints * 100) / this.dailyGoal)).toFixed(2)}%\n`;
        summary += `Current Streak: ${this.currentStreak} days\n`;

        if (this.dailyChallenge && this.dailyChallenge.completed) {
            summary += `\nDaily Challenge Completed! +${this.dailyChallenge.bonusPoints} bonus points\n`;
        }

        if (this.badges.size > 0) {
            summary += `\nBadges Earned: ${Array.from(this.badges).join(', ')}`;
        }

        alert(summary);

        this.dayStarted = false;
        this.saveToLocalStorage();
        this.showWelcomeScreen();
    }

    updateStatsDisplay() {
        const totalPoints = this.history.reduce((sum, day) => sum + day.pointsEarned, 0);
        const totalGoals = this.history.reduce((sum, day) => sum + day.goalPoints, 0);
        const avgCompletion = totalGoals > 0 ? Math.min(100, (totalPoints * 100) / totalGoals) : 0;

        let stats = '\n  ===========================================\n';
        stats += '               OVERALL PROGRESS\n';
        stats += '  ===========================================\n\n';
        stats += `  Total Active Days:          ${this.activeDays}\n\n`;
        stats += `  Total Points Earned:        ${totalPoints}\n`;
        stats += `  Total Goal Points:          ${totalGoals}\n`;
        stats += `  Average Completion:         ${avgCompletion.toFixed(2)}%\n\n`;
        stats += `  Current Streak:             ${this.currentStreak} days\n`;
        stats += `  Best Streak:                ${this.bestStreak} days\n\n`;

        if (this.badges.size > 0) {
            stats += '  BADGES UNLOCKED:\n';
            Array.from(this.badges).forEach(badge => {
                stats += `     ${badge}\n`;
            });
        } else {
            stats += '  No badges unlocked yet\n';
        }

        stats += '\n  ===========================================\n';

        document.getElementById('stats-text').textContent = stats;
    }

    // Utility functions
    getMaxPointsForCategory(category) {
        const maxPoints = {
            'HEALTH': 200,
            'STUDY': 500,
            'SPORTS_HOBBY': 100
        };
        return maxPoints[category] || 100;
    }

    formatCategory(category) {
        const formats = {
            'HEALTH': 'Health',
            'STUDY': 'Study',
            'SPORTS_HOBBY': 'Sports & Hobby'
        };
        return formats[category] || category;
    }

    compareHabits(a, b) {
        const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.points - a.points;
    }


    // Local Storage persistence
    saveToLocalStorage() {
        const data = {
            habits: this.habits,
            dailyChallenge: this.dailyChallenge,
            dailyGoal: this.dailyGoal,
            currentPoints: this.currentPoints,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            badges: Array.from(this.badges),
            history: this.history,
            dayStarted: this.dayStarted,
            activeDays: this.activeDays,
            shownMilestones: Array.from(this.shownMilestones)
        };
        localStorage.setItem('habitTracker', JSON.stringify(data));
    }

    // Theme Management
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update theme toggle icon
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }

        // Add transition class to body for smooth theme switching
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);

        // Show toast notification
        this.showToast(`Switched to ${newTheme} theme`, 'info');
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('habitTracker');
        if (data) {
            const parsed = JSON.parse(data);
            this.habits = parsed.habits || [];
            this.dailyGoal = parsed.dailyGoal || 0;
            this.currentPoints = parsed.currentPoints || 0;
            this.currentStreak = parsed.currentStreak || 0;
            this.bestStreak = parsed.bestStreak || 0;
            this.badges = new Set(parsed.badges || []);
            this.history = parsed.history || [];
            this.dayStarted = parsed.dayStarted || false;
            this.activeDays = parsed.activeDays || 0;
            this.shownMilestones = new Set(parsed.shownMilestones || []);

            if (parsed.dailyChallenge) {
                this.dailyChallenge = new RandomChallenge();
                Object.assign(this.dailyChallenge, parsed.dailyChallenge);
            }

            if (this.dayStarted) {
                this.showDailyScreen();
                this.refreshHabitsTable();
                this.updateProgress();
            }
        }
    }
}

// Random Challenge class (similar to Java version)
class RandomChallenge {
    constructor() {
        this.challenges = [
            "Complete 3 High Priority Habits",
            "Earn 50 points from Health",
            "Mark 5 habits complete",
            "Complete all Study habits",
            "Earn 100 total points",
            "Complete 2 Study habits with 100+ points",
            "Achieve 300 points from mixed categories",
            "Mark all High Priority habits today",
            "Complete 7 habits regardless of priority",
            "Earn 75 points from Sports and Hobbies",
            "Complete one habit from each category",
            "Mark 10 habits complete total",
            "Earn 200 points combined from Study and Health",
            "Maintain Medium or High priority on 4 habits",
            "Complete 50% of total habit goals"
        ];

        this.description = this.challenges[Math.floor(Math.random() * this.challenges.length)];
        this.completed = false;
        this.bonusPoints = 200;
    }

    getDescription() {
        return this.description;
    }

    checkChallenge(habits, totalPoints) {
        if (this.completed) return;

        if (this.description.includes("3 High Priority")) {
            const highCount = habits.filter(h => h.completed && h.priority === 'HIGH').length;
            if (highCount >= 3) this.completed = true;
        } else if (this.description.includes("50 points from Health")) {
            const healthPoints = habits
                .filter(h => h.completed && h.category === 'HEALTH')
                .reduce((sum, h) => sum + h.points, 0);
            if (healthPoints >= 50) this.completed = true;
        } else if (this.description.includes("5 habits")) {
            const completedCount = habits.filter(h => h.completed).length;
            if (completedCount >= 5) this.completed = true;
        } else if (this.description.includes("all Study")) {
            const studyTotal = habits.filter(h => h.category === 'STUDY').length;
            const studyCompleted = habits.filter(h => h.completed && h.category === 'STUDY').length;
            if (studyTotal > 0 && studyTotal === studyCompleted) this.completed = true;
        } else if (this.description.includes("100 total")) {
            if (totalPoints >= 100) this.completed = true;
        } else if (this.description.includes("2 Study habits with 100+")) {
            const studyHighPoints = habits.filter(h => h.completed && h.category === 'STUDY' && h.points >= 100).length;
            if (studyHighPoints >= 2) this.completed = true;
        } else if (this.description.includes("300 points")) {
            if (totalPoints >= 300) this.completed = true;
        } else if (this.description.includes("all High Priority")) {
            const highTotal = habits.filter(h => h.priority === 'HIGH').length;
            const highCompleted = habits.filter(h => h.completed && h.priority === 'HIGH').length;
            if (highTotal > 0 && highTotal === highCompleted) this.completed = true;
        } else if (this.description.includes("7 habits")) {
            const completedCount = habits.filter(h => h.completed).length;
            if (completedCount >= 7) this.completed = true;
        } else if (this.description.includes("75 points from Sports")) {
            const sportsPoints = habits
                .filter(h => h.completed && h.category === 'SPORTS_HOBBY')
                .reduce((sum, h) => sum + h.points, 0);
            if (sportsPoints >= 75) this.completed = true;
        } else if (this.description.includes("one habit from each")) {
            const healthCount = habits.filter(h => h.completed && h.category === 'HEALTH').length;
            const studyCount = habits.filter(h => h.completed && h.category === 'STUDY').length;
            const sportsCount = habits.filter(h => h.completed && h.category === 'SPORTS_HOBBY').length;
            if (healthCount > 0 && studyCount > 0 && sportsCount > 0) this.completed = true;
        } else if (this.description.includes("10 habits")) {
            const completedCount = habits.filter(h => h.completed).length;
            if (completedCount >= 10) this.completed = true;
        } else if (this.description.includes("200 points")) {
            const combined = habits
                .filter(h => h.completed && (h.category === 'STUDY' || h.category === 'HEALTH'))
                .reduce((sum, h) => sum + h.points, 0);
            if (combined >= 200) this.completed = true;
        } else if (this.description.includes("4 habits")) {
            const mediumOrHighCount = habits.filter(h => h.completed && (h.priority === 'MEDIUM' || h.priority === 'HIGH')).length;
            if (mediumOrHighCount >= 4) this.completed = true;
        } else if (this.description.includes("50%")) {
            const totalHabits = habits.length;
            const completedCount = habits.filter(h => h.completed).length;
            if (totalHabits > 0 && completedCount >= (totalHabits / 2)) this.completed = true;
        }
    }
}

// Initialize the application
const app = new HabitTracker();
