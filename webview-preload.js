const { ipcRenderer } = require('electron');

window.addEventListener('click', async (e) => {
  const link = e.target.closest('a');
  if (link && link.target === '_blank') {
    const url = link.href;
    
    // Check if it's a Discord link
    if (url.includes('discord.com') ||url.includes('discord.gg') || url.includes('discordapp.com')) {
      console.log('Discord link detected, allowing default behavior:', url);
      return; // Allow Discord links to use default behavior
    }

    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling to Discord's event handlers
    console.log('External link clicked:', url);
    
    try {
      // Send message to main process to show confirmation dialog
      const response = await ipcRenderer.invoke('show-link-dialog', url);
      console.log('Dialog response:', response);
      
      if (response.action === 'open') {
        await ipcRenderer.invoke('open-external', url);
        console.log('Request sent to open in external browser:', url);
      } else if (response.action === 'copy') {
        await navigator.clipboard.writeText(url);
        console.log('URL copied to clipboard:', url);
      }
    } catch (error) {
      console.error('Failed to handle link:', error);
    }
  }
}, true); 

// Try to remove Discord's confirmation dialog
const removeDialog = () => {
  // Use reliable class name combinations and structural features to identify the dialog
  const dialog = document.querySelector('div[class*="focusLock__"]');
  if (dialog) {
    const root = dialog.querySelector('div[class*="root__"][class*="fullscreenOnMobile__"]');
    if (root) {
      const linkContainer = root.querySelector('div[class*="linkCalloutContainer_"]');
      if (linkContainer) {
        dialog.remove();
        console.log('Removed Discord external link dialog');
      }
    }
  }
};

// Listen for DOM changes to remove the dialog
const observer = new MutationObserver((mutations) => {
  mutations.forEach(() => {
    removeDialog();
  });
});

// Start observing DOM changes
document.addEventListener('DOMContentLoaded', () => {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}); 