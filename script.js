document.addEventListener('DOMContentLoaded', function() {
    // Global state for optimization toggle
    let isOptimizedView = true;
    
    // Filter state
    let currentFilter = 'all';
    let selectedDay = null;
    
    // Mock data
    const subjects = [
        { name: 'Computer Science', code: 'CS101', id: 1 },
        { name: 'Mathematics', code: 'MATH201', id: 2 },
        { name: 'Physics', code: 'PHY301', id: 3 },
        { name: 'Chemistry', code: 'CHEM101', id: 4 },
        { name: 'Biology', code: 'BIO201', id: 5 }
    ];
    
    // Updated professors array with hasNotification property
    const professors = [
        { name: 'Dr. Smith', email: 'smith@university.edu', hasNotification: true },
        { name: 'Prof. Johnson', email: 'johnson@university.edu', hasNotification: false },
        { name: 'Dr. Williams', email: 'williams@university.edu', hasNotification: true },
        { name: 'Prof. Brown', email: 'brown@university.edu', hasNotification: false }
    ];
    
    // New events array with date, type, and title
    const events = [
        { date: '2025-11-15', type: 'Deadline', title: 'Database Assignment Due' },
        { date: '2025-11-18', type: 'Assignment', title: 'Web Development Project' },
        { date: '2025-11-20', type: 'Deadline', title: 'Algorithm Quiz' },
        { date: '2025-11-22', type: 'Assignment', title: 'Physics Lab Report' },
        { date: '2025-11-25', type: 'Deadline', title: 'Chemistry Presentation' },
        { date: '2025-11-28', type: 'Assignment', title: 'Biology Research Paper' },
        { date: '2025-12-01', type: 'Deadline', title: 'Math Final Project' },
        { date: '2025-12-05', type: 'Assignment', title: 'CS Implementation' }
    ];
    
    // Notifications now include a type for icon and styling (info, warning, success)
    const notifications = [
        { message: 'New assignment posted in CS101', type: 'info' },
        { message: 'Office hours changed for MATH201', type: 'warning' },
        { message: 'Grade updated for PHY301', type: 'success' }
    ];

    // Render notifications into the dropdown and update badge
    function renderNotifications() {
        const dropdown = document.getElementById('notification-dropdown');
        if (!dropdown) return;

        const iconMap = {
            info: 'ℹ️',
            warning: '⚠️',
            success: '✅'
        };

        if (notifications.length === 0) {
            dropdown.innerHTML = '<div class="notification-item"><span class="notif-icon">ℹ️</span><div class="notif-text">No notifications</div></div>';
        } else {
            dropdown.innerHTML = `
                <h4>Recent Notifications</h4>
                ${notifications.map(n => `
                    <div class="notification-item ${n.type}">
                        <span class="notif-icon">${iconMap[n.type] || 'ℹ️'}</span>
                        <div class="notif-text">${n.message}</div>
                    </div>
                `).join('')}
                <div style="text-align: right; margin-top: 8px;">
                    <button id="clear-notifications" class="clear-notifications-btn">Clear</button>
                </div>
            `;
        }

        const badge = document.getElementById('notification-badge');
        if (badge) {
            badge.textContent = notifications.length;
            badge.style.display = notifications.length > 0 ? 'flex' : 'none';
        }

        const clearBtn = document.getElementById('clear-notifications');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                notifications.length = 0; // clear mock data
                renderNotifications();
                showToast('Notifications cleared', '🧹');
            });
        }
    }

    // Generate a simple random email for the static un-optimized page
    function generateRandomEmail() {
        const names = ['alex','sam','morgan','jordan','taylor','casey','chris','pat','lee','jamie','devon','riley'];
        const domains = ['example.com','mail.com','student.edu','inbox.com','university.edu'];
        const name = names[Math.floor(Math.random() * names.length)];
        const num = Math.floor(Math.random() * 900) + 100;
        const domain = domains[Math.floor(Math.random() * domains.length)];
        return `${name}${num}@${domain}`;
    }
    
    // Toast notification function
    function showToast(message, icon = '✓') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Dark Mode Toggle Logic
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️ Light Mode';
    }
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        // Save preference to localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update button text
        this.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
        
        // Show toast notification
        showToast(isDark ? 'Dark mode activated' : 'Light mode activated', isDark ? '🌙' : '☀️');
    });
    
    // DOM element selectors
    const toggleBtn = document.getElementById('toggle-view-btn');
    const subjectList = document.getElementById('subject-list');
    const timelineEventsContainer = document.getElementById('timeline-events');
    const professorsList = document.getElementById('professors-list');
    const notificationsLink = document.getElementById('notifications-link');
    const notificationBadge = document.getElementById('notification-badge');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const viewProfileLink = document.getElementById('view-profile-link');
    const seeAllBtn = document.getElementById('see-all-btn');
    const upcomingEventsSimple = document.getElementById('upcoming-events-simple');
    const viewFullCalendarBtn = document.getElementById('view-full-calendar-btn');
    const calendarModal = document.getElementById('calendar-modal');
    const closeCalendarModal = document.getElementById('close-calendar-modal');
    const mainContent = document.querySelector('.main-content');
    const rightSidebar = document.querySelector('.right-sidebar');
    
    // Populate subject list
    function populateSubjects() {
        subjectList.innerHTML = '';
        subjects.forEach(subject => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="subject-name">${subject.name}</div>
                <div class="subject-code">${subject.code}</div>
            `;
            li.addEventListener('click', function() {
                // Remove selected class from all items
                document.querySelectorAll('#subject-list li').forEach(item => {
                    item.classList.remove('selected-subject');
                });
                // Add selected class to clicked item
                this.classList.add('selected-subject');
                showToast(`Selected: ${subject.name} (${subject.code})`, '📚');
            });
            subjectList.appendChild(li);
        });
    }
    
    // Show next 3 upcoming events (Simplified view)
    function showUpcomingEvents() {
        upcomingEventsSimple.innerHTML = '';
        
        if (!isOptimizedView) {
            upcomingEventsSimple.style.display = 'none';
            viewFullCalendarBtn.style.display = 'none';
            const filters = document.querySelector('.calendar-filters');
            if (filters) filters.style.display = 'none';
            return;
        }
        
        upcomingEventsSimple.style.display = 'flex';
        viewFullCalendarBtn.style.display = 'block';
        const filters = document.querySelector('.calendar-filters');
        if (filters) filters.style.display = 'flex';
        
        // Get today's date
        const today = new Date();
        
        // Filter and sort upcoming events based on currentFilter
        let upcomingEvents = events
            .map(event => ({
                ...event,
                dateObj: new Date(event.date)
            }))
            .filter(event => event.dateObj >= today)
            .sort((a, b) => a.dateObj - b.dateObj);
        
        // Apply filter
        if (currentFilter === 'assignments') {
            upcomingEvents = upcomingEvents.filter(e => e.type === 'Assignment');
        } else if (currentFilter === 'deadlines') {
            upcomingEvents = upcomingEvents.filter(e => e.type === 'Deadline');
        }
        
        // Update counts
        const totalUpcoming = events.filter(e => new Date(e.date) >= today).length;
        const assignmentCount = events.filter(e => new Date(e.date) >= today && e.type === 'Assignment').length;
        const deadlineCount = events.filter(e => new Date(e.date) >= today && e.type === 'Deadline').length;
        
        const allCountEl = document.getElementById('all-count');
        const assignmentsCountEl = document.getElementById('assignments-count');
        const deadlinesCountEl = document.getElementById('deadlines-count');
        
        if (allCountEl) allCountEl.textContent = totalUpcoming;
        if (assignmentsCountEl) assignmentsCountEl.textContent = assignmentCount;
        if (deadlinesCountEl) deadlinesCountEl.textContent = deadlineCount;
        
        // Take first 3
        upcomingEvents = upcomingEvents.slice(0, 3);
        
        if (upcomingEvents.length === 0) {
            upcomingEventsSimple.innerHTML = '<p style="color: #666; font-size: 14px;">No upcoming events</p>';
            return;
        }
        
        upcomingEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = `upcoming-event-item ${event.type.toLowerCase()}`;
            
            const dateStr = event.dateObj.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
            
            eventDiv.innerHTML = `
                <div class="upcoming-event-title">${event.title}</div>
                <div class="upcoming-event-date">${dateStr} • ${event.type}</div>
            `;
            
            // Add click handler to show alert with event details
            eventDiv.addEventListener('click', function() {
                alert(`Event Details:\n\nTitle: ${event.title}\nType: ${event.type}\nDate: ${dateStr}\n\nClick OK to close.`);
            });
            
            upcomingEventsSimple.appendChild(eventDiv);
        });
    }
    
    // Calendar Filter Buttons
    document.getElementById('filter-all').addEventListener('click', function() {
        currentFilter = 'all';
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        showUpcomingEvents();
    });
    
    document.getElementById('filter-assignments').addEventListener('click', function() {
        currentFilter = 'assignments';
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        showUpcomingEvents();
    });
    
    document.getElementById('filter-deadlines').addEventListener('click', function() {
        currentFilter = 'deadlines';
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        showUpcomingEvents();
    });
    
    // View Full Calendar Button
    viewFullCalendarBtn.addEventListener('click', function() {
        calendarModal.style.display = 'flex';
        renderModalCalendar();
        showToast('Opening full calendar...', '📅');
    });
    
    // Close Calendar Modal
    closeCalendarModal.addEventListener('click', function() {
        calendarModal.style.display = 'none';
        selectedDay = null; // Reset selected day when closing
    });
    
    // Close modal when clicking outside
    calendarModal.addEventListener('click', function(e) {
        if (e.target === calendarModal) {
            calendarModal.style.display = 'none';
        }
    });
    
    // Calendar functionality
    let currentDate = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    function renderModalCalendar() {
        const modalContainer = document.getElementById('modal-calendar-container');
        modalContainer.innerHTML = `
            <div class="calendar-container" style="display: block;">
                <h3 style="margin-bottom: 16px;">Full Interactive Calendar</h3>
                <div class="calendar-header">
                    <button id="modal-prev-month" class="calendar-nav">&lt;</button>
                    <span id="modal-month-year" style="font-size: 18px; font-weight: 600;"></span>
                    <button id="modal-next-month" class="calendar-nav">&gt;</button>
                </div>
                <div class="calendar-days-header" id="modal-calendar-days-header"></div>
                <div class="calendar-grid" id="modal-calendar-days"></div>
                <div id="modal-selected-day-events" class="selected-day-events" style="display: none;"></div>
            </div>
        `;
        
        renderCalendar('modal');
        
        document.getElementById('modal-prev-month').addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar('modal');
        });
        
        document.getElementById('modal-next-month').addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar('modal');
        });
    }
    
    function renderCalendar(prefix = 'modal') {
        const monthYearElement = document.getElementById(prefix ? `${prefix}-month-year` : 'month-year');
        const calendarDaysHeader = document.getElementById(prefix ? `${prefix}-calendar-days-header` : 'calendar-days-header');
        const calendarDays = document.getElementById(prefix ? `${prefix}-calendar-days` : 'calendar-days');
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month header
        monthYearElement.textContent = `${monthNames[month]} ${year}`;
        
        // Clear existing calendar
        calendarDaysHeader.innerHTML = '';
        calendarDays.innerHTML = '';
        
        // Add day headers
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarDaysHeader.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Add previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day other-month';
            dayDiv.textContent = daysInPrevMonth - i;
            calendarDays.appendChild(dayDiv);
        }
        
        // Add current month's days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            
            const currentDay = new Date(year, month, day);
            const dayString = currentDay.toISOString().split('T')[0];
            
            // Check if this is today
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayDiv.classList.add('today');
            }
            
            // Check if this is the selected day
            if (selectedDay && selectedDay === dayString) {
                dayDiv.classList.add('selected');
            }
            
            // Check for events on this day
            const eventsOnDay = events.filter(event => event.date === dayString);
            
            // Create day content with colored dots underneath
            const dayNumber = document.createElement('div');
            dayNumber.textContent = day;
            dayDiv.appendChild(dayNumber);
            
            if (eventsOnDay.length > 0) {
                const dotsContainer = document.createElement('div');
                dotsContainer.style.cssText = 'display: flex; gap: 3px; justify-content: center; margin-top: 2px;';
                
                // Show up to 3 dots
                eventsOnDay.slice(0, 3).forEach(event => {
                    const dot = document.createElement('span');
                    dot.style.cssText = `
                        width: 5px;
                        height: 5px;
                        border-radius: 50%;
                        display: inline-block;
                        background: ${event.type === 'Deadline' ? '#FF3B30' : '#34C759'};
                    `;
                    dotsContainer.appendChild(dot);
                });
                
                dayDiv.appendChild(dotsContainer);
                dayDiv.classList.add('has-event');
                
                // Add click event to show events and select day
                dayDiv.addEventListener('click', function() {
                    selectedDay = dayString;
                    showDayEvents(currentDay, eventsOnDay, prefix);
                    renderCalendar(prefix); // Re-render to update selected styling
                });
            } else {
                // Even if no events, allow clicking to select
                dayDiv.addEventListener('click', function() {
                    selectedDay = dayString;
                    renderCalendar(prefix); // Re-render to update selected styling
                    // Clear event details section
                    const eventDetailsSection = document.getElementById('selected-day-events');
                    if (eventDetailsSection) {
                        eventDetailsSection.innerHTML = `
                            <h4>Selected: ${currentDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                            <p style="color: #666;">No events on this day</p>
                        `;
                    }
                });
            }
            
            calendarDays.appendChild(dayDiv);
        }
        
        // Add next month's leading days
        const totalCells = calendarDays.children.length;
        const remainingCells = 42 - totalCells;
        for (let day = 1; day <= remainingCells; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day other-month';
            dayDiv.textContent = day;
            calendarDays.appendChild(dayDiv);
        }
    }
    
    function showDayEvents(date, dayEvents, prefix = 'modal') {
        const selectedDayEvents = document.getElementById(prefix ? `${prefix}-selected-day-events` : 'selected-day-events');
        
        if (!selectedDayEvents) return;
        
        selectedDayEvents.style.display = 'block';
        
        const dateStr = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        selectedDayEvents.innerHTML = `
            <h4>📅 Events for ${dateStr}</h4>
            <div style="margin-top: 12px;">
                ${dayEvents.map(event => `
                    <div class="selected-event-item" style="
                        padding: 10px;
                        margin: 8px 0;
                        background: white;
                        border-radius: 8px;
                        border-left: 4px solid ${event.type === 'Deadline' ? '#FF3B30' : '#34C759'};
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    ">
                        <div style="font-weight: 600; color: #333; margin-bottom: 4px;">
                            ${event.type === 'Deadline' ? '🔴' : '🟢'} ${event.title}
                        </div>
                        <div style="font-size: 13px; color: #666;">
                            ${event.type}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Populate timeline events (for unoptimized view)
    function populateTimeline() {
        timelineEventsContainer.innerHTML = '';
        if (isOptimizedView) {
            // Hide simple timeline in optimized view
            timelineEventsContainer.style.display = 'none';
            return;
        }
        
        // Show simple timeline in unoptimized view
        timelineEventsContainer.style.display = 'block';
        events.slice(0, 5).forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = `timeline-event ${event.type.toLowerCase()}`;
            eventDiv.innerHTML = `
                <div class="event-title">${event.title}</div>
                <div class="event-date">${event.date}</div>
                <div class="event-type ${event.type.toLowerCase()}">${event.type}</div>
            `;
            timelineEventsContainer.appendChild(eventDiv);
        });
    }
    
    // Render right sidebar based on optimization state with fade animation
    function renderRightSidebar() {
        // Add fade out effect
        rightSidebar.classList.add('fade-out');
        
        setTimeout(() => {
            // Clear professors list
            professorsList.innerHTML = '';
            
            // Hide notification dropdown
            notificationDropdown.style.display = 'none';
            
            professors.forEach(professor => {
                const li = document.createElement('li');
                
                if (isOptimizedView) {
                    // OPTIMIZED VIEW: Gmail compose links and schedule
                    // Compose URL with pre-filled subject and body
                    const subject = encodeURIComponent('Question about your course');
                    const body = encodeURIComponent(`Hi ${professor.name},\n\nI have a question about your course and would appreciate your guidance. Could we schedule a time to discuss?\n\nThanks,\n[Your Name]`);
                    const gmailComposeURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(professor.email)}&su=${subject}&body=${body}`;
                    
                    li.innerHTML = `
                        <div class="professor-name">
                            ${professor.name}
                            <span class="prof-notification-icon ${professor.hasNotification ? 'visible' : ''}"></span>
                        </div>
                        <div class="professor-email">${professor.email}</div>
                        <div class="professor-actions" style="margin-top: 8px;">
                            <a href="${gmailComposeURL}" target="_blank" class="action-link" style="color: #3b82f6; text-decoration: none; margin-right: 12px; font-size: 14px;">📧 Email</a>
                            <a href="#" class="schedule-link" style="color: #10b981; text-decoration: none; font-size: 14px;">📅 Schedule</a>
                        </div>
                    `;
                    
                    // Add event listener for schedule link
                    li.querySelector('.schedule-link').addEventListener('click', function(e) {
                        e.preventDefault();
                        showToast(`Opening calendar to schedule with ${professor.name}...`, '📅');
                    });
                    
                    // Add event listener for email link: explicitly open compose URL (prevent default)
                    const emailAnchor = li.querySelector('.action-link');
                    if (emailAnchor) {
                        emailAnchor.addEventListener('click', function(e) {
                            e.preventDefault();
                            // Open Gmail compose in a new tab/window
                            window.open(gmailComposeURL, '_blank');
                            showToast(`Opening Gmail to compose email to ${professor.name}...`, '📧');
                        });
                    }
                } else {
                    // UNOPTIMIZED VIEW: Plain text, no links, old-fashioned
                    li.innerHTML = `
                        <div style="color: #333; font-size: 13px; line-height: 1.6; font-family: 'Times New Roman', serif;">
                            <strong>${professor.name}</strong><br>
                            Email: ${professor.email}
                        </div>
                    `;
                }
                
                professorsList.appendChild(li);
            });
            
            // Update view profile link
            if (viewProfileLink) {
                if (isOptimizedView) {
                    viewProfileLink.style.display = 'inline';
                    viewProfileLink.textContent = 'View Profile';
                } else {
                    viewProfileLink.style.display = 'none';
                }
            }
            
            // Update email link for un-optimized view
            const profileEmailLink = document.getElementById('profile-email-link');
            if (profileEmailLink) {
                if (isOptimizedView) {
                    profileEmailLink.href = 'https://mail.google.com/';
                    profileEmailLink.target = '_blank';
                    profileEmailLink.style.pointerEvents = 'auto';
                    profileEmailLink.style.color = '#007AFF';
                    profileEmailLink.style.textDecoration = 'none';
                } else {
                    profileEmailLink.href = '#';
                    profileEmailLink.removeAttribute('target');
                    profileEmailLink.style.pointerEvents = 'none';
                    profileEmailLink.style.color = '#333';
                    profileEmailLink.style.textDecoration = 'none';
                    profileEmailLink.style.cursor = 'default';
                }
            }

            // Update/insert a random personal email next to the profile E-mail for the static un-optimized page
            const profileRandomEmailSpan = document.getElementById('profile-random-email');
            if (profileRandomEmailSpan) {
                if (!isOptimizedView) {
                    profileRandomEmailSpan.textContent = generateRandomEmail();
                    // visibility handled via CSS (.unoptimized-view .profile-random-email)
                } else {
                    profileRandomEmailSpan.textContent = '';
                }
            }
            
            if (notificationBadge) {
                notificationBadge.style.display = isOptimizedView ? 'flex' : 'none';
            }
            
            // Handle "See all" button state
            if (seeAllBtn) {
                if (isOptimizedView) {
                    seeAllBtn.disabled = false;
                    seeAllBtn.style.opacity = '1';
                    seeAllBtn.style.cursor = 'pointer';
                } else {
                    seeAllBtn.disabled = true;
                    seeAllBtn.style.opacity = '0.5';
                    seeAllBtn.style.cursor = 'not-allowed';
                }
            }
            
            // Remove fade out and trigger fade in
            rightSidebar.classList.remove('fade-out');
        }, 200);
    }
    
    // Event listeners for navigation menu
    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (!link.classList.contains('active')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const linkText = this.textContent.trim();
                showToast(`Navigating to ${linkText}...`, '🔗');
            });
        }
    });
    
    // Event listener for toggle button
    toggleBtn.addEventListener('click', function() {
        isOptimizedView = !isOptimizedView;
        this.textContent = isOptimizedView ? 'Show Un-optimized Version' : 'Show Optimized Version';
        
        // Toggle body class for unoptimized styling
        if (isOptimizedView) {
            document.body.classList.remove('unoptimized-view');
        } else {
            document.body.classList.add('unoptimized-view');
        }
        
        // Add fade animation to main content
        mainContent.classList.add('fade-out');
        
        setTimeout(() => {
            renderRightSidebar();
            populateTimeline();
            showUpcomingEvents();
            mainContent.classList.remove('fade-out');
        }, 200);
        
        // Show toast notification
        const message = isOptimizedView ? 
            'Switched to Optimized View - Modern UI/UX!' : 
            'Switched to Un-optimized View - Old static design!';
        showToast(message, isOptimizedView ? '🚀' : '⚠️');
    });
    
    // Notifications link - Show dropdown instead of alert
    if (notificationsLink) {
        notificationsLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isOptimizedView) {
                // OPTIMIZED: Toggle dropdown menu
                if (notificationDropdown.style.display === 'block') {
                    notificationDropdown.style.display = 'none';
                } else {
                    // Populate dropdown from notifications mock data and show
                    renderNotifications();
                    notificationDropdown.style.display = 'block';
                    showToast('Showing notifications', '🔔');
                }
            } else {
                // UNOPTIMIZED: Static text, no interaction - just show plain message
                notificationDropdown.innerHTML = `
                    <div style="padding: 12px; font-size: 13px; color: #333; font-family: 'Times New Roman', serif; line-height: 1.6;">
                        <strong>Notifications (${notifications.length}):</strong><br><br>
                        ${notifications.map((n, i) => `${i + 1}. ${n.message}`).join('<br>')}
                    </div>
                `;
                notificationDropdown.style.display = 'block';
            }
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (notificationsLink && notificationDropdown && 
            !notificationsLink.contains(e.target) && 
            !notificationDropdown.contains(e.target)) {
            notificationDropdown.style.display = 'none';
        }
    });
    
    if (viewProfileLink) {
        viewProfileLink.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Showing your full profile...', '👤');
        });
    }
    
    if (seeAllBtn) {
        seeAllBtn.addEventListener('click', function() {
            if (isOptimizedView) {
                showToast('Showing all professors...', '👥');
            }
        });
    }
    
    // Profile email link now navigates to Gmail; show a toast when clicked (optimized view only)
    const profileEmailLink = document.getElementById('profile-email-link');
    if (profileEmailLink) {
        profileEmailLink.addEventListener('click', function(e) {
            if (!isOptimizedView) {
                e.preventDefault();
                return false;
            }
            // Let the link open Gmail (target=_blank); provide non-intrusive feedback
            showToast('Opening Gmail...', '📧');
        });
    }
    
    // Initial calls
    populateSubjects();
    populateTimeline();
    renderRightSidebar();
    showUpcomingEvents();

    // Initialize notification UI
    renderNotifications();
    
    // Set initial filter button active state
    const filterAll = document.getElementById('filter-all');
    if (filterAll) {
        filterAll.classList.add('active');
    }
    
    // Log initial state
    console.log('✅ Student Dashboard loaded successfully!');
    console.log('🎨 Optimization state:', isOptimizedView ? 'Optimized' : 'Un-optimized');
    console.log('🌙 Theme:', document.body.classList.contains('dark-mode') ? 'Dark' : 'Light');
});