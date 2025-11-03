(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Example of simple config override capability (edit values below or set via JSON)
  const config = {
    founderName: 'Van Vo', // change once here
    email: 'info@valtanasolutions.com',
    phoneText: '[Your Phone Number]',
    phoneHref: '+1REPLACE',
    linkedin: 'https://www.linkedin.com/in/REPLACE-THIS/'
  };
  const byId = id => document.getElementById(id);
  const set = (id, text) => { const n = byId(id); if (n) n.textContent = text; };
  const setHref = (id, href, text) => { const n = byId(id); if (n){ n.href = href; if (text) n.textContent = text; } };

  set('founder-name', config.founderName);
  set('contact-name', config.founderName);
  setHref('contact-email', 'mailto:' + config.email, config.email);
  setHref('contact-phone', 'tel:' + config.phoneHref, config.phoneText);
  const li = document.getElementById('linkedin'); if (li) li.href = config.linkedin;
})();
