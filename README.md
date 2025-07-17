이준규's 포트폴리오 웹 페이지 프로젝트 <Br>
프로젝트 명 : RollerCoaster (가제) <br>
http://jungyu.store/

## 프로젝트 개요

RollerCoaster는 정적 웹사이트 기반의 개인 포트폴리오 프로젝트입니다.<br>
AWS 클라우드 환경에서 최적의 비용과 합리적인 인프라 구성을 목적으로 진행하였습니다.<br>
목적에 맞게 Serverless를 적극적으로 활용하여 확장성과 유지보수성을 고려해 설계되었습니다.

---

## 주요 기능

* 정적 웹사이트 (소개 / 프로젝트 / 기술 스택 / 연락처)
* 챗라스틱 상담 챗봇 (Gemini API + Lambda + API Gateway + IaC 배포)
* 이미지 갤러리 (Lambda+API Gateway+S3 저장 기반)
* 이메일 문의 기능 (Lambda + API Gateway + SES)
* 관리자 업로드 기능 (Lambda + S3)
* CI/CD 배포 자동화 (GitHub Actions + Serverless Framework)

---

## 기술 스택

### 프론트엔드

* HTML / CSS / JavaScript
* 반응형 디자인, 다크모드, SimpleLightbox
* Github Action을 통한 CI/CD 구현

### 백엔드 (서버리스)

* AWS Lambda (Node.js)
* API Gateway
* Email contact
* DynamoDB (상담 기록 저장)
* S3 (정적 호스팅 및 이미지 저장)
* Google Gemini API (대화 처리)
* Serverless Framework (.yml 기반 배포 자동화)

---

## 프로젝트 구조
```
<프론트엔드>
📁 RollerCoaster
├── 📁 .github
├── 📁 .vscode
├── 📁 chatlastic
│   ├── 📄 index.html
│   ├── 📄 rastic.png
│   ├── 📄 script.js
│   └── 📄 style.css
├── 📁 favicons
├── 📁 images
├── 📄 common.js
├── 📄 gallery.html
├── 📄 gallery.js
├── 📄 index.html
├── 📄 script.js
├── 📄 style.css

<백엔드>
📁 contactlambda (이메일 전송기능)
├── 📄 index.js
├── 📄 package.json
├── ...
📁 gallery-uploader(갤러리 업로드)
├── 📄 app.js
├── 📄 package.json
├── ...
📁 chatlastcBE (챗라스틱)
├── 📄 index.js
├── 📄 package.json
├── ...
```
---

## API 명세

### 상담 챗봇 엔드포인트

* **POST /chat**

#### Request Body

```json
{
  "userId": "user123",
  "myDateTime": "1990-07-01T08:00",
  "userMessages": ["오늘은 기분이 다운되는 군요"],
  "assistantMessages": []
}
```

#### Response Body

```json
{
  "assistant": "홍길동님, 오늘 기분이 다운되신다고 하니 챗라스틱도 마음이 무겁네요. 마음이 답답하고 힘드실 텐데, 혼자 앓지 마시고 저에게 편하게 털어놓으세요. 무슨 일이 있었는지, 어떤 점이 힘든지 이야기해 주시면 제가 홍길동님의 이야기를 경청하고 함께 해결책을 찾아보도록 할게요."
}
```

---

## .env 예시

```
GEMINI_API_KEY=my_google_gen_api_key
```

---
```
## 아키텍처 구성도

📱 사용자 브라우저
│
▼
🟦 CloudFront (jungyu.store 도메인)
│
▼
🟦 S3 (정적 웹 호스팅)
└── index.html / gallery.html / chat.html
│
└──── JS 요청 (Fetch/Axios)
│
├────────────→ \[📧 이메일 API]
│                └─ API Gateway → Lambda → SES
│
├────────────→ \[🖼 이미지 업로드 API]
│                └─ API Gateway → Lambda → S3 업로드
│
└────────────→ \[💬 챗라스틱 상담 API]
└─ API Gateway → Lambda
├─ Google Gemini API
└─ DynamoDB (대화 저장)

🛠 개발 자동화
├─ Serverless Framework (IaC)
└─ GitHub Actions (CI/CD)
```
---

## 배포 및 운영

* 챗라스틱의 AWS 백엔드 리소스는 Serverless Framework를 사용하여 IaC 기반으로 관리
* 웹페이지의 프론트엔드를 GitHub Actions를 통한 CI/CD 구성
* 정적 웹사이트는 S3 + CloudFront + Route 53 기반으로 배포
* 모든 API는 API Gateway를 통해 Lambda로 연결됨

---

## 향후 개발 계획

* 갤러리 이미지 모달 + 댓글/좋아요 기능 추가
* 관리자 인증 기반 업로드 인터페이스 구축
* 챗봇 UI/UX 추가 개선
* CloudWatch 기반 로깅 및 운영 모니터링 도입
* 인프라 고도화 및 전체 아키텍처 IaC 구성

---

## 개발자 정보

* 이름: 이준규 (Lee Jungyu)
* 포트폴리오 주소: [https://jungyu.store](https://jungyu.store)
* AWS Region: ap-northeast-2 (서울)

---
