/**
 * Vibrant Vision - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', async () => {

    // 1. Fetch & Render Data
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        renderContent(data);
    } catch (e) {
        console.error("Failed to load data.json", e);
    }

    // 2. Initialize Interaction Logic (Depends on rendered DOM)
    initThemeToggle();
    initCursor();
    initScrollReveal();
    initParallax();
    initVideoModal();
});

function renderContent(data) {
    // Meta
    if (data.meta) {
        document.getElementById('meta-title').innerText = data.meta.title;
        document.getElementById('meta-desc').content = data.meta.description;
    }

    // Navigation
    document.getElementById('nav-logo').innerHTML = `${data.logo.text}<span class="dot">${data.logo.dot}</span>`;

    const navLinksContainer = document.getElementById('nav-links-container');
    data.navigation.forEach(link => {
        navLinksContainer.innerHTML += `<li><a href="${link.href}" class="hover-target">${link.label}</a></li>`;
    });
    navLinksContainer.innerHTML += `<li><a href="${data.contactButton.href}" class="btn-primary hover-target">${data.contactButton.label}</a></li>`;
    navLinksContainer.innerHTML += `<li><button class="theme-toggle hover-target" id="theme-toggle" aria-label="Toggle Dark Mode"><i class="ph-bold ph-moon"></i></button></li>`;

    // Hero Section
    document.getElementById('hero-badge').innerText = data.hero.badge;
    document.getElementById('hero-title-base').innerText = data.hero.titleBase;
    document.getElementById('hero-title-highlight').innerText = data.hero.titleHighlight;
    document.getElementById('hero-title-end').innerText = data.hero.titleEnd;
    document.getElementById('hero-subtitle').innerText = data.hero.subtitle;

    document.getElementById('hero-cta').innerHTML = `${data.hero.ctaButton.label} <i class="ph-bold ph-play"></i>`;

    // Bind main showreel video URL & Thumbnail
    if (data.hero.showreelVideo) {
        document.getElementById('hero-cta').setAttribute('data-video', data.hero.showreelVideo);
        document.getElementById('hero-circle-btn').setAttribute('data-video', data.hero.showreelVideo);
    }
    
    if (data.hero.showreelThumbnail) {
        document.getElementById('hero-circle-thumb').style.backgroundImage = `url('${data.hero.showreelThumbnail}')`;
    }

    const heroSocials = document.getElementById('hero-socials');
    data.hero.socialIcons.forEach(icon => {
        heroSocials.innerHTML += `<a href="${icon.href}" class="hover-target"><i class="${icon.iconClass}"></i></a>`;
    });

    document.getElementById('hero-circle-text').innerHTML = data.hero.circleText;

    // Marquee
    const marqueeContent = document.getElementById('marquee-content');
    data.marquee.forEach((item) => {
        marqueeContent.innerHTML += `<span>${item}</span> ✦ `;
    });

    // Work Section
    document.getElementById('work-header-title').innerText = data.workSection.headerTitle;
    document.getElementById('work-header-highlight').innerText = data.workSection.headerHighlight;
    document.getElementById('work-header-subtitle').innerText = data.workSection.headerSubtitle;

    const workGrid = document.getElementById('work-grid');
    data.workSection.projects.forEach(project => {
        let tagHtml = project.tags.map(t => `<span>${t}</span>`).join('');

        workGrid.innerHTML += `
            <div class="project-card reveal ${project.extraClasses}" id="${project.id}">
                <div class="project-image-wrapper">
                    <img src="${project.image}" alt="${project.alt}"
                        class="project-img placeholder"
                        data-fallback="${project.fallbackImage}">
                    <div class="project-overlay">
                        <button class="play-btn-small center-abs hover-target open-video-modal" data-video="${project.videoFile}"><i class="ph-fill ph-play"></i></button>
                    </div>
                </div>
                <div class="project-info">
                    <div class="project-tags">${tagHtml}</div>
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            </div>
        `;
    });

    // Image Error Fallbacks
    document.querySelectorAll('.project-img.placeholder').forEach(img => {
        img.addEventListener('error', function () {
            this.src = this.getAttribute('data-fallback');
            this.classList.remove('placeholder');
        });
    });

    // Expertise Section
    document.getElementById('expertise-header-title').innerText = data.expertiseSection.headerTitle;
    document.getElementById('expertise-header-highlight').innerText = data.expertiseSection.headerHighlight;
    document.getElementById('expertise-header-subtitle').innerText = data.expertiseSection.headerSubtitle;

    const softwareGrid = document.getElementById('software-grid');
    data.expertiseSection.software.forEach(soft => {
        softwareGrid.innerHTML += `
            <div class="software-card hover-target">
                <div class="icon-box ${soft.colorClass}"><i class="${soft.iconClass}"></i></div>
                <h4>${soft.shortName}</h4>
                <span>${soft.fullName}</span>
            </div>
        `;
    });

    // Footer
    document.getElementById('footer-title-base').innerText = data.footer.titleBase;
    document.getElementById('footer-title-highlight').innerText = data.footer.titleHighlight;

    document.getElementById('footer-email').innerText = data.footer.email;
    document.getElementById('footer-email').href = data.footer.mailtoLink;
    document.getElementById('footer-email').target = "_blank";
    document.getElementById('footer-copyright').innerHTML = data.footer.copyright;

    const footerSocials = document.getElementById('footer-socials');
    data.footer.socialLinks.forEach(link => {
        footerSocials.innerHTML += `<a href="${link.href}" class="hover-target">${link.platform}</a>\n`;
    });
}

function initCursor() {
    const cursor = document.getElementById('custom-cursor');
    // Must target hover-targets after they have been dynamically injected
    const hoverTargets = document.querySelectorAll('.hover-target, a, button');

    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
    });

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        target.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    document.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget && !e.toElement) {
            cursor.style.opacity = '0';
        }
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));
}

function initParallax() {
    const blobs = document.querySelectorAll('.gradient-blob');
    if (!blobs.length) return;

    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        requestAnimationFrame(() => {
            blobs[0].style.transform = `translateY(${scrollY * 0.15}px)`;
            blobs[1].style.transform = `translateY(${-scrollY * 0.1}px) translateX(${scrollY * 0.05}px)`;
            blobs[2].style.transform = `translateY(${scrollY * 0.2}px)`;
        });
    });
}

function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const icon = themeToggleBtn.querySelector('i');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (icon) icon.classList.replace('ph-moon', 'ph-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = 'light';
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            if (icon) icon.classList.replace('ph-sun', 'ph-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (icon) icon.classList.replace('ph-moon', 'ph-sun');
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });
}

function initVideoModal() {
    const modal = document.getElementById('video-modal');
    const backdrop = document.getElementById('video-modal-backdrop');
    const closeBtn = document.getElementById('modal-close');
    const player = document.getElementById('modal-video-player');
    const source = document.getElementById('modal-video-source');

    const playButtons = document.querySelectorAll('.open-video-modal');

    // Function to close modal
    const closeModal = () => {
        modal.classList.remove('active');
        player.pause();
        // Delay wiping source to allow fade out animation to look smooth
        setTimeout(() => {
            source.src = "";
            player.load();
        }, 500);
    };

    // Open logic
    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const videoUrl = btn.getAttribute('data-video');
            if (videoUrl) {
                source.src = videoUrl;
                player.load();
                modal.classList.add('active');

                // Autoplay once modal is open
                // Browser policies might block this if without interaction, but click counts as interaction!
                player.play().catch(e => console.log("Autoplay blocked:", e));
            }
        });
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
}
