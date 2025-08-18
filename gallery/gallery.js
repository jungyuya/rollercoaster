document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM 요소 선택 (기존과 동일) ---
    const galleryContainer = document.getElementById("gallery-container");
    const openModalBtn = document.getElementById('open-upload-modal-btn');
    const modalOverlay = document.getElementById('upload-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const uploadForm = document.getElementById('upload-form');
    const imageInput = document.getElementById('image-input');
    const fileInputLabel = document.querySelector('.file-input-label span');
    const uploadStatus = document.getElementById('upload-status');
    const adminTokenInput = document.getElementById('admin-token-input');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const customAlertModal = document.getElementById('custom-alert-modal');
    const alertMessage = document.getElementById('alert-message');
    const alertOkBtn = document.getElementById('alert-ok-btn');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmYesBtn = document.getElementById('confirm-yes-btn');
    const confirmNoBtn = document.getElementById('confirm-no-btn');
    const deleteSelectedBtn = document.getElementById('delete-selected-btn');
    const selectedCountSpan = document.getElementById('selected-count');

    // --- 2. API 및 상태 변수 설정 ---
    const API_BASE_URL = 'https://73624ycwk6.execute-api.ap-northeast-2.amazonaws.com/default';
    
    // ✨✨✨ 핵심 변경점 1: ADMIN_TOKEN 상수를 완전히 삭제합니다.
    // 대신, 사용자가 입력한 토큰을 저장할 변수를 만듭니다. 초기값은 비어있습니다(null).
    let loggedInToken = null; 
    
    let isAdmin = false;
    let selectedImages = new Set();

    // --- 모달 제어 함수들 (기존과 동일) ---
    const showAlertModal = (message) => {
        alertMessage.textContent = message;
        customAlertModal.classList.add('show');
    };
    const hideAlertModal = () => {
        customAlertModal.classList.remove('show');
    };
    alertOkBtn.addEventListener('click', hideAlertModal);
    customAlertModal.addEventListener('click', (e) => { if (e.target === customAlertModal) hideAlertModal(); });
    let confirmCallback = null;
    const showConfirmModal = (message, onConfirm) => {
        confirmMessage.textContent = message;
        confirmCallback = onConfirm;
        confirmModal.classList.add('show');
    };
    const hideConfirmModal = () => {
        confirmModal.classList.remove('show');
        confirmCallback = null;
    };
    confirmYesBtn.addEventListener('click', () => { if (confirmCallback) { confirmCallback(true); } hideConfirmModal(); });
    confirmNoBtn.addEventListener('click', () => { if (confirmCallback) { confirmCallback(false); } hideConfirmModal(); });
    confirmModal.addEventListener('click', (e) => { if (e.target === confirmModal) { hideConfirmModal(); } });

    // --- 관리자 모드 토글 함수 ---
    const toggleAdminMode = (loggedIn) => {
        isAdmin = loggedIn;
        if (isAdmin) {
            adminTokenInput.style.display = 'none';
            adminLoginBtn.style.display = 'none';
            adminLogoutBtn.style.display = 'inline-block';
            openModalBtn.style.display = 'inline-block';
            deleteSelectedBtn.style.display = 'inline-block';
        } else {
            // 로그아웃 시 저장된 토큰을 비웁니다.
            loggedInToken = null; 
            adminTokenInput.style.display = 'inline-block';
            adminLoginBtn.style.display = 'inline-block';
            adminLogoutBtn.style.display = 'none';
            openModalBtn.style.display = 'none';
            deleteSelectedBtn.style.display = 'none';
            adminTokenInput.value = '';
            selectedImages.clear();
            updateSelectedCount();
        }
        loadGallery();
    };

    // --- 관리자 로그인/로그아웃 이벤트 리스너 ---
    adminLoginBtn.addEventListener('click', () => {
        const enteredToken = adminTokenInput.value;
        if (!enteredToken) {
            showAlertModal('관리자 토큰을 입력해주세요.');
            return;
        }
        // ✨✨✨ 핵심 변경점 2: 여기서 더 이상 토큰을 비교하지 않습니다!
        // 사용자가 입력한 값을 loggedInToken 변수에 "저장"만 합니다.
        loggedInToken = enteredToken;
        toggleAdminMode(true);
        showAlertModal('관리자 모드로 전환합니다. 실제 인증은 API 요청 시 서버에서 이루어집니다.');
    });

    adminLogoutBtn.addEventListener('click', () => {
        toggleAdminMode(false);
        showAlertModal('관리자 로그아웃 되었습니다.');
    });

    const updateSelectedCount = () => { /* ... 기존 코드와 동일 ... */ };

    // --- ✨✨✨ 핵심 변경점 3: 모든 API 호출 시 loggedInToken 변수를 사용합니다. ---

    const deleteImage = async (imageKey) => {
        showConfirmModal('정말로 이 이미지를 삭제하시겠습니까?', async (confirmed) => {
            if (!confirmed) return;
            try {
                const response = await fetch(`${API_BASE_URL}/image/${imageKey}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': loggedInToken }, // 저장된 토큰 사용
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || '이미지 삭제 실패');
                showAlertModal(result.message);
                loadGallery();
            } catch (error) {
                showAlertModal(`❌ 이미지 삭제 오류: ${error.message}`);
            }
        });
    };

    const deleteSelectedImages = async () => {
        if (selectedImages.size === 0) return;
        showConfirmModal(`선택된 이미지 ${selectedImages.size}개를 정말로 삭제하시겠습니까?`, async (confirmed) => {
            if (!confirmed) return;
            try {
                const response = await fetch(`${API_BASE_URL}/images/batch`, {
                    method: 'DELETE',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': loggedInToken // 저장된 토큰 사용
                    },
                    body: JSON.stringify({ keys: Array.from(selectedImages) }),
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || '이미지 삭제 실패');
                showAlertModal(result.message);
                selectedImages.clear();
                loadGallery();
            } catch (error) {
                showAlertModal(`❌ 이미지 다중 삭제 오류: ${error.message}`);
            }
        });
    };

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!imageInput.files || imageInput.files.length === 0) { /* ... */ return; }
        const formData = new FormData();
        for (let i = 0; i < imageInput.files.length; i++) {
            formData.append('images', imageInput.files[i]);
        }
        uploadStatus.textContent = `⏳ ${imageInput.files.length}개의 클라우드로 전송 중...`;
        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: { 'Authorization': loggedInToken }, // 저장된 토큰 사용
                body: formData,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || '업로드 실패');
            uploadStatus.textContent = result.message;
            setTimeout(() => { closeModal(); loadGallery(); }, 1500);
        } catch (error) {
            uploadStatus.textContent = `❌ 오류: ${error.message}`;
        }
    });
    
    // --- 5. 이벤트 리스너 연결 ---
    openModalBtn.addEventListener('click', () => {
        if (isAdmin) {
            openModal();
        } else {
            showAlertModal('관리자만 이미지를 업로드할 수 있습니다. 로그인해주세요.');
        }
    });
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
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

    // ✨ 다중 삭제 버튼 이벤트 리스너
    deleteSelectedBtn.addEventListener('click', deleteSelectedImages);

    // --- 페이지 첫 로드 시 갤러리 불러오기 및 관리자 모드 초기화 ---
    toggleAdminMode(false); // 초기에는 관리자 모드 비활성화
});
