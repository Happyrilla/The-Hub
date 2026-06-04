const form = document.getElementById('contactForm');
form.addEventListener('submit', async (e) => {
e.preventDefault();
const res = await fetch(form.action, { method: form.method, body: new FormData(form), headers: { Accept: 'application/json' }});
if (res.ok) { alert('Sent — thanks!'); form.reset(); } else { alert('Send failed'); }
});