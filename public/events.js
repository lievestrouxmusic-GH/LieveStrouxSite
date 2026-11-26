(() => {
  // Calendar dates follow the artist's local timezone; today's shows remain upcoming.
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
  const events = (window.LIEVE_EVENTS || []).filter(event =>
    event.title && (event.date === null || /^\d{4}-\d{2}-\d{2}$/.test(event.date))
  );
  const dateLabel = date => new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'
  }).format(new Date(date + 'T12:00:00Z'));
  const text = (tag, value, className) => {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    return element;
  };
  function card(event) {
    const item = text('li', '', 'event-card');
    const date = text(event.date ? 'time' : 'span', event.date ? dateLabel(event.date) : 'To be determined', 'event-date');
    if (event.date) date.dateTime = event.date;
    const content = document.createElement('div');
    content.append(text('h4', event.title));
    const location = [event.venue, event.city].filter(Boolean).join(' · ');
    if (location) content.append(text('p', location, 'event-meta'));
    if (event.time) content.append(text('p', event.time, 'event-meta'));
    if (event.description) content.append(text('p', event.description));
    const links = text('div', '', 'event-links');
    for (const link of event.links || []) {
      let url;
      try { url = new URL(link.url); } catch { continue; }
      if (!['https:', 'http:'].includes(url.protocol)) continue;
      const anchor = text('a', link.label || 'More information');
      anchor.href = url.href;
      links.append(anchor);
    }
    if (links.children.length) content.append(links);
    item.append(date, content);
    return item;
  }
  function render(section, entries) {
    const list = document.getElementById(section + '-events');
    list.replaceChildren(...entries.map(card));
    document.getElementById(section + '-empty').hidden = entries.length > 0;
  }
  render('upcoming', events.filter(e => !e.date || (e.endDate || e.date) >= today).sort((a,b) => (a.date || '9999').localeCompare(b.date || '9999')));
  render('past', events.filter(e => e.date && (e.endDate || e.date) < today).sort((a,b) => b.date.localeCompare(a.date)));
})();
