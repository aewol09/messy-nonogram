export type LanguageType = 'ko' | 'en' | 'ja';

export interface Translations {
  // Navigation & Common
  back: string;
  confirm: string;
  cancel: string;
  close: string;
  delete: string;
  completed: string;
  inProgress: string;
  puzzleNum: string;

  // Home
  play: string;
  collection: string;
  settings: string;
  login: string;
  guestUser: string;

  // ThemeSelect
  selectTheme: string;
  themeAnimal: string;
  themeFood: string;
  themeTravel: string;

  // DifficultySelect
  selectDifficulty: string;
  diffEasy: string;
  diffNormal: string;
  diffHard: string;

  // Game
  fillMode: string;
  xMode: string;
  hint: string;
  reset: string;
  revealAnswer: string;
  resetConfirmTitle: string;
  resetConfirmDesc: string;

  // PuzzleWinModal
  winTitle: string;
  winSubtitle: string;
  nextPuzzle: string;
  viewCollection: string;
  goToList: string;

  // Settings
  settingsTitle: string;
  accountAndCloud: string;
  language: string;
  langKo: string;
  langEn: string;
  langJa: string;
  gameSettings: string;
  vibration: string;
  darkMode: string;
  dataMgmt: string;
  resetAllProgress: string;
  resetAllConfirmTitle: string;
  resetAllConfirmDesc: string;
  info: string;
  version: string;
  privacyPolicy: string;

  // HintStoreModal
  hintStoreTitle: string;
  currentHints: string;
  unlimited: string;
  watchAd: string;
  watchAdSub: string;
  free: string;
  iapSection: string;
  pack10: string;
  unlimitedPass: string;
  unlimitedPassSub: string;
  using: string;
}

