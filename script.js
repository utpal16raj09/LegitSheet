// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const menuItems = document.querySelectorAll('.menu li a');
    const sections = document.querySelectorAll('.section');
    
    // Upload
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const queueList = document.getElementById('queueList');
    
    // Notifications
    const notificationsBtn = document.querySelector('.notifications');
    const notificationItems = document.querySelectorAll('.notification-item');
    const notificationDismissBtns = document.querySelectorAll('.notification-dismiss');
    const markAllReadBtn = document.querySelector('.mark-all-read');
    
    // Modal
    const modal = document.getElementById('documentModal');
    const closeBtn = document.querySelector('.close-btn');
    const previewBtns = document.querySelectorAll('.validation-actions .btn:first-child');
    
    // Filters
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const refreshBtn = document.getElementById('refreshBtn');
    
    // Report
    const reportType = document.getElementById('reportType');
    const reportPeriod = document.getElementById('reportPeriod');
    const generateReportBtn = document.getElementById('generateReportBtn');
    
    // Navigation functionality
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all menu items and sections
            menuItems.forEach(menuItem => {
                menuItem.parentElement.classList.remove('active');
            });
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Add active class to clicked menu item
            this.parentElement.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // Upload functionality
    if (browseBtn) {
        browseBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
    }
    
    if (dropZone) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        // Handle dropped files
        dropZone.addEventListener('drop', handleDrop, false);
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropZone.classList.add('highlight');
    }
    
    function unhighlight() {
        dropZone.classList.remove('highlight');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    function handleFiles(files) {
        files = [...files];
        files.forEach(uploadFile);
    }
    
    function uploadFile(file) {
        // Create upload item element
        const uploadItem = document.createElement('div');
        uploadItem.className = 'upload-item';
        
        const fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = file.name;
        
        const fileSize = document.createElement('div');
        fileSize.className = 'file-size';
        fileSize.textContent = formatFileSize(file.size);
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        progressText.textContent = '0%';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(progressText);
        
        uploadItem.appendChild(fileName);
        uploadItem.appendChild(fileSize);
        uploadItem.appendChild(progressContainer);
        uploadItem.appendChild(cancelBtn);
        
        queueList.appendChild(uploadItem);
        
        // Simulate upload progress
        simulateUpload(progressBar, progressText, uploadItem);
        
        // Cancel button functionality
        cancelBtn.addEventListener('click', function() {
            uploadItem.remove();
        });
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    function simulateUpload(progressBar, progressText, uploadItem) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = progress + '%';
            progressText.textContent = Math.round(progress) + '%';
            
            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    uploadItem.classList.add('success');
                    progressText.textContent = 'Completed';
                    
                    // Add success icon
                    const successIcon = document.createElement('div');
                    successIcon.className = 'success-icon';
                    successIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                    uploadItem.appendChild(successIcon);
                    
                    // Add validation status
                    setTimeout(() => {
                        const validationStatus = document.createElement('div');
                        validationStatus.className = 'validation-status success';
                        validationStatus.textContent = 'Validated';
                        uploadItem.appendChild(validationStatus);
                    }, 1000);
                }, 500);
            }
        }, 200);
    }
    
    // Modal functionality
    previewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'flex';
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Filter functionality
    if (statusFilter) {
        statusFilter.addEventListener('change', filterValidationItems);
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', filterValidationItems);
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            // Reset filters
            statusFilter.value = 'all';
            dateFilter.value = 'today';
            
            // Show all validation items
            const validationItems = document.querySelectorAll('.validation-item');
            validationItems.forEach(item => {
                item.style.display = 'flex';
            });
        });
    }
    
    function filterValidationItems() {
        const status = statusFilter.value;
        const date = dateFilter.value;
        
        const validationItems = document.querySelectorAll('.validation-item');
        
        validationItems.forEach(item => {
            const itemStatus = getValidationItemStatus(item);
            const itemDate = getValidationItemDate(item);
            
            const statusMatch = status === 'all' || status === itemStatus;
            const dateMatch = date === 'today' || date === 'week' || date === 'month' || date === 'custom';
            
            if (statusMatch && dateMatch) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    function getValidationItemStatus(item) {
        const statusElement = item.querySelector('.validation-status');
        if (statusElement.classList.contains('success')) return 'validated';
        if (statusElement.classList.contains('warning')) return 'warning';
        if (statusElement.classList.contains('error')) return 'error';
        if (statusElement.classList.contains('pending')) return 'pending';
        return 'all';
    }
    
    function getValidationItemDate(item) {
        // In a real app, we would parse the date from the item
        // For this demo, we'll just return 'today'
        return 'today';
    }
    
    // Report generation functionality
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            const type = reportType.value;
            const period = reportPeriod.value;
            
            // Simulate report generation
            alert(`Generating ${type} report for ${period}...`);
            
            // In a real app, this would make an API call to generate the report
        });
    }
    
    // Add event listeners to all buttons to make them interactive
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Position the ripple
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (event.clientX - rect.left - size/2) + 'px';
            ripple.style.top = (event.clientY - rect.top - size/2) + 'px';
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add validation item functionality
    document.querySelectorAll('.validation-actions .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const action = this.querySelector('i').className;
            const item = this.closest('.validation-item');
            
            if (action.includes('eye')) {
                // Preview document
                modal.style.display = 'flex';
            } else if (action.includes('download')) {
                // Download document
                alert('Downloading document...');
            } else if (action.includes('edit')) {
                // Edit document
                alert('Opening document for editing...');
            } else if (action.includes('trash')) {
                // Delete document
                if (confirm('Are you sure you want to remove this document?')) {
                    item.remove();
                }
            }
        });
    });
    
    // Settings toggle functionality
    document.querySelectorAll('.switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.setting-item').querySelector('h4').textContent;
            const isEnabled = this.checked;
            
            console.log(`Setting "${settingName}" is now ${isEnabled ? 'enabled' : 'disabled'}`);
            
            // In a real app, this would make an API call to update the setting
        });
    });
    
    // Save settings functionality
    const saveSettingsBtn = document.querySelector('.settings-actions .btn.primary');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            alert('Settings saved successfully!');
        });
    }
    
    // Reset settings functionality
    const resetSettingsBtn = document.querySelector('.settings-actions .btn.secondary');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all settings to default?')) {
                document.querySelectorAll('.switch input').forEach(toggle => {
                    toggle.checked = true;
                });
                alert('Settings reset to default!');
            }
        });
    }

    // Add notification functionality
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            
            // Close other dropdowns if open
            document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                if (dropdown !== this) {
                    dropdown.classList.remove('active');
                }
            });
        });
        
        // Close notification dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!notificationsBtn.contains(e.target)) {
                notificationsBtn.classList.remove('active');
            }
        });
    }
    
    // Notification dismiss buttons
    if (notificationDismissBtns) {
        notificationDismissBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const notificationItem = this.closest('.notification-item');
                
                // Add fade-out animation
                notificationItem.style.opacity = '0';
                notificationItem.style.height = notificationItem.offsetHeight + 'px';
                notificationItem.style.marginTop = '0';
                notificationItem.style.marginBottom = '0';
                notificationItem.style.paddingTop = '0';
                notificationItem.style.paddingBottom = '0';
                
                setTimeout(() => {
                    notificationItem.style.height = '0';
                    
                    setTimeout(() => {
                        notificationItem.remove();
                        
                        // Update badge count
                        updateNotificationBadge();
                    }, 300);
                }, 200);
            });
        });
    }
    
    // Mark all as read functionality
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });
            
            // Update notification badge (set to 0)
            const badge = document.querySelector('.notifications .badge');
            if (badge) {
                badge.textContent = '0';
                badge.style.display = 'none';
            }
        });
    }
    
    // Function to update notification badge count
    function updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notifications .badge');
        
        if (badge) {
            badge.textContent = unreadCount;
            
            if (unreadCount === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'flex';
            }
        }
    }

    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .upload-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            background-color: var(--background-light);
            border-radius: 4px;
            margin-bottom: 1rem;
            position: relative;
        }
        
        .file-name {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 1rem;
        }
        
        .file-size {
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-right: 1rem;
            white-space: nowrap;
        }
        
        .progress-container {
            width: 100px;
            height: 6px;
            background-color: var(--background-dark);
            border-radius: 3px;
            overflow: hidden;
            margin-right: 1rem;
            position: relative;
        }
        
        .progress-bar {
            height: 100%;
            background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
            width: 0;
            transition: width 0.2s ease;
        }
        
        .progress-text {
            position: absolute;
            right: -40px;
            top: -7px;
            font-size: 0.8rem;
            color: var(--text-secondary);
            width: 40px;
            text-align: left;
        }
        
        .cancel-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 0.9rem;
        }
        
        .cancel-btn:hover {
            color: var(--error-color);
        }
        
        .upload-item.success .progress-bar {
            background-color: var(--success-color);
        }
        
        .success-icon {
            color: var(--success-color);
            margin-right: 1rem;
        }
        
        .validation-status {
            font-size: 0.8rem;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            margin-right: 1rem;
        }
        
        .validation-status.success {
            background-color: rgba(76, 175, 80, 0.1);
            color: var(--success-color);
        }
        
        .highlight {
            border-color: var(--primary-color);
            background-color: rgba(0, 176, 255, 0.05);
        }
    `;
    document.head.appendChild(style);

    // Initialize WebSocket connection simulation
    initWebSocketSimulation();
});

// WebSocket simulation for real-time updates
function initWebSocketSimulation() {
    console.log('Initializing WebSocket connection...');
    
    // Simulate WebSocket connection status
    const connectionStatus = {
        connected: true,
        reconnectAttempts: 0,
        maxReconnectAttempts: 5
    };
    
    // Simulate receiving messages
    const messageTypes = ['validation_complete', 'validation_warning', 'validation_error', 'new_document'];
    const documents = ['TS-2023-044', 'TS-2023-045', 'TS-2023-046', 'TS-2023-047'];
    
    // Simulate periodic messages
    setInterval(() => {
        if (connectionStatus.connected) {
            const randomType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
            const randomDoc = documents[Math.floor(Math.random() * documents.length)];
            
            handleWebSocketMessage({
                type: randomType,
                document: randomDoc,
                timestamp: new Date().toISOString()
            });
        }
    }, 15000); // Every 15 seconds
    
    // Simulate connection issues occasionally
    setInterval(() => {
        const shouldDisconnect = Math.random() > 0.9; // 10% chance
        
        if (shouldDisconnect && connectionStatus.connected) {
            console.log('WebSocket connection lost. Attempting to reconnect...');
            connectionStatus.connected = false;
            
            // Attempt to reconnect
            attemptReconnect(connectionStatus);
        }
    }, 30000); // Check every 30 seconds
}

function attemptReconnect(connectionStatus) {
    if (connectionStatus.reconnectAttempts < connectionStatus.maxReconnectAttempts) {
        connectionStatus.reconnectAttempts++;
        
        setTimeout(() => {
            console.log(`Reconnect attempt ${connectionStatus.reconnectAttempts}...`);
            
            // 80% chance of successful reconnection
            if (Math.random() > 0.2) {
                connectionStatus.connected = true;
                connectionStatus.reconnectAttempts = 0;
                console.log('WebSocket connection reestablished.');
            } else {
                // Try again
                attemptReconnect(connectionStatus);
            }
        }, 2000); // Wait 2 seconds between attempts
    } else {
        console.error('Failed to reconnect after maximum attempts. Please refresh the page.');
        // In a real app, we would show a user-friendly message
    }
}

function handleWebSocketMessage(message) {
    console.log('Received WebSocket message:', message);
    
    // In a real app, we would update the UI based on the message type
    if (message.type === 'validation_complete') {
        addNotification({
            type: 'success',
            message: `Term Sheet #${message.document} successfully validated`,
            time: 'Just now'
        });
    } else if (message.type === 'validation_warning') {
        addNotification({
            type: 'warning',
            message: `Term Sheet #${message.document} requires attention`,
            time: 'Just now'
        });
    } else if (message.type === 'validation_error') {
        addNotification({
            type: 'error',
            message: `Validation failed for Term Sheet #${message.document}`,
            time: 'Just now'
        });
    } else if (message.type === 'new_document') {
        addNotification({
            type: 'info',
            message: `New Term Sheet #${message.document} added to queue`,
            time: 'Just now'
        });
    }
}

