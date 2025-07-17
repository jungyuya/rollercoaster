---
이준규's 포트폴리오 웹 페이지 프로젝트 
프로젝트 명 : RollerCoaster (가제)

## 프로젝트 개요

Chatlastic은 정적 웹사이트 기반의 개인 포트폴리오 프로젝트입니다.  
AWS 클라우드 환경에서 최적의 비용과 합리적인 인프라 구성을 목적으로 진행하였습니다.
목적에 맞게 Serverless를 적극적으로 활용하여 확장성과 유지보수성을 고려해 설계되었습니다.

---

## 주요 기능

- 정적 웹사이트 (소개 / 프로젝트 / 기술 스택 / 연락처)
- 챗라스틱 상담 챗봇 (Gemini API + Lambda + API Gateway + IaC 배포)
- 이미지 갤러리 (Lambda+API Gateway+S3 저장 기반)
- 이메일 문의 기능 (Lambda + API Gateway + SES)
- 관리자 업로드 기능 (Lambda + S3)
- CI/CD 배포 자동화 (GitHub Actions + Serverless Framework)

---

## 기술 스택

### 프론트엔드

- HTML / CSS / JavaScript
- 반응형 디자인, 다크모드, SimpleLightbox

### 백엔드 (서버리스)

- AWS Lambda (Node.js)
- API Gateway
- Email contact
- DynamoDB (상담 기록 저장)
- S3 (정적 호스팅 및 이미지 저장)
- Google Gemini API (대화 처리)
- Serverless Framework (.yml 기반 배포 자동화)

---

## 프로젝트 구조

```
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


````

---

## API 명세

### 상담 챗봇 엔드포인트

- **POST /chat**

#### Request Body

```json
{
  "userId": "user123",
  "myDateTime": "1990-07-01T08:00",
  "userMessages": ["요즘 너무 우울해요..."],
  "assistantMessages": []
}
````

#### Response Body

```json
{
  "assistant": "당신의 이야기를 들어줘서 고마워요. 힘든 시간을 함께 이겨낼 수 있어요."
}
```

---

## .env 예시

```
GEMINI_API_KEY=your_google_gen_api_key
```

---

## 아키텍처 구성도

```
사용자 브라우저
    |
    |-- CloudFront → S3 (정적 웹페이지)
    |
    |-- API Gateway → Lambda (chat) → Gemini API
                        └──────→ DynamoDB
    |
    |-- API Gateway → Lambda (upload) → S3 (이미지 저장)
```

---

## 배포 및 운영

* AWS 리소스는 Serverless Framework를 사용하여 IaC 기반으로 관리
* GitHub Actions를 통한 CI/CD 구성 예정
* 정적 웹사이트는 S3 + CloudFront + Route 53 기반으로 배포
* 모든 API는 API Gateway를 통해 Lambda로 연결됨

---

## 향후 개발 계획

* 갤러리 이미지 모달 + 댓글/좋아요 기능 추가
* 관리자 인증 기반 업로드 인터페이스 구축
* 챗봇 UI/UX 개선
* CloudWatch 기반 로깅 및 운영 모니터링 도입
* CI/CD 자동화 완성 (브랜치 기반 배포 환경 포함)

---

## 개발자 정보

* 이름: 이준규 (Lee Jungyu)
* 포트폴리오 주소: [https://jungyu.store](https://jungyu.store)
* AWS Region: ap-northeast-2 (서울)

```

---

위 내용을 `chatlastic/README.md` 파일로 저장하면 GitHub에서도 자동 인식되는 문서 포맷입니다.  
필요 시 PDF나 .md 다운로드 파일로도 제공 가능하니 원하시면 알려주세요.
```
