# 메아리

말하지 못했던 조직의 마음을 다음 날 단 한 명의 동료에게 전하는 모바일 우선 익명 커뮤니케이션 MVP입니다.

## VS Code에서 실행하기

### 1. 준비 사항

- [Node.js 20 LTS](https://nodejs.org/) 이상
- npm 10 이상
- VS Code

저장소 루트(`dahoon`)를 VS Code로 여세요. 상위 폴더가 아니라 `package.json`이
보이는 이 폴더를 열어야 합니다.

```bash
code /workspace/dahoon
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 실행

다음 세 방법 중 하나를 사용할 수 있습니다.

1. VS Code에서 **Terminal → Run Task… → 메아리: 개발 서버 실행**을 선택합니다.
2. `Ctrl/Cmd + Shift + B`로 기본 개발 서버 작업을 실행합니다.
3. 통합 터미널에서 직접 실행합니다.

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. VS Code의 **Run and Debug**에서
`메아리: Chrome에서 디버깅`을 선택하면 개발 서버 실행과 브라우저 디버깅을
한 번에 시작할 수 있습니다. 중지하려면 터미널에서 `Ctrl + C`를 누릅니다.

### 4. 검사 및 프로덕션 빌드

```bash
npm run lint
npm run build
```

포트 3000이 이미 사용 중이라면 `npm run dev -- -p 3001`로 실행하고
`http://localhost:3001`을 여세요.

## 화면과 흐름

- 온보딩 → 홈 → 세 질문 통합 작성/실시간 미리보기 → 배달 대기
- 받은 메아리 → 단 한 번의 답장 → 상호 선택 → 연결 또는 익명 종료
- 양쪽이 모두 좋아요를 선택한 연결만 프로필 공개 및 DM 접근 허용
- 마이페이지에서 활동 통계와 익명성·알림 설정 확인
- 홈 하단의 보라색 개발자 패널에서 모든 샘플 상태 확인

상태는 `draft → scheduled → delivered → replied → waiting_for_match → matched | closed` 순서로 이동합니다. 각 행동은 현재 상태를 검사하며, 연결되지 않은 사용자의 DM 접근은 차단됩니다.

## 데이터와 API 경계

Zustand persist 미들웨어가 `localStorage`의 `maeari-state` 키에 데이터를 저장합니다. 문장 다듬기와 안전 점검은 `lib/safety-check.ts`의 지연 기반 mock 함수로 분리되어 있습니다. 향후 Spring Boot 연동 시 이 함수 및 store action 내부 구현을 REST 클라이언트로 교체하고 화면 컴포넌트는 유지할 수 있습니다.

## 알려진 제한

- 인증, 무작위 배달, 알림, 신고 처리는 브라우저 mock입니다.
- AI 문장 다듬기는 키워드 치환 기반이며 실제 생성형 AI를 호출하지 않습니다.
- 단일 브라우저 사용자 기준이므로 상대 선택은 개발자 패널의 시나리오로 재현합니다.
