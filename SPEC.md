프롬프트

당신은 시니어 Flutter 개발자이자 UX 디자이너입니다.

아래 요구사항을 모두 만족하는 Android/iOS용 Flutter 앱을 완성형으로 구현하세요.

프로젝트 이름:

Pixel Puzzle Quest

앱 개요

노노그램(Nonogram, Picross) 퍼즐 게임 앱입니다.

광고 없음.
인앱결제 없음.
회원가입 없음.
로그인 없음.
인터넷 연결 없이 동작.

사용자는

테마 선택
난이도 선택
퍼즐 플레이
퍼즐 완료
컬렉션 등록

순서로 게임을 진행합니다.

디자인 컨셉

스타일:

미니멀
깔끔함
밝은 색상
Material 3

주 색상:

Primary: #4F46E5
Secondary: #8B5CF6
Background: #F8FAFC

애니메이션:

부드러운 화면 전환
퍼즐 완료 시 축하 애니메이션
앱 구조
홈 화면

제목:

Pixel Puzzle Quest

메뉴:

플레이 시작
컬렉션
설정
테마 선택 화면

테마 목록:

동물
음식
여행

카드 UI 사용

각 카드에

아이콘
완료율

표시

예:

동물
12 / 30 완료

난이도 선택

선택 가능한 난이도:

Easy

5x5

Normal

10x10

Hard

15x15

각 난이도 카드에

퍼즐 수
완료율

표시

퍼즐 목록 화면

그리드 형태

예:

[1] [2] [3]
[4] [5] [6]

상태 표시:

잠금 없음
완료 표시
진행 중 표시
노노그램 게임 규칙

기본 Picross 규칙 적용

행과 열 힌트 표시

사용자는

칸 채우기
X 표시

가능

실수 허용

언제든 수정 가능

게임 화면

상단

뒤로가기
퍼즐 이름
진행률

중앙

노노그램 보드

하단

버튼

채우기 모드
X 모드
초기화
힌트
힌트 시스템

사용 시

정답 칸 1개 공개

퍼즐당 최대 3회

퍼즐 완료

완료 조건:

모든 정답 칸 정확히 채움

완료 시

모달 표시

제목:

퍼즐 완료!

내용:

축하합니다.
새로운 컬렉션이 등록되었습니다.

버튼:

다음 퍼즐
목록으로
컬렉션 시스템

퍼즐을 완료하면

컬렉션 등록

컬렉션 화면:

테마별 분류

예:

동물

고양이
강아지
토끼

완료 여부 표시

완료된 퍼즐은

픽셀 이미지 공개

미완료는

실루엣 표시

데이터 저장

shared_preferences 사용

저장 항목:

완료 퍼즐
진행 중 퍼즐
컬렉션
힌트 사용 횟수

앱 재실행 시 복구

초기 퍼즐 데이터

JSON 기반

assets/puzzles/

구조:

animal_easy.json
animal_normal.json
animal_hard.json

food_easy.json
food_normal.json
food_hard.json

travel_easy.json
travel_normal.json
travel_hard.json

퍼즐 수

초기 데이터 생성

동물

Easy 10개
Normal 10개
Hard 10개

음식

Easy 10개
Normal 10개
Hard 10개

여행

Easy 10개
Normal 10개
Hard 10개

총 90개 퍼즐 생성

각 퍼즐은 실제 플레이 가능한 정답 데이터 포함

코드 구조

MVVM 패턴 사용

폴더 구조

lib/

core/
models/
services/
viewmodels/
views/
widgets/
data/

사용 패키지

provider
shared_preferences

필요 시

flutter_animate

사용 가능

품질 요구사항
null safety 적용
Flutter 최신 안정 버전 기준
반응형 UI
Android/iOS 동시 지원
모든 코드 작성
모든 화면 작성
더미 코드 금지
TODO 금지
컴파일 가능한 완성 코드 제공
추가 기능
진행률 표시
테마별 완료율 표시
퍼즐 자동 저장
다크모드 지원
퍼즐 완료 진동 효과
컬렉션 도감 시스템
최종 결과

아래 내용을 모두 생성:

pubspec.yaml
전체 디렉토리 구조
모든 Dart 파일
JSON 퍼즐 데이터
앱 실행 방법
빌드 방법

코드는 즉시 실행 가능한 수준으로 작성하고 누락 없이 제공하세요.



#수정사항
난이도에서 normal만번호 선택하고 들어갔을 때 이름 옆에 (normal)이라고 안 떠 easy나 hard는 뜨는데, 이거 안 뜨는 거 수정해줘
그리고 번호 선택 칸에 어떤 퍼즐인지 이름 써줘
컬렉션에서 난이도별로 칸 나눠줘
그리고 hard난이도에서 오른족 퍼즐이 클릭이 안 돼 버그 수정해줘
힌트 얻는 걸 광고보기랑 인앱결제 방식으로 힌트를 더 얻을 수 있게 만들어줘
로그인 기능 만들어서 구글 계정 또는 아이디랑 비번으로 회원가입 하거나 게스트 계정으로 로그인 할 수 있게 만들어줘(앱을 지웠다 깔아도 로그인 하면 원래 플레이 하던게 남을 수 있게)
google play store에 출시할건데 로그인 기능을 만들면 서버 또는 세션이 남는지 알려줘