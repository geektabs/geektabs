import React, { useState } from 'react';
import { Download, Check, Smartphone, Share, PlusSquare, X, WifiOff } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'card';
  isDarkMode?: boolean;
  language?: string;
}

const LABELS: Record<string, {
  installApp: string;
  installOnIOS: string;
  installedBadge: string;
  useAddressBar: string;
  iosModalTitle: string;
  iosStep1: string;
  iosStep2: string;
  iosStep3: string;
  close: string;
  offline: string;
}> = {
  English: {
    installApp: 'Install App',
    installOnIOS: 'Add to Home Screen',
    installedBadge: 'Installed as App',
    useAddressBar: 'Click the Install icon in your browser address bar',
    iosModalTitle: 'Install GeekTabs on iPhone / iPad',
    iosStep1: 'Tap the Share button in the Safari toolbar.',
    iosStep2: 'Scroll down and tap "Add to Home Screen".',
    iosStep3: 'Tap "Add" to place the GeekTabs logo on your screen.',
    close: 'Got it',
    offline: 'Offline Mode — Cached data active',
  },
  Chinese: {
    installApp: '下载应用',
    installOnIOS: '添加到主屏幕',
    installedBadge: '已作为应用安装',
    useAddressBar: '点击浏览器地址栏右侧的“安装”图标即可安装',
    iosModalTitle: '在 iPhone / iPad 上安装 GeekTabs',
    iosStep1: '点击 Safari 工具栏中的“分享”图标。',
    iosStep2: '向下滑动并选择“添加到主屏幕”。',
    iosStep3: '点击“添加”，将 GeekTabs 图标保存到桌面。',
    close: '知道了',
    offline: '离线模式 — 正在使用缓存数据',
  },
  'Chinese Traditional': {
    installApp: '下載應用程式',
    installOnIOS: '加入主畫面',
    installedBadge: '已安裝為應用程式',
    useAddressBar: '點擊瀏覽器網址列右側的「安裝」圖示即可安裝',
    iosModalTitle: '在 iPhone / iPad 上安裝 GeekTabs',
    iosStep1: '點擊 Safari 工具列中的「分享」圖示。',
    iosStep2: '向下滑動並選擇「加入主畫面」。',
    iosStep3: '點擊「新增」，將 GeekTabs 圖示儲存到桌面。',
    close: '知道了',
    offline: '離線模式 — 正在使用快取資料',
  },
  Korean: {
    installApp: '앱 설치',
    installOnIOS: '홈 화면에 추가',
    installedBadge: '앱으로 설치됨',
    useAddressBar: '브라우저 주소창 오른쪽의 설치 아이콘을 클릭하세요',
    iosModalTitle: 'iPhone / iPad에 GeekTabs 설치',
    iosStep1: 'Safari 도구 모음에서 공유 버튼을 탭합니다.',
    iosStep2: '아래로 스크롤하여 "홈 화면에 추가"를 탭합니다.',
    iosStep3: '"추가"를 탭하여 홈 화면에 GeekTabs 로고를 추가합니다.',
    close: '확인',
    offline: '오프라인 모드 — 캐시된 데이터 사용 중',
  },
  Spanish: {
    installApp: 'Instalar App',
    installOnIOS: 'Añadir a inicio',
    installedBadge: 'Instalada como App',
    useAddressBar: 'Haz clic en el icono Instalar de la barra de direcciones',
    iosModalTitle: 'Instalar GeekTabs en iPhone / iPad',
    iosStep1: 'Toca el botón Compartir en la barra de Safari.',
    iosStep2: 'Desliza y toca "Añadir a pantalla de inicio".',
    iosStep3: 'Toca "Añadir" para guardar el icono de GeekTabs.',
    close: 'Entendido',
    offline: 'Modo sin conexión — Datos en caché activos',
  },
  French: {
    installApp: 'Installer l’app',
    installOnIOS: 'Ajouter à l’écran d’accueil',
    installedBadge: 'Installée comme App',
    useAddressBar: 'Cliquez sur l’icône Installer dans la barre d’adresse',
    iosModalTitle: 'Installer GeekTabs sur iPhone / iPad',
    iosStep1: 'Appuyez sur le bouton Partager dans Safari.',
    iosStep2: 'Faites défiler et appuyez sur « Sur l’écran d’accueil ».',
    iosStep3: 'Appuyez sur « Ajouter » pour afficher l’icône GeekTabs.',
    close: 'Compris',
    offline: 'Mode hors ligne — Données en cache actives',
  },
  German: {
    installApp: 'App installieren',
    installOnIOS: 'Zum Home-Bildschirm',
    installedBadge: 'Als App installiert',
    useAddressBar: 'Klicken Sie auf das Installieren-Symbol in der Adressleiste',
    iosModalTitle: 'GeekTabs auf iPhone / iPad installieren',
    iosStep1: 'Tippen Sie in Safari auf das Teilen-Symbol.',
    iosStep2: 'Scrollen Sie nach unten und wählen Sie „Zum Home-Bildschirm“.',
    iosStep3: 'Tippen Sie auf „Hinzufügen“, um das GeekTabs-Logo zu sichern.',
    close: 'Verstanden',
    offline: 'Offline-Modus — Zwischengespeicherte Daten aktiv',
  },
  Japanese: {
    installApp: 'アプリをインストール',
    installOnIOS: 'ホーム画面に追加',
    installedBadge: 'アプリとしてインストール済み',
    useAddressBar: 'アドレスバー右側のインストールアイコンをクリックしてください',
    iosModalTitle: 'iPhone / iPad に GeekTabs を追加',
    iosStep1: 'Safari ツールバーの「共有」ボタンをタップします。',
    iosStep2: '下にスクロールして「ホーム画面に追加」をタップします。',
    iosStep3: '「追加」をタップしてホーム画面にロゴを追加します。',
    close: '閉じる',
    offline: 'オフラインモード — キャッシュを使用中',
  },
  Italian: {
    installApp: 'Installa App',
    installOnIOS: 'Aggiungi a Home',
    installedBadge: 'Installata come App',
    useAddressBar: 'Fai clic sull’icona Installa nella barra degli indirizzi',
    iosModalTitle: 'Installa GeekTabs su iPhone / iPad',
    iosStep1: 'Tocca il pulsante Condividi nella barra di Safari.',
    iosStep2: 'Scorri e tocca «Aggiungi alla schermata Home».',
    iosStep3: 'Tocca «Aggiungi» per salvare l’icona GeekTabs.',
    close: 'Ho capito',
    offline: 'Modalità offline — Dati in cache attivi',
  },
  Russian: {
    installApp: 'Установить приложение',
    installOnIOS: 'На экран «Домой»',
    installedBadge: 'Установлено как приложение',
    useAddressBar: 'Нажмите значок установки в адресной строке браузера',
    iosModalTitle: 'Установить GeekTabs на iPhone / iPad',
    iosStep1: 'Нажмите кнопку «Поделиться» на панели Safari.',
    iosStep2: 'Прокрутите вниз и выберите «На экран «Домой»».',
    iosStep3: 'Нажмите «Добавить», чтобы сохранить логотип GeekTabs.',
    close: 'Понятно',
    offline: 'Офлайн-режим — используются кэшированные данные',
  },
  Luxembourgish: {
    installApp: 'App installéieren',
    installOnIOS: 'Op den Home-Bildschierm',
    installedBadge: 'Als App installéiert',
    useAddressBar: 'Klickt op d’Installéieren-Ikon an der Adressläischt',
    iosModalTitle: 'GeekTabs op iPhone / iPad installéieren',
    iosStep1: 'Tippt op de Deelen-Knäppchen a Safari.',
    iosStep2: 'Scrollt erof a wielt „Op den Home-Bildschierm“.',
    iosStep3: 'Tippt op „Derbäisetzen“ fir de GeekTabs-Logo ze späicheren.',
    close: 'Verstanen',
    offline: 'Offline-Modus — Zwëschespäichert Donnéeën aktiv',
  },
  Dutch: {
    installApp: 'App installeren',
    installOnIOS: 'Zet op beginscherm',
    installedBadge: 'Geïnstalleerd als app',
    useAddressBar: 'Klik op het installatiepictogram in de adresbalk van je browser',
    iosModalTitle: 'GeekTabs installeren op iPhone / iPad',
    iosStep1: 'Tik op de Deel-knop in de Safari-werkbalk.',
    iosStep2: 'Scrol omlaag en tik op "Zet op beginscherm".',
    iosStep3: 'Tik op "Voeg toe" om het GeekTabs-logo op je scherm te plaatsen.',
    close: 'Begrepen',
    offline: 'Offline-modus — Gegevens in cache actief',
  },
  Swedish: {
    installApp: 'Installera app',
    installOnIOS: 'Lägg till på hemskärmen',
    installedBadge: 'Installerad som app',
    useAddressBar: 'Klicka på installationsikonen i webbläsarens adressfält',
    iosModalTitle: 'Installera GeekTabs på iPhone / iPad',
    iosStep1: 'Tryck på Dela-knappen i Safaris verktygsfält.',
    iosStep2: 'Bläddra ner och tryck på "Lägg till på hemskärmen".',
    iosStep3: 'Tryck på "Lägg till" för att placera GeekTabs-logotypen på skärmen.',
    close: 'Uppfattat',
    offline: 'Offlineläge — Cachad data aktiv',
  },
  Finnish: {
    installApp: 'Asenna sovellus',
    installOnIOS: 'Lisää Koti-valikkoon',
    installedBadge: 'Asennettu sovelluksena',
    useAddressBar: 'Napsauta selaimen osoitepalkin asennuskuvaketta',
    iosModalTitle: 'Asenna GeekTabs iPhonelle / iPadille',
    iosStep1: 'Napauta Jaa-painiketta Safarin työkalupalkissa.',
    iosStep2: 'Vieritä alas ja napauta "Lisää Koti-valikkoon".',
    iosStep3: 'Napauta "Lisää" asettaaksesi GeekTabs-logon näytölle.',
    close: 'Selvä',
    offline: 'Offline-tila — Välimuistissa olevat tiedot käytössä',
  },
  Hindi: {
    installApp: 'ऐप इंस्टॉल करें',
    installOnIOS: 'होम स्क्रीन पर जोड़ें',
    installedBadge: 'ऐप के रूप में इंस्टॉल किया गया',
    useAddressBar: 'अपने ब्राउज़र के एड्रेस बार में इंस्टॉल आइकन पर क्लिक करें',
    iosModalTitle: 'iPhone / iPad पर GeekTabs इंस्टॉल करें',
    iosStep1: 'Safari टूलबार में शेयर बटन पर टैप करें।',
    iosStep2: 'नीचे स्क्रॉल करें और "Add to Home Screen" पर टैप करें।',
    iosStep3: 'अपनी स्क्रीन पर GeekTabs लोगो रखने के लिए "Add" पर टैप करें।',
    close: 'समझ गया',
    offline: 'ऑफ़लाइन मोड — कैश्ड डेटा सक्रिय',
  },
  Norwegian: {
    installApp: 'Installer app',
    installOnIOS: 'Legg til på Hjem-skjerm',
    installedBadge: 'Installert som app',
    useAddressBar: 'Klikk på installeringsikonet i nettleserens adressefelt',
    iosModalTitle: 'Installer GeekTabs på iPhone / iPad',
    iosStep1: 'Trykk på Del-knappen i Safari-verktøylinjen.',
    iosStep2: 'Bla nedover og trykk på «Legg til på Hjem-skjerm».',
    iosStep3: 'Trykk på «Legg til» for å plassere GeekTabs-logoen på skjermen.',
    close: 'Forstått',
    offline: 'Frakoblet modus — Bufrede data aktive',
  },
  Thai: {
    installApp: 'ติดตั้งแอป',
    installOnIOS: 'เพิ่มไปยังหน้าจอโฮม',
    installedBadge: 'ติดตั้งเป็นแอปแล้ว',
    useAddressBar: 'คลิกไอคอนติดตั้งในแถบที่อยู่ของเบราว์เซอร์',
    iosModalTitle: 'ติดตั้ง GeekTabs บน iPhone / iPad',
    iosStep1: 'แตะปุ่มแชร์ในแถบเครื่องมือ Safari',
    iosStep2: 'เลื่อนลงแล้วแตะ "เพิ่มไปยังหน้าจอโฮม"',
    iosStep3: 'แตะ "เพิ่ม" เพื่อวางโลโก้ GeekTabs บนหน้าจอของคุณ',
    close: 'เข้าใจแล้ว',
    offline: 'โหมดออฟไลน์ — กำลังใช้ข้อมูลแคช',
  },
  Portuguese: {
    installApp: 'Instalar Aplicação',
    installOnIOS: 'Adicionar ao Ecrã Principal',
    installedBadge: 'Instalada como Aplicação',
    useAddressBar: 'Clique no ícone de instalação na barra de endereço do navegador',
    iosModalTitle: 'Instalar GeekTabs no iPhone / iPad',
    iosStep1: 'Toque no botão Partilhar na barra de ferramentas do Safari.',
    iosStep2: 'Deslize para baixo e toque em "Ecrã principal".',
    iosStep3: 'Toque em "Adicionar" para guardar o logótipo GeekTabs no seu ecrã.',
    close: 'Entendido',
    offline: 'Modo offline — Dados em cache ativos',
  },
  Vietnamese: {
    installApp: 'Cài đặt ứng dụng',
    installOnIOS: 'Thêm vào màn hình chính',
    installedBadge: 'Đã cài đặt ứng dụng',
    useAddressBar: 'Nhấp vào biểu tượng Cài đặt trên thanh địa chỉ trình duyệt',
    iosModalTitle: 'Cài đặt GeekTabs trên iPhone / iPad',
    iosStep1: 'Nhấn nút Chia sẻ trên thanh công cụ Safari.',
    iosStep2: 'Cuộn xuống và nhấn "Thêm vào MH chính".',
    iosStep3: 'Nhấn "Thêm" để lưu biểu tượng GeekTabs lên màn hình.',
    close: 'Đã hiểu',
    offline: 'Chế độ ngoại tuyến — Đang dùng dữ liệu đệm',
  },
  Polish: {
    installApp: 'Zainstaluj aplikację',
    installOnIOS: 'Dodaj do ekranu początkowego',
    installedBadge: 'Zainstalowano jako aplikację',
    useAddressBar: 'Kliknij ikonę instalacji na pasku adresu przeglądarki',
    iosModalTitle: 'Zainstaluj GeekTabs na iPhone / iPad',
    iosStep1: 'Stuknij przycisk Udostępnij na pasku narzędzi Safari.',
    iosStep2: 'Przewiń w dół i stuknij „Do ekranu początkowego”.',
    iosStep3: 'Stuknij „Dodaj”, aby umieścić ikonę GeekTabs na ekranie.',
    close: 'Rozumiem',
    offline: 'Tryb offline — Aktywne dane z pamięci podręcznej',
  },
  Danish: {
    installApp: 'Installer app',
    installOnIOS: 'Føj til hjemmeskærm',
    installedBadge: 'Installeret som app',
    useAddressBar: 'Klik på installeringsikonet i browserens adresselinje',
    iosModalTitle: 'Installer GeekTabs på iPhone / iPad',
    iosStep1: 'Tryk på knappen Del i Safari-værktøjslinjen.',
    iosStep2: 'Rul ned, og tryk på "Føj til hjemmeskærm".',
    iosStep3: 'Tryk på "Tilføj" for at gemme GeekTabs-logoet på din skærm.',
    close: 'Forstået',
    offline: 'Offline-tilstand — Cachede data aktive',
  },
  Turkish: {
    installApp: 'Uygulamayı Yükle',
    installOnIOS: 'Ana Ekrana Ekle',
    installedBadge: 'Uygulama Olarak Yüklendi',
    useAddressBar: 'Tarayıcı adres çubuğundaki Yükle simgesine tıklayın',
    iosModalTitle: 'GeekTabs’i iPhone / iPad’e Yükle',
    iosStep1: 'Safari araç çubuğundaki Paylaş düğmesine dokunun.',
    iosStep2: 'Aşağı kaydırıp "Ana Ekrana Ekle"ye dokunun.',
    iosStep3: 'GeekTabs logosunu ekranınıza eklemek için "Ekle"ye dokunun.',
    close: 'Anladım',
    offline: 'Çevrimdışı Mod — Önbellekteki veriler aktif',
  },
  Greek: {
    installApp: 'Εγκατάσταση εφαρμογής',
    installOnIOS: 'Προσθήκη στην Αφετηρία',
    installedBadge: 'Εγκαταστάθηκε ως εφαρμογή',
    useAddressBar: 'Κάντε κλικ στο εικονίδιο εγκατάστασης στη γραμμή διευθύνσεων',
    iosModalTitle: 'Εγκατάσταση του GeekTabs σε iPhone / iPad',
    iosStep1: 'Πατήστε το κουμπί Κοινοποίησης στη γραμμή εργαλείων του Safari.',
    iosStep2: 'Κάντε κύλιση προς τα κάτω και πατήστε «Προσθήκη στην οθόνη Αφετηρίας».',
    iosStep3: 'Πατήστε «Προσθήκη» για να τοποθετήσετε το λογότυπο GeekTabs στην οθόνη σας.',
    close: 'Εντάξει',
    offline: 'Λειτουργία εκτός σύνδεσης — Ενεργά δεδομένα cache',
  },
};

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'compact',
  isDarkMode = false,
  language = 'English',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const copy = LABELS[language] || LABELS.English;

  if (variant === 'compact') {
    if (isInstalled || (!isInstallable && !isIOS)) {
      return null;
    }

    return (
      <>
        <button
          type="button"
          onClick={isInstallable ? install : () => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] lg:min-h-0 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
            isDarkMode
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
          }`}
          style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
          title={isInstallable ? copy.installApp : copy.installOnIOS}
        >
          {isInstallable ? <Download size={13} className="shrink-0" /> : <Smartphone size={13} className="shrink-0" />}
          <span className="hidden sm:inline whitespace-nowrap">
            {isInstallable ? copy.installApp : copy.installOnIOS}
          </span>
        </button>

        {showIOSGuide && (
          <IOSInstallModal copy={copy} onClose={() => setShowIOSGuide(false)} />
        )}
      </>
    );
  }

  // Card variant (for Settings -> Browser page)
  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 text-xs font-black uppercase tracking-wider shrink-0">
        <Check size={15} className="stroke-[2.5]" />
        <span>{copy.installedBadge}</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-indigo-500/20 cursor-pointer active:scale-95"
        style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
      >
        <Download size={15} className="stroke-[2.5]" />
        <span>{copy.installApp}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-indigo-500/20 cursor-pointer active:scale-95"
          style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
        >
          <Smartphone size={15} className="stroke-[2.2]" />
          <span>{copy.installOnIOS}</span>
        </button>

        {showIOSGuide && (
          <IOSInstallModal copy={copy} onClose={() => setShowIOSGuide(false)} />
        )}
      </>
    );
  }

  // Desktop browsers without deferred beforeinstallprompt (e.g. Safari/Firefox or before Chromium fires)
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-[#6143f7] text-xs font-bold shrink-0">
      <Download size={14} className="shrink-0" />
      <span>{copy.useAddressBar}</span>
    </div>
  );
};

function IOSInstallModal({
  copy,
  onClose,
}: {
  copy: (typeof LABELS)['English'];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src="/apple-touch-icon.png"
              alt="GeekTabs Logo"
              className="w-11 h-11 rounded-2xl shadow-sm shrink-0"
            />
            <h3 className="text-base font-black text-slate-900 leading-snug">
              {copy.iosModalTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <ol className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <span className="flex items-center gap-1.5 flex-wrap">
              <Share size={14} className="text-indigo-600 inline shrink-0" />
              {copy.iosStep1}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <span className="flex items-center gap-1.5 flex-wrap">
              <PlusSquare size={14} className="text-indigo-600 inline shrink-0" />
              {copy.iosStep2}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <span>{copy.iosStep3}</span>
          </li>
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer"
          style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
        >
          {copy.close}
        </button>
      </div>
    </div>
  );
}

export const OfflineIndicator: React.FC<{ language?: string }> = ({ language = 'English' }) => {
  const isOnline = useOnlineStatus();
  const copy = LABELS[language] || LABELS.English;

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100] flex items-center gap-2 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-semibold text-white shadow-lg">
      <WifiOff size={14} className="shrink-0" />
      <span>{copy.offline}</span>
    </div>
  );
};
