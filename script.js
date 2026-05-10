// 打字机效果
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // 打字完成后的光标效果
            element.style.borderRight = 'none';
        }
    }

    type();
}

// 页面加载完成后初始化打字机效果
document.addEventListener('DOMContentLoaded', () => {
    const typedTextElement = document.getElementById('typed-text');
    if (typedTextElement) {
        const fullText = typedTextElement.textContent.trim();
        typeWriter(typedTextElement, fullText, 40);
    }
});

// 平滑滚动效果
const navPillLinks = document.querySelectorAll('.nav-pill a');
const navbarEl = document.querySelector('.navbar');
let isProgrammaticScroll = false;

document.querySelectorAll('.nav-pill a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            isProgrammaticScroll = true;
            navbarEl.style.transform = 'translateY(0)';
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // smooth scroll 大约持续 300-800ms，之后恢复
            setTimeout(() => { isProgrammaticScroll = false; }, 900);
        }
    });
});

// 滚动监听 - 高亮当前导航 + 导航栏显隐
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    // 导航栏显隐（程序化跳转时不隐藏）
    if (!isProgrammaticScroll && scrollTop > lastScrollTop && scrollTop > 300) {
        navbarEl.style.transform = 'translateY(-110%)';
    } else if (!isProgrammaticScroll || scrollTop < 100) {
        navbarEl.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;

    // 高亮当前导航
    const sections = document.querySelectorAll('.section');
    const navHeight = navbarEl ? navbarEl.offsetHeight : 70;
    let currentId = '';
    sections.forEach(section => {
        if (section.getBoundingClientRect().top <= navHeight + 40) {
            currentId = section.id;
        }
    });
    navPillLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
});

// 页面加载动画
document.addEventListener('DOMContentLoaded', () => {
    // 添加加载动画类
    document.body.classList.add('loaded');

    // 为各个section添加交错动画
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });
});

// 响应式图片加载
function loadProfileImage() {
    const profileImg = document.getElementById('profile-img');
    if (profileImg) {
        profileImg.src = 'assets/自我介绍.jpg';

        profileImg.onload = () => {
            console.log('自我介绍.jpg loaded successfully');
        };

        profileImg.onerror = () => {
            console.log('Failed to load 自我介绍.jpg');
        };
    }
}

// 页面加载完成后初始化
window.addEventListener('load', () => {
    loadProfileImage();
});

// 键盘导航支持
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // 当用户使用Tab键导航时，增强焦点效果
        document.body.classList.add('keyboard-nav');
    }
});

// 检测用户是否使用鼠标
document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// 无障碍支持
function enhanceAccessibility() {
    // 为所有交互元素添加适当的ARIA标签
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('aria-label') && element.textContent) {
            element.setAttribute('aria-label', element.textContent);
        }
    });
}

// 初始化无障碍功能
enhanceAccessibility();

// ========== 扇形卡片交互 ==========
function initFanCarousel() {
    const carousel = document.getElementById('fanCarousel');
    const cards = carousel?.querySelectorAll('.fan-card');
    const leftArrow = document.querySelector('.fan-arrow-left');
    const rightArrow = document.querySelector('.fan-arrow-right');
    const dotsContainer = document.getElementById('fanDots');

    if (!carousel || !cards.length) return;

    // 创建指示点
    cards.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'fan-dot';
        dot.dataset.index = i;
        dot.addEventListener('click', () => scrollToCard(i));
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.fan-dot');

    // 滚动到指定卡片
    function scrollToCard(index) {
        const card = cards[index];
        if (!card) return;
        const scrollLeft = card.offsetLeft - carousel.offsetLeft - carousel.offsetWidth / 2 + card.offsetWidth / 2;
        carousel.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }

    // 更新激活指示点
    function updateActiveDot() {
        const center = carousel.scrollLeft + carousel.offsetWidth / 2;
        let closestIdx = 0;
        let closestDist = Infinity;
        cards.forEach((card, i) => {
            const cardCenter = card.offsetLeft - carousel.offsetLeft + card.offsetWidth / 2;
            const dist = Math.abs(center - cardCenter);
            if (dist < closestDist) { closestDist = dist; closestIdx = i; }
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === closestIdx));
    }

    // 左右箭头
    leftArrow?.addEventListener('click', () => {
        const cardWidth = cards[0]?.offsetWidth || 220;
        const gap = 20;
        carousel.scrollBy({ left: -(cardWidth + gap) * 1.5, behavior: 'smooth' });
    });

    rightArrow?.addEventListener('click', () => {
        const cardWidth = cards[0]?.offsetWidth || 220;
        const gap = 20;
        carousel.scrollBy({ left: (cardWidth + gap) * 1.5, behavior: 'smooth' });
    });

    // 点击翻转
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // 防止拖拽时误触发翻转
            if (card.dataset.dragging === 'true') return;
            card.classList.toggle('flipped');
        });

        // 拖拽检测
        let startX = 0;
        let moved = false;
        card.addEventListener('mousedown', (e) => { startX = e.clientX; moved = false; card.dataset.dragging = 'false'; });
        card.addEventListener('mousemove', (e) => { if (Math.abs(e.clientX - startX) > 5) { moved = true; card.dataset.dragging = 'true'; } });
        card.addEventListener('mouseup', () => { setTimeout(() => { card.dataset.dragging = 'false'; }, 100); });

        // 触摸事件
        card.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; moved = false; card.dataset.dragging = 'false'; });
        card.addEventListener('touchmove', (e) => { if (Math.abs(e.touches[0].clientX - startX) > 5) { moved = true; card.dataset.dragging = 'true'; } });
        card.addEventListener('touchend', () => { setTimeout(() => { card.dataset.dragging = 'false'; }, 100); });
    });

    // 点击空白处关闭翻转
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.fan-card')) {
            cards.forEach(c => c.classList.remove('flipped'));
        }
    });

    // 滚动时更新指示点
    carousel.addEventListener('scroll', updateActiveDot, { passive: true });
    updateActiveDot();
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initFanCarousel();
});

// ========== 下载简历 & 联系我弹窗 ==========
document.addEventListener('DOMContentLoaded', () => {
    const btnDownload = document.getElementById('btnDownload');
    const btnContact = document.getElementById('btnContact');
    const overlay = document.getElementById('contactOverlay');
    const btnClose = document.getElementById('popupClose');

    // 下载简历
    btnDownload?.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = 'assets/蒋奕文【简历】.pdf';
        a.download = '蒋奕文【简历】.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // 打开弹窗
    btnContact?.addEventListener('click', () => {
        overlay?.classList.add('active');
    });

    // 关闭弹窗
    btnClose?.addEventListener('click', () => {
        overlay?.classList.remove('active');
    });

    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
    });

    // 复制功能
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const text = btn.dataset.copy;
            try {
                await navigator.clipboard.writeText(text);
                btn.textContent = '已复制';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '复制';
                    btn.classList.remove('copied');
                }, 1500);
            } catch {
                // fallback
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                btn.textContent = '已复制';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '复制';
                    btn.classList.remove('copied');
                }, 1500);
            }
        });
    });
});

