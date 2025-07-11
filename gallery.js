// 갤러리 이미지 파일 목록 배열
const images = [
  "cert1.jpg",
  "cert2.jpg",
  "3.jpg",
  "4.jpg",
  "t.gif",
  "5.png"
];

// container 가져오기
const container = document.getElementById("gallery-container");

// 이미지 목록을 반복해서 갤러리에 추가
images.forEach(image => {
  const img = document.createElement("img");
  img.src = `images/gallery/${image}`;
  img.alt = image;
  img.className = "gallery-img";
  container.appendChild(img);

  img.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.className = "image-overlay";

    const enlargedImg = document.createElement("img");
    enlargedImg.src = img.src;
    enlargedImg.alt = img.alt;

    overlay.appendChild(enlargedImg);
    document.body.appendChild(overlay);

    // 클릭 시 닫기
    overlay.addEventListener("click", () => {
      overlay.remove();
    });

    // ESC 키로 닫기
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", handleEsc);
      }
    };
    document.addEventListener("keydown", handleEsc);
  });
});


