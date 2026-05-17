export type Locale = "ko" | "en" | "ja";

export interface Translations {
  nav: { feed: string; explore: string; write: string; mypage: string; login: string; logout: string };
  header: { search: string };
  login: {
    description: string; startWithKakao: string; terms: string;
    email: string; password: string; username: string;
    loginBtn: string; signupBtn: string;
    switchToSignup: string; switchToLogin: string;
    orDivider: string;
    emailRequired: string; passwordRequired: string; usernameRequired: string;
    passwordMinLength: string; usernameMinLength: string;
    loginFailed: string; signupFailed: string; signupSuccess: string;
  };
  feed: { recentArticles: string; noArticles: string; todayEditors: string; noEditors: string };
  article: {
    backToFeed: string; sold: string; markAsSold: string; markAsSoldConfirm: string;
    contactSection: string; instagramDm: string; kakaoChat: string;
    seller: string; condition: string; delivery: string; location: string;
    follow: string; following: string; followFailed: string; unfollowFailed: string;
    followers: string; articles: string;
  };
  write: {
    saveDraft: string; publish: string; processing: string; draftSaved: string;
    titlePlaceholder: string; contentPlaceholder: string;
    tagPlaceholder: string; addTag: string; uploadPrompt: string; cover: string;
    saleSettings: string; sellItem: string; price: string; priceUnit: string; priceHint: string;
    itemCondition: string; tradeMethod: string; contactInfo: string;
    instagramPlaceholder: string; kakaoPlaceholder: string;
    conditionS: string; conditionA: string; conditionB: string; conditionC: string;
    deliveryParcel: string; deliveryDirect: string; deliveryNegotiable: string;
    titleRequired: string; contentRequired: string; uploading: string;
    saveFailed: string; publishFailed: string; saveError: string; publishError: string;
    uploadFailed: string;
  };
  mypage: {
    publishedTab: string; draftsTab: string; followingTab: string; editProfile: string;
    edit: string; delete: string; publishBtn: string;
    deleteConfirm: string; noPublished: string; noDrafts: string; noFollowing: string;
    displayName: string; bio: string; instagramId: string; kakaoUrl: string;
    cancel: string; save: string; saving: string;
    saveFailed: string; deleteFailed: string; publishFailed: string;
    deleteError: string; publishError: string; saveError: string;
    loading: string;
  };
  explore: { title: string; searchPlaceholder: string; results: string; noArticles: string };
  users: { articles: string; noArticles: string; notFound: string };
  common: { loading: string; noArticles: string };
  notFound: { heading: string; title: string; description: string; backToHome: string };
  error: { title: string; description: string; retry: string; home: string };
}