const translations: Record<LanguageType, Translations> = {
  ko: {
    back: '뒤로',
    confirm: '확인',
    cancel: '취소',
    close: '닫기',
    delete: '삭제',
    completed: '완료',
    inProgress: '진행 중',
    puzzleNum: '번 퍼즐',

    play: '플레이 시작',
    collection: '컬렉션',
    settings: '설정',
    login: '로그인',
    guestUser: '게스트 유저',

    selectTheme: '테마 선택',
    themeAnimal: '동물',
    themeFood: '음식',
    themeTravel: '여행',

    selectDifficulty: '난이도 선택',
    diffEasy: 'Easy (10x10)',
    diffNormal: 'Normal (15x15)',
    diffHard: 'Hard (20x20)',

    fillMode: '채우기',
    xMode: 'X 표시',
    hint: '힌트',
    reset: '초기화',
    revealAnswer: '👑 정답 공개',
    resetConfirmTitle: '퍼즐 초기화',
    resetConfirmDesc: '정말 퍼즐을 초기화하고 다시 시작하시겠습니까?',

    winTitle: '퍼즐 완성!',
    winSubtitle: '축하합니다! 그림을 완성했습니다.',
    nextPuzzle: '다음 퍼즐 도전',
    viewCollection: '컬렉션 보기',
    goToList: '목록으로',

    settingsTitle: '설정',
    accountAndCloud: '계정 & 클라우드 데이터',
    language: '언어 (Language)',
    langKo: '한국어',
    langEn: 'English',
    langJa: '日本語',
    gameSettings: '게임 설정',
    vibration: '진동 피드백',
    darkMode: '다크 모드',
    dataMgmt: '데이터 관리',
    resetAllProgress: '진행 상황 초기화',
    resetAllConfirmTitle: '진행 상황 초기화',
    resetAllConfirmDesc: '모든 퍼즐 기록과 컬렉션이 삭제됩니다. 정말 초기화하시겠습니까?',
    info: '정보',
    version: '버전',
    privacyPolicy: '개인정보 처리방침',

    hintStoreTitle: '힌트 충전소',
    currentHints: '현재 보유 힌트',
    unlimited: '무제한 (∞)',
    watchAd: '광고 보고 힌트 충전',
    watchAdSub: '짧은 동영상 시청 후 +3개 획득',
    free: '무료 🎁',
    iapSection: '인앱 결제 (IAP)',
    pack10: '힌트 10개 팩',
    unlimitedPass: '힌트 무제한 패스',
    unlimitedPassSub: '평생 모든 퍼즐 힌트 무제한',
    using: '사용 중',
  },
  en: {
    back: 'Back',
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    delete: 'Delete',
    completed: 'Completed',
    inProgress: 'In Progress',
    puzzleNum: 'Puzzle #',

    play: 'Start Game',
    collection: 'Collection',
    settings: 'Settings',
    login: 'Login',
    guestUser: 'Guest User',

    selectTheme: 'Select Theme',
    themeAnimal: 'Animals',
    themeFood: 'Food',
    themeTravel: 'Travel',

    selectDifficulty: 'Select Difficulty',
    diffEasy: 'Easy (10x10)',
    diffNormal: 'Normal (15x15)',
    diffHard: 'Hard (20x20)',

    fillMode: 'Fill',
    xMode: 'Mark X',
    hint: 'Hint',
    reset: 'Reset',
    revealAnswer: '👑 Reveal Answer',
    resetConfirmTitle: 'Reset Puzzle',
    resetConfirmDesc: 'Are you sure you want to reset this puzzle?',

    winTitle: 'Puzzle Complete!',
    winSubtitle: 'Congratulations! You solved the picture.',
    nextPuzzle: 'Next Puzzle',
    viewCollection: 'View Collection',
    goToList: 'Back to List',

    settingsTitle: 'Settings',
    accountAndCloud: 'Account & Cloud Data',
    language: 'Language',
    langKo: '한국어',
    langEn: 'English',
    langJa: '日本語',
    gameSettings: 'Game Settings',
    vibration: 'Vibration Feedback',
    darkMode: 'Dark Mode',
    dataMgmt: 'Data Management',
    resetAllProgress: 'Reset All Progress',
    resetAllConfirmTitle: 'Reset All Data',
    resetAllConfirmDesc: 'All puzzle progress and collection will be deleted. Are you sure?',
    info: 'Information',
    version: 'Version',
    privacyPolicy: 'Privacy Policy',

    hintStoreTitle: 'Hint Shop',
    currentHints: 'Current Hints',
    unlimited: 'Unlimited (∞)',
    watchAd: 'Watch Ad for Hints',
    watchAdSub: 'Watch short video for +3 hints',
    free: 'Free 🎁',
    iapSection: 'In-App Purchases (IAP)',
    pack10: '10 Hints Pack',
    unlimitedPass: 'Unlimited Hints Pass',
    unlimitedPassSub: 'Unlimited hints for all puzzles forever',
    using: 'Active',
  },
  ja: {
    back: '戻る',
    confirm: '確認',
    cancel: 'キャンセル',
    close: '閉じる',
    delete: '削除',
    completed: '完了',
    inProgress: '進行中',
    puzzleNum: '番パズル',

    play: 'プレイ開始',
    collection: 'コレクション',
    settings: '設定',
    login: 'ログイン',
    guestUser: 'ゲストユーザー',

    selectTheme: 'テーマ選択',
    themeAnimal: '動物',
    themeFood: '料理',
    themeTravel: '旅行',

    selectDifficulty: '難易度選択',
    diffEasy: 'かんたん (10x10)',
    diffNormal: 'ふつう (15x15)',
    diffHard: 'むずかしい (20x20)',

    fillMode: '塗る',
    xMode: '×印',
    hint: 'ヒント',
    reset: 'リセット',
    revealAnswer: '👑 正解公開',
    resetConfirmTitle: 'パズルリセット',
    resetConfirmDesc: '本当にパズルをリセットしてやり直しますか？',

    winTitle: 'パズル完成！',
    winSubtitle: 'おめでとうございます！絵を完成させました。',
    nextPuzzle: '次のパズルへ',
    viewCollection: 'コレクションを見る',
    goToList: '一覧へ',

    settingsTitle: '設定',
    accountAndCloud: 'アカウント＆クラウドデータ',
    language: '言語 (Language)',
    langKo: '한국어',
    langEn: 'English',
    langJa: '日本語',
    gameSettings: 'ゲーム設定',
    vibration: 'バイブレーション',
    darkMode: 'ダークモード',
    dataMgmt: 'データ管理',
    resetAllProgress: '全進行状況リセット',
    resetAllConfirmTitle: '全データリセット',
    resetAllConfirmDesc: 'すべてのパズル記録とコレクションが削除されます。本当に実行しますか？',
    info: '情報',
    version: 'バージョン',
    privacyPolicy: 'プライバシーポリシー',

    hintStoreTitle: 'ヒントショップ',
    currentHints: '現在のヒント数',
    unlimited: '無制限 (∞)',
    watchAd: 'CMを見てヒント獲得',
    watchAdSub: '短い動画を見て+3個獲得',
    free: '無料 🎁',
    iapSection: 'アプリ内課金 (IAP)',
    pack10: 'ヒント10個パック',
    unlimitedPass: 'ヒント無制限パス',
    unlimitedPassSub: '全パズルでヒント永久無制限',
    using: '使用中',
  },
};

