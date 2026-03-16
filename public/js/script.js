// Global utility functions

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Confirm action
function confirmAction(message) {
    return confirm(message);
}

// Handle form submissions with confirmation
document.addEventListener('DOMContentLoaded', () => {
    // Delete forms
    document.querySelectorAll('.delete-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!confirm('Are you sure you want to delete this item?')) {
                e.preventDefault();
            }
        });
    });
    
    // Auto-hide alerts
    document.querySelectorAll('.error-message, .success-message').forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.style.display = 'none';
            }, 300);
        }, 5000);
    });
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strength = checkPasswordStrength(this.value);
            updatePasswordStrengthIndicator(strength);
        });
    }
    
    // Confirm password match
    const confirmPasswordInput = document.getElementById('confirm_password');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = document.getElementById('password')?.value;
            if (password && this.value !== password) {
                this.setCustomValidity('Passwords do not match');
                this.style.borderColor = '#e74c3c';
            } else {
                this.setCustomValidity('');
                this.style.borderColor = '#27ae60';
            }
        });
    }
});

// Check password strength
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    
    return strength;
}

// Update password strength indicator
function updatePasswordStrengthIndicator(strength) {
    let indicator = document.getElementById('password-strength');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'password-strength';
        document.querySelector('.form-group:has(#password)')?.appendChild(indicator);
    }
    
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColor = ['#e74c3c', '#e67e22', '#f1c40f', '#3498db', '#27ae60'];
    
    indicator.textContent = strengthText[strength] || '';
    indicator.style.color = strengthColor[strength] || '#95a5a6';
    indicator.style.fontSize = '0.85rem';
    indicator.style.marginTop = '0.25rem';
}

// Load user reputation
async function loadUserReputation(userId) {
    try {
        const response = await fetch(`/api/user/${userId}/reputation`);
        const data = await response.json();
        
        const reputationElement = document.getElementById('reputation');
        if (reputationElement) {
            reputationElement.textContent = data.score.toFixed(2) + ' / 5.0';
        }
    } catch (error) {
        console.error('Error loading reputation:', error);
    }
}

// Load categories for filter
async function loadCategories() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;
    
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category_name;
            option.textContent = category.category_name;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});