export const ko: Translations = {
  nav: { feed: "피드", explore: "탐색", write: "글쓰기", mypage: "마이페이지", login: "로그인", logout: "로그아웃" },
  header: { search: "물건 이야기 검색" },
  login: {
    description: "물건과의 이야기를 기록하고 나눠보세요.", startWithKakao: "카카오로 시작하기", terms: "로그인 시 서비스 이용약관에 동의하게 됩니다.",
    email: "이메일", password: "비밀번호", username: "사용자명",
    loginBtn: "로그인", signupBtn: "회원가입",
    switchToSignup: "계정이 없으신가요? 회원가입", switchToLogin: "이미 계정이 있으신가요? 로그인",
    orDivider: "또는",
    emailRequired: "이메일을 입력해주세요.", passwordRequired: "비밀번호를 입력해주세요.", usernameRequired: "사용자명을 입력해주세요.",
    passwordMinLength: "비밀번호는 8자 이상이어야 합니다.", usernameMinLength: "사용자명은 2자 이상이어야 합니다.",
    loginFailed: "이메일 또는 비밀번호가 올바르지 않습니다.", signupFailed: "회원가입에 실패했습니다.", signupSuccess: "회원가입 완료! 로그인해주세요.",
  },
  feed: { recentArticles: "최근 아티클", noArticles: "아직 아티클이 없습니다.", todayEditors: "오늘의 에디터", noEditors: "에디터가 없어요." },
  article: {
    backToFeed: "← 피드로 돌아가기", sold: "판매완료", markAsSold: "판매 완료로 변경",
    markAsSoldConfirm: "판매 완료로 변경하시겠습니까?", contactSection: "거래 문의하기",
    instagramDm: "📷 인스타그램 DM", kakaoChat: "💬 카카오 오픈채팅",
    seller: "판매자", condition: "상태", delivery: "거래", location: "지역",
    follow: "팔로우", following: "팔로잉",
    followFailed: "팔로우에 실패했습니다.", unfollowFailed: "언팔로우에 실패했습니다.",
    followers: "팔로워", articles: "아티클",
  },
  write: {
    saveDraft: "임시저장", publish: "발행하기", processing: "처리 중...", draftSaved: "임시저장 완료!",
    titlePlaceholder: "이 물건과의 이야기를 제목으로...",
    contentPlaceholder: "어떤 물건인가요? 어디서 만났나요? 어떻게 함께했나요?\n\n이야기를 자유롭게 써주세요. 최소 200자를 권장해요.",
    tagPlaceholder: "+ 태그", addTag: "태그 추가",
    uploadPrompt: "클릭 또는 이미지를 드래그해서 올려주세요", cover: "커버",
    saleSettings: "판매 설정", sellItem: "이 물건 판매하기",
    price: "판매 가격", priceUnit: "원", priceHint: "가격 입력",
    itemCondition: "물건 상태", tradeMethod: "거래 방식", contactInfo: "거래 연락처",
    instagramPlaceholder: "인스타그램 ID (예: @thingz_official)",
    kakaoPlaceholder: "카카오 오픈채팅 링크",
    conditionS: "S급", conditionA: "A급", conditionB: "B급", conditionC: "C급",
    deliveryParcel: "택배", deliveryDirect: "직거래", deliveryNegotiable: "협의",
    titleRequired: "제목을 입력해주세요.", contentRequired: "본문을 입력해주세요.",
    uploading: "이미지 업로드 중입니다. 잠시 후 다시 시도해주세요.",
    saveFailed: "저장 실패", publishFailed: "발행 실패",
    saveError: "저장 중 오류가 발생했습니다.", publishError: "발행 중 오류가 발생했습니다.",
    uploadFailed: "개 이미지 업로드에 실패했습니다.",
  },
  mypage: {
    publishedTab: "발행된 글", draftsTab: "임시저장", followingTab: "팔로잉", editProfile: "프로필 수정",
    edit: "수정", delete: "삭제", publishBtn: "발행",
    deleteConfirm: "정말 삭제하시겠어요?", noPublished: "아직 발행한 아티클이 없어요.", noDrafts: "임시저장된 아티클이 없어요.", noFollowing: "팔로잉하는 에디터가 없어요.",
    displayName: "표시 이름", bio: "소개글", instagramId: "인스타그램 ID", kakaoUrl: "카카오 오픈채팅 링크",
    cancel: "취소", save: "저장", saving: "저장 중...",
    saveFailed: "저장 실패", deleteFailed: "삭제 실패", publishFailed: "발행 실패",
    deleteError: "삭제 중 오류가 발생했습니다.", publishError: "발행 중 오류가 발생했습니다.", saveError: "저장 중 오류가 발생했습니다.",
    loading: "불러오는 중...",
  },
  explore: { title: "탐색", searchPlaceholder: "태그로 검색 (예: 필름카메라)", results: "#{tag} 검색 결과 {count}개", noArticles: "아티클이 없어요." },
  users: { articles: "아티클", noArticles: "아직 발행한 아티클이 없어요.", notFound: "유저를 찾을 수 없습니다." },
  common: { loading: "불러오는 중...", noArticles: "아티클이 없어요." },
  notFound: { heading: "404", title: "페이지를 찾을 수 없어요", description: "요청하신 페이지가 존재하지 않거나 이동되었습니다.", backToHome: "홈으로 돌아가기" },
  error: { title: "오류가 발생했습니다", description: "잠시 후 다시 시도해주세요.", retry: "다시 시도", home: "홈으로" },
};

