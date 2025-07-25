document.addEventListener('DOMContentLoaded', function() {
  // Save account button
  const saveAccountBtn = document.getElementById('saveAccountBtn');
  if (saveAccountBtn) {
    saveAccountBtn.addEventListener('click', function() {
      // Show success message
      showToast('Account settings saved successfully', 'success');
    });
  }

  // Save preferences button
  const savePreferencesBtn = document.getElementById('savePreferencesBtn');
  if (savePreferencesBtn) {
    savePreferencesBtn.addEventListener('click', function() {
      // Get theme preference
      const themeRadios = document.getElementsByName('theme');
      let selectedTheme = 'light';
      for (const radio of themeRadios) {
        if (radio.checked) {
          selectedTheme = radio.value;
          break;
        }
      }
      
      // Save theme preference
      if (selectedTheme === 'light' || selectedTheme === 'dark') {
        localStorage.setItem('theme', selectedTheme);
        applyTheme(selectedTheme);
      } else {
        // For system preference, check system setting
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          applyTheme('dark');
        } else {
          applyTheme('light');
        }
        localStorage.removeItem('theme'); // Remove stored preference to follow system
      }
      
      // Show success message
      showToast('Preferences saved successfully', 'success');
      
      // Function to apply theme
      function applyTheme(theme) {
        const themeToggle = document.getElementById('themeToggle');
        
        if (theme === 'dark') {
          document.body.classList.add('dark-theme');
          if (themeToggle) {
            themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
          }
        } else {
          document.body.classList.remove('dark-theme');
          if (themeToggle) {
            themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
          }
        }
      }
    });
  }

  // Save notifications button
  const saveNotificationsBtn = document.getElementById('saveNotificationsBtn');
  if (saveNotificationsBtn) {
    saveNotificationsBtn.addEventListener('click', function() {
      // Show success message
      showToast('Notification preferences saved successfully', 'success');
    });
  }

  // Confirm delete account button
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const deleteConfirmation = document.getElementById('deleteConfirmation');
  if (confirmDeleteBtn && deleteConfirmation) {
    deleteConfirmation.addEventListener('input', function() {
      confirmDeleteBtn.disabled = this.value !== 'DELETE';
    });
    
    confirmDeleteBtn.addEventListener('click', function() {
      // Show message
      showToast('Account deletion initiated. You will receive a confirmation email.', 'warning');
      
      // Close the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAccountModal'));
      modal.hide();
    });
  }

  // Add team member button
  const addMemberBtn = document.getElementById('addMemberBtn');
  if (addMemberBtn) {
    addMemberBtn.addEventListener('click', function() {
      const email = document.getElementById('memberEmail').value;
      
      if (!email) {
        showToast('Please enter an email address', 'warning');
        return;
      }
      
      // Close the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('addTeamMemberModal'));
      modal.hide();
      
      // Show success message
      showToast(`Invitation sent to ${email}`, 'success');
    });
  }

  // Initialize theme settings
  initializeThemeSettings();

  // Function to initialize theme settings
  function initializeThemeSettings() {
    const currentTheme = localStorage.getItem('theme');
    const themeSystem = document.getElementById('themeSystem');
    const themeLight = document.getElementById('themeLight');
    const themeDark = document.getElementById('themeDark');
    
    if (!themeSystem || !themeLight || !themeDark) return;
    
    if (!currentTheme) {
      // No stored preference, use system default
      themeSystem.checked = true;
    } else if (currentTheme === 'dark') {
      themeDark.checked = true;
    } else {
      themeLight.checked = true;
    }
  }
});