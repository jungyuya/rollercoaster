// 갤러리 이미지 파일 목록 배열
const images = [
  "cert1.jpg",
  "cert2.jpg",
  "3.jpg"
];

// container 가져오기
const container = document.getElementById("gallery-container");

// 이미지 목록을 반복해서 갤러리에 추가
images.forEach(image => {
  const img = document.createElement("img");
  img.src = `images/gallery/${image}`;
  img.alt = image;
  img.className = "gallery-img"; // 스타일 클래스 지정
  container.appendChild(img);
});
