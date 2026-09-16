$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
            document.querySelector('header').classList.add('scrolled');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
            document.querySelector('header').classList.remove('scrolled');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // emailjs to mail contact form data
    $('#contact-form').submit(function (event) {
        event.preventDefault();
        emailjs.init('user_TTDmetQLYgWCLzHTDgqxm');

        emailjs.sendForm('contact_service', 'template_contact', '#contact-form')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById('contact-form').reset();
                alert('Message sent successfully!');
            }, function (error) {
                console.log('FAILED...', error);
                alert('Message failed to send. Please try again.');
            });
    });

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === 'visible') {
            document.title = 'Likash Gunisetti Portfolio';
            $('#favicon').attr('href', 'assets/images/Likas1');
        }
    });

// typed js effect
var typed = new Typed('.typing-text', {
    strings: ['Machine Learning', 'Data Science', 'Artificial Intelligence', 'Deep Learning', 'Computer Vision', 'Natural Language Processing'],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});

// tilt.js effect on profile images
VanillaTilt.init(document.querySelectorAll('.tilt'), {
    max: 15,
});

/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

srtop.reveal('.home .content h2', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });
srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .social-icons li', { interval: 150 });

srtop.reveal('.about .row .image', { delay: 200 });
srtop.reveal('.about .row .content', { delay: 300 });

srtop.reveal('.education .box', { interval: 200 });

srtop.reveal('.experience .timeline', { delay: 200 });
srtop.reveal('.experience .container', { interval: 200 });

srtop.reveal('.contact .container', { delay: 200 });

/* ===== JSON-driven content ===== */

async function loadJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to load ${path}: ${response.status}`);
    }
    return response.json();
}

function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    const groups = {};
    skills.forEach(function (skill) {
        if (!groups[skill.category]) groups[skill.category] = [];
        groups[skill.category].push(skill);
    });

    let html = '';
    Object.keys(groups).forEach(function (category) {
        html += `<div class="skills-group"><h3>${category}</h3><div class="row">`;
        groups[category].forEach(function (skill) {
            html += `
        <div class="bar">
          <div class="info">
            <span>${skill.name}</span>
          </div>
        </div>`;
        });
        html += `</div></div>`;
    });

    container.innerHTML = html;
    srtop.reveal('.skills .bar', { interval: 40 });
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    let html = '';
    projects.forEach(function (project) {
        const viewClass = project.links.view === '#' ? 'is-placeholder' : '';
        const codeClass = project.links.code === '#' ? 'is-placeholder' : '';
        html += `
      <div class="box card-surface">
        <img draggable="false" src="./assets/images/projects/${project.image}" alt="${project.name}">
        <div class="content">
          <div class="tag">
            <h3>${project.name}</h3>
          </div>
          <div class="btns">
            <a href="${project.links.view}" target="_blank" class="${viewClass}"><i class="fas fa-eye"></i> View</a>
            <a href="${project.links.code}" target="_blank" class="${codeClass}">Code <i class="fas fa-code"></i></a>
          </div>
        </div>
      </div>`;
    });
    container.innerHTML = html;
    srtop.reveal('#projects-container .box', { interval: 150 });
}

function renderCertifications(certifications) {
    const container = document.getElementById('certifications-container');
    let html = '';
    certifications.forEach(function (cert) {
        const placeholderClass = cert.link === '#' ? 'is-placeholder' : '';
        html += `
      <a href="${cert.link}" target="_blank" class="box card-surface ${placeholderClass}">
        <img draggable="false" src="./assets/images/${cert.image}" alt="${cert.name}">
        <div class="content">
          <div class="tag">
            <h3>${cert.name}</h3>
          </div>
        </div>
      </a>`;
    });
    container.innerHTML = html;
    srtop.reveal('#certifications-container .box', { interval: 150 });
}

loadJSON('./assets/data/skills.json').then(renderSkills).catch(function (err) { console.error(err); });
loadJSON('./assets/data/projects.json').then(renderProjects).catch(function (err) { console.error(err); });
loadJSON('./assets/data/certifications.json').then(renderCertifications).catch(function (err) { console.error(err); });
