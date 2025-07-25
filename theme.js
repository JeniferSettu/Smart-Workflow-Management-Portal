// Theme switcher functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get the theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  
  // Check if a theme preference is stored in localStorage
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Apply the current theme
  applyTheme(currentTheme);
  
  // Add event listener to the theme toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      // Get the current theme
      const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      
      // Switch to the opposite theme
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      // Apply the new theme
      applyTheme(newTheme);
      
      // Store the new theme preference in localStorage
      localStorage.setItem('theme', newTheme);
    });
  }
  
  // Function to apply a theme
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
        themeToggle.setAttribute('title', 'Switch to light theme');
      }
    } else {
      document.body.classList.remove('dark-theme');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
        themeToggle.setAttribute('title', 'Switch to dark theme');
      }
    }
  }
  
  // Also check for system preference if no preference is stored
  if (!localStorage.getItem('theme')) {
    // Check if the user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
    
    // Listen for changes in the system preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
});