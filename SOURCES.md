# Content sources

Content was checked on **27 October 2026**. The site is in English. Research descriptions and paper summaries are original editorial summaries of the sources below.

## People and research

- [Minh-Tien Nguyen's homepage](https://tiennutehy.github.io/tiennm-homepage/): Associate Professor at Hung Yen University of Technology and Education, research interests, email, and Scholar profile.
- [Manh-Cuong Phan's homepage](https://cuongpm-cs.github.io/cuongpm-homepage/): affiliation, research interests, email, and Scholar profile. The user subsequently confirmed that he has graduated and requested his placement under Researchers; the profile now uses Researcher and no longer lists an undergraduate title.
- Huu-Loi Le: added at the user's request, using the supplied portrait. [Minh-Tien Nguyen's student directory](https://tiennutehy.github.io/tiennm-homepage/students/) lists his role as Senior AI Engineer at AI Academy and links to [his Scholar profile](https://scholar.google.com/citations?user=7I65pLYAAAAJ&hl=en). His AI Academy Vietnam affiliation and email are published on the first page of [Metamo](https://aclanthology.org/2025.emnlp-demos.66.pdf). Research interests are an editorial summary inferred from his coauthored Metamo and cognitive distortion analysis papers. The website groups his profile under Researchers.
- The user confirmed the initial two-person roster, with Minh-Tien Nguyen as advisor, then requested Huu-Loi Le and all people in [the student directory](https://tiennutehy.github.io/tiennm-homepage/students/). The directory contains eight people; Huu-Loi Le and Manh-Cuong Phan were already present, so six profiles were added. The site now contains nine people including the advisor. Huu-Loi Le and Manh-Cuong Phan remain under Researchers according to the user's previous instructions.
- New profiles use the directory's categories and supplied professional information:
  - **PhD Students:** Duc-Tho Bui and Quoc-Hung Pham — University of Engineering and Technology (UET).
  - **Undergraduate Students:** Trinh-Hoai-An Duong and Chi-Hai Cao — Hung Yen University of Technology and Education; listed as Junior AI Engineers at AI Academy.
  - **Alumni:** Son-Ba Giang — Senior AI Engineer at AI Academy; Tien-Manh Tran — Senior Data Scientist at XanhSM, VinSmart Future. The directory links to [Tien-Manh Tran's Scholar profile](https://scholar.google.com/citations?user=AgDIcc0AAAAJ&hl=en).
- All six new profiles have `image: null`. At the user's latest request, missing photos now use a default avatar; Trinh-Hoai-An Duong and Chi-Hai Cao are temporarily hidden with `visible: false`. All nine profiles remain in the data, with seven currently displayed. Personal homepages, emails, and research interests are left unset when absent from the source. The shared advisor sidebar on individual student pages is not used as student information.
- Logo and portraits: supplied by the user in `images/` and `member_pics/`.
- The two `.txt` URL files were empty on disk when implementation started. The supplied message and IDE context provided the homepages; Scholar URLs were read from those homepages.

## News

News entries summarize research announcements on [the advisor's news page](https://tiennutehy.github.io/tiennm-homepage/news/), with each entry linking to the original announcement. Their dates show the confirmed year; specific acceptance dates have not been invented.

- [EMNLP 2026 announcements](https://tiennutehy.github.io/tiennm-homepage/news/2026_5_EMNLP/)
- [Findings of ACL 2026 announcements](https://tiennutehy.github.io/tiennm-homepage/news/2026_4_ACL/)
- [CogSci 2026 announcement](https://tiennutehy.github.io/tiennm-homepage/news/2026_3_CogSci/)
- [ACII 2026 announcement](https://tiennutehy.github.io/tiennm-homepage/news/2026_2_ACII/)
- [ICALT 2026 announcement](https://tiennutehy.github.io/tiennm-homepage/news/2026_1_ICALT/)

There were no confirmed awards in the supplied sources. The Awards category is implemented with an empty state, ready for confirmed entries.

## Selected publications

Titles, author order, venue, year, and paper/PDF links were checked against ACL Anthology. Code links appear only where a repository was provided by the source.

- [CogRAG — Findings of EMNLP 2026](https://aclanthology.org/2026.findings-emnlp.658/)
- [CMTD — Findings of ACL 2026](https://aclanthology.org/2026.findings-acl.41/)
- [From Span Extraction to Classification — PACLIC 2025](https://aclanthology.org/2025.paclic-1.34/)
- [Metamo — EMNLP 2025 System Demonstrations](https://aclanthology.org/2025.emnlp-demos.66/)

## Design and assets

The Conferences page lists venues represented in the selected publications, with the corresponding publication year. It is not a submission-deadline calendar.

- [EMNLP 2026 official website](https://2026.emnlp.org/)
- [ACL 2026 official website](https://2026.aclweb.org/)
- [PACLIC 2025 proceedings](https://aclanthology.org/volumes/2025.paclic-1/)

- [DI Lab](https://dilab.utehy.edu.vn/): reference for research navigation, research areas, news, publications, and team presentation. The layout and visual treatment were created for Cog-AI-Lab.
- The homepage illustration is an original 3D brain mesh with translucent connections, depth-shaded nodes, orbiting research words, and gentle light pulses. `brain-model.js` supplies shared geometry for the animated canvas (`network.js`) and static fallback (`images/neural-brain.svg`, generated by `scripts/brain-artwork.mjs`). The cerebrum, cerebellum, and brainstem are stylized decorative forms; the network does not represent measured brain connectivity or medical anatomy.
- [Manrope](https://github.com/google/fonts/tree/main/ofl/manrope): self-hosted font, SIL Open Font License. The license is included in `fonts/OFL.txt`.
- [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site): publishing instructions.
