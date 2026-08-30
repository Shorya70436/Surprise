/* ================================================================
   OUR STORY — Birthday Experience
   JavaScript Controller
   ================================================================ */

(function () {
    'use strict';

    // ──────────────────────────────────────────────────
    //  Config
    // ──────────────────────────────────────────────────
    const BIRTHDAY = new Date(Date.now() + 15 * 1000); // 15-second countdown

    const REASONS = [
        "Your laugh is my favorite sound in the world.",
        "You make even boring days feel like an adventure.",
        "The way you scrunch your nose when you're thinking.",
        "You always know how to make me smile — even when I'm trying to be mad.",
        "Your hugs feel like coming home.",
        "You're the bravest person I know, even when you don't realize it.",
        "The way you care about the little things.",
        "You make me want to be a better person every single day.",
        "Your determination is honestly so inspiring.",
        "The way you get excited about your favorite food.",
        "You remember the tiny details that everyone else forgets.",
        "Your kindness is genuine — it's just who you are.",
        "The way you look at the stars like they're old friends.",
        "You never give up, even when things are hard.",
        "Your morning voice is secretly adorable.",
        "You're the only person who truly gets my weird humor.",
        "The way you dance when you think no one's watching.",
        "You make the world softer just by being in it.",
        "Your eyes light up when you talk about things you love.",
        "You chose to love me, and that's the greatest gift I've ever received."
    ];

    let lastReasonIndex = -1;

    // ──────────────────────────────────────────────────
    //  DOM References
    // ──────────────────────────────────────────────────
    const $  = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const stage1       = $('#stage1');
    const stage2       = $('#stage2');
    const stage3       = $('#stage3');
    const cdDays       = $('#cd-days');
    const cdHours      = $('#cd-hours');
    const cdMinutes    = $('#cd-minutes');
    const cdSeconds    = $('#cd-seconds');
    const btnOpen      = $('#btn-open-surprise');
    const videoIntro   = $('#video-intro');
    const videoArea    = $('#video-area');
    const btnReady     = $('#btn-ready');
    const storyVideo   = $('#story-video');
    const btnMute      = $('#btn-mute');
    const iconUnmuted  = $('#icon-unmuted');
    const iconMuted    = $('#icon-muted');
    const videoEnd     = $('#video-end');
    const btnContinue  = $('#btn-continue');
    const reasonText   = $('#reason-text');
    const btnShuffle   = $('#btn-shuffle');
    const btnMusic     = $('#btn-music');
    const btnRainHearts= $('#btn-rain-hearts');
    const heartsCanvas = $('#hearts-canvas');
    const heartRainCanvas = $('#heart-rain-canvas');
    const footerTrigger= $('#footer-hearts-trigger');
    const easterEgg    = $('#easter-egg');
    const bgMusic      = $('#bg-music');

    // ──────────────────────────────────────────────────
    //  Stage Transitions
    // ──────────────────────────────────────────────────
    function transitionTo(target) {
        const current = document.querySelector('.stage.active');
        if (current) {
            current.style.opacity = '1';
            current.style.transition = 'opacity 0.8s ease';
            current.style.opacity = '0';
            setTimeout(() => {
                current.classList.remove('active');
                current.style.opacity = '';
                current.style.transition = '';
                showStage(target);
            }, 800);
        } else {
            showStage(target);
        }
    }

    function showStage(target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'instant' });

        if (target === stage3) {
            initStage3();
        }
    }

    // ──────────────────────────────────────────────────
    //  STAGE 1 — Countdown
    // ──────────────────────────────────────────────────
    let countdownInterval;

    function updateCountdown() {
        const now = new Date();
        const diff = BIRTHDAY - now;

        if (diff <= 0) {
            // Birthday has arrived!
            cdDays.textContent = '00';
            cdHours.textContent = '00';
            cdMinutes.textContent = '00';
            cdSeconds.textContent = '00';
            enableButton();
            clearInterval(countdownInterval);
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        cdDays.textContent    = String(d).padStart(2, '0');
        cdHours.textContent   = String(h).padStart(2, '0');
        cdMinutes.textContent = String(m).padStart(2, '0');
        cdSeconds.textContent = String(s).padStart(2, '0');
    }

    function enableButton() {
        btnOpen.classList.remove('disabled');
        btnOpen.disabled = false;
        btnOpen.querySelector('.btn-text').textContent = 'Open your surprise';
        btnOpen.style.animation = 'none';
        void btnOpen.offsetHeight; // trigger reflow
        btnOpen.style.animation = 'pulse 2s ease-in-out infinite';
    }

    // Add pulse animation
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0%, 100% { box-shadow: 0 8px 32px rgba(194, 24, 91, 0.15); }
            50% { box-shadow: 0 8px 40px rgba(194, 24, 91, 0.35); }
        }
    `;
    document.head.appendChild(pulseStyle);

    btnOpen.addEventListener('click', () => {
        if (btnOpen.disabled) return;
        transitionTo(stage2);
    });

    // ──────────────────────────────────────────────────
    //  STAGE 1 — Floating Hearts (Canvas)
    // ──────────────────────────────────────────────────
    function initHeartsCanvas() {
        const ctx = heartsCanvas.getContext('2d');
        let hearts = [];
        let animId;

        function resize() {
            heartsCanvas.width = window.innerWidth;
            heartsCanvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Heart {
            constructor() {
                this.reset();
                this.y = Math.random() * heartsCanvas.height; // random initial Y
            }
            reset() {
                this.x = Math.random() * heartsCanvas.width;
                this.y = heartsCanvas.height + 20;
                this.size = Math.random() * 12 + 6;
                this.speed = Math.random() * 0.5 + 0.2;
                this.opacity = Math.random() * 0.3 + 0.1;
                this.wobble = Math.random() * 2 - 1;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
                this.angle = 0;
            }
            update() {
                this.y -= this.speed;
                this.angle += this.wobbleSpeed;
                this.x += Math.sin(this.angle) * this.wobble;
                if (this.y < -20) this.reset();
            }
            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = '#C2185B';
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                const s = this.size;
                ctx.moveTo(0, s * 0.3);
                ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
                ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < 25; i++) {
            hearts.push(new Heart());
        }

        function animate() {
            ctx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
            hearts.forEach(h => {
                h.update();
                h.draw(ctx);
            });
            animId = requestAnimationFrame(animate);
        }
        animate();

        // Cleanup when leaving stage 1
        return () => cancelAnimationFrame(animId);
    }

    const cleanupHearts = initHeartsCanvas();

    // Start countdown
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);

    // ──────────────────────────────────────────────────
    //  STAGE 2 — Video
    // ──────────────────────────────────────────────────
    btnReady.addEventListener('click', () => {
        videoIntro.style.transition = 'opacity 0.8s ease';
        videoIntro.style.opacity = '0';
        setTimeout(() => {
            videoIntro.style.display = 'none';
            videoArea.classList.remove('hidden');
            videoArea.style.animation = 'stageFadeIn 1s ease forwards';

            // Play video
            storyVideo.play().catch(err => {
                console.warn('Video autoplay blocked:', err);
            });
        }, 800);
    });

    // Mute toggle
    btnMute.addEventListener('click', () => {
        storyVideo.muted = !storyVideo.muted;
        iconUnmuted.style.display = storyVideo.muted ? 'none' : 'block';
        iconMuted.style.display = storyVideo.muted ? 'block' : 'none';
    });

    // Video ended
    storyVideo.addEventListener('ended', () => {
        videoArea.style.transition = 'opacity 0.8s ease';
        videoArea.style.opacity = '0';
        btnMute.style.display = 'none';
        setTimeout(() => {
            videoArea.style.display = 'none';
            videoEnd.classList.remove('hidden');
        }, 800);
    });

    // Continue button
    btnContinue.addEventListener('click', () => {
        transitionTo(stage3);
    });

    // ──────────────────────────────────────────────────
    //  STAGE 3 — Interactive Site
    // ──────────────────────────────────────────────────
    function initStage3() {
        initGiftBoxes();
        initReasons();
        initFlipCards();
        initScrollReveal();
        initLetterReveal();
        initEasterEgg();
        initMusicToggle();
        initHeartRain();
    }

    // Gift Boxes
    function initGiftBoxes() {
        $$('.gift-box').forEach(box => {
            box.addEventListener('click', () => {
                if (box.classList.contains('opened')) return;
                const msg = box.getAttribute('data-message');
                box.querySelector('.gift-message').textContent = msg;
                box.classList.add('opened');
            });
        });
    }

    // Reasons I Love You
    function initReasons() {
        btnShuffle.addEventListener('click', () => {
            reasonText.classList.add('fading');
            setTimeout(() => {
                let idx;
                do {
                    idx = Math.floor(Math.random() * REASONS.length);
                } while (idx === lastReasonIndex && REASONS.length > 1);
                lastReasonIndex = idx;
                reasonText.textContent = `"${REASONS[idx]}"`;
                reasonText.classList.remove('fading');
            }, 300);
        });
    }

    // Flip Cards (touch support)
    function initFlipCards() {
        $$('.flip-card').forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });
    }

    // Scroll Reveal for sections
    function initScrollReveal() {
        const sections = $$('.s3-section');
        sections.forEach(s => s.classList.add('scroll-reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(s => observer.observe(s));
    }

    // Love letter line-by-line reveal
    function initLetterReveal() {
        const lines = $$('.reveal-line');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.3 });

        lines.forEach((line, i) => {
            line.style.transitionDelay = `${i * 0.15}s`;
            observer.observe(line);
        });
    }

    // Easter Egg — triple click
    function initEasterEgg() {
        let clickCount = 0;
        let clickTimer;

        footerTrigger.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { clickCount = 0; }, 500);

            if (clickCount >= 3) {
                easterEgg.classList.remove('hidden');
                clickCount = 0;

                // Confetti burst
                spawnConfetti();
            }
        });
    }

    // Simple confetti burst
    function spawnConfetti() {
        const emojis = ['🎉', '🎊', '✨', '💖', '🥳', '🎂', '🌟'];
        for (let i = 0; i < 30; i++) {
            const el = document.createElement('div');
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.cssText = `
                position: fixed;
                top: ${Math.random() * 100}vh;
                left: ${Math.random() * 100}vw;
                font-size: ${Math.random() * 1.5 + 1}rem;
                pointer-events: none;
                z-index: 9999;
                animation: confettiFall ${Math.random() * 2 + 1.5}s ease forwards;
            `;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 3500);
        }
    }

    // Add confetti animation
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes confettiFall {
            0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
            100% { opacity: 0; transform: translateY(100vh) rotate(720deg) scale(0.3); }
        }
    `;
    document.head.appendChild(confettiStyle);

    // Music toggle
    function initMusicToggle() {
        let musicPlaying = false;
        btnMusic.addEventListener('click', () => {
            if (musicPlaying) {
                bgMusic.pause();
                btnMusic.classList.remove('active');
                btnMusic.textContent = '🎵';
            } else {
                bgMusic.play().catch(err => console.warn('Music play blocked:', err));
                btnMusic.classList.add('active');
                btnMusic.textContent = '🔊';
            }
            musicPlaying = !musicPlaying;
        });
    }

    // Heart Rain
    function initHeartRain() {
        const ctx = heartRainCanvas.getContext('2d');
        let raining = false;
        let rainHearts = [];
        let rainAnimId;

        function resize() {
            heartRainCanvas.width = window.innerWidth;
            heartRainCanvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class RainHeart {
            constructor() {
                this.x = Math.random() * heartRainCanvas.width;
                this.y = -20;
                this.size = Math.random() * 14 + 8;
                this.speed = Math.random() * 3 + 2;
                this.opacity = Math.random() * 0.6 + 0.4;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.05;
                this.wobble = Math.random() * 1.5;
                this.wobbleAngle = Math.random() * Math.PI * 2;
            }
            update() {
                this.y += this.speed;
                this.rotation += this.rotSpeed;
                this.wobbleAngle += 0.03;
                this.x += Math.sin(this.wobbleAngle) * this.wobble;
            }
            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.fillStyle = '#C2185B';
                ctx.beginPath();
                const s = this.size;
                ctx.moveTo(0, s * 0.3);
                ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
                ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);
                ctx.fill();
                ctx.restore();
            }
        }

        function startRain() {
            raining = true;
            rainHearts = [];

            function spawnHeart() {
                if (!raining) return;
                rainHearts.push(new RainHeart());
                setTimeout(spawnHeart, Math.random() * 100 + 30);
            }
            spawnHeart();

            function animateRain() {
                ctx.clearRect(0, 0, heartRainCanvas.width, heartRainCanvas.height);
                rainHearts = rainHearts.filter(h => h.y < heartRainCanvas.height + 30);
                rainHearts.forEach(h => {
                    h.update();
                    h.draw(ctx);
                });
                if (raining || rainHearts.length > 0) {
                    rainAnimId = requestAnimationFrame(animateRain);
                }
            }
            animateRain();

            // Auto-stop after 5 seconds
            setTimeout(() => stopRain(), 5000);
        }

        function stopRain() {
            raining = false;
            btnRainHearts.classList.remove('active');
        }

        btnRainHearts.addEventListener('click', () => {
            if (raining) {
                stopRain();
            } else {
                btnRainHearts.classList.add('active');
                startRain();
            }
        });
    }

    // ──────────────────────────────────────────────────
    //  Auto-init: if Stage 3 is already active on load
    // ──────────────────────────────────────────────────
    if (stage3.classList.contains('active')) {
        initStage3();
    }

})();