export const en: Translations = {
  nav: { feed: "Feed", explore: "Explore", write: "Register", mypage: "My Page", login: "Login", logout: "Logout" },
  header: { search: "Search item stories" },
  login: {
    description: "Record and share your stories with things.", startWithKakao: "Continue with Kakao", terms: "By signing in, you agree to our Terms of Service.",
    email: "Email", password: "Password", username: "Username",
    loginBtn: "Login", signupBtn: "Sign Up",
    switchToSignup: "Don't have an account? Sign up", switchToLogin: "Already have an account? Login",
    orDivider: "or",
    emailRequired: "Please enter your email.", passwordRequired: "Please enter your password.", usernameRequired: "Please enter a username.",
    passwordMinLength: "Password must be at least 8 characters.", usernameMinLength: "Username must be at least 2 characters.",
    loginFailed: "Invalid email or password.", signupFailed: "Sign up failed.", signupSuccess: "Sign up complete! Please log in.",
  },
  feed: { recentArticles: "Recent Articles", noArticles: "No articles yet.", todayEditors: "Today's Editors", noEditors: "No editors yet." },
  article: {
    backToFeed: "← Back to Feed", sold: "SOLD", markAsSold: "Mark as Sold",
    markAsSoldConfirm: "Mark this item as sold?", contactSection: "Contact Seller",
    instagramDm: "📷 Instagram DM", kakaoChat: "💬 Kakao Open Chat",
    seller: "Seller", condition: "Condition", delivery: "Trade", location: "Location",
    follow: "Follow", following: "Following",
    followFailed: "Failed to follow.", unfollowFailed: "Failed to unfollow.",
    followers: "Followers", articles: "Articles",
  },
  write: {
    saveDraft: "Save Draft", publish: "Publish", processing: "Processing...", draftSaved: "Saved as draft!",
    titlePlaceholder: "Title of your item story...",
    contentPlaceholder: "What's this item? Where did you find it? How did it become yours?\n\nWrite freely. At least 200 characters recommended.",
    tagPlaceholder: "+ Tag", addTag: "Add Tag",
    uploadPrompt: "Click or drag to upload images", cover: "Cover",
    saleSettings: "Sale Settings", sellItem: "Sell this item",
    price: "Price", priceUnit: "₩", priceHint: "Enter price",
    itemCondition: "Item Condition", tradeMethod: "Trade Method", contactInfo: "Contact Info",
    instagramPlaceholder: "Instagram ID (e.g. @thingz_official)",
    kakaoPlaceholder: "Kakao Open Chat link",
    conditionS: "S Grade", conditionA: "A Grade", conditionB: "B Grade", conditionC: "C Grade",
    deliveryParcel: "Delivery", deliveryDirect: "In Person", deliveryNegotiable: "Negotiable",
    titleRequired: "Please enter a title.", contentRequired: "Please enter content.",
    uploading: "Images are uploading. Please try again shortly.",
    saveFailed: "Save failed", publishFailed: "Publish failed",
    saveError: "An error occurred while saving.", publishError: "An error occurred while publishing.",
    uploadFailed: " image(s) failed to upload.",
  },
  mypage: {
    publishedTab: "Published", draftsTab: "Drafts", followingTab: "Following", editProfile: "Edit Profile",
    edit: "Edit", delete: "Delete", publishBtn: "Publish",
    deleteConfirm: "Are you sure you want to delete?", noPublished: "No published articles yet.", noDrafts: "No drafts saved.", noFollowing: "You're not following anyone yet.",
    displayName: "Display Name", bio: "Bio", instagramId: "Instagram ID", kakaoUrl: "Kakao Open Chat Link",
    cancel: "Cancel", save: "Save", saving: "Saving...",
    saveFailed: "Save failed", deleteFailed: "Delete failed", publishFailed: "Publish failed",
    deleteError: "An error occurred while deleting.", publishError: "An error occurred while publishing.", saveError: "An error occurred while saving.",
    loading: "Loading...",
  },
  explore: { title: "Explore", searchPlaceholder: "Search by tag (e.g. film camera)", results: "#{tag}: {count} results", noArticles: "No articles found." },
  users: { articles: "Articles", noArticles: "No published articles yet.", notFound: "User not found." },
  common: { loading: "Loading...", noArticles: "No articles found." },
  notFound: { heading: "404", title: "Page Not Found", description: "The page you requested doesn't exist or has been moved.", backToHome: "Back to Home" },
  error: { title: "Something went wrong", description: "Please try again later.", retry: "Try Again", home: "Home" },
};

