import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { PWAInstallButton } from '../PWAInstallButton';

export interface DownloadAppTabProps {
  language?: string;
}

const appInstallGuides: Record<string, {
  pageTitle: string;
  pageSubtitle: string;
  addressBarHint: string;
  pc: { label: string; heading: string; steps: string[] };
  phone: { label: string; heading: string; steps: string[] };
  tablet: { label: string; heading: string; steps: string[] };
}> = {
  English: {
    pageTitle: 'Download as App (PC / Phone / Tablet)',
    pageSubtitle: 'Install GeekTabs as a standalone app with its own desktop or home screen logo — just like installing Google AI Studio.',
    addressBarHint: 'Desktop Tip: Look for the Install icon (screen with downward arrow) at the right edge of your browser address bar.',
    pc: {
      label: 'PC / Mac (Desktop)',
      heading: 'Download on PC / Mac (Chrome, Edge, Brave)',
      steps: [
        'Open GeekTabs in Chrome, Edge, or Brave on your computer.',
        'Look at the right side of the browser address bar for the "Install GeekTabs Dashboard" download icon (similar to the "Install Google AI Studio" icon).',
        'Click the Install icon (or click the "Install App" button above, or open browser menu ⋮ → Cast, save, and share → Install page as app).',
        'Click "Install" in the confirmation popup — GeekTabs will open in its own app window and place the GeekTabs logo on your Desktop, Start Menu, Taskbar, or Mac Dock.'
      ]
    },
    phone: {
      label: 'Phone (iOS & Android)',
      heading: 'Add App Logo on Phone',
      steps: [
        'iPhone (Safari): Tap the Share icon (square with upward arrow) at the bottom/top toolbar → scroll down and tap "Add to Home Screen" → tap "Add".',
        'Android (Chrome / Edge): Tap the "Install App" button above, or tap the browser menu (⋮) → "Install app" / "Add to Home screen" → tap "Install".',
        'Launch GeekTabs directly from its logo icon on your phone home screen in full-screen app mode.'
      ]
    },
    tablet: {
      label: 'Tablet (iPad & Android)',
      heading: 'Add App Logo on Tablet',
      steps: [
        'iPad (iPadOS Safari): Tap the Share icon in the top-right address bar → select "Add to Home Screen" → tap "Add" to place the GeekTabs logo on your iPad screen.',
        'Android Tablet (Chrome / Edge): Tap the Install icon in the address bar (or open ⋮ → "Install app" / tap "Install App" above) → confirm "Install".',
        'Open GeekTabs directly from your tablet home screen or dock with a clean standalone app window.'
      ]
    }
  },
  Chinese: {
    pageTitle: '下载为独立应用（电脑 / 手机 / 平板）',
    pageSubtitle: '将 GeekTabs 安装为独立桌面或主屏幕应用图标 — 就像安装 Google AI Studio 一样便捷。',
    addressBarHint: '电脑端提示：在 Chrome / Edge 浏览器地址栏最右侧会出现“安装 GeekTabs Dashboard”下载图标。',
    pc: {
      label: '电脑 PC / Mac',
      heading: '在电脑端下载为桌面应用（Chrome / Edge / Brave）',
      steps: [
        '使用 Chrome、Edge 或 Brave 浏览器打开 GeekTabs 首页。',
        '查看浏览器地址栏最右侧弹出的“安装 GeekTabs Dashboard”下载小图标（类似安装 Google AI Studio 的图标）。',
        '点击该地址栏安装图标（或直接点击上方的“下载应用”按钮，也可在右上角 ⋮ 菜单 → 投放、保存和分享 / 应用 → 将此网站作为应用安装）。',
        '在弹窗中点击“安装”，GeekTabs 将作为独立应用窗口打开，并在桌面、任务栏或 Mac 程序坞生成应用 Logo 图标。'
      ]
    },
    phone: {
      label: '手机（iPhone / 安卓）',
      heading: '在手机主屏幕添加应用图标',
      steps: [
        'iPhone（Safari 浏览器）：点击工具栏的“分享”按钮（带向上箭头的方框）→ 向下滑动点击“添加到主屏幕” → 点击右上角“添加”。',
        '安卓手机（Chrome / Edge）：点击上方“下载应用”按钮，或点击浏览器右上角菜单 (⋮) → “安装应用 / 添加到主屏幕” → 点击“安装”。',
        '安装完成后，即可在手机桌面直接点击 GeekTabs Logo 图标以全屏 App 方式打开。'
      ]
    },
    tablet: {
      label: '平板（iPad / 安卓平板）',
      heading: '在平板电脑主屏幕添加应用图标',
      steps: [
        'iPad（iPadOS Safari）：点击浏览器右上角的“分享”图标 → 选择“添加到主屏幕” → 点击“添加”，即可在主屏幕生成应用 Logo。',
        '安卓平板（Chrome / Edge）：点击地址栏中的安装图标或 ⋮ 菜单 → “安装应用”（或点击上方“下载应用”按钮）→ 确认安装。',
        '之后即可从平板主屏幕或程序坞一键启动独立应用样式的 GeekTabs。'
      ]
    }
  },
  Korean: {
    pageTitle: '앱으로 다운로드 (PC / 모바일 / 태블릿)',
    pageSubtitle: 'Google AI Studio 설치 아이콘처럼 브라우저 주소창에서 GeekTabs를 독립 실행형 앱 로고로 설치하세요.',
    addressBarHint: 'PC 팁: Chrome 또는 Edge 주소창 오른쪽 끝에 나타나는 설치 아이콘을 클릭하세요.',
    pc: {
      label: 'PC / Mac',
      heading: 'PC / Mac에서 앱으로 다운로드 (Chrome, Edge, Brave)',
      steps: [
        'Chrome, Edge 또는 Brave 브라우저에서 GeekTabs를 엽니다.',
        '주소창 오른쪽 끝에 표시되는 "GeekTabs Dashboard 설치" 아이콘(Google AI Studio 설치 아이콘과 동일)을 찾습니다.',
        '해당 설치 아이콘 또는 위의 "앱 설치" 버튼을 클릭합니다(또는 메뉴 ⋮ → 저장 및 공유 → 앱으로 설치).',
        '"설치"를 누르면 독립 창으로 실행되며 바탕화면, 작업 표시줄 또는 Dock에 GeekTabs 로고가 추가됩니다.'
      ]
    },
    phone: {
      label: '스마트폰 (iOS / Android)',
      heading: '스마트폰 홈 화면에 앱 로고 추가',
      steps: [
        'iPhone (Safari): 도구 모음의 공유 아이콘을 누른 뒤 "홈 화면에 추가" → "추가"를 탭합니다.',
        'Android (Chrome / Edge): 위의 "앱 설치" 버튼을 누르거나 메뉴(⋮) → "앱 설치 / 홈 화면에 추가" → "설치"를 탭합니다.',
        '이제 홈 화면의 GeekTabs 로고 아이콘을 눌러 전체 화면 앱처럼 바로 실행할 수 있습니다.'
      ]
    },
    tablet: {
      label: '태블릿 (iPad / Android)',
      heading: '태블릿 홈 화면에 앱 로고 추가',
      steps: [
        'iPad (Safari): 오른쪽 상단 공유 아이콘 → "홈 화면에 추가" → "추가"를 선택합니다.',
        'Android 태블릿 (Chrome / Edge): 주소창의 설치 아이콘 또는 메뉴(⋮) → "앱 설치"를 눌러 설치합니다.',
        '태블릿 홈 화면이나 Dock에서 GeekTabs 앱 로고를 눌러 깔끔한 앱 스타일로 사용하세요.'
      ]
    }
  },
  Spanish: {
    pageTitle: 'Descargar como App (PC / Teléfono / Tablet)',
    pageSubtitle: 'Instala GeekTabs como aplicación independiente con su propio icono en tu escritorio o pantalla de inicio.',
    addressBarHint: 'Consejo en PC: Busca el icono de Instalar en el extremo derecho de la barra de direcciones.',
    pc: {
      label: 'PC / Mac',
      heading: 'Descargar en PC / Mac (Chrome, Edge, Brave)',
      steps: [
        'Abre GeekTabs en Chrome, Edge o Brave.',
        'Busca en el lado derecho de la barra de direcciones el icono "Instalar GeekTabs Dashboard" (similar al de Instalar Google AI Studio).',
        'Haz clic en el icono o en el botón "Instalar App" de arriba (o menú ⋮ → Guardar y compartir → Instalar página como aplicación).',
        'Confirma en "Instalar" para crear el acceso directo con el logo de GeekTabs en tu escritorio o Dock.'
      ]
    },
    phone: {
      label: 'Teléfono (iOS y Android)',
      heading: 'Añadir icono en el teléfono',
      steps: [
        'iPhone (Safari): Toca Compartir en la barra → desliza y selecciona "Añadir a pantalla de inicio" → toca "Añadir".',
        'Android (Chrome / Edge): Toca "Instalar App" arriba o menú (⋮) → "Instalar aplicación" → "Instalar".',
        'Abre GeekTabs directamente desde su logo en la pantalla de inicio en modo aplicación.'
      ]
    },
    tablet: {
      label: 'Tablet (iPad y Android)',
      heading: 'Añadir icono en Tablet',
      steps: [
        'iPad (Safari): Toca el botón Compartir en la esquina superior derecha → "Añadir a pantalla de inicio" → "Añadir".',
        'Tablet Android (Chrome / Edge): Toca el icono de Instalar en la barra de direcciones o menú ⋮ → "Instalar aplicación".',
        'Disfruta GeekTabs en pantalla completa directamente desde el logo en tu tablet.'
      ]
    }
  },
  French: {
    pageTitle: 'Télécharger en tant qu’App (PC / Téléphone / Tablette)',
    pageSubtitle: 'Installez GeekTabs comme application autonome avec son propre logo sur votre bureau ou écran d’accueil.',
    addressBarHint: 'Astuce PC : Repérez l’icône d’installation à droite de la barre d’adresse du navigateur.',
    pc: {
      label: 'PC / Mac',
      heading: 'Télécharger sur PC / Mac (Chrome, Edge, Brave)',
      steps: [
        'Ouvrez GeekTabs dans Chrome, Edge ou Brave.',
        'À droite de la barre d’adresse, cliquez sur l’icône "Installer GeekTabs Dashboard" (similaire à l’icône d’installation Google AI Studio).',
        'Vous pouvez aussi cliquer sur "Installer l’app" ci-dessus ou ouvrir le menu ⋮ → Caster, enregistrer et partager → Installer la page en tant qu’application.',
        'Cliquez sur "Installer" pour ajouter le logo GeekTabs sur votre Bureau, Barre des tâches ou Dock.'
      ]
    },
    phone: {
      label: 'Téléphone (iOS & Android)',
      heading: 'Ajouter le logo sur téléphone',
      steps: [
        'iPhone (Safari) : Touchez Partager → sélectionnez "Sur l’écran d’accueil" → touchez "Ajouter".',
        'Android (Chrome / Edge) : Touchez "Installer l’app" ci-dessus ou menu ⋮ → "Installer l’application".',
        'Lancez GeekTabs directement depuis son icône sur votre écran d’accueil.'
      ]
    },
    tablet: {
      label: 'Tablette (iPad & Android)',
      heading: 'Ajouter le logo sur tablette',
      steps: [
        'iPad (Safari) : Touchez le bouton Partager en haut à droite → "Sur l’écran d’accueil" → "Ajouter".',
        'Tablette Android (Chrome / Edge) : Touchez l’icône d’installation dans la barre d’adresse ou ⋮ → "Installer l’application".',
        'Ouvrez GeekTabs en mode application plein écran depuis l’icône sur votre tablette.'
      ]
    }
  },
  German: {
    pageTitle: 'Als App herunterladen (PC / Handy / Tablet)',
    pageSubtitle: 'Installieren Sie GeekTabs als eigenständige App mit eigenem Logo auf Desktop oder Startbildschirm.',
    addressBarHint: 'PC-Tipp: Achten Sie auf das Installieren-Symbol rechts in der Browser-Adressleiste.',
    pc: {
      label: 'PC / Mac',
      heading: 'Auf PC / Mac herunterladen (Chrome, Edge, Brave)',
      steps: [
        'Öffnen Sie GeekTabs in Chrome, Edge oder Brave.',
        'Klicken Sie rechts in der Adressleiste auf das Symbol „GeekTabs Dashboard installieren“ (wie bei Google AI Studio).',
        'Alternativ klicken Sie oben auf „App installieren“ oder im Menü (⋮) auf „Speichern und teilen“ → „Seite als App installieren“.',
        'Bestätigen Sie „Installieren“, um das GeekTabs-Logo auf Desktop, Taskleiste oder Dock abzulegen.'
      ]
    },
    phone: {
      label: 'Handy (iOS & Android)',
      heading: 'App-Logo auf dem Smartphone hinzufügen',
      steps: [
        'iPhone (Safari): Tippen Sie auf Teilen → „Zum Home-Bildschirm“ → „Hinzufügen“.',
        'Android (Chrome / Edge): Tippen Sie oben auf „App installieren“ oder Menü (⋮) → „App installieren“.',
        'Starten Sie GeekTabs direkt über das App-Logo auf Ihrem Startbildschirm.'
      ]
    },
    tablet: {
      label: 'Tablet (iPad & Android)',
      heading: 'App-Logo auf dem Tablet hinzufügen',
      steps: [
        'iPad (Safari): Tippen Sie oben rechts auf Teilen → „Zum Home-Bildschirm“ → „Hinzufügen“.',
        'Android-Tablet (Chrome / Edge): Tippen Sie auf das Installieren-Symbol in der Adressleiste oder ⋮ → „App installieren“.',
        'Öffnen Sie GeekTabs im eigenständigen Vollbild-App-Modus direkt vom Tablet-Startbildschirm.'
      ]
    }
  },
  Japanese: {
    pageTitle: 'アプリとしてダウンロード（PC / スマホ / タブレット）',
    pageSubtitle: 'デスクトップやホーム画面に GeekTabs のアプリアイコンを追加し、専用アプリのように起動できます。',
    addressBarHint: 'PC のヒント：ブラウザのアドレスバー右端に表示される「インストール」アイコンをクリックしてください。',
    pc: {
      label: 'PC / Mac',
      heading: 'PC / Mac にアプリをダウンロード（Chrome / Edge / Brave）',
      steps: [
        'Chrome、Edge、または Brave で GeekTabs を開きます。',
        'アドレスバー右側の「GeekTabs Dashboard をインストール」アイコン（Google AI Studio のインストールアイコンと同様）をクリックします。',
        'または上の「アプリをインストール」ボタンを押すか、メニュー ⋮ →「保存と共有」→「ページをアプリとしてインストール」を選択します。',
        '「インストール」をクリックすると、デスクトップやタスクバー、Dock にロゴが追加されます。'
      ]
    },
    phone: {
      label: 'スマホ（iPhone / Android）',
      heading: 'スマートフォンのホーム画面に追加',
      steps: [
        'iPhone（Safari）：共有アイコンをタップ →「ホーム画面に追加」→「追加」をタップします。',
        'Android（Chrome / Edge）：上の「アプリをインストール」ボタン、または ⋮ メニュー →「アプリをインストール」をタップします。',
        'ホーム画面の GeekTabs ロゴからアプリスタイルで直接起動できます。'
      ]
    },
    tablet: {
      label: 'タブレット（iPad / Android）',
      heading: 'タブレットのホーム画面に追加',
      steps: [
        'iPad（Safari）：右上の共有ボタン →「ホーム画面に追加」→「追加」をタップします。',
        'Android タブレット（Chrome / Edge）：アドレスバーのインストールアイコン、または ⋮ →「アプリをインストール」を選択します。',
        'タブレットのホーム画面から独立したアプリウィンドウとして利用できます。'
      ]
    }
  },
  Italian: {
    pageTitle: 'Scarica come App (PC / Telefono / Tablet)',
    pageSubtitle: 'Installa GeekTabs come app autonoma con il proprio logo sul desktop o sulla schermata Home.',
    addressBarHint: 'Suggerimento PC: Clicca sull’icona Installa sul lato destro della barra degli indirizzi.',
    pc: {
      label: 'PC / Mac',
      heading: 'Scarica su PC / Mac (Chrome, Edge, Brave)',
      steps: [
        'Apri GeekTabs in Chrome, Edge o Brave.',
        'Fai clic sull’icona "Installa GeekTabs Dashboard" a destra nella barra degli indirizzi.',
        'Puoi anche premere "Installa App" qui sopra o aprire menu ⋮ → Salva e condividi → Installa pagina come app.',
        'Conferma "Installa" per aggiungere il logo GeekTabs su Desktop, Barra delle applicazioni o Dock.'
      ]
    },
    phone: {
      label: 'Telefono (iOS e Android)',
      heading: 'Aggiungi logo su telefono',
      steps: [
        'iPhone (Safari): Tocca Condividi → "Aggiungi alla schermata Home" → "Aggiungi".',
        'Android (Chrome / Edge): Tocca "Installa App" sopra o menu ⋮ → "Installa app".',
        'Avvia GeekTabs direttamente dal logo sulla schermata Home.'
      ]
    },
    tablet: {
      label: 'Tablet (iPad e Android)',
      heading: 'Aggiungi logo su Tablet',
      steps: [
        'iPad (Safari): Tocca Condividi in alto a destra → "Aggiungi alla schermata Home" → "Aggiungi".',
        'Tablet Android (Chrome / Edge): Tocca l’icona Installa nella barra degli indirizzi o ⋮ → "Installa app".',
        'Apri GeekTabs in finestra app dedicata direttamente dalla schermata del tablet.'
      ]
    }
  },
  Russian: {
    pageTitle: 'Скачать как приложение (ПК / Телефон / Планшет)',
    pageSubtitle: 'Установите GeekTabs как отдельное приложение со своим логотипом на рабочий стол или экран «Домой».',
    addressBarHint: 'Совет для ПК: Нажмите значок установки в правой части адресной строки браузера.',
    pc: {
      label: 'ПК / Mac',
      heading: 'Установка на ПК / Mac (Chrome, Edge, Brave)',
      steps: [
        'Откройте GeekTabs в браузере Chrome, Edge или Brave.',
        'Нажмите на значок «Установить GeekTabs Dashboard» в правой части адресной строки (как у Google AI Studio).',
        'Или нажмите кнопку «Установить приложение» выше, либо меню ⋮ → Сохранить и поделиться → Установить как приложение.',
        'Подтвердите установку — логотип GeekTabs появится на рабочем столе, панели задач или в Dock.'
      ]
    },
    phone: {
      label: 'Телефон (iOS / Android)',
      heading: 'Добавить логотип на экран телефона',
      steps: [
        'iPhone (Safari): Нажмите «Поделиться» → «На экран «Домой»» → «Добавить».',
        'Android (Chrome / Edge): Нажмите «Установить приложение» выше или меню ⋮ → «Установить приложение».',
        'Запускайте GeekTabs в полноэкранном режиме прямо с иконки на главном экране.'
      ]
    },
    tablet: {
      label: 'Планшет (iPad / Android)',
      heading: 'Добавить логотип на экран планшета',
      steps: [
        'iPad (Safari): Нажмите «Поделиться» в правом верхнем углу → «На экран «Домой»» → «Добавить».',
        'Android-планшет (Chrome / Edge): Нажмите значок установки в адресной строке или ⋮ → «Установить приложение».',
        'Пользуйтесь GeekTabs как полноценным приложением с рабочего стола планшета.'
      ]
    }
  },
  Luxembourgish: {
    pageTitle: 'Als App eroflueden (PC / Handy / Tablet)',
    pageSubtitle: 'Installéiert GeekTabs als eegestänneg App mat engem Logo um Desktop oder Home-Bildschierm.',
    addressBarHint: 'PC-Tipp: Klickt op d’Installéieren-Ikon riets an der Adressläischt vum Browser.',
    pc: {
      label: 'PC / Mac',
      heading: 'Op PC / Mac eroflueden (Chrome, Edge, Brave)',
      steps: [
        'Maacht GeekTabs a Chrome, Edge oder Brave op.',
        'Klickt riets an der Adressläischt op d’Ikon "GeekTabs Dashboard installéieren".',
        'Oder klickt uewen op "App installéieren" respektiv Menü ⋮ → Säit als App installéieren.',
        'Bestätegt mat "Installéieren" fir de GeekTabs-Logo um Desktop oder Dock ze späicheren.'
      ]
    },
    phone: {
      label: 'Handy (iOS & Android)',
      heading: 'App-Logo um Handy derbäisetzen',
      steps: [
        'iPhone (Safari): Tippt op Deelen → „Op den Home-Bildschierm“ → „Derbäisetzen“.',
        'Android (Chrome / Edge): Tippt uewen op „App installéieren“ oder Menü ⋮ → „App installéieren“.',
        'Start GeekTabs direkt iwwer de Logo um Home-Bildschierm.'
      ]
    },
    tablet: {
      label: 'Tablet (iPad & Android)',
      heading: 'App-Logo um Tablet derbäisetzen',
      steps: [
        'iPad (Safari): Tippt uewen riets op Deelen → „Op den Home-Bildschierm“ → „Derbäisetzen“.',
        'Android-Tablet (Chrome / Edge): Tippt op d’Installéieren-Ikon an der Adressläischt oder ⋮ → „App installéieren“.',
        'Öffent GeekTabs am eegenen App-Modus direkt vum Tablet-Bildschierm.'
      ]
    }
  }
};

