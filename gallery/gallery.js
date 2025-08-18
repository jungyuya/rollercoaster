document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM 요소 선택 ---
    const galleryContainer = document.getElementById("gallery-container");
    const galleryControls = document.querySelector('.gallery-controls'); // <-- 이 줄 추가
    const openModalBtn = document.getElementById('open-upload-modal-btn');
    const modalOverlay = document.getElementById('upload-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const uploadForm = document.getElementById('upload-form');
    const imageInput = document.getElementById('image-input');
    const fileInputLabel = document.querySelector('.file-input-label span');
    const uploadStatus = document.getElementById('upload-status');

    // 관리자 로그인 UI 요소
    const adminTokenInput = document.getElementById('admin-token-input');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');

    // 커스텀 알림/확인 모달 요소
    const customAlertModal = document.getElementById('custom-alert-modal');
    const alertMessage = document.getElementById('alert-message');
    const alertOkBtn = document.getElementById('alert-ok-btn');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmYesBtn = document.getElementById('confirm-yes-btn');
    const confirmNoBtn = document.getElementById('confirm-no-btn');

    // 다중 삭제 관련 요소
    const deleteSelectedBtn = document.getElementById('delete-selected-btn');
    const selectedCountSpan = document.getElementById('selected-count');

    // --- 2. API 및 상태 변수 설정 ---
    const API_BASE_URL = 'https://73624ycwk6.execute-api.ap-northeast-2.amazonaws.com/default';

    // 하드코딩된 ADMIN_TOKEN을 제거하고, 로그인 성공 시 토큰을 저장할 변수를 만듭니다.
    let loggedInToken = null;

    let isAdmin = false; // 관리자 로그인 상태
    let selectedImages = new Set(); // 선택된 이미지의 S3 키를 저장할 Set

    // --- 커스텀 알림 모달 제어 함수 ---
    const showAlertModal = (message) => {
        alertMessage.textContent = message;
        customAlertModal.classList.add('show');
    };

    const hideAlertModal = () => {
        customAlertModal.classList.remove('show');
    };

    alertOkBtn.addEventListener('click', hideAlertModal);
    customAlertModal.addEventListener('click', (e) => {
        if (e.target === customAlertModal) hideAlertModal();
    });

    // --- 커스텀 확인 모달 제어 함수 ---
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
        if (e.target === confirmModal) {
            hideConfirmModal();
        }
    });

    // --- 4. 모달 및 업로드 관련 기능 (누락되었던 함수 정의) ---
    const openModal = () => modalOverlay.classList.add('show');
    const closeModal = () => modalOverlay.classList.remove('show');

    // --- 관리자 모드 토글 함수 ---
    const toggleAdminMode = (loggedIn) => {
        isAdmin = loggedIn;
        if (isAdmin) {
            adminTokenInput.style.display = 'none';
            adminLoginBtn.style.display = 'none';
            adminLogoutBtn.style.display = 'inline-block';
            openModalBtn.style.display = 'inline-block';
            // deleteSelectedBtn.style.display = 'inline-block'; // [삭제] 이 줄을 삭제하거나 주석 처리합니다.
            galleryControls.style.display = 'block';          // [수정] 컨테이너를 보이게 합니다.
        } else {
            // 로그아웃 시 저장된 토큰을 비웁니다.
            loggedInToken = null;
            adminTokenInput.style.display = 'inline-block';
            adminLoginBtn.style.display = 'inline-block';
            adminLogoutBtn.style.display = 'none';
            openModalBtn.style.display = 'none';
            // deleteSelectedBtn.style.display = 'none'; // [삭제] 이 줄을 삭제하거나 주석 처리합니다.
            galleryControls.style.display = 'none';     // [수정] 컨테이너를 다시 숨깁니다.
            adminTokenInput.value = '';
            selectedImages.clear();
            updateSelectedCount();
        }
        loadGallery();
    };

    // --- 관리자 로그인/로그아웃 이벤트 리스너 ---
    // adminLoginBtn의 이벤트 리스너를 async 함수로 변경합니다.
    adminLoginBtn.addEventListener('click', async () => {
        const enteredToken = adminTokenInput.value;
        if (!enteredToken) {
            showAlertModal('관리자 토큰을 입력해주세요.');
            return;
        }

        try {
            // 1. 백엔드의 '/verify-admin' API에 사용자가 입력한 토큰을 보냅니다.
            const response = await fetch(`${API_BASE_URL}/verify-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: enteredToken }), // { "token": "사용자 입력값" } 형태로 전송
            });

            // 2. 백엔드에서 보낸 응답을 JSON 형태로 파싱합니다.
            const result = await response.json();

            // 3. 응답이 성공(status code 200-299)이 아니면 에러로 처리합니다.
            if (!response.ok) {
                // 백엔드가 보낸 에러 메시지(예: '관리자 토큰이 유효하지 않습니다.')를 사용합니다.
                throw new Error(result.message || '인증에 실패했습니다.');
            }

            // 4. ✨ 인증에 성공한 경우에만 ✨ 다음 단계를 진행합니다.
            loggedInToken = enteredToken; // 토큰을 변수에 저장
            toggleAdminMode(true);      // 관리자 UI로 변경
            showAlertModal('관리자 로그인 성공!'); // 성공 메시지 표시

        } catch (error) {
            // 5. fetch 과정이나 인증 실패 시 에러를 여기서 처리합니다.
            console.error('Admin login error:', error);
            showAlertModal(`로그인 실패: ${error.message}`);
            toggleAdminMode(false); // 혹시 모르니 비로그인 상태로 확실히 되돌립니다.
        }
    });

    adminLogoutBtn.addEventListener('click', () => {
        toggleAdminMode(false);
        showAlertModal('관리자 로그아웃 되었습니다.');
    });

    // --- 선택된 이미지 개수 업데이트 함수 ---
    const updateSelectedCount = () => {
        selectedCountSpan.textContent = selectedImages.size;
        deleteSelectedBtn.disabled = selectedImages.size === 0;
        if (selectedImages.size === 0) {
            deleteSelectedBtn.classList.remove('active');
        } else {
            deleteSelectedBtn.classList.add('active');
        }
    };

    // --- 이미지 삭제 함수 (개별) ---
    const deleteImage = async (imageKey) => {
        showConfirmModal('정말로 이 이미지를 삭제하시겠습니까?', async (confirmed) => {
            if (!confirmed) return;

            try {
                const response = await fetch(`${API_BASE_URL}/image/${imageKey}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': loggedInToken }, // 저장된 토큰 사용
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || '이미지 삭제에 실패했습니다.');
                }

                showAlertModal(result.message);
                loadGallery();
            } catch (error) {
                showAlertModal(`❌ 이미지 삭제 오류: ${error.message}`);
            }
        });
    };

    // --- 이미지 삭제 함수 (다중) ---
    const deleteSelectedImages = async () => {
        if (selectedImages.size === 0) {
            showAlertModal('삭제할 이미지를 선택해주세요.');
            return;
        }

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
                if (!response.ok) {
                    throw new Error(result.message || '이미지 삭제에 실패했습니다.');
                }

                showAlertModal(result.message);
                selectedImages.clear();
                loadGallery();
            } catch (error) {
                showAlertModal(`❌ 이미지 다중 삭제 오류: ${error.message}`);
            }
        });
    };

    // --- 이미지 요소를 생성하고 갤러리에 추가하는 함수 ---
    const createImageElement = (url) => {
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";
        galleryItem.dataset.url = url;

        const img = document.createElement("img");
        img.src = url;
        img.alt = "S3 갤러리 이미지";
        img.className = "gallery-img";

        img.addEventListener("click", () => {
            const overlay = document.createElement("div");
            overlay.className = "image-overlay";
            const enlargedImg = document.createElement("img");
            enlargedImg.src = img.src;
            enlargedImg.alt = img.alt;
            overlay.appendChild(enlargedImg);
            document.body.appendChild(overlay);
            overlay.addEventListener("click", () => overlay.remove());
            const handleEsc = (e) => {
                if (e.key === "Escape") {
                    overlay.remove();
                    document.removeEventListener("keydown", handleEsc);
                }
            };
            document.addEventListener("keydown", handleEsc);
        });

        galleryItem.appendChild(img);

        if (isAdmin) {
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = '🗑️';
            const urlParts = url.split('/');
            const s3Key = urlParts.slice(urlParts.indexOf('gallery') + 1).join('/');
            deleteBtn.dataset.key = s3Key;

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteImage(deleteBtn.dataset.key);
            });
            galleryItem.appendChild(deleteBtn);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'select-checkbox';
            checkbox.dataset.key = s3Key;

            if (selectedImages.has(s3Key)) {
                checkbox.checked = true;
                galleryItem.classList.add('selected');
            }

            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                const key = e.target.dataset.key;
                if (e.target.checked) {
                    selectedImages.add(key);
                    galleryItem.classList.add('selected');
                } else {
                    selectedImages.delete(key);
                    galleryItem.classList.remove('selected');
                }
                updateSelectedCount();
            });
            galleryItem.appendChild(checkbox);
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

            galleryContainer.innerHTML = '';

            if (imageUrls.length === 0) {
                galleryContainer.innerHTML = '<p>아직 업로드된 이미지가 없어요. 첫 번째 이미지를 올려보세요!</p>';
                return;
            }

            imageUrls.forEach(url => {
                const item = createImageElement(url);
                galleryContainer.appendChild(item);
            });
            updateSelectedCount();
        } catch (error) {
            galleryContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    };

    // --- 업로드 폼 제출 이벤트 ---
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!imageInput.files || imageInput.files.length === 0) {
            uploadStatus.textContent = '⚠️ 이미지를 먼저 선택해주세요.';
            uploadStatus.style.color = 'orange';
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < imageInput.files.length; i++) {
            formData.append('images', imageInput.files[i]);
        }

        uploadStatus.textContent = `⏳ ${imageInput.files.length}개의 클라우드로 전송 중...`;
        uploadStatus.style.color = '#3498db';

        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: { 'Authorization': loggedInToken }, // 저장된 토큰 사용
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || '업로드에 실패했습니다.');

            uploadStatus.textContent = result.message;
            uploadStatus.style.color = '#27ae60';

            uploadForm.reset();
            fileInputLabel.textContent = '🖼️ 이미지 선택';

            setTimeout(() => {
                closeModal();
                loadGallery();
                uploadStatus.textContent = '';
            }, 1500);

        } catch (error) {
            uploadStatus.textContent = `❌ 오류: ${error.message}`;
            uploadStatus.style.color = 'red';
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

    // 다중 삭제 버튼 이벤트 리스너
    deleteSelectedBtn.addEventListener('click', deleteSelectedImages);

    // --- 페이지 첫 로드 시 갤러리 불러오기 및 관리자 모드 초기화 ---
    toggleAdminMode(false); // 초기에는 관리자 모드 비활성화
});