export const ja: Translations = {
  nav: { feed: "フィード", explore: "探索", write: "登録する", mypage: "マイページ", login: "ログイン", logout: "ログアウト" },
  header: { search: "物語を検索" },
  login: {
    description: "物との物語を記録してシェアしましょう。", startWithKakao: "カカオで始める", terms: "ログインすることで利用規約に同意したことになります。",
    email: "メール", password: "パスワード", username: "ユーザー名",
    loginBtn: "ログイン", signupBtn: "会員登録",
    switchToSignup: "アカウントがありませんか？会員登録", switchToLogin: "すでにアカウントがありますか？ログイン",
    orDivider: "または",
    emailRequired: "メールを入力してください。", passwordRequired: "パスワードを入力してください。", usernameRequired: "ユーザー名を入力してください。",
    passwordMinLength: "パスワードは8文字以上必要です。", usernameMinLength: "ユーザー名は2文字以上必要です。",
    loginFailed: "メールまたはパスワードが正しくありません。", signupFailed: "会員登録に失敗しました。", signupSuccess: "会員登録完了！ログインしてください。",
  },
  feed: { recentArticles: "最近の記事", noArticles: "まだ記事がありません。", todayEditors: "今日のエディター", noEditors: "エディターがいません。" },
  article: {
    backToFeed: "← フィードに戻る", sold: "売り切れ", markAsSold: "売り切れにする",
    markAsSoldConfirm: "売り切れにしますか？", contactSection: "取引について問い合わせる",
    instagramDm: "📷 インスタグラム DM", kakaoChat: "💬 カカオオープンチャット",
    seller: "販売者", condition: "状態", delivery: "取引", location: "地域",
    follow: "フォロー", following: "フォロー中",
    followFailed: "フォローに失敗しました。", unfollowFailed: "フォロー解除に失敗しました。",
    followers: "フォロワー", articles: "記事",
  },
  write: {
    saveDraft: "下書き保存", publish: "公開する", processing: "処理中...", draftSaved: "下書きを保存しました！",
    titlePlaceholder: "この物との物語をタイトルに...",
    contentPlaceholder: "どんな物ですか？どこで出会いましたか？どのように過ごしてきましたか？\n\n自由に書いてください。200文字以上を推奨します。",
    tagPlaceholder: "+ タグ", addTag: "タグを追加",
    uploadPrompt: "クリックまたはドラッグして画像をアップロード", cover: "カバー",
    saleSettings: "販売設定", sellItem: "この商品を販売する",
    price: "販売価格", priceUnit: "₩", priceHint: "価格を入力",
    itemCondition: "商品の状態", tradeMethod: "取引方法", contactInfo: "連絡先",
    instagramPlaceholder: "インスタグラム ID（例：@thingz_official）",
    kakaoPlaceholder: "カカオオープンチャットのリンク",
    conditionS: "S級", conditionA: "A級", conditionB: "B級", conditionC: "C級",
    deliveryParcel: "宅配", deliveryDirect: "手渡し", deliveryNegotiable: "相談",
    titleRequired: "タイトルを入力してください。", contentRequired: "本文を入力してください。",
    uploading: "画像をアップロード中です。後でもう一度お試しください。",
    saveFailed: "保存に失敗しました", publishFailed: "公開に失敗しました",
    saveError: "保存中にエラーが発生しました。", publishError: "公開中にエラーが発生しました。",
    uploadFailed: "枚の画像のアップロードに失敗しました。",
  },
  mypage: {
    publishedTab: "公開済み", draftsTab: "下書き", followingTab: "フォロー中", editProfile: "プロフィール編集",
    edit: "編集", delete: "削除", publishBtn: "公開",
    deleteConfirm: "本当に削除しますか？", noPublished: "まだ公開した記事がありません。", noDrafts: "下書きが保存されていません。", noFollowing: "フォローしているエディターはいません。",
    displayName: "表示名", bio: "自己紹介", instagramId: "インスタグラム ID", kakaoUrl: "カカオオープンチャットのリンク",
    cancel: "キャンセル", save: "保存", saving: "保存中...",
    saveFailed: "保存に失敗しました", deleteFailed: "削除に失敗しました", publishFailed: "公開に失敗しました",
    deleteError: "削除中にエラーが発生しました。", publishError: "公開中にエラーが発生しました。", saveError: "保存中にエラーが発生しました。",
    loading: "読み込み中...",
  },
  explore: { title: "探索", searchPlaceholder: "タグで検索（例：フィルムカメラ）", results: "#{tag}：{count}件", noArticles: "記事がありません。" },
  users: { articles: "記事", noArticles: "まだ公開した記事がありません。", notFound: "ユーザーが見つかりません。" },
  common: { loading: "読み込み中...", noArticles: "記事がありません。" },
  notFound: { heading: "404", title: "ページが見つかりません", description: "お探しのページは存在しないか、移動されました。", backToHome: "ホームに戻る" },
  error: { title: "エラーが発生しました", description: "しばらくしてから再試行してください。", retry: "再試行", home: "ホーム" },
};

const dict: Record<Locale, Translations> = { ko, en, ja };

export function getT(locale: string): Translations {
  return dict[(locale as Locale)] ?? ko;
}

// 백엔드 키("S","A","B","C") → 번역 레이블 매핑
export function conditionLabel(key: string, t: Translations): string {
  const m: Record<string, string> = { S: t.write.conditionS, A: t.write.conditionA, B: t.write.conditionB, C: t.write.conditionC };
  return m[key] ?? key;
}

// 백엔드 키("택배","직거래","협의") → 번역 레이블 매핑
export function deliveryLabel(key: string, t: Translations): string {
  const m: Record<string, string> = { "택배": t.write.deliveryParcel, "직거래": t.write.deliveryDirect, "협의": t.write.deliveryNegotiable };
  return m[key] ?? key;
}
