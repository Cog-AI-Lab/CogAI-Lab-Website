import { writeFile } from 'node:fs/promises';

// Shared layout and page markup. Run `npm run pages` after editing this file.
export const pages = [
  ['index', 'Home'],
  ['members', 'Members'],
  ['publications', 'Publications'],
  ['projects', 'Projects'],
  ['news', 'News'],
  ['conferences', 'Conferences'],
  ['contact', 'Contact'],
];

const pageHeading = (title, description) =>
  `<header class="page-heading"><h1>${title}</h1>${description ? `<p>${description}</p>` : ''}</header>`;
const bodies = {
  index: `<section class="hero container" aria-labelledby="hero-title">
    <div class="hero-copy"><p class="eyebrow">COG-AI-LAB</p><h1 id="hero-title">Cognition meets<br><span>artificial intelligence.</span></h1>
      <p class="hero-description">We study language, human cognition, and empathetic AI.</p>
      <div class="hero-actions"><a class="button" href="projects.html">Explore our research <span aria-hidden="true">↗</span></a><a class="text-link" href="members.html">Meet the team <span aria-hidden="true">→</span></a></div>
      <p class="advisor-line">Led by <a href="https://tiennutehy.github.io/tiennm-homepage/" target="_blank" rel="noopener noreferrer">Assoc. Prof. Minh-Tien Nguyen</a></p>
    </div>
    <div class="hero-visual" role="img" aria-label="A neural brain surrounded by the words Cognition, Language, Empathy, and Learning"><img class="hero-artwork" src="images/neural-brain.svg" width="600" height="480" alt="" aria-hidden="true"><canvas id="neural-network" aria-hidden="true"></canvas></div>
  </section>
  <section class="home-research container" aria-labelledby="research-title"><div class="section-heading"><h2 id="research-title">Research areas</h2><a class="text-link" href="publications.html">Our publications <span aria-hidden="true">↗</span></a></div>
    <div class="research-grid">
      <a class="research-card" href="publications.html?q=cognition"><span data-icon="brain" aria-hidden="true"></span><h3>Cognition-aware AI</h3><p>Human reasoning in intelligent systems.</p></a>
      <a class="research-card" href="publications.html?q=language"><span data-icon="language" aria-hidden="true"></span><h3>Language models</h3><p>Understanding language and knowledge.</p></a>
      <a class="research-card" href="publications.html?q=empathetic"><span data-icon="heart" aria-hidden="true"></span><h3>Empathetic AI</h3><p>More thoughtful human–AI conversations.</p></a>
      <a class="research-card" href="publications.html?q=multimodal"><span data-icon="layers" aria-hidden="true"></span><h3>Multimodal AI</h3><p>Connecting text, vision, and speech.</p></a>
    </div>
  </section>
  <section class="home-news container" aria-labelledby="latest-title"><div class="section-heading"><h2 id="latest-title">Latest news</h2><a class="text-link" href="news.html">All news <span aria-hidden="true">→</span></a></div><div id="home-news-list"></div></section>`,
  members: `<div class="container page-content">${pageHeading('Members', 'The people behind Cog-AI-Lab.')}<div class="member-groups" id="member-groups"></div></div>`,
  publications: `<div class="container page-content">${pageHeading('Publications', 'Selected work from our research group.')}
    <div class="publication-toolbar"><p id="publication-count" role="status"></p><div class="publication-controls"><label class="search-field"><span class="sr-only">Search publications</span><span data-icon="search" aria-hidden="true"></span><input id="publication-search" type="search" placeholder="Search publications" autocomplete="off"></label><label class="year-field"><span class="sr-only">Publication year</span><select id="publication-year" aria-label="Publication year"><option value="all">All years</option></select></label></div></div>
    <div class="publication-list" id="publication-list"></div><a class="text-link page-end-link" href="https://scholar.google.com/citations?user=ASd5leYAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">More on Google Scholar <span aria-hidden="true">↗</span></a>
  </div>`,
  projects: `<div class="container page-content">${pageHeading('Projects', 'From research questions to working systems.')}<div class="projects-grid" id="projects-grid"></div></div>`,
  news: `<div class="container page-content reading-width">${pageHeading('News', 'Publications, awards, and life at the lab.')}
    <div class="filter-group" aria-label="Filter news"><button type="button" class="filter-button active" data-news-filter="all" aria-pressed="true">All updates</button><button type="button" class="filter-button" data-news-filter="publication" aria-pressed="false">Publications</button><button type="button" class="filter-button" data-news-filter="award" aria-pressed="false">Awards</button><button type="button" class="filter-button" data-news-filter="lab" aria-pressed="false">Lab life</button></div>
    <div id="news-list" class="news-list"></div><p id="news-status" class="sr-only" role="status"></p><button class="text-link news-more" id="news-more" type="button">Show more updates <span aria-hidden="true">↓</span></button>
  </div>`,
  conferences: `<div class="container page-content">${pageHeading('Conferences', 'Venues featuring our recent research.')}<div class="conference-list" id="conference-list"></div></div>`,
  contact: `<div class="container page-content">${pageHeading('Contact', 'Research questions or collaboration ideas? Get in touch.')}
    <div class="contact-layout"><section class="contact-emails" aria-label="Email contacts"><div><p class="contact-label">Lab advisor</p><h2>Minh-Tien Nguyen</h2><a class="contact-email" href="mailto:tiennm@utehy.edu.vn">tiennm@utehy.edu.vn <span aria-hidden="true">↗</span></a></div><div><p class="contact-label">Student researcher</p><h2>Manh-Cuong Phan</h2><a class="contact-email" href="mailto:cuongpm@spkt.edu.vn">cuongpm@spkt.edu.vn <span aria-hidden="true">↗</span></a></div></section>
    <aside class="contact-location"><span data-icon="university" aria-hidden="true"></span><h2>Find us</h2><p>Hung Yen University of<br>Technology and Education</p><p>Hung Yen, Vietnam</p><a class="text-link" href="https://github.com/Cog-AI-Lab" target="_blank" rel="noopener noreferrer">Cog-AI-Lab on GitHub <span aria-hidden="true">↗</span></a></aside></div>
  </div>`,
};

