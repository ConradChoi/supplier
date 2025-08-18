# Seepn Suppliers Management

공급사 전용 관리 시스템의 로그인 페이지입니다.

## 기능

- **PC 화면**: Left 영역(이미지/배너)과 Right 영역(로그인 폼)으로 구성
- **모바일 화면**: 로그인 폼만 표시되는 반응형 디자인
- **로그인 기능**: 공급사 아이디/비밀번호 입력
- **추가 기능**: 아이디 저장, 아이디/비밀번호 찾기, 회원가입 링크

## 기술 스택

- Next.js 14 (App Router)
- React 18
- TypeScript
- CSS3 (반응형 디자인)

## 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 `http://localhost:3000` 접속

## 빌드

프로덕션 빌드:
```bash
npm run build
```

프로덕션 서버 실행:
```bash
npm start
```

## 프로젝트 구조

```
suppliers_supplier/
├── app/
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx          # 메인 페이지
│   └── globals.css       # 전역 스타일
├── components/
│   ├── LoginPage.tsx     # 로그인 페이지 컴포넌트
│   └── LoginPage.css     # 로그인 페이지 스타일
├── next.config.js        # Next.js 설정
├── tsconfig.json         # TypeScript 설정
└── package.json
```

## 반응형 디자인

- **PC (768px 이상)**: Left/Right 영역 모두 표시
- **모바일 (768px 이하)**: 로그인 폼만 표시
- **작은 모바일 (480px 이하)**: 최적화된 모바일 레이아웃

## Next.js 특징

- **App Router**: 최신 Next.js 14 App Router 사용
- **Server Components**: 기본적으로 서버 컴포넌트 사용
- **Client Components**: 인터랙티브 기능을 위해 'use client' 지시어 사용
- **TypeScript**: 완전한 타입 안전성 제공
- **최적화**: 자동 코드 분할 및 최적화
