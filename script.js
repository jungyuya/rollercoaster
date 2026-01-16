const API_ENDPOINT = "https://0oliq70yca.execute-api.ap-northeast-2.amazonaws.com/prod/ContactEmail";

// ⚠️ 사용할 배경 이미지 경로들을 배열에 추가 (실제 로컬경로)
const HERO_BACKGROUND_IMAGES = [
    'images/background.jpg',
    'images/background1.jpg',
    'images/background2.png',
    'images/background3.webp',
    'images/background4.jpg',
    'images/background5.jpg',
    'images/background4.webp',
    'images/background7.jpg',
    'images/background8.webp',
    'images/background9.jpg'
];

document.addEventListener('DOMContentLoaded', () => {
    /* ====================================
     * 🎓 자격증 이미지 모달 기능
     * ==================================== */
    const certItems = document.querySelectorAll('.cert-item');
    const imageCertModal = document.getElementById('imageCertModal');
    const certModalImage = document.getElementById('certModalImage');
    const certModalCloseBtn = imageCertModal?.querySelector('.close-btn');

    const certImages = {
        'linux-master': 'images/linux.jpg',
        'network-admin': 'images/network.jpg',
        'aws-saa': 'images/SAA.jpg'
    };

    // 모달 닫기 로직을 함수로 캡슐화
    function closeCertModal() {
        if (imageCertModal) {
            imageCertModal.classList.remove('show');
            setTimeout(() => {
                document.body.style.overflow = '';
                if (certModalImage) certModalImage.src = '';
            }, 300);
        }
    }

    if (certItems.length > 0 && imageCertModal) {
        certItems.forEach(item => {
            // 클릭 이벤트만 남김 (모바일/데스크톱 모두 작동)
            item.addEventListener('click', () => {
                const certId = item.dataset.certId;
                const imageUrl = certImages[certId];

                if (imageUrl && certModalImage) {
                    certModalImage.src = imageUrl;
                    imageCertModal.classList.add('show');
                    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
                }
            });
        });

        // 모달 닫기 버튼 클릭 이벤트
        if (certModalCloseBtn) {
            certModalCloseBtn.addEventListener('click', closeCertModal);
        }

        // 모달 외부 클릭 시 닫기
        imageCertModal.addEventListener('click', (e) => {
            if (e.target === imageCertModal) {
                closeCertModal();
            }
        });

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && imageCertModal.classList.contains('show')) {
                closeCertModal();
            }
        });
    }

    /* ====================================
     * 🌟 히어로 섹션 배경 이미지 랜덤 변경 기능
     * ==================================== */
    const heroSection = document.getElementById('home');

    function setRandomHeroBackground() {
        if (heroSection && HERO_BACKGROUND_IMAGES.length > 0) {
            const randomIndex = Math.floor(Math.random() * HERO_BACKGROUND_IMAGES.length);
            const selectedImage = HERO_BACKGROUND_IMAGES[randomIndex];
            heroSection.style.backgroundImage = `url("${selectedImage}")`;
        }
    }

    // 페이지 로드 시 배경 이미지 설정
    setRandomHeroBackground();

    //배경 변환 시간 설정
    setInterval(setRandomHeroBackground, 5000);
});

/* ====================================
 * 📂 프로젝트 데이터 및 렌더링 (가로형 레이아웃)
 * ==================================== */