export async function generatePages() {
  for (const [slug, label] of pages) {
    const title =
      slug === 'index' ? 'Cog-AI-Lab — Cognition meets artificial intelligence.' : `${label} — Cog-AI-Lab`;
    const description =
      slug === 'index'
        ? 'Research in language, human cognition, and empathetic AI.'
        : `${label} at Cog-AI-Lab, Hung Yen University of Technology and Education.`;
    const html = `<!doctype html>
<!-- Generated from scripts/pages.mjs. Run npm run pages after editing the shared template. -->
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#0872b6">
  <title>${title}</title><meta name="description" content="${description}"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:image" content="https://cog-ai-lab.github.io/CogAI-Lab-Website/images/social-card.png"><meta property="og:url" content="https://cog-ai-lab.github.io/CogAI-Lab-Website/${slug === 'index' ? '' : `${slug}.html`}"><meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="images/favicon.svg" type="image/svg+xml"><link rel="preload" href="fonts/Manrope.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="styles.css"><script src="content.js" defer></script><script src="app.js" defer></script>${slug === 'index' ? '<script type="module" src="network.js"></script>' : ''}
</head><body data-page="${slug}"><a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="container header-inner"><a class="brand" href="index.html" aria-label="Cog-AI-Lab home"><img src="images/CogAI%20logo.png" width="1315" height="366" alt="CogAI Lab"></a>
    <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-navigation"><span></span><span></span></button>
    <nav class="navigation" id="primary-navigation" aria-label="Main navigation">${pages.map(([id, name]) => `<a class="nav-link${id === slug ? ' active' : ''}" href="${id}.html"${id === slug ? ' aria-current="page"' : ''}>${name}</a>`).join('')}</nav>
  </div></header>
  <main id="main" tabindex="-1">${bodies[slug]}</main>
  <footer class="site-footer"><div class="container footer-inner"><p>© <span id="copyright-year">2026</span> Cog-AI-Lab</p><div class="footer-links"><a href="https://github.com/Cog-AI-Lab" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a><a href="https://scholar.google.com/citations?user=ASd5leYAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Google Scholar <span aria-hidden="true">↗</span></a><a href="contact.html">Contact</a></div></div></footer>
  <noscript><p class="noscript-notice">Enable JavaScript to view the lab’s content, or visit <a href="https://tiennutehy.github.io/tiennm-homepage/">our advisor’s homepage</a>.</p></noscript>
</body></html>`;
    await writeFile(`${slug}.html`, html);
  }
}

await generatePages();
