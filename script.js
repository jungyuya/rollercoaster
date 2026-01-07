document.addEventListener('DOMContentLoaded', function () {
    const strings = [
        "안녕하세요, 이준규입니다.😊",
        "클라우드 환경에서 IaC와 CI/CD를 활용하여,",
        "인프라 자동화 배포에 관심이 많습니다.",
        "진행해 온 프로젝트 소개",
        "국내·해외 IT 뉴스요약 'IT츄르' 제작",
        "심리상담 챗봇 '챗라스틱' 제작",
        "IaC(CDK) 기반 기술 블로그 제작 및 운영",
        "EKS 기반 '펫커넥트' 제작",
        "IaC 및 CI/CD를 통한 인프라 자동화 구성 및 관리",
        "프로젝트의 자세한 내용은 아래에서 확인해보세요!!😎",
        '깃허브 → <a href="https://github.com/jungyuya" target="_blank" rel="noopener noreferrer">https://github.com/jungyuya</a>'
    ];

    const options = {
        strings: strings,
        contentType: 'html',   // 중요: HTML 렌더링 허용 (링크 삽입용)
        typeSpeed: 80,
        backSpeed: 25,
        backDelay: 2000,
        startDelay: 200,
        loop: true,
        showCursor: true,
        cursorChar: '|',
        smartBackspace: true,
        fadeOut: false,

        preStringTyped: function (arrayPos) {
            // 첫 1~2 문장: 천천히 보여주기
            if (arrayPos <= 1) {
                this.typeSpeed = 100 + Math.floor(Math.random() * 40); // 느리게
                this.backSpeed = 30 + Math.floor(Math.random() * 15);
                this.backDelay = 2500 + Math.floor(Math.random() * 1000);
            } else if (arrayPos === strings.length - 1) {
                // 마지막(깃허브) 문자열: 타이핑은 평소보다 조금 빠르게, 삭제 전 대기 5초
                this.typeSpeed = 40 + Math.floor(Math.random() * 12);
                this.backSpeed = 6 + Math.floor(Math.random() * 6);
                this.backDelay = 5000; // 여기서 3초 대기
            } else {
                // 프로젝트 라인: 빠르게 리듬감 있게
                this.typeSpeed = 28 + Math.floor(Math.random() * 12);
                this.backSpeed = 1 + Math.floor(Math.random() * 8);
                this.backDelay = 650 + Math.floor(Math.random() * 450);
            }
        }
    };

    const typed = new Typed('#typing-effect', options);
});



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
     * ✉️ 연락처 폼 제출 기능
     * ==================================== */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = contactForm.querySelector('#name')?.value.trim();
            const email = contactForm.querySelector('#email')?.value.trim();
            const message = contactForm.querySelector('#message')?.value.trim();

            if (!name || !email || !message) {
                alert('모든 필드를 채워주세요!');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = '전송 중...';
            }

            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`${name}님, 메시지가 성공적으로 전송되었습니다!`);
                    contactForm.reset();
                } else {
                    alert(`메시지 전송 실패: ${data.message || '알 수 없는 서버 오류'}`);
                    console.error('API 응답 오류:', data);
                }
            } catch (error) {
                alert('메시지 전송 중 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                console.error('API 호출 중 치명적인 오류 발생:', error);
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = '보내기';
                }
            }
        });
    }

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
        imageCertModal.classList.remove('show');
        // 모달이 완전히 사라지는 애니메이션 시간(0.3s) 후에 스크롤바 되돌리기
        // 이 타이밍은 .modal-overlay의 transition 시간과 일치해야 합니다.
        setTimeout(() => {
            document.body.style.overflow = '';
            certModalImage.src = '';
        }, 300);
    }

    if (certItems.length > 0 && imageCertModal) {
        certItems.forEach(item => {
            // 클릭 이벤트만 남김 (모바일/데스크톱 모두 작동)
            item.addEventListener('click', () => {
                const certId = item.dataset.certId;
                const imageUrl = certImages[certId];

                if (imageUrl) {
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
    setInterval(setRandomHeroBackground, 4000);
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
        tags: ["AWS", "Next.js", "AWS CDK", "DevOps", "AI Integration"],
        links: [
            { text: "블로그 바로가기", url: "https://blog.jungyu.store", icon: "🌐" },
            { text: "상세 소개", url: "https://docs.google.com/document/d/1BnN1a3AGs5fQwx7btCwQ6wtPT2h2ahBMccugiAm-w9I/edit?usp=sharing", icon: "💻" },
            { text: "GitHub", url: "https://github.com/jungyuya/new-blog", icon: "💻" }
        ]
    },
    {
        id: "realtime-chat",
        title: "실시간 채팅 서비스",
        description: "Go와 React로 구축하여 기존 블로그에 iframe으로 통합한 실시간 채팅 위젯입니다. WebSocket과 JWT를 실시간 채팅 환경을 구현했으며, 서비스 규모에 맞춰 GKE아키텍처를 단일 VM 환경으로 재설계하는 '인프라 최적화'를 수행했습니다. Terraform과 Docker Compose를 통해 운영 비용을 '0원'으로 절감하면서도, SSL 자동화 및 배포 파이프라인을 유지하여 지속 가능한 서비스를 완성했습니다.",
        image: "images/realtime-chat-thumbnail.png", 
        tags: ["Go", "React", "Terraform", "GCP", "Docker", "WebSocket"],
        links: [
            { text: "서비스 방문", url: "https://chat.jungyu.store", icon: "💬" },
            { text: "GitHub", url: "https://github.com/jungyuya/realtime-chat", icon: "💻" },
            { text: "개발 과정 보기", url: "https://blog.jungyu.store/posts/14097f75-8709-4749-80e0-22ad11fa3dee", icon: "📝" } 
        ]
    },
    {
        id: "itchuru",
        title: "IT츄르",
        description: "매일 쏟아지는 IT 뉴스를 Gemini API로 요약하여 제공합니다. 국내 및 해외 IT 소식을 정리하고, AI 챗봇을 통해 뉴스 내용을 요약하고 추가 질문을 가능하도록 구성하였습니다.",
        image: "images/itchuru.webp",
        tags: ["AWS Lambda", "Serverless", "Gemini API", "Python"],
        links: [
            { text: "서비스 방문", url: "https://jungyu.store/itchuru", icon: "🐱" }
        ]
    },
    {
        id: "chatlastic",
        title: "챗라스틱 (Chatlastic)",
        description: "사용자의 감정을 분석하여 위로와 조언을 건네는 심리상담 AI 챗봇 웹 애플리케이션입니다. OpenAI API를 활용해 자연스러운 대화를 구현했으며, 프롬프트 엔지니어링을 통해 상담가 페르소나를 적용했습니다.",
        image: "images/project1.png",
        tags: ["OpenAI API", "HTML/CSS/JS", "Prompt Engineering"],
        links: [
            { text: "발표자료", url: "https://docs.google.com/presentation/d/1uBBbbRDRsrr6D8dfGmaN-vBXXFjmXaDP2wu_v7q5KEg/edit?pli=1&slide=id.p1#slide=id.p1", icon: "📄" },
            { text: "데모 보기", url: "/chatlastic/", icon: "💬" }
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
            { text: "상세 보기", url: "#", icon: "🔍" } // 필요 시 링크 수정
        ]
    }, */
    {
        id: "rollercoaster",
        title: "롤러코스터 (RollerCoaster)",
        description: "개인 포트폴리오용 웹 앱입니다.",
        image: "images/project3.webp",
        tags: ["Vanilla JS", "WSL/Linux", "Responsive Web"],
        links: [
            { text: "GitHub", url: "https://github.com/jungyuya/rollercoaster", icon: "💻" }
        ]
    },
    /*
    {
        id: "itchuru",
        title: "IT츄르 (IT-Churu)",
        description: "매일 쏟아지는 IT 뉴스를 Gemini API로 요약하여 제공합니다. AWS Lambda와 API Gateway를 활용한 서버리스(Serverless) 아키텍처로 구축하여 운영 비용을 최소화했습니다.",
        image: "images/itchuru.webp",
        tags: ["AWS Lambda", "Serverless", "Gemini API", "Python"],
        links: [
            { text: "서비스 방문", url: "https://jungyu.store/itchuru", icon: "🐱" }
        ]
    }
        */
];

function renderProjects() {
    const container = document.getElementById('project-list-container');
    if (!container) return;

    container.innerHTML = projectData.map(project => `
        <article class="project-row">
            <div class="project-image-wrapper">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
                <p class="project-desc">${project.description}</p>
                <div class="project-links">
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

// 페이지 로드 시 렌더링 실행
document.addEventListener('DOMContentLoaded', renderProjects);