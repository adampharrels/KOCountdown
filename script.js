const EVENT_START = new Date('2025-10-04T14:00:00+10:00');

// ====== COUNTDOWN ======
const d = document.getElementById('d');
const h = document.getElementById('h');
const m = document.getElementById('m');
const s = document.getElementById('s');

const pad = (n, len = 2) => String(n).padStart(len, '0');

function tick() {
    const now = new Date();
    let diff = Math.max(0, EVENT_START.getTime() - now.getTime());

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);
    const secs = Math.floor(diff / 1000);

    d.textContent = pad(days, 3);
    h.textContent = pad(hours);
    m.textContent = pad(mins);
    s.textContent = pad(secs);

    if (days + hours + mins + secs <= 0) {
        clearInterval(timer);
        document.querySelector('.subtitle').textContent = 'IT’S SHOWTIME.';
    }
}
const timer = setInterval(tick, 1000); tick();

// ====== “Add to Calendar” (.ics) & Notification permission ======
document.getElementById('addCalBtn').addEventListener('click', () => {
    const dtStartUTC = new Date(EVENT_START).toISOString().replaceAll('-', '').replaceAll(':', '').slice(0, 15) + 'Z';
    const dtEndUTC = new Date(EVENT_START.getTime() + 4 * 60 * 60 * 1000).toISOString().replaceAll('-', '').replaceAll(':', '').slice(0, 15) + 'Z';

    const ics =
        `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//HSU//Knockout Outdoor//EN
BEGIN:VEVENT
UID:${crypto.randomUUID()}
DTSTAMP:${new Date().toISOString().replaceAll('-', '').replaceAll(':', '').slice(0, 15)}Z
DTSTART:${dtStartUTC}
DTEND:${dtEndUTC}
SUMMARY:Knockout Outdoor — Return of the Circuz
LOCATION:ENGIE Stadium (Sydney Showground)
DESCRIPTION:Hardstyle • Raw • Happy Hardcore
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'knockout-outdoor-2025.ics';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
});

document.getElementById('notifyBtn').addEventListener('click', async () => {
    try {
        if (!('Notification' in window)) return alert('Your browser does not support notifications.');
        let perm = Notification.permission;
        if (perm !== 'granted') {
            perm = await Notification.requestPermission();
        }
        if (perm === 'granted') {
            new Notification('Festival reminder set ✅', { body: 'I’ll ping you when we’re close to gates opening.' });
        }
    } catch (e) { console.warn(e); }
});