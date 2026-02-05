document.addEventListener('DOMContentLoaded', function() {
  const contactBtn = document.getElementById('contactBtn');
  const emailSpan = document.getElementById('email');
  
  if (contactBtn) {
    contactBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (emailSpan.style.display === 'none') {
        emailSpan.style.display = 'inline';
        contactBtn.textContent = 'Masquer';
      } else {
        emailSpan.style.display = 'none';
        contactBtn.textContent = 'Contactez-moi';
      }
    });
  }
});
