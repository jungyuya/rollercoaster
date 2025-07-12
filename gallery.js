document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM 요소 선택 ---
    const galleryContainer = document.getElementById("gallery-container");
    const openModalBtn = document.getElementById('open-upload-modal-btn');
    const modalOverlay = document.getElementById('upload-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const uploadForm = document.getElementById('upload-form');
    const imageInput = document.getElementById('image-input');
    const fileInputLabel = document.querySelector('.file-input-label span');
    const uploadStatus = document.getElementById('upload-status');

    // ✨ 관리자 로그인 UI 요소
    const adminTokenInput = document.getElementById('admin-token-input');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');

    // ✨ 커스텀 확인 모달 요소
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmYesBtn = document.getElementById('confirm-yes-btn');
    const confirmNoBtn = document.getElementById('confirm-no-btn');

    // --- 2. API 및 토큰 설정 ---
    const API_BASE_URL = 'http://localhost:3000';
    const ADMIN_TOKEN = '123456'; // 하드코딩된 관리자 토큰 (실제 서비스에서는 보안 강화 필요)
    let isAdmin = false; // 관리자 로그인 상태

    // --- 커스텀 확인 모달 제어 함수 ---
    let confirmCallback = null; // 확인/취소 버튼 클릭 시 실행될 콜백 함수

    const showConfirmModal = (message, onConfirm) => {
        confirmMessage.textContent = message;
        confirmCallback = onConfirm;
        confirmModal.classList.add('show');
    };

    const hideConfirmModal = () => {
        confirmModal.classList.remove('show');
        confirmCallback = null;
    };

    confirmYesBtn.addEventListener('click', () => {
        if (confirmCallback) {
            confirmCallback(true);
        }
        hideConfirmModal();
    });

    confirmNoBtn.addEventListener('click', () => {
        if (confirmCallback) {
            confirmCallback(false);
        }
        hideConfirmModal();
    });

    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) { // 오버레이 클릭 시 닫기
            hideConfirmModal();
        }
    });

    // --- 관리자 모드 토글 함수 ---
    const toggleAdminMode = (loggedIn) => {
        isAdmin = loggedIn;
        if (isAdmin) {
            adminTokenInput.style.display = 'none';
            adminLoginBtn.style.display = 'none';
            adminLogoutBtn.style.display = 'inline-block';
            openModalBtn.style.display = 'inline-block'; // 업로드 버튼 표시
            console.log('관리자 모드 활성화');
        } else {
            adminTokenInput.style.display = 'inline-block';
            adminLoginBtn.style.display = 'inline-block';
            adminLogoutBtn.style.display = 'none';
            openModalBtn.style.display = 'none'; // 업로드 버튼 숨김
            adminTokenInput.value = ''; // 로그아웃 시 토큰 초기화
            console.log('관리자 모드 비활성화');
        }
        loadGallery(); // 관리자 모드 변경 시 갤러리 새로고침 (삭제 버튼 표시/숨김)
    };

    // --- 관리자 로그인/로그아웃 이벤트 리스너 ---
    adminLoginBtn.addEventListener('click', () => {
        const enteredToken = adminTokenInput.value;
        if (enteredToken === ADMIN_TOKEN) {
            toggleAdminMode(true);
            alert('관리자 로그인 성공!'); // 사용자에게 알림
        } else {
            alert('잘못된 관리자 토큰입니다.'); // 사용자에게 알림
        }
    });

    adminLogoutBtn.addEventListener('click', () => {
        toggleAdminMode(false);
        alert('관리자 로그아웃 되었습니다.'); // 사용자에게 알림
    });

    // --- 이미지 삭제 함수 ---
    const deleteImage = async (imageKey) => {
        showConfirmModal('정말로 이 이미지를 삭제하시겠습니까?', async (confirmed) => {
            if (!confirmed) {
                return; // 삭제 취소
            }

            try {
                const response = await fetch(`${API_BASE_URL}/image/${imageKey}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': ADMIN_TOKEN },
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || '이미지 삭제에 실패했습니다.');
                }

                alert(result.message); // 사용자에게 삭제 성공 알림
                loadGallery(); // 갤러리 새로고침
            } catch (error) {
                alert(`❌ 이미지 삭제 오류: ${error.message}`); // 사용자에게 삭제 실패 알림
            }
        });
    };

    // --- 이미지 요소를 생성하고 갤러리에 추가하는 함수 ---
    const createImageElement = (url) => {
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";

        const img = document.createElement("img");
        img.src = url;
        img.alt = "S3 갤러리 이미지";
        img.className = "gallery-img";

        // 이미지 확대 기능
        img.addEventListener("click", () => {
            const overlay = document.createElement("div");
            overlay.className = "image-overlay";

            const enlargedImg = document.createElement("img");
            enlargedImg.src = img.src;
            enlargedImg.alt = img.alt;

            overlay.appendChild(enlargedImg);
            document.body.appendChild(overlay);

            overlay.addEventListener("click", () => {
                overlay.remove();
            });

            const handleEsc = (e) => {
                if (e.key === "Escape") {
                    overlay.remove();
                    document.removeEventListener("keydown", handleEsc);
                }
            };
            document.addEventListener("keydown", handleEsc);
        });

        galleryItem.appendChild(img);

        // 관리자 모드일 경우 삭제 버튼 추가
        if (isAdmin) {
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = '🗑️'; // 휴지통 이모지
            // S3 객체 키를 data-key 속성에 저장 (URL에서 추출)
            const urlParts = url.split('/');
            const s3Key = urlParts.slice(urlParts.indexOf('gallery') + 1).join('/'); // 'gallery/' 이후의 경로 추출
            deleteBtn.dataset.key = s3Key; // data-key="12345-image.jpg"
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 이미지 확대 이벤트 방지
                deleteImage(deleteBtn.dataset.key);
            });
            galleryItem.appendChild(deleteBtn);
        }

        return galleryItem;
    };

    // --- 3. 갤러리 로딩 함수 ---
    const loadGallery = async () => {
        if (!galleryContainer) return;
        try {
            galleryContainer.innerHTML = '<p>☁️ S3에서 이미지를 불러오는 중...</p>';
            const response = await fetch(`${API_BASE_URL}/images`);
            if (!response.ok) {
                throw new Error('갤러리를 불러오는데 실패했습니다.');
            }
            const imageUrls = await response.json();

            galleryContainer.innerHTML = ''; // 기존 갤러리 비우기

            if (imageUrls.length === 0) {
                galleryContainer.innerHTML = '<p>아직 업로드된 이미지가 없어요. 첫 번째 이미지를 올려보세요!</p>';
                return;
            }

            // S3에서 받아온 이미지 URL 목록을 반복해서 갤러리에 추가
            imageUrls.forEach(url => {
                const item = createImageElement(url); // 이미지 요소 생성 함수 사용
                galleryContainer.appendChild(item);
            });

        } catch (error) {
            galleryContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    };

    // --- 4. 모달 및 업로드 관련 기능 ---
    const openModal = () => modalOverlay.classList.add('show');
    const closeModal = () => modalOverlay.classList.remove('show');

    // 업로드 폼 제출 이벤트 처리
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!imageInput.files || imageInput.files.length === 0) { // ✨ 다중 파일 확인
            uploadStatus.textContent = '⚠️ 이미지를 먼저 선택해주세요.';
            uploadStatus.style.color = 'orange';
            return;
        }

        const formData = new FormData();
        // ✨ 선택된 모든 파일을 'images' 필드에 추가
        for (let i = 0; i < imageInput.files.length; i++) {
            formData.append('images', imageInput.files[i]);
        }

        uploadStatus.textContent = `⏳ ${imageInput.files.length}개의 클라우드로 전송 중...`;
        uploadStatus.style.color = '#3498db';

        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: { 'Authorization': ADMIN_TOKEN },
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || '업로드에 실패했습니다.');

            uploadStatus.textContent = result.message;
            uploadStatus.style.color = '#27ae60';
            
            uploadForm.reset();
            fileInputLabel.textContent = '🖼️ 이미지 선택'; // 파일 선택 라벨 초기화
            
            setTimeout(() => {
                closeModal();
                loadGallery(); // 업로드 후 갤러리 새로고침
                uploadStatus.textContent = '';
            }, 1500);

        } catch (error) {
            uploadStatus.textContent = `❌ 오류: ${error.message}`;
            uploadStatus.style.color = 'red';
        }
    });
    
    // --- 5. 이벤트 리스너 연결 ---
    // 업로드 모달 열기/닫기
    openModalBtn.addEventListener('click', () => {
        if (isAdmin) { // 관리자일 때만 업로드 모달 열기
            openModal();
        } else {
            alert('관리자만 이미지를 업로드할 수 있습니다. 로그인해주세요.');
        }
    });
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    // 파일 입력 변경 시 라벨 텍스트 업데이트
    imageInput.addEventListener('change', () => {
        const files = imageInput.files;
        if (files.length > 1) {
            fileInputLabel.textContent = `✔️ ${files.length}개의 파일 선택됨`;
        } else if (files.length === 1) {
            fileInputLabel.textContent = `✔️ ${files[0].name}`;
        } else {
            fileInputLabel.textContent = '🖼️ 이미지 선택';
        }
    });

    // --- 페이지 첫 로드 시 갤러리 불러오기 및 관리자 모드 초기화 ---
    toggleAdminMode(false); // 초기에는 관리자 모드 비활성화
});