// Localized Puzzle Names Dictionary
const puzzleNameTranslations: Record<string, { en: string; ja: string }> = {
  // Animals 10x10
  '고양이': { en: 'Cat', ja: 'ネコ' },
  '강아지': { en: 'Dog', ja: 'イヌ' },
  '토끼': { en: 'Rabbit', ja: 'ウサギ' },
  '곰': { en: 'Bear', ja: 'クマ' },
  '물고기': { en: 'Fish', ja: 'サカナ' },
  '부엉이': { en: 'Owl', ja: 'フクロウ' },
  '펭귄': { en: 'Penguin', ja: 'ペンギン' },
  '개구리': { en: 'Frog', ja: 'カエル' },
  '코끼리': { en: 'Elephant', ja: 'ゾウ' },
  '오리': { en: 'Duck', ja: 'アヒル' },

  // Animals 15x15
  '호랑이': { en: 'Tiger', ja: 'トラ' },
  '독수리': { en: 'Eagle', ja: 'ワシ' },
  '고래': { en: 'Whale', ja: 'クジラ' },
  '기린': { en: 'Giraffe', ja: 'キリン' },
  '공룡': { en: 'Dinosaur', ja: '恐竜' },
  '늑대': { en: 'Wolf', ja: 'オオカミ' },
  '공작': { en: 'Peacock', ja: 'クジャク' },
  '사슴': { en: 'Deer', ja: 'シカ' },
  '펭귄가족': { en: 'Penguin Family', ja: 'ペンギン家族' },
  '카멜레온': { en: 'Chameleon', ja: 'カメレオン' },

  // Animals 20x20
  '사자왕': { en: 'Lion King', ja: 'ライオンキング' },
  '홍학': { en: 'Flamingo', ja: 'フラミンゴ' },
  '바다거북': { en: 'Sea Turtle', ja: 'ウミガメ' },
  '다람쥐': { en: 'Squirrel', ja: 'リス' },
  '판다곰': { en: 'Panda', ja: 'パンダ' },
  '백조': { en: 'Swan', ja: 'ハクチョウ' },
  '돌고래': { en: 'Dolphin', ja: 'イルカ' },
  '여우': { en: 'Fox', ja: 'キツネ' },
  '부엉이숲': { en: 'Owl Forest', ja: 'フクロウの森' },
  '해파리': { en: 'Jellyfish', ja: 'クラゲ' },

  // Food 10x10
  '사과': { en: 'Apple', ja: 'リンゴ' },
  '버거': { en: 'Burger', ja: 'ハンバーガー' },
  '피자': { en: 'Pizza', ja: 'ピザ' },
  '도넛': { en: 'Donut', ja: 'ドーナツ' },
  '조각케이크': { en: 'Cake Slice', ja: 'ショートケーキ' },
  '커피잔': { en: 'Coffee Cup', ja: 'コーヒーカップ' },
  '아이스크림콘': { en: 'Ice Cream', ja: 'アイスクリーム' },
  '초밥': { en: 'Sushi', ja: '寿司' },
  '핫도그': { en: 'Hot Dog', ja: 'ホットドッグ' },
  '파르페': { en: 'Parfait', ja: 'パフェ' },

  // Food 15x15
  '디저트세트': { en: 'Dessert Set', ja: 'デザートセット' },
  '햄버거세트': { en: 'Burger Combo', ja: 'ハンバーガーセット' },
  '피자한판': { en: 'Whole Pizza', ja: 'ホールピザ' },
  '카페라떼': { en: 'Cafe Latte', ja: 'カフェラテ' },
  '생일케이크': { en: 'Birthday Cake', ja: 'バースデーケーキ' },
  '와인과잔': { en: 'Wine & Glass', ja: 'ワインとグラス' },
  '벤또도시락': { en: 'Bento Box', ja: '弁当' },
  '감자튀김음료': { en: 'Fries & Soda', ja: 'ポテト＆ドリンク' },
  '과일멜론': { en: 'Melon', ja: 'メロン' },
  '팬케이크타워': { en: 'Pancake Tower', ja: 'パンケーキタワー' },

  // Food 20x20
  '럭셔리스테이크': { en: 'Luxury Steak', ja: '高級ステーキ' },
  '라멘한그릇': { en: 'Ramen Bowl', ja: 'ラーメン' },
  '브런치플래터': { en: 'Brunch Platter', ja: 'ブランチプレート' },
  '아시안딤섬': { en: 'Dim Sum', ja: '点心' },
  '딸기타르트': { en: 'Strawberry Tart', ja: '苺タルト' },
  '바베큐꼬치': { en: 'BBQ Skewer', ja: 'BBQ串' },
  '카키고리빙수': { en: 'Shaved Ice', ja: 'かき氷' },
  '랍스터요리': { en: 'Lobster', ja: 'ロブスター' },
  '칵테일글라스': { en: 'Cocktail', ja: 'カクテル' },
  '치즈퐁듀': { en: 'Cheese Fondue', ja: 'チーズフォンデュ' },

  // Travel 10x10
  '비행기': { en: 'Airplane', ja: '飛行機' },
  '캐리어': { en: 'Suitcase', ja: 'スーツケース' },
  '카메라': { en: 'Camera', ja: 'カメラ' },
  '캠핑텐트': { en: 'Camping Tent', ja: 'キャンプテント' },
  '돛단배': { en: 'Sailboat', ja: 'ヨット' },
  '에펠탑': { en: 'Eiffel Tower', ja: 'エッフェル塔' },
  '열기구': { en: 'Hot Air Balloon', ja: '気球' },
  '야자수': { en: 'Palm Tree', ja: 'ヤシの木' },
  '나침반': { en: 'Compass', ja: '方位磁石' },
  '등대': { en: 'Lighthouse', ja: '灯台' },

  // Travel 15x15
  '여권과티켓': { en: 'Passport & Ticket', ja: 'パスポートとチケット' },
  '캠핑트레일러': { en: 'Camper Van', ja: 'キャンピングカー' },
  '자유의여신상': { en: 'Statue of Liberty', ja: '自由の女神' },
  '피사의사탑': { en: 'Leaning Tower', ja: 'ピサの斜塔' },
  '크루즈여행선': { en: 'Cruise Ship', ja: '豪華客船' },
  '열기구축제': { en: 'Balloon Festival', ja: 'バルーンフェスティバル' },
  '휴양지파라솔': { en: 'Beach Umbrella', ja: 'ビーチパラソル' },
  '고성': { en: 'Ancient Castle', ja: '古城' },
  '야자수해변': { en: 'Tropical Sunset', ja: 'トロピカルビーチ' },
  '증기기관차': { en: 'Steam Train', ja: 'SL蒸気機関車' },

  // Travel 20x20
  '타지마할': { en: 'Taj Mahal', ja: 'タージ・マハル' },
  '후지산벚꽃': { en: 'Mt. Fuji & Sakura', ja: '富士山と桜' },
  '빅벤시계탑': { en: 'Big Ben', ja: 'ビッグ・ベン' },
  '콜로세움': { en: 'Colosseum', ja: 'コロッセオ' },
  '스위스풍차': { en: 'Swiss Windmill', ja: 'スイスの風車' },
  '복고풍스쿠터': { en: 'Vintage Scooter', ja: 'レトロスクーター' },
  '스쿠버다이빙': { en: 'Scuba Diving', ja: 'スキューバダイビング' },
  '베니스곤돌라': { en: 'Venice Gondola', ja: 'ヴェネツィアのゴンドラ' },
  '열대섬항해': { en: 'Yacht Sailing', ja: '南の島セーリング' },
  '우주선': { en: 'Space Shuttle', ja: 'スペースシャトル' }
};

export const getTranslation = (lang: LanguageType = 'ko'): Translations => {
  return translations[lang] || translations.ko;
};

export const getLocalizedPuzzleName = (name: string, lang: LanguageType = 'ko'): string => {
  if (lang === 'ko') return name;
  const entry = puzzleNameTranslations[name];
  if (!entry) return name;
  return entry[lang] || name;
};