export default function DownloadAppTab({ language = 'English' }: DownloadAppTabProps = {}) {
  const [activeDevice, setActiveDevice] = useState<'pc' | 'phone' | 'tablet'>('pc');
  const guide = appInstallGuides[language] || appInstallGuides['English'];
  const currentDeviceGuide = guide[activeDevice];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8 relative z-10 p-2 sm:p-4 select-none">
      {/* Clean Centered Hero Header — matches Set Browser Homepage layout cleanly */}
      <div className="flex flex-col items-center justify-center text-center gap-3 max-w-2xl mx-auto mb-1 sm:mb-2">
        <img
          src="/icon.svg"
          alt="GeekTabs App Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300"
        />
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
          {guide.pageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-2">
          {guide.pageSubtitle}
        </p>
        <div className="pt-1">
          <PWAInstallButton variant="card" language={language} />
        </div>
      </div>

      {/* Neat Device Tabs & Step-by-Step Guide Card */}
      <div className="GeekTabs-card rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8 flex flex-col gap-5 sm:gap-6 max-w-2xl mx-auto w-full">
        {/* Device Selector Tabs: PC / Phone / Tablet */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 bg-black/[0.03] dark:bg-white/[0.03] rounded-2xl border border-black/5 dark:border-white/5">
            {([
              { id: 'pc' as const, label: guide.pc.label, icon: Monitor },
              { id: 'phone' as const, label: guide.phone.label, icon: Smartphone },
              { id: 'tablet' as const, label: guide.tablet.label, icon: Tablet },
            ]).map((dev) => {
              const IconComp = dev.icon;
              const isSelected = activeDevice === dev.id;
              return (
                <button
                  key={dev.id}
                  type="button"
                  onClick={() => setActiveDevice(dev.id)}
                  className={`browser-nav-btn px-3 py-2.5 rounded-xl text-[11px] font-bold tracking-tight uppercase transition-all cursor-pointer text-center select-none flex items-center justify-center gap-1.5 min-h-[40px] border ${
                    isSelected
                      ? 'browser-nav-active-btn bg-violet-600 !text-white text-white border-violet-600 shadow-md shadow-violet-500/25 font-black scale-[1.01]'
                      : 'bg-white/80 dark:bg-white/5 text-[#6143f7] hover:text-[#4f32e6] hover:bg-white dark:hover:bg-white/10 border-black/5 dark:border-white/5'
                  }`}
                  style={isSelected ? { color: '#ffffff' } : { color: '#6143f7' }}
                >
                  <IconComp
                    size={14}
                    className="shrink-0"
                    style={isSelected ? { stroke: '#ffffff', color: '#ffffff' } : { stroke: '#6143f7', color: '#6143f7' }}
                  />
                  <span
                    className={`truncate whitespace-nowrap px-0.5 ${isSelected ? 'browser-nav-active-label !text-white text-white font-black' : ''}`}
                    style={isSelected ? { color: '#ffffff' } : { color: '#6143f7' }}
                  >
                    {dev.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Download Steps for Selected Device */}
        <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 sm:p-6 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-black/5 dark:border-white/5">
            {activeDevice === 'pc' && <Monitor size={15} className="browser-guide-globe text-[#6143f7] shrink-0" style={{ color: '#6143f7', filter: 'none', textShadow: 'none' }} />}
            {activeDevice === 'phone' && <Smartphone size={15} className="browser-guide-globe text-[#6143f7] shrink-0" style={{ color: '#6143f7', filter: 'none', textShadow: 'none' }} />}
            {activeDevice === 'tablet' && <Tablet size={15} className="browser-guide-globe text-[#6143f7] shrink-0" style={{ color: '#6143f7', filter: 'none', textShadow: 'none' }} />}
            <h4
              className="browser-guide-subheading text-xs font-black uppercase tracking-wider text-[#6143f7]"
              style={{ color: '#6143f7', textShadow: 'none', filter: 'none' }}
            >
              {currentDeviceGuide.heading}
            </h4>
          </div>
          <ol
            className="browser-steps-list list-decimal list-inside space-y-3.5 sm:space-y-4 text-xs text-[#6143f7]"
            style={{ color: '#6143f7' }}
          >
            {currentDeviceGuide.steps.map((step: string, i: number) => (
              <li key={i} className="leading-relaxed font-semibold text-[#6143f7]" style={{ color: '#6143f7' }}>
                <span className="ml-1 sm:ml-2 font-sans text-xs sm:text-[13px] text-[#6143f7]" style={{ color: '#6143f7' }}>{step}</span>
              </li>
            ))}
          </ol>
          {activeDevice === 'pc' && (
            <p className="mt-4 pt-3 border-t border-black/5 text-[11px] sm:text-xs font-medium text-slate-600">
              {guide.addressBarHint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