function addNotification(notification) {
    const notificationsList = document.querySelector('.notifications-list');
    if (!notificationsList) return;
    
    // Create notification element
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item unread';
    
    const notificationIcon = document.createElement('div');
    notificationIcon.className = `notification-icon ${notification.type}`;
    
    let iconClass = 'fas fa-info-circle';
    if (notification.type === 'success') iconClass = 'fas fa-check-circle';
    if (notification.type === 'warning') iconClass = 'fas fa-exclamation-circle';
    if (notification.type === 'error') iconClass = 'fas fa-times-circle';
    
    notificationIcon.innerHTML = `<i class="${iconClass}"></i>`;
    
    const notificationContent = document.createElement('div');
    notificationContent.className = 'notification-content';
    notificationContent.innerHTML = `
        <p>${notification.message}</p>
        <span class="notification-time">${notification.time}</span>
    `;
    
    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'notification-dismiss';
    dismissBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    // Add dismiss functionality
    dismissBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationItem.style.opacity = '0';
        notificationItem.style.height = notificationItem.offsetHeight + 'px';
        notificationItem.style.marginTop = '0';
        notificationItem.style.marginBottom = '0';
        notificationItem.style.paddingTop = '0';
        notificationItem.style.paddingBottom = '0';
        
        setTimeout(() => {
            notificationItem.style.height = '0';
            
            setTimeout(() => {
                notificationItem.remove();
                updateNotificationBadge();
            }, 300);
        }, 200);
    });
    
    notificationItem.appendChild(notificationIcon);
    notificationItem.appendChild(notificationContent);
    notificationItem.appendChild(dismissBtn);
    
    // Add to the top of the list
    notificationsList.prepend(notificationItem);
    
    // Update badge count
    updateNotificationBadge();
    
    // Animate the notification bell
    const bell = document.querySelector('.notifications i');
    if (bell) {
        bell.classList.add('ringing');
        
        setTimeout(() => {
            bell.classList.remove('ringing');
        }, 1000);
    }
}

function updateNotificationCount() {
    updateNotificationBadge();
    
    // Add a new notification
    const types = ['success', 'warning', 'error', 'info'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const messages = [
        'Term Sheet #TS-2023-048 successfully validated',
        'Term Sheet #TS-2023-049 requires attention',
        'Validation failed for Term Sheet #TS-2023-050',
        'New Term Sheet #TS-2023-051 added to queue'
    ];
    
    addNotification({
        type: randomType,
        message: messages[types.indexOf(randomType)],
        time: 'Just now'
    });
}
