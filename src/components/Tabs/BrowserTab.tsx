import React, { useState } from 'react';
import { Compass, Globe, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

export interface BrowserTabProps {
  language?: string;
}

const browserGuides: Record<string, any> = {
  English: {
    title: 'Set Browser Homepage',
    subtitle: 'Make this dashboard your default homepage or new tab page to stay organized every time you open your browser.',
    copyButton: 'Copy URL',
    copiedText: 'Copied!',
    chrome: {
      title: 'Google Chrome',
      steps: [
        'Open Chrome, click the three-dot menu (top-right) and select Settings.',
        'Navigate to "On startup" in the left sidebar.',
        'Choose "Open a specific page or set of pages" and click "Add a new page".',
        'Paste the copied URL and click "Add".'
      ]
    },
    edge: {
      title: 'Microsoft Edge',
      steps: [
        'Open Edge, click the three-dot menu (top-right) and select Settings.',
        'Click "Start, home, and new tabs" in the left sidebar.',
        'Under "When Edge starts", select "Open these pages".',
        'Click "Add a new page", paste the copied URL and click "Add".'
      ]
    },
    firefox: {
      title: 'Mozilla Firefox',
      steps: [
        'Open Firefox, click the menu button (top-right) and select Settings.',
        'Click "Home" in the left sidebar.',
        'Under "Homepage and new windows", select "Custom URLs..." in the dropdown.',
        'Paste the copied URL and press Enter to save.'
      ]
    },
    safari: {
      title: 'Apple Safari',
      steps: [
        'Open Safari and select "Safari > Settings" from the menu bar.',
        'In the "General" panel, find the "Homepage" option.',
        'Set "New windows/tabs open with" to "Homepage".',
        'Paste the page URL and confirm.'
      ]
    },
    brave: {
      title: 'Brave',
      steps: [
        'Open Brave, click the three-line menu (top-right) and select Settings.',
        'Navigate to "Get started" in the left sidebar.',
        'Under "On startup", select "Open a specific page or set of pages" and click "Add a new page".',
        'Paste the copied URL and click "Add".'
      ]
    }
  },
  Korean: {
    title: '브라우저 홈으로 설정',
    subtitle: '브라우저를 열 때마다 개인 맞춤형 대시보드가 열리도록 시작 페이지 또는 홈 페이지로 설정하세요.',
    copyButton: 'URL 복사',
    copiedText: '복사 완료!',
    chrome: {
      title: '구글 크롬',
      steps: [
        'Chrome을 열고 우측 상단의 점 3개 메뉴를 클릭한 후 설정에 들어갑니다.',
        '왼쪽 사이드바에서 "시작 그룹" 메뉴로 이동합니다.',
        '"특정 페이지 또는 페이지 모음 열기"를 선택하고 "새 페이지 추가"를 누릅니다.',
        '복사한 URL을 붙여넣고 "추가" 버튼을 클릭합니다.'
      ]
    },
    edge: {
      title: '마이크로소프트 엣지',
      steps: [
        'Edge를 열고 우측 상단의 점 3개 메뉴를 클릭한 후 설정에 들어갑니다.',
        '왼쪽 사이드바에서 "시작, 홈 및 새 탭"으로 이동합니다.',
        '"Edge가 시작될 때" 설정에서 "이 페이지 열기"를 선택합니다.',
        '"새 페이지 추가"를 클릭하여 복사한 URL을 붙여넣고 "추가"를 클릭합니다.'
      ]
    },
    firefox: {
      title: '모질라 파이어폭스',
      steps: [
        'Firefox를 열고 우측 상단의 메뉴(줄 3개)에서 설정에 들어갑니다.',
        '왼쪽 사이드바에서 "홈"을 클릭합니다.',
        '"홈페이지와 새 창" 드롭다운 메뉴에서 "사용자 지정 URL..."을 선택합니다.',
        '복사한 URL을 입력 칸에 붙여넣고 엔터를 눌러 저장합니다.'
      ]
    },
    safari: {
      title: '애플 사파리',
      steps: [
        'Safari를 실행하고 상단 메뉴 막대에서 "Safari > 설정"을 선택합니다.',
        '"일반" 탭으로 이동하여 "홈페이지" 항목을 찾습니다.',
        '"새 윈도우/탭 열기" 설정을 "홈페이지"로 변경합니다.',
        '기존 내용을 지우고 복사한 URL을 홈페이지 칸에 붙여넣어 설정합니다.'
      ]
    },
    brave: {
      title: '브레이브 (Brave)',
      steps: [
        'Brave를 열고 우측 상단의 줄 3개 메뉴를 클릭한 후 설정에 들어갑니다.',
        '왼쪽 사이드바에서 "시작하기" 메뉴로 이동합니다.',
        '"시작 그룹" 설정을 찾아 "특정 페이지 또는 페이지 모음 열기"를 선택하고 "새 페이지 추가"를 누릅니다.',
        '복사한 URL을 붙여넣고 "추가" 버튼을 클릭합니다.'
      ]
    }
  },
  Spanish: {
    title: 'Establecer como página de inicio',
    subtitle: 'Configura este tablero como tu página de inicio predeterminada de tu navegador para mantenerte organizado.',
    copyButton: 'Copiar URL',
    copiedText: '¡Copiado!',
    chrome: {
      title: 'Google Chrome',
      steps: [
        'Abre Chrome, haz clic en el menú de tres puntos (arriba a la derecha) y elige Configuración.',
        'Ve a la sección "Al abrir" en el menú de la izquierda.',
        'Selecciona "Abrir una página específica o un conjunto de páginas" y haz clic en "Agregar una nueva página".',
        'Pega la URL copiada y haz clic en "Agregar".'
      ]
    },
    edge: {
      title: 'Microsoft Edge',
      steps: [
        'Abre Edge, haz clic en el menú de tres puntos (arriba a la derecha) y elige Configuración.',
        'Haz clic en "Inicio, página de inicio y pestañas nuevas" en la barra de la izquierda.',
        'En "Cuando se inicia Edge", selecciona "Abrir estas páginas".',
        'Haz clic en "Agregar una nueva página", pega la URL copiada y selecciona "Agregar".'
      ]
    },
    firefox: {
      title: 'Mozilla Firefox',
      steps: [
        'Abre Firefox, haz clic en el menú de tres líneas (arriba a la derecha) y selecciona Ajustes.',
        'Haz clic en "Inicio" en el panel izquierdo.',
        'En "Página de inicio y nuevas ventanas", elige "Direcciones URL personalizadas...".',
        'Pega la URL y pulsa Enter para guardar.'
      ]
    },
    safari: {
      title: 'Apple Safari',
      steps: [
        'Abre Safari y selecciona "Safari > Ajustes" en la barra de menú superior.',
        'En la pestaña "General", busca el campo para "Página de inicio".',
        'Cambia "Las nuevas ventanas/pestañas se abren con" a "Página de inicio".',
        'Pega la URL copiada y confirma.'
      ]
    },
    brave: {
      title: 'Brave',
      steps: [
        'Abre Brave, haz clic en el menú de tres líneas (arriba a la derecha) y elige Configuración.',
        'Ve a la sección "Al abrir" en el menú de la izquierda.',
        'Selecciona "Abrir una página específica o un conjunto de páginas" y haz clic en "Agregar una nueva página".',
        'Pega la URL copiada y haz clic en "Agregar".'
      ]
    }
  },
  French: {
    title: 'Définir la page d\'accueil',
    subtitle: 'Faites de ce tableau de bord votre page d\'accueil par défaut pour rester organisé à chaque ouverture de votre navigateur.',
    copyButton: 'Copier l\'adresse',
    copiedText: 'Copié !',
    chrome: {
      title: 'Google Chrome',
      steps: [
        'Ouvrez Chrome, cliquez sur le menu à trois points (en haut à droite) et sélectionnez Paramètres.',
        'Naviguez vers "Au démarrage" dans la colonne de gauche.',
        'Choisissez "Ouvrir une page spécifique ou un ensemble de pages" et cliquez sur "Ajouter une nouvelle page".',
        'Collez l\'URL copiée et cliquez sur "Ajouter".'
      ]
    },
    edge: {
      title: 'Microsoft Edge',
      steps: [
        'Ouvrez Edge, cliquez sur le menu à trois points (en haut à droite) et sélectionnez Paramètres.',
        'Cliquez sur "Démarrage, page d\'accueil et nouveaux onglets" à gauche.',
        'Sous "Au démarrage d\'Edge", sélectionnez "Ouvrir ces pages".',
        'Cliquez sur "Ajouter une nouvelle page", collez l\'URL copiée et validez.'
      ]
    },
    firefox: {
      title: 'Mozilla Firefox',
      steps: [
        'Ouvrez Firefox, cliquez sur le menu à trois lignes (en haut à droite) et sélectionnez Paramètres.',
        'Cliquez sur "Accueil" dans le menu de gauche.',
        'Sous "Page d\'accueil et nouvelles fenêtres", sélectionnez "Adresses personnalisées...".',
        'Collez l\'URL copiée et appuyez sur Entrée pour enregistrer.'
      ]
    },
    safari: {
      title: 'Apple Safari',
      steps: [
        'Ouvrez Safari et choisissez "Safari > Réglages" dans la barre des menus.',
        'Dans l\'onglet "Général", localisez le champ "Page d\'accueil".',
        'Réglez l\'option d\'ouverture des fenêtres sur "Page d\'accueil".',
        'Collez l\'URL de la page et valisez.'
      ]
    },
    brave: {
      title: 'Brave',
      steps: [
        'Ouvrez Brave, cliquez sur le menu à trois lignes (en haut à droite) et sélectionnez Paramètres.',
        'Naviguez vers "Au démarrage" dans la colonne de gauche.',
        'Choisissez "Ouvrir une page spécifique ou un ensemble de pages" et cliquez sur "Ajouter une nouvelle page".',
        'Collez l\'URL copiée et cliquez sur "Ajoute".'
      ]
    }
  },
  German: {
    title: 'Startseite festlegen',
    subtitle: 'Machen Sie dieses Dashboard zu Ihrer Standard-Startseite, um bei jedem Öffnen des Browsers organisiert zu bleiben.',
    copyButton: 'URL kopieren',
    copiedText: 'Kopiert!',
    chrome: {
      title: 'Google Chrome',
      steps: [
        'Öffnen Sie Chrome, klicken Sie auf das Dreipunkt-Menü (oben rechts) und wählen Sie Einstellungen.',
        'Navigieren Sie in der linken Seitenleiste zu "Beim Start".',
        'Wählen Sie "Bestimmte Seite oder Seiten öffnen" und klicken Sie auf "Neue Seite hinzufügen".',
        'Fügen Sie die kopierte URL ein und klicken Sie auf "Hinzufügen".'
      ]
    },
    edge: {
      title: 'Microsoft Edge',
      steps: [
        'Öffnen Sie Edge, klicken Sie auf das Dreipunkt-Menü (oben rechts) und wählen Sie Einstellungen.',
        'Klicken Sie links auf "Start, Startseite und neue Registerkarten".',
        'Wählen Sie unter "Beim Start von Edge" die Option "Bestimmte Seiten öffnen".',
        'Klicken Sie auf "Neue Seite hinzufügen", fügen Sie die kopierte URL ein und klicken Sie auf "Hinzufügen".'
      ]
    },
    firefox: {
      title: 'Mozilla Firefox',
      steps: [
        'Öffnen Sie Firefox, klicken Sie auf das Menüsymbol (oben rechts) und wählen Sie Einstellungen.',
        'Klicken Sie in der linken Seitenleiste auf "Startseite".',
        'Wählen Sie unter "Startseite und neue Fenster" die Option "Benutzerdefinierte URL...".',
        'Fügen Sie die kopierte URL ein und drücken Sie die Eingabetaste zum Speichern.'
      ]
    },
    safari: {
      title: 'Apple Safari',
      steps: [
        'Öffnen Sie Safari und wählen Sie "Safari > Einstellungen" in der Menüleiste.',
        'Suchen Sie im Reiter "Allgemein" nach der Option "Homepage".',
        'Wählen Sie bei "Neue Fenster/Tabs öffnen mit" die Option "Homepage".',
        'Fügen Sie die kopierte URL ein und bestätigen Sie.'
      ]
    },
    brave: {
      title: 'Brave',
      steps: [
        'Öffnen Sie Brave, klicken Sie auf das Dreistrich-Menü (oben rechts) und wählen Sie Einstellungen.',
        'Navigieren Sie in der linken Seitenleiste zu "Beim Start".',
        'Wählen Sie "Bestimmte Seite oder Seiten öffnen" und klicken Sie auf "Neue Seite hinzufügen".',
        'Fügen Sie die kopierte URL ein und klicken Sie auf "Hinzufügen".'
      ]
    }
  },
  Chinese: {
    title: '设置浏览器主页',
    subtitle: '将此仪表盘设置为浏览器的默认主页或新标签页，以便在每次启动浏览器时都能高效规划。',
    copyButton: '复制网址',
    copiedText: '已复制！',
    chrome: {
      title: '谷歌浏览器',
      steps: [
        '打开 Chrome，点击右上角三点菜单并选择“设置”。',
        '点击左侧边栏的“启动时”。',
        '选择“打开特定网页或一组网页”，然后点击“添加新网页”。',
        '粘贴已复制的仪表盘网址，然后点击“添加”。'
      ]
    },
    edge: {
      title: '微软 Edge',
      steps: [
        '打开 Edge，点击右上角三点菜单并选择“设置”。',
        '点击左侧边栏的“开始、主页和新建标签页”。',
        '在“Edge 启动时”下选择“打开这些页面”。',
        '点击“添加新页面”，粘贴已复制的仪表盘网址，并点击“添加”。'
      ]
    },
    firefox: {
      title: '火狐浏览器',
      steps: [
        '打开 Firefox，点击右上角三条线菜单选项进入“设置”。',
        '点击左侧边栏的“主页”。',
        '在“主页和新窗口”下，选择下拉菜单中的“自定义网址...”。',
        '粘贴已复制的页面网址，按回车键即可自动保存。'
      ]
    },
    safari: {
      title: '苹果 Safari',
      steps: [
        '打开 Safari 浏览器，在顶部菜单栏选择“Safari 浏览器 > 设置”。',
        '在“通用”面板中，找到“主页”选项。',
        '将“新窗口/标签页打开时打开”设置为“主页”。',
        '粘贴复制的网址，确认即可。'
      ]
    },
    brave: {
      title: 'Brave 浏览器',
      steps: [
        '打开 Brave 浏览器，点击右上角三条线菜单选项进入“设置”。',
        '点击左侧边栏的“启动时”。',
        '选择“打开特定网页或一组网页”，然后点击“添加新网页”。',
        '粘贴已复制的仪表盘网址，然后点击“添加”。'
      ]
    }
  },
  Japanese: {
    title: 'ブラウザのホームページに設定する',
    subtitle: 'ブラウザを開くたびにこのダッシュボードが自動的に開くように、ホームページまたは起動ページとして設定しましょう。',
    copyButton: 'URLをコピー',
    copiedText: 'コピー完了！',
    chrome: {
      title: 'Google Chrome',
      steps: [
        'Chrome を開き、右上にある3点メニューをクリックして「設定」を選択します。',
        '左側のサイドメニューから「起動時」を選択します。',
        '「特定のページまたはページセットを開く」を選択し、「新しいページを追加」をクリックします。',
        'コピーしたURLを貼り付け、「追加」をクリックします。'
      ]
    },
    edge: {
      title: 'Microsoft Edge',
      steps: [
        'Edge を開き、右上にある3点メニューをクリックして「設定」を選択します。',
        '左側のサイドバーから「[スタート]、[홈]、および [新規タブ]」を選択します。',
        '「Edge の起動時」で「these pages」を選択します。',
        '「新しいページを追加」をクリックし、コピーしたURLを貼り付け、「追加」をクリックします。'
      ]
    },
    firefox: {
      title: 'Mozilla Firefox',
      steps: [
        'Firefox を開き、右上にあるメニュー（3本線）から「設定」を選択します。',
        '左側のサイドバーから「ホーム」を選択します。',
        '「ホームページと新しいウィンドウ」で、ドロップダウンから「カスタムURL...」を選択します。',
        'コピーしたURLを貼り付け、Enterキーを押して保存します。'
      ]
    },
    safari: {
      title: 'Apple Safari',
      steps: [
        'Safari を開き、メニューバーから「Safari > 設定」を選択します。',
        '「一般」タブをクリックして、「ホームページ」の入力フィールドを探します。',
        '「新規ウィンドウ/タブを開く場合」の設定を「ホームページ」に変更します。',
        'コピーしたURLを入力欄に貼り付け、確定します。'
      ]
    },
    brave: {
      title: 'Brave',
      steps: [
        'Brave を開き、右上にある3本線メニューをクリックして「設定」を選択します。',
        '左側のサイドメニューから「起動时」を選択します。',
        '「特定のページまたはページセットを開く」を選択し、「新しいページを追加」をクリックします。',
        'コピーしたURLを貼り付け、「追加」をクリックします。'
      ]
    }
  },
  Italian: {
    title: 'Imposta la Homepage del Browser',
    subtitle: 'Rendi questa dashboard la tua homepage predefinita o la pagina della nuova scheda per rimanere organizzato ogni volta che apri il browser.',
    copyButton: 'Copia URL',
    copiedText: 'Copiato!',
    chrome: {
      title: 'Google Chrome',
      steps: [
        'Apri Chrome, fai clic sul menu con tre punti (in alto a destra) e seleziona Impostazioni.',
        'Seleziona "All\'avvio" nella barra laterale sinistra.',
        'Scegli "Apri una pagina specifica o un insieme di pagine" e fai clic su "Aggiungi una nuova pagina".',
        'Incolla l\'URL copiato e fai clic su "Aggiungi".'
      ]
    },
    edge: {
      title: 'Microsoft Edge',
      steps: [
        'Apri Edge, fai clic sul menu con tre punti (in alto a destra) e seleziona Impostazioni.',
        'Fai clic su "Start, home e nuove schede" nella barra laterale sinistra.',
        'Sotto "All\'avvio di Edge", seleziona "Apri queste pagine".',
        'Fai clic su "Aggiungi una nuova pagina", incolla l\'URL copiato e fai clic su "Aggiungi".'
      ]
    },
    firefox: {
      title: 'Mozilla Firefox',
      steps: [
        'Apri Firefox, fai clic sul pulsante del menu (in alto a destra) e seleziona Impostazioni.',
        'Fai clic su "Pagina iniziale" nella barra laterale sinistra.',
        'Sotto "Pagina iniziale e nuove finestre", seleziona "URL personalizzati..." nel menu a discesa.',
        'Incolla l\'URL copiato e premi Invio per salvare.'
      ]
    },
    safari: {
      title: 'Apple Safari',
      steps: [
        'Apri Safari e seleziona "Safari > Impostazioni" dalla barra dei menu.',
        'Nel pannello "Generale", trova l\'opzione "Pagina iniziale".',
        'Imposta "Apri nuove finestre/pannelli con" su "Pagina iniziale".',
        'Incolla l\'URL della pagina e conferma.'
      ]
    },
    brave: {
      title: 'Brave',
      steps: [
        'Apri Brave, fai clic sul menu a tre linee (in alto a destra) e seleziona Impostazioni.',
        'Seleziona "All\'avvio" nella barra laterale sinistra.',
        'Sotto "All\'avvio", seleziona "Apri una pagina specifica o un insieme di pagine" e fai clic su "Aggiungi una nuova pagina".',
        'Incolla l\'URL copiato e fai clic su "Aggiungi".'
      ]
    }
  },
  Russian: {
    title: 'Установить домашнюю страницу',
    subtitle: 'Сделайте эту панель своей домашней страницей по умолчанию или страницей новой вкладки, чтобы оставаться организованным при каждом открытии браузера.',
    copyButton: 'Копировать URL',
    copiedText: 'Скопировано!',
    chrome: {
      title: 'Google Chrome',
      steps: [
        'Откройте Chrome, нажмите на трехточечное меню (справа вверху) и выберите «Настройки».',
        'Перейдите в раздел «Запуск Chrome» на панели слева.',
        'Выберите «Ранее открытые вкладки» или «Заданные страницы» и нажмите «Добавить страницу».',
        'Вставьте скопированный URL и нажмите «Добавить».'
      ]
    },
    edge: {
      title: 'Microsoft Edge',
      steps: [
        'Откройте Edge, нажмите на трехточечное меню (справа вверху) и выберите «Настройки».',
        'Нажмите «Запуск, домашняя и новые вкладки» на панели слева.',
        'В разделе «При запуске Edge» выберите «Открыть эти страницы».',
        'Нажмите «Добавить новую страницу», вставьте скопированный URL и нажмите «Добавить».'
      ]
    },
    firefox: {
      title: 'Mozilla Firefox',
      steps: [
        'Откройте Firefox, нажмите кнопку меню (справа вверху) и выберите «Настройки».',
        'Нажмите «Начало» на панели слева.',
        'В разделе «Домашняя страница и новые окна» выберите «Адреса URL...» в раскрывающемся списке.',
        'Вставьте скопированный URL-адрес и нажмите Enter для сохранения.'
      ]
    },
    safari: {
      title: 'Apple Safari',
      steps: [
        'Откройте Safari и выберите «Safari > Настройки» в строке меню.',
        'На вкладке «Основные» найдите параметр «Домашняя страница».',
        'Установите «В новых окнах открывать» значение «Домашняя страница».',
        'Вставьте скопированный URL и подтвердите.'
      ]
    },
    brave: {
      title: 'Brave',
      steps: [
        'Откройте Brave, нажмите меню с тремя полосками (справа вверху) и выберите «Настройки».',
        'Перейдите в раздел «При запуске» на панели слева.',
        'Выберите «Открыть конкретную страницу или набор страниц» и нажмите «Добавить новую страницу».',
        'Вставьте скопированный URL и нажмите «Добавить».'
      ]
    }
  },
  Luxembourgish: {
    title: 'Als Startsäit astellen',
    subtitle: 'Setzt dësen Dashboard als Standard-Startsäit oder nei Tabsäit fir ëmmer organiséiert ze bleiwen wann Dir Äre Browser opmaacht.',
    copyButton: 'URL kopéieren',
    copiedText: 'Kopéiert!',
    chrome: {
      title: 'Google Chrome',
      steps: [
        'Öffent Chrome, klickt op den Dräi-Punkt-Menü (uewen riets) an wielt Astellungen.',
        'Navigéiert op "Beim Start" an der lénkser Säiteleiste.',
        'Wielt "Eng spezifesch Säit oder eng Rei vu Säiten opmaachen" an klickt op "Eng nei Säit derbäisetzen".',
        'Pech déi kopéiert URL an klickt op "Derbäisetzen".'
      ]
    },
    edge: {
      title: 'Microsoft Edge',
      steps: [
        'Öffent Edge, klickt op den Dräi-Punkt-Menü (uewen riets) an wielt Astellungen.',
        'Klickt op "Start, Startsäit an nei Tabs" an der lénkser Säiteleiste.',
        'Ënner "Wann Edge start", wielt "Dës Säiten opmaachen".',
        'Klickt op "Eng nei Säit derbäisetzen", pech déi kopéiert URL an klickt op "Derbäisetzen".'
      ]
    },
    firefox: {
      title: 'Mozilla Firefox',
      steps: [
        'Öffent Firefox, klickt op de Menü-Knäppchen (uewen riets) an wielt Astellungen.',
        'Klickt op "Startsäit" an der lénkser Säiteleiste.',
        'Ënner "Startsäit an nei Fënsteren", wielt "Benotzerdefinéiert URLen..." am Dropdown-Menü.',
        'Pech déi kopéiert URL an dréckt op Enter fir ze späicheren.'
      ]
    },
    safari: {
      title: 'Apple Safari',
      steps: [
        'Öffent Safari an wielt "Safari > Astellungen" aus der Menülescht.',
        'Am Panel "Allgemeng", fannt Dir d\'Optioun "Startsäit".',
        'Setzt "Nei Fënsteren/Tabs opmaachen mat" op "Startsäit".',
        'Pech d\'URL vun der Säit an confirméiert.'
      ]
    },
    brave: {
      title: 'Brave',
      steps: [
        'Öffent Brave, klickt op den Dräi-Linnen-Menü (uewen riets) an wielt Astellungen.',
        'Navigéiert op "Beim Start" an der lénkser Säiteleiste.',
        'Ënner "Beim Start", wielt "Eng spezifesch Säit oder eng Rei vu Säiten opmaachen" an klickt op "Eng nei Säit derbäisetzen".',
        'Pech déi kopéiert URL an klickt op "Derbäisetzen".'
      ]
    }
  }
};

export default function BrowserTab({ language = 'English' }: BrowserTabProps = {}) {
  const [copiedHomepage, setCopiedHomepage] = useState(false);
  const [activeBrowser, setActiveBrowser] = useState<'chrome' | 'edge' | 'firefox' | 'safari' | 'brave'>('chrome');

  const guides = browserGuides[language] || browserGuides['English'];

  const getTargetUrl = () => {
    return typeof window !== 'undefined' ? window.location.origin : 'https://GeekTabs.app';
  };

  const handleCopy = () => {
    const targetUrl = getTargetUrl();
    navigator.clipboard.writeText(targetUrl);
    setCopiedHomepage(true);
    setTimeout(() => setCopiedHomepage(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8 relative z-10 p-2 sm:p-4 select-none">
      <div className="flex flex-col items-center justify-center text-center gap-2.5 sm:gap-3 max-w-2xl mx-auto mb-2 sm:mb-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[1.5rem] bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500 shadow-xl shadow-violet-500/5 hover:scale-105 transition-transform duration-300">
          <Compass size={28} className="stroke-[1.5] sm:w-8 sm:h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black dark:text-white mt-1 sm:mt-2">
          {guides.title}
        </h1>
        <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 leading-relaxed px-2">
          {guides.subtitle}
        </p>
      </div>

      <div className="GeekTabs-card rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8 flex flex-col gap-5 sm:gap-6 max-w-2xl mx-auto w-full">
        {/* URL Field with Copy button */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <input
            type="text"
            readOnly
            value={getTargetUrl()}
            className="browser-url-input flex-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-[#6143f7] font-mono text-xs outline-none select-all overflow-hidden text-ellipsis whitespace-nowrap focus:ring-1 focus:ring-violet-500/30"
            style={{ color: '#6143f7' }}
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-blue-500/15 cursor-pointer active:scale-95"
          >
            {copiedHomepage ? (
              <>
                <Check size={14} className="stroke-[2.5]" />
                {guides.copiedText}
              </>
            ) : (
              <>
                <Copy size={14} className="stroke-[2.5]" />
                {guides.copyButton}
              </>
            )}
          </button>
        </div>

        {/* Browser Selector Tabs - Tab style for mobile & tablet (2-col grid), 5-col on desktop */}
        <div className="w-full">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 bg-black/[0.03] dark:bg-white/[0.03] rounded-2xl border border-black/5 dark:border-white/5">
            {(['chrome', 'edge', 'firefox', 'safari', 'brave'] as const).map((bKey, index) => {
              const curB = guides[bKey] || browserGuides['English'][bKey];
              const isSelected = activeBrowser === bKey;
              const isLast = index === 4; // 'brave'
              return (
                <button
                  key={bKey}
                  type="button"
                  onClick={() => setActiveBrowser(bKey)}
                  className={`browser-nav-btn px-2 sm:px-3 lg:px-1.5 xl:px-2 py-2 sm:py-2.5 lg:py-2 rounded-xl text-[10px] sm:text-[11px] lg:text-[9.5px] xl:text-[10px] font-bold tracking-tight uppercase transition-all cursor-pointer text-center select-none flex items-center justify-center min-h-[38px] sm:min-h-[42px] lg:min-h-[38px] border ${
                    isLast ? 'col-span-2 lg:col-span-1' : ''
                  } ${
                    isSelected
                      ? 'browser-nav-active-btn bg-violet-600 !text-white text-white border-violet-600 shadow-md shadow-violet-500/25 font-black scale-[1.01]'
                      : 'bg-white/80 dark:bg-white/5 text-[#6143f7] hover:text-[#4f32e6] hover:bg-white dark:hover:bg-white/10 border-black/5 dark:border-white/5'
                  }`}
                  style={isSelected ? { color: '#ffffff' } : { color: '#6143f7' }}
                >
                  <span 
                    className={`truncate whitespace-nowrap px-0.5 ${isSelected ? 'browser-nav-active-label !text-white text-white font-black' : ''}`}
                    style={isSelected ? { color: '#ffffff' } : { color: '#6143f7' }}
                  >
                    {curB.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Steps List */}
        <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 sm:p-6 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-black/5 dark:border-white/5">
            <Globe size={15} className="text-[#6143f7] shrink-0" style={{ color: '#6143f7' }} />
            <h4 
              className="browser-guide-subheading text-xs font-black uppercase tracking-wider text-[#6143f7]"
              style={{ color: '#6143f7' }}
            >
              {(guides[activeBrowser] || browserGuides['English'][activeBrowser])?.title}
            </h4>
          </div>
          <ol 
            className="browser-steps-list list-decimal list-inside space-y-3.5 sm:space-y-4 text-xs text-[#6143f7]"
            style={{ color: '#6143f7' }}
          >
            {((guides[activeBrowser] || browserGuides['English'][activeBrowser])?.steps || []).map((step: string, i: number) => (
              <li key={i} className="leading-relaxed font-semibold text-[#6143f7]" style={{ color: '#6143f7' }}>
                <span className="ml-1 sm:ml-2 font-sans text-xs sm:text-[13px] text-[#6143f7]" style={{ color: '#6143f7' }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
