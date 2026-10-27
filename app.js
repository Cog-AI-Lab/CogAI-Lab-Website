(() => {
  'use strict';

  const content = window.LAB_CONTENT;
  const external = 'target="_blank" rel="noopener noreferrer"';
  const escape = (text = '') =>
    String(text).replace(
      /[&<>"']/g,
      (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
    );
  const normalize = (text) =>
    String(text)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const paths = {
    brain:
      '<path d="M12 5a3 3 0 0 0-5-2 4 4 0 0 0-4 5 4 4 0 0 0-1 7 4 4 0 0 0 4 5 3 3 0 0 0 6-1V5Zm0 0a3 3 0 0 1 5-2 4 4 0 0 1 4 5 4 4 0 0 1 1 7 4 4 0 0 1-4 5 3 3 0 0 1-6-1"/><path d="M7 3v4l2 2M3 8l3 2v3M3 16h4l2-2M7 20v-3m10-14v4l-2 2m6-1-3 2v3m3 3h-4l-2-2m2 6v-3"/>',
    language:
      '<rect x="2" y="3" width="15" height="12" rx="3"/><path d="m5 15-1 4 5-4m8-7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-1v3l-4-3h-3a2 2 0 0 1-2-2M6 7h7M6 11h4"/>',
    heart:
      '<path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/><path d="M3 12h4l2-4 4 8 2-4h6"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7l10-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    university: '<path d="m3 8 9-5 9 5M3 9h18M5 10v8m5-8v8m4-8v8m5-8v8M3 21h18M2 18h20"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/>',
    arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  };
  const icon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
  document.querySelectorAll('[data-icon]').forEach((element) => {
    element.innerHTML = icon(element.dataset.icon);
  });
  document.getElementById('copyright-year').textContent = new Date().getFullYear();

  // Only the component belonging to the current page is initialized.
  const memberGroups = document.getElementById('member-groups');
  if (memberGroups) {
    const placeholder = (name) =>
      `<div class="member-placeholder" role="img" aria-label="Default avatar for ${escape(name)}">${icon('user')}</div>`;
    const memberMarkup = (member) => `
      <article class="member-card">
        <div class="member-header">
          <div class="member-photo">${member.image ? `<img src="${escape(member.image)}" alt="${escape(member.name)}" width="224" height="224" style="object-position:${escape(member.imagePosition || 'center')}">` : placeholder(member.name)}</div>
          <div class="member-details">
            <h3>${member.homepage ? `<a href="${escape(member.homepage)}" ${external}>${escape(member.name)}</a>` : escape(member.name)}</h3>
            ${member.role ? `<p class="member-role">${escape(member.role)}</p>` : ''}
            ${member.title ? `<p class="member-title">${escape(member.title)}</p>` : ''}
            ${member.affiliation ? `<p class="member-affiliation">${escape(member.affiliation)}</p>` : ''}
          </div>
        </div>
        ${member.interests?.length ? `<div class="member-research"><p class="member-label">Research interests</p><p class="member-interests">${member.interests.map(escape).join(' · ')}</p></div>` : ''}
        ${member.homepage || member.scholar || member.email ? `<div class="member-links">${member.homepage ? `<a href="${escape(member.homepage)}" ${external} aria-label="${escape(member.name)}: homepage">Homepage ↗</a>` : ''}${member.scholar ? `<a href="${escape(member.scholar)}" ${external} aria-label="${escape(member.name)}: Google Scholar">Scholar ↗</a>` : ''}${member.email ? `<a href="mailto:${escape(member.email)}" aria-label="Email ${escape(member.name)}">Email ↗</a>` : ''}</div>` : ''}
      </article>`;
    const visibleMembers = content.members.filter((member) => member.visible !== false);
    const groups = (content.memberGroups || []).map((group) => ({
      ...group,
      members: visibleMembers.filter((member) => member.group === group.id),
    }));
    // Keep new profiles visible even if their group has not been configured yet.
    const ungrouped = visibleMembers.filter((member) => !groups.some((group) => group.id === member.group));
    if (ungrouped.length) groups.push({ id: 'other', label: 'Other members', members: ungrouped });
    memberGroups.innerHTML = groups
      .filter((group) => group.members.length)
      .map(
        (group, index) => `
        <section class="member-group" data-member-group="${escape(group.id)}" aria-labelledby="member-group-${index}">
          <h2 class="member-group-heading" id="member-group-${index}"><span>${escape(group.label)}</span></h2>
          <div class="members-grid">${group.members.map(memberMarkup).join('')}</div>
        </section>`,
      )
      .join('');
    memberGroups.querySelectorAll('img').forEach((image) =>
      image.addEventListener(
        'error',
        () => {
          image.outerHTML = placeholder(image.alt);
        },
        { once: true },
      ),
    );
  }

  const categoryLabels = { publication: 'Publication', award: 'Award', lab: 'Lab life' };
  const newsMarkup = (item) => `<a class="news-item" href="${escape(item.url)}" ${external}>
    <time class="news-date" datetime="${escape(item.date)}">${escape(item.date)}</time>
    <div><p class="news-venue">${escape(item.venue || categoryLabels[item.category] || 'News')}</p><h2>${escape(item.title)}</h2></div><span class="news-arrow" aria-hidden="true">↗</span></a>`;
  const homeNews = document.getElementById('home-news-list');
  if (homeNews) homeNews.innerHTML = content.news.slice(0, 2).map(newsMarkup).join('');

  const newsList = document.getElementById('news-list');
  if (newsList) {
    let filter = 'all';
    let expanded = false;
    const moreButton = document.getElementById('news-more');
    const render = () => {
      const filtered = content.news.filter((item) => filter === 'all' || item.category === filter);
      const visible = expanded ? filtered : filtered.slice(0, 5);
      newsList.innerHTML = visible.length
        ? visible.map(newsMarkup).join('')
        : `<div class="empty-state"><h2>${filter === 'award' ? 'Awards & recognition' : 'Life at the lab'}</h2><p>Updates will appear here.</p><button class="text-link" type="button" data-reset-news>See all updates →</button></div>`;
      moreButton.hidden = filtered.length <= 5;
      moreButton.innerHTML = expanded
        ? 'Show fewer updates <span aria-hidden="true">↑</span>'
        : 'Show more updates <span aria-hidden="true">↓</span>';
      moreButton.setAttribute('aria-expanded', String(expanded));
      moreButton.setAttribute('aria-controls', 'news-list');
      document.getElementById('news-status').textContent =
        `${visible.length} of ${filtered.length} updates shown.`;
      document.querySelector('[data-reset-news]')?.addEventListener('click', () => {
        const all = document.querySelector('[data-news-filter="all"]');
        all.click();
        all.focus();
      });
    };
    document.querySelectorAll('[data-news-filter]').forEach((button) =>
      button.addEventListener('click', () => {
        filter = button.dataset.newsFilter;
        expanded = false;
        document.querySelectorAll('[data-news-filter]').forEach((item) => {
          item.classList.toggle('active', item === button);
          item.setAttribute('aria-pressed', String(item === button));
        });
        render();
      }),
    );
    moreButton.addEventListener('click', () => {
      expanded = !expanded;
      render();
    });
    render();
  }

  const publicationList = document.getElementById('publication-list');
  if (publicationList) {
    const search = document.getElementById('publication-search');
    const year = document.getElementById('publication-year');
    const params = new URLSearchParams(location.search);
    const years = [...new Set(content.publications.map((paper) => paper.year))].sort((a, b) => b - a);
    years.forEach((value) => year.add(new Option(String(value), String(value))));
    search.value = params.get('q') || '';
    if (years.some((value) => String(value) === params.get('year'))) year.value = params.get('year');
    const render = () => {
      const query = normalize(search.value.trim());
      const papers = content.publications.filter((paper) => {
        const haystack = normalize(
          [paper.title, paper.name, paper.authors, paper.venue, paper.topic, paper.summary, paper.year].join(
            ' ',
          ),
        );
        return (
          (year.value === 'all' || String(paper.year) === year.value) &&
          query.split(/\s+/).every((term) => haystack.includes(term))
        );
      });
      document.getElementById('publication-count').textContent =
        `${papers.length} ${papers.length === 1 ? 'publication' : 'publications'}`;
      publicationList.innerHTML = papers.length
        ? papers
            .map(
              (paper) => `
        <article class="publication-item" id="paper-${escape(paper.id)}"><div class="publication-side"><span class="publication-year">${paper.year}</span><span class="publication-venue">${escape(paper.venue)}</span></div>
          <div><h2><a href="${escape(paper.url)}" ${external}>${escape(paper.title)}</a></h2><p class="publication-authors">${escape(paper.authors.split(',')[0])} et al.</p>
            <div class="publication-links"><a href="${escape(paper.url)}" ${external} aria-label="Read ${escape(paper.name)} on ACL Anthology">Paper ↗</a>${paper.pdf ? `<a href="${escape(paper.pdf)}" ${external} aria-label="Read ${escape(paper.name)} PDF">PDF ↗</a>` : ''}${paper.code ? `<a href="${escape(paper.code)}" ${external} aria-label="View ${escape(paper.name)} code">Code ↗</a>` : ''}</div>
            <details class="publication-summary"><summary>Details<span class="sr-only">: ${escape(paper.name)}</span></summary><div><p class="full-authors">${escape(paper.authors)}</p><p>${escape(paper.summary)}</p></div></details>
          </div></article>`,
            )
            .join('')
        : '<div class="empty-state"><h2>No matching publications.</h2><p>Try another keyword or year.</p><button type="button" class="text-link" data-clear-search>Clear filters →</button></div>';
      document.querySelector('[data-clear-search]')?.addEventListener('click', () => {
        search.value = '';
        year.value = 'all';
        update();
        search.focus();
      });
    };
    const update = () => {
      const url = new URL(location.href);
      search.value.trim() ? url.searchParams.set('q', search.value.trim()) : url.searchParams.delete('q');
      year.value !== 'all' ? url.searchParams.set('year', year.value) : url.searchParams.delete('year');
      // File previews still work in browsers that restrict history updates for file URLs.
      if (location.protocol !== 'file:') history.replaceState(null, '', url);
      render();
    };
    search.addEventListener('input', update);
    year.addEventListener('change', update);
    window.addEventListener('pageshow', render);
    render();
  }

  const projects = document.getElementById('projects-grid');
  if (projects)
    projects.innerHTML = content.projects
      .map(
        (project) => `
    <article class="project-card"><div class="project-icon">${icon(project.icon)}</div><p class="project-venue">${escape(project.venue)}</p><h2>${escape(project.name)}</h2><p class="project-description">${escape(project.description)}</p><div class="project-links"><a href="${escape(project.paper)}" ${external} aria-label="Read ${escape(project.name)} paper">Paper ↗</a>${project.code ? `<a href="${escape(project.code)}" ${external} aria-label="View ${escape(project.name)} code">Code ↗</a>` : ''}</div></article>`,
      )
      .join('');

  const conferences = document.getElementById('conference-list');
  if (conferences)
    conferences.innerHTML = content.conferences
      .map(
        (conference) => `
    <article class="conference-item"><div class="conference-year">${conference.year}</div><div><h2>${escape(conference.name)}</h2><p>${escape(conference.title)}</p></div><div class="conference-links"><a href="${escape(conference.url)}" ${external}>${escape(conference.linkLabel || 'Website')} ↗</a><a href="publications.html?q=${encodeURIComponent(conference.query)}&amp;year=${conference.year}">Lab papers →</a></div></article>`,
      )
      .join('');

  // The current page is marked in the generated HTML, including without JavaScript.
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.navigation');
  const header = document.querySelector('.site-header');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    document.querySelector('main').inert = open;
    document.querySelector('footer').inert = open;
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      setMenu(false);
      toggle.focus();
    }
    if (event.key === 'Tab') {
      const focusable = [...header.querySelectorAll('a, button')].filter(
        (element) => element.getClientRects().length,
      );
      const first = focusable[0],
        last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  window.matchMedia('(min-width: 1051px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });
  window.addEventListener('pageshow', () => setMenu(false));
})();