const projectData = [
    {
        id: "deepdive-blog",
        title: "블로그 프로젝트 : Deep Dive! ",
        description: "AWS 서버리스 환경에서 TypeScript 기반 Node.js와 Next.js를 활용하여 직접 기획부터 풀스택 개발, CI/CD 파이프라인 구현 및 배포, 운영까지 진행한 기술 블로그입니다. 제작 과정과 다양한 기술 블로그 포스팅을 확인할 수 있습니다. 기존 대형 블로그 플랫폼 그 이상의 기술과 사용 경험을 만들기 위해 노력했습니다.",
        image: "images/deepdive-blog-thumbnail.png",
        tags: ["Node.js", "Next.js", "Docker", "AWS CDK", "CI/CD", "AI Integration"],
        github: "https://github.com/jungyuya/new-blog",
        period: "2025.08 ~ 2026.01",
        team: "개인 프로젝트",
        architectures: [
            "architectures/blog_arch_1.jpg", // 전체 아키텍처
            "architectures/blog_arch_2.png", // CI/CD 파이프라인
            "architectures/blog_arch_3.jpg", // Polly TTS 음성 파이프라인
            "architectures/blog_arch_4.jpg", // Open Search 파이프라인
            "architectures/blog_arch_5.png", // 이미지 리사이징 
        ],
        links: [
            { text: "블로그 바로가기", url: "https://blog.jungyu.store", icon: "🌐" },
            { text: "상세 소개", url: "https://docs.google.com/document/d/1BnN1a3AGs5fQwx7btCwQ6wtPT2h2ahBMccugiAm-w9I/edit?usp=sharing", icon: "💻" },
        ]
    },
    {
        id: "realtime-chat",
        title: "실시간 채팅 서비스",
        description: "Go와 React로 구축하여 기존 블로그에 iframe으로 통합한 실시간 채팅 위젯입니다. WebSocket과 JWT를 실시간 채팅 환경을 구현했으며, 서비스 규모에 맞춰 GKE아키텍처를 단일 VM 환경으로 재설계하는 인프라 최적화를 수행했습니다. Terraform과 Docker Compose를 통해 프리티어로 유지하면서도, SSL 자동화 및 배포 파이프라인을 유지하여 지속 가능한 서비스를 완성했습니다.",
        image: "images/realtime-chat-thumbnail.png",
        tags: ["Go", "React", "Terraform", "GCP", "ArgoCD", "Docker", "WebSocket"],
        github: "https://github.com/jungyuya/realtime-chat",
        period: "2025.11 ~ 2025.12",
        team: "개인 프로젝트",
        architectures: [
            "architectures/chat_arch_1.png", // GKE 아키텍처
            "architectures/chat_arch_2.png", // VM 파이프라인
        ],
        links: [
            { text: "서비스 방문", url: "https://chat.jungyu.store", icon: "💬" },
            { text: "상세 소개", url: "https://github.com/jungyuya/realtime-chat/blob/main/README.md", icon: "📝" }
        ]
    },
    {
        id: "itchuru",
        title: "IT츄르",
        description: "매일 쏟아지는 IT 뉴스를 Gemini API로 요약하여 제공합니다. 국내 및 해외 IT 소식을 정리하고, AI 챗봇을 통해 뉴스 내용을 요약하고 추가 질문을 가능하도록 구성하였습니다.",
        image: "images/itchuru.webp",
        tags: ["AWS Lambda", "Gemini API", "Python"],
        github: "https://github.com/jungyuya/itchuru",
        period: "2025.09 ~ 2025.10",
        team: "개인 프로젝트",
        links: [
            { text: "서비스 방문", url: "https://jungyu.store/itchuru", icon: "📰" }
        ]
    },
    {
        id: "chatlastic",
        title: "챗라스틱 (Chatlastic)",
        description: "사용자의 감정을 분석하여 위로와 조언을 건네는 심리상담 AI 챗봇 웹 애플리케이션입니다. OpenAI API를 활용해 자연스러운 대화를 구현했으며, 프롬프트 엔지니어링을 통해 상담가 페르소나를 적용했습니다.",
        image: "images/project1.png",
        tags: ["OpenAI API", "HTML/CSS/JS", "Node.js", "CI/CD", "Serverless"],
        github: "https://github.com/jungyuya/chatlastic",
        period: "2023.11 ~ 2024.02",
        team: "팀 프로젝트 (3인)",
        links: [
            { text: "서비스 방문", url: "/chatlastic/", icon: "💬" },
            { text: "발표자료", url: "https://docs.google.com/presentation/d/1uBBbbRDRsrr6D8dfGmaN-vBXXFjmXaDP2wu_v7q5KEg/edit?pli=1&slide=id.p1#slide=id.p1", icon: "📄" },
        ]
    },
    /*
    {
        id: "petconnect",
        title: "펫커넥트 (PetConnect)",
        description: "유기동물 입양을 돕는 플랫폼으로, AWS EKS 기반의 마이크로서비스 아키텍처로 구축되었습니다. ArgoCD를 도입하여 GitOps 기반의 CI/CD 파이프라인을 구축, 배포 자동화를 실현했습니다.",
        image: "images/project2.png",
        tags: ["AWS EKS", "ArgoCD", "Jenkins", "Microservices"],
        links: [
            { text: "상세 보기", url: "#", icon: "🔍" } 
        ]
    }, */
    {
        id: "rollercoaster",
        title: "롤러코스터 (RollerCoaster)",
        description: "개인 포트폴리오용 웹 앱입니다.",
        image: "images/project3.webp",
        period: "2025.06 ~ 2025.08",
        team: "개인 프로젝트",
        tags: ["AWS Serverless", "HTML/CSS/JS", "Responsive Web"],
        github: "https://github.com/jungyuya/rollercoaster",
        links: [
        ]
    },
];

/* ====================================
 * 📂 프로젝트 렌더링 및 아키텍처 모달 로직
 * ==================================== */

// 1. 프로젝트 렌더링 함수
function renderProjects() {
    const container = document.getElementById('project-list-container');
    if (!container) return;

    // GitHub 아이콘 SVG
    const githubIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;

    // 아키텍처 아이콘 SVG (다이어그램 모양)
    const archIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="8" rx="2" /><line x1="9" y1="7" x2="9.01" y2="7" /><line x1="12" y1="7" x2="15" y2="7" /><path d="M12 11v3" /><path d="M6 18v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" /><circle cx="6" cy="19" r="2" /><circle cx="12" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></svg>`;

    container.innerHTML = projectData.map(project => `
        <article class="project-row">
            <div class="project-left-col">
                <div class="project-img-box">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                </div>
                <div class="project-meta-info">
                    <div class="meta-item">
                        <span class="meta-icon">📅</span>
                        <span class="meta-text">${project.period}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-icon">👥</span>
                        <span class="meta-text">${project.team}</span>
                    </div>
                </div>
            </div>

            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    
                    <div class="header-icons">
                        <!-- ✨ 아키텍처 버튼 (상단 이동) -->
                        ${project.architectures && project.architectures.length > 0 ? `
                            <button class="icon-btn btn-arch" data-id="${project.id}" aria-label="Architecture">
                                ${archIconSvg}
                                <!-- ✨ 툴팁 요소 추가 -->
                                <span class="arch-tooltip">🏗️ Architecture!</span>
                            </button>
                        ` : ''}

                        <!-- GitHub 버튼 -->
                        ${project.github ? `
                            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="icon-btn btn-github" aria-label="GitHub Code" title="GitHub Repository">
                                ${githubIconSvg}
                            </a>
                        ` : ''}
                    </div>
                </div>

                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
                <p class="project-desc">${project.description}</p>
                
                <div class="project-links">
                    <!-- 하단에는 일반 링크만 남김 -->
                    ${project.links.map(link => `
                        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn-small">
                            ${link.icon} ${link.text}
                        </a>
                    `).join('')}
                </div>
            </div>
        </article>
    `).join('');
}

// 2. 아키텍처 모달 관련 로직
const archModal = document.getElementById('arch-modal');
const archImage = document.getElementById('arch-image');
const archCounter = document.getElementById('arch-counter');
const prevBtn = document.getElementById('arch-prev-btn');
const nextBtn = document.getElementById('arch-next-btn');
const closeArchBtn = document.getElementById('close-arch-modal');

let currentArchImages = [];
let currentArchIndex = 0;

function openArchModal(images) {
    if (!images || images.length === 0) return;

    currentArchImages = images;
    currentArchIndex = 0;

    updateArchSlider();
    if (archModal) {
        archModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeArchModal() {
    if (archModal) {
        archModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function updateArchSlider() {
    if (archImage && archCounter) {
        archImage.src = currentArchImages[currentArchIndex];
        archCounter.textContent = `${currentArchIndex + 1} / ${currentArchImages.length}`;
    }
}

// 3. 이벤트 리스너 연결 (DOMContentLoaded 내부)
document.addEventListener('DOMContentLoaded', () => {
    // 프로젝트 렌더링
    renderProjects();

    // 아키텍처 버튼 클릭 이벤트 위임
    const projectListContainer = document.getElementById('project-list-container');
    if (projectListContainer) {
        projectListContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-arch');
            if (btn) {
                const projectId = btn.dataset.id;
                const project = projectData.find(p => p.id === projectId);
                if (project && project.architectures) {
                    openArchModal(project.architectures);
                }
            }
        });
    }

    // 슬라이더 버튼 이벤트
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentArchIndex = (currentArchIndex - 1 + currentArchImages.length) % currentArchImages.length;
            updateArchSlider();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentArchIndex = (currentArchIndex + 1) % currentArchImages.length;
            updateArchSlider();
        });
    }

    // 닫기 버튼
    if (closeArchBtn) {
        closeArchBtn.addEventListener('click', closeArchModal);
    }

    // 모달 배경 클릭 시 닫기
    if (archModal) {
        archModal.addEventListener('click', (e) => {
            if (e.target === archModal) closeArchModal();
        });
    }

    // 키보드 이벤트 (ESC, 화살표)
    window.addEventListener('keydown', (e) => {
        if (archModal && archModal.classList.contains('show')) {
            if (e.key === 'Escape') closeArchModal();
            if (e.key === 'ArrowLeft') prevBtn?.click();
            if (e.key === 'ArrowRight') nextBtn?.click();
        }
    });
    const archButtons = document.querySelectorAll('.btn-arch');

    if (archButtons.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.8 // 버튼이 80% 이상 보일 때 트리거
        };

        const tooltipObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const btn = entry.target;
                    const tooltip = btn.querySelector('.arch-tooltip');

                    if (tooltip) {
                        tooltip.classList.add('show');
                        observer.unobserve(btn);
                        setTimeout(() => {
                            tooltip.classList.remove('show');
                        }, 2500);
                    }
                }
            });
        }, observerOptions);

        archButtons.forEach(btn => tooltipObserver.observe(btn));
    }
});