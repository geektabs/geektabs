import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, Palette, Image as ImageIcon, Layout, Check, Trash2, Globe, Compass, Download, RotateCcw, Type, ChevronDown, CloudSun, Menu, X, Info } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ThemesTab from './ThemesTab';
import WallpapersTab from './WallpapersTab';
import TextTab from './TextTab';
import BrowserTab from './BrowserTab';
import DownloadAppTab from './DownloadAppTab';
import WeatherSettingsTab from './WeatherSettingsTab';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmModal from '../ConfirmModal';
import { t } from '../../i18n';

export interface SettingsTabProps {
  currentTheme: string;
  setTheme: (theme: string) => void;
  isDarkMode: boolean;
  customWallpapers: any[];
  setCustomWallpapers: (wallpapers: any[]) => void;
  language: string;
  setLanguage: (lang: string) => void;
  cardBgMode: 'white' | 'dark' | 'dark-glass';
  setCardBgMode: (mode: 'white' | 'dark' | 'dark-glass') => void;
  textColor?: string;
  setTextColor?: (color: string) => void;
}

const SETTINGS_T: Record<string, Record<string, string>> = {
  English: {
    title: "SETTINGS",
    generalSettings: "General Settings",
    managePreferences: "Manage basic preferences",
    customBoardName: "Custom Board Name",
    boardNameDesc: "This name will be displayed as an elegant brand signature on the home page. Defaults to a time-based greeting (Good Morning / Good Afternoon / Good Evening).",
    defaultPlaceholder: "Default: ",
    save: "Save",
    saved: "Saved",
    languageSelection: "Language Selection",
    langDesc: "Choose your preferred language for the widgets and controls.",
    cardStyle: "Card Background Style",
    cardDesc: "Choose between Light (white), Dark (black), or Glass (frosted glass) webcard background styles.",
    whiteBg: "Light",
    darkBg: "Dark",
    darkGlass: "Glass",
    dataBackup: "Data Backup & Restore Point",
    dataDesc: "Export your bookmarks, to-do list items, and personal notes into a JSON file, or import a previously saved backup to restore your data completely.",
    exportBackup: "Export Backup (Create Restore Point)",
    importBackup: "Import Backup (Restore to Point)",
    resetTitle: "Reset to Default",
    resetDesc: "Reset the entire dashboard back to its original factory settings. This will permanently delete all your custom themes, wallpapers, bookmarks, tasks, and notes!",
    resetButton: "Reset & Clear All Data",
    aboutTitle: "About Us",
    aboutDesc: "Discover our story",
    aboutWelcome: "Welcome to GeekTabs",
    aboutText1: "GeekTabs was built with a simple mission: to transform the mundane \"new tab\" page into a beautiful, personalized, and highly functional dashboard. We believe that your digital environment deeply impacts your productivity and creativity.",
    aboutText2: "With a focus on clean design, thoughtful features, and extensive customization, GeekTabs sits right at the start of your journey across the web. Whether you need a daily dose of inspiration, a place to organize your tasks, or simply an elegant clock to keep you grounded, we've got you covered.",
    supportContact: "Support & Contact",
    restoreSuccess: "Backup restored successfully! The page will now reload.",
    invalidBackup: "Invalid backup file.",
    failParse: "Failed to parse backup file.",
    modalTitle: "Reset All Data?",
    modalMessage: "This action is irreversible. This will permanently delete all of your custom settings, Bookmarks, To-Do lists, and Notes. The page will reload after reset.",
    modalConfirm: "Confirm Reset",
    modalCancel: "Cancel"
  },
  Chinese: {
    title: "系统设置",
    generalSettings: "通用设置",
    managePreferences: "管理您的基础偏好设置",
    customBoardName: "自定义主页板名",
    boardNameDesc: "此名字将作为精美的品牌签名显示在首页。默认将显示随时间变化的问候语（早上好 / 下午好 / 晚上好）。",
    defaultPlaceholder: "默认值：",
    save: "保存",
    saved: "已保存",
    languageSelection: "语言选择",
    langDesc: "为所有小组件和控制面板选择您的偏好语言。",
    cardStyle: "卡片背景样式",
    cardDesc: "在浅色（白色卡片）、深色（黑色卡片）与玻璃（磨砂玻璃卡片）之间进行选择。",
    whiteBg: "浅色 (Light)",
    darkBg: "深色 (Dark)",
    darkGlass: "玻璃 (Glass)",
    dataBackup: "数据备份与还原 (还原点)",
    dataDesc: "导出您所有的书签、待办事项和笔记数据，或导入之前备份的 JSON 文件以恢复至此前的状态。",
    exportBackup: "导出备份 (创建还原点)",
    importBackup: "导入备份 (恢复至该点)",
    resetTitle: "恢复默认设置",
    resetDesc: "重置整个网站到原始默认设置。您的所有个性化设置、书签、待办事项和笔记数据都将被永久删除！",
    resetButton: "重置并清除所有数据",
    aboutTitle: "关于我们",
    aboutDesc: "探索我们的故事",
    aboutWelcome: "欢迎来到 GeekTabs",
    aboutText1: "GeekTabs 秉承着一个简单的使命而创建：将平淡无奇的“新标签页”转变为精美、个性化且功能强大的仪表盘。我们深信数码环境会深深影响您的工作效率与创造力。",
    aboutText2: "专注于简约设计、周到功能和深度自定义，GeekTabs 伴您开启每一次网络之旅。无论您是需要每日灵感，还是组织任务，抑或是优雅的时间显示，我们都能满足您的期待。",
    supportContact: "支持与联系",
    restoreSuccess: "备份恢复成功！网页即将刷新。",
    invalidBackup: "无效的备份文件。",
    failParse: "解析备份文件失败。",
    modalTitle: "确认重置所有数据？",
    modalMessage: "此操作是不可逆的。这将永久删除您的所有自定义设置、书签（Bookmarks）、待办事项（To-Do）以及笔记（Notes）。重置后页面将重新加载。",
    modalConfirm: "确认重置",
    modalCancel: "取消"
  },
  Spanish: {
    title: "CONFIGURACIÓN",
    generalSettings: "Ajustes Generales",
    managePreferences: "Gestionar preferencias básicas",
    customBoardName: "Nombre de Tablero Personalizado",
    boardNameDesc: "Este nombre se mostrará como una firma de marca elegante en la página de inicio. Por defecto, muestra un saludo según la hora (Buenos Días / Buenas Tardes / Buenas Noches).",
    defaultPlaceholder: "Por defecto: ",
    save: "Guardar",
    saved: "Guardado",
    languageSelection: "Selección de Idioma",
    langDesc: "Elige tu idioma preferido para los widgets y controles.",
    cardStyle: "Estilo de Fondo de Tarjeta",
    cardDesc: "Elige entre tarjetas Claro (blanco), Oscuro (negro) o Cristal (vidrio esmerilado).",
    whiteBg: "Claro",
    darkBg: "Oscuro",
    darkGlass: "Cristal",
    dataBackup: "Copia de Seguridad y Restauración",
    dataDesc: "Exporta tus marcadores, tareas y notas a un archivo JSON, o importa una copia de seguridad para restaurar tus datos por completo.",
    exportBackup: "Exportar Copia (Crear Punto de Restauración)",
    importBackup: "Importar Copia (Restaurar a este Punto)",
    resetTitle: "Restablecer por Defecto",
    resetDesc: "Restablece todo el tablero a su estado de fábrica original. ¡Esto eliminará permanentemente todos tus temas, fondos, marcadores, tareas y notas!",
    resetButton: "Restablecer y Limpiar Todos los Datos",
    aboutTitle: "Sobre Nosotros",
    aboutDesc: "Descubre nuestra historia",
    aboutWelcome: "Bienvenido a GeekTabs",
    aboutText1: "GeekTabs fue creado con una misión sencilla: transformar la aburrida página de \"nueva pestaña\" en un panel hermoso, personalizado y altamente funcional. Creemos que tu entorno digital influye profundamente en tu productividad y creatividad.",
    aboutText2: "Con un enfoque en el diseño limpio, características pensadas y una amplia personalización, GeekTabs se sitúa al inicio de tu viaje por la web. Ya sea que necesites inspiración diaria, organizar tus tareas o simplemente un reloj elegante para mantenerte enfocado, te tenemos cubierto.",
    supportContact: "Soporte y Contacto",
    restoreSuccess: "¡Copia de seguridad restaurada con éxito! La página se recargará ahora.",
    invalidBackup: "Archivo de copia de seguridad no válido.",
    failParse: "Error al analizar el archivo de copia de seguridad.",
    modalTitle: "¿Restablecer todos los datos?",
    modalMessage: "Esta acción es irreversible. Esto eliminará permanentemente todos sus ajustes personalizados, marcadores, tareas y notas. La página se recargará después de restablecer.",
    modalConfirm: "Confirmar",
    modalCancel: "Cancelar"
  },
  French: {
    title: "PARAMÈTRES",
    generalSettings: "Paramètres Généraux",
    managePreferences: "Gérer les préférences de base",
    customBoardName: "Nom de Tableau Personnalisé",
    boardNameDesc: "Ce nom s'affichera comme une signature de marque élégante sur la page d'accueil. Par défaut, un message d'accueil lié à l'heure (Bonjour / Bon Après-midi / Bonsoir).",
    defaultPlaceholder: "Par défaut : ",
    save: "Enregistrer",
    saved: "Enregistré",
    languageSelection: "Sélection de la Langue",
    langDesc: "Choisissez votre langue préférée pour les widgets et contrôles.",
    cardStyle: "Style de Fond de Carte",
    cardDesc: "Choisissez entre Clair (blanc), Sombre (noir) ou Verre (verre dépoli).",
    whiteBg: "Clair",
    darkBg: "Sombre",
    darkGlass: "Verre",
    dataBackup: "Sauvegarde et Restauration",
    dataDesc: "Exportez vos signets, tâches et notes dans un fichier JSON, ou importez une sauvegarde enregistrée pour restaurer complètement vos données.",
    exportBackup: "Exporter la Sauvegarde (Créer Point de Restauration)",
    importBackup: "Importer la Sauvegarde (Restaurer au Point)",
    resetTitle: "Réinitialiser par Défaut",
    resetDesc: "Réinitialisez l'ensemble du tableau de bord à ses paramètres d'usine d'origine. Cela supprimera définitivement tous vos thèmes, fonds d'écran, signets, tâches et notes !",
    resetButton: "Réinitialiser et Effacer Toutes les Données",
    aboutTitle: "À Propos de Nous",
    aboutDesc: "Découvrez notre histoire",
    aboutWelcome: "Bienvenue sur GeekTabs",
    aboutText1: "GeekTabs a été conçu avec une mission simple : transformer la page de \"nouvel onglet\" banale en un tableau de bord magnifique, personnalisé et hautement fonctionnel. Nous pensons que votre environnement numérique influence profondément votre productivité et votre créativité.",
    aboutText2: "Mettant l'accent sur un design épuré, des fonctionnalités réfléchies et une personnalisation poussée, GeekTabs se place au tout début de votre voyage sur le Web. Que vous ayez besoin d'inspiration quotidienne, d'un espace pour organiser vos tâches ou simplement d'une horloge élégante pour garder les pieds sur terre, nous avons ce qu'il vous faut.",
    supportContact: "Support & Contact",
    restoreSuccess: "Sauvegarde restaurée avec succès ! La page va maintenant se recharger.",
    invalidBackup: "Fichier de sauvegarde invalide.",
    failParse: "Échec de l'analyse du fichier de sauvegarde.",
    modalTitle: "Réinitialiser toutes les données ?",
    modalMessage: "Cette action est irréversible. Cela supprimera définitivement tous vos paramètres personnalisés, vos signets, vos tâches et vos notes. La page se rechargera après la réinitialisation.",
    modalConfirm: "Confirmer",
    modalCancel: "Annuler"
  },
  German: {
    title: "EINSTELLUNGEN",
    generalSettings: "Allgemeine Einstellungen",
    managePreferences: "Grundlegende Einstellungen verwalten",
    customBoardName: "Benutzerdefinierter Boardname",
    boardNameDesc: "Dieser Name wird als elegante Signatur auf der Startseite angezeigt. Standardmäßig wird eine zeitabhängige Begrüßung verwendet (Guten Morgen / Guten Tag / Guten Abend).",
    defaultPlaceholder: "Standard: ",
    save: "Speichern",
    saved: "Gespeichert",
    languageSelection: "Sprachauswahl",
    langDesc: "Wählen Sie Ihre bevorzugte Sprache für Widgets und Steuerelemente.",
    cardStyle: "Karten-Hintergrundstil",
    cardDesc: "Wählen Sie zwischen Hell (Weiß), Dunkel (Schwarz) oder Glas (Milchglas).",
    whiteBg: "Hell",
    darkBg: "Dunkel",
    darkGlass: "Glas",
    dataBackup: "Datensicherung & Wiederherstellung",
    dataDesc: "Exportieren Sie Ihre Lesezeichen, Aufgaben und Notizen in eine JSON-Datei oder importieren Sie ein zuvor gespeichertes Backup, um Ihre Daten vollständig wiederherzustellen.",
    exportBackup: "Backup exportieren (Wiederherstellungspunkt erstellen)",
    importBackup: "Backup importieren (Auf Punkt wiederherstellen)",
    resetTitle: "Auf Standard zurücksetzen",
    resetDesc: "Setzen Sie das gesamte Dashboard auf die ursprünglichen Werkseinstellungen zurück. Dadurch werden alle Ihre benutzerdefinierten Designs, Hintergründe, Lesezeichen, Aufgaben und Notizen dauerhaft gelöscht!",
    resetButton: "Zurücksetzen & alle Daten löschen",
    aboutTitle: "Über Uns",
    aboutDesc: "Entdecken Sie unsere Geschichte",
    aboutWelcome: "Willkommen bei GeekTabs",
    aboutText1: "GeekTabs wurde mit einer einfachen Mission entwickelt: Die alltägliche \"Neue Registerkarte\"-Seite in ein schönes, personalisiertes und hochfunktionales Dashboard zu verwandeln. Wir glauben, dass Ihre digitale Umgebung Ihre Produktivität und Kreativität stark beeinflusst.",
    aboutText2: "Mit Fokus auf klares Design, durchdachte Funktionen und umfassende Anpassungsmöglichkeiten steht GeekTabs direkt am Anfang Ihrer Reise durchs Web. Egal, ob Sie tägliche Inspiration benötigen, Ihre Aufgaben organisieren möchten oder einfach nur eine elegante Uhr suchen – wir haben die passende Lösung.",
    supportContact: "Support & Kontakt",
    restoreSuccess: "Backup erfolgreich wiederhergestellt! Die Seite wird nun neu geladen.",
    invalidBackup: "Ungültige Backup-Datei.",
    failParse: "Fehler beim Parsen der Backup-Datei.",
    modalTitle: "Alle Daten zurücksetzen?",
    modalMessage: "Diese Aktion kann nicht rückgängig gemacht werden. Dadurch werden alle Ihre benutzerdefinierten Einstellungen, Lesezeichen, Aufgaben und Notizen dauerhaft gelöscht. Die Seite wird nach dem Zurücksetzen neu geladen.",
    modalConfirm: "Bestätigen",
    modalCancel: "Abbrechen"
  },
  Japanese: {
    title: "設定",
    generalSettings: "一般設定",
    managePreferences: "基本的な設定を管理",
    customBoardName: "カスタムボード名",
    boardNameDesc: "この名前は、ホームページ上にエレガントなブランド署名として表示されます。デフォルトは時間帯に応じた挨拶です（おはようございます / こんにちは / こんばんは）。",
    defaultPlaceholder: "デフォルト: ",
    save: "保存",
    saved: "保存されました",
    languageSelection: "言語選択",
    langDesc: "ウィジェットとコントロールに適用するお好みの言語を選択してください。",
    cardStyle: "カード背景スタイル",
    cardDesc: "ライト（白）、ダーク（黒）、またはグラス（すりガラス）スタイルを選択します。",
    whiteBg: "ライト",
    darkBg: "ダーク",
    darkGlass: "グラス",
    dataBackup: "データのバックアップと復元（復元ポイント）",
    dataDesc: "すべてのブックマーク、やることリスト、メモデータをエクスポートするか、以前に保存したJSONバックアップファイルをインポートして元の状態に復元します。",
    exportBackup: "バックアップをエクスポート (復元ポイント作成)",
    importBackup: "バックアップをインポート (ポイントに復元)",
    resetTitle: "デフォルトにリセット",
    resetDesc: "ダッシュボード全体を初期状態にリセットします。カスタムテーマ、壁紙、ブックマーク、タスク、メモデータがすべて永久に削除されます！",
    resetButton: "リセットしてすべてのデータを消去",
    aboutTitle: "私たちについて",
    aboutDesc: "私たちのストーリー",
    aboutWelcome: "GeekTabsへようこそ",
    aboutText1: "GeekTabsは、ありふれた「新しいタブ」ページを美しく、パーソナライズされ、非常に機能的なダッシュボードに変換するというシンプルな使命のもとに構築されました。私たちは、デジタルの環境がお客様の生産性や創造性に深く影響を及ぼすと信じています。",
    aboutText2: "クリーンなデザイン、気の利いた機能、そして豊富なカスタマイズ性に重点を置いたGeekTabsは、ウェブを巡る旅のスタート地点に位置しています。毎日のインスピレーションが必要なときも、タスクを整理したいときも、あるいは心を落ち着かせるエレガントな時計が必要なときも、私たちがサポートします。",
    supportContact: "サポート＆お問い合わせ",
    restoreSuccess: "バックアップが正常に復元されました！ページを再読み込みします。",
    invalidBackup: "無効なバックアップファイルです。",
    failParse: "バックアップファイルの解析に失敗しました。",
    modalTitle: "すべてのデータをリセットしますか？",
    modalMessage: "この操作は取り消せません。カスタム設定、ブックマーク、やることリスト、メモがすべて永久に削除されます。リセット後にページが再読み込みされます。",
    modalConfirm: "リセットする",
    modalCancel: "キャンセル"
  },
  Korean: {
    title: "설정",
    generalSettings: "일반 설정",
    managePreferences: "기본 환경 설정 관리",
    customBoardName: "사용자 지정 보드 이름",
    boardNameDesc: "이 이름은 홈 페이지에 우아한 브랜드 서명으로 표시됩니다. 기본값은 시간대별 인사말입니다 (좋은 아침 / 좋은 오후 / 좋은 저녁).",
    defaultPlaceholder: "기본값: ",
    save: "저장",
    saved: "저장됨",
    languageSelection: "언어 선택",
    langDesc: "위젯 및 제어판에 사용할 선호 언어를 선택하세요.",
    cardStyle: "카드 배경 스타일",
    cardDesc: "라이트(화이트), 다크(블랙), 글래스(프로스트 유리) 스타일 중 선택하세요.",
    whiteBg: "라이트",
    darkBg: "다크",
    darkGlass: "글래스",
    dataBackup: "데이터 백업 및 복원 (복원 지점)",
    dataDesc: "북마크, 할 일 목록, 메모 데이터를 JSON 파일로 내보내거나, 이전에 저장한 백업 파일을 가져와 완전히 복원하세요.",
    exportBackup: "백업 내보내기 (복원 지점 생성)",
    importBackup: "백업 가져오기 (지점으로 복원)",
    resetTitle: "기본값으로 초기화",
    resetDesc: "대시보드 전체를 공장 초기 상태로 되돌립니다. 사용자 지정 테마, 배경화면, 북마크, 할 일 및 메모가 모두 영구적으로 삭제됩니다!",
    resetButton: "초기화 및 모든 데이터 지우기",
    aboutTitle: "소개",
    aboutDesc: "우리의 이야기",
    aboutWelcome: "GeekTabs에 오신 것을 환영합니다",
    aboutText1: "GeekTabs는 평범한 '새 탭' 페이지를 아름답고 개성 넘치며 기능적인 대시보드로 탈바꿈시키겠다는 단순한 목표로 제작되었습니다.",
    aboutText2: "깔끔한 디자인과 정성 어린 기능, 폭넓은 커스터마이징을 통해 웹 여정의 시작을 함께합니다.",
    supportContact: "지원 및 문의",
    restoreSuccess: "백업이 성공적으로 복원되었습니다! 페이지가 새로고침됩니다.",
    invalidBackup: "유효하지 않은 백업 파일입니다.",
    failParse: "백업 파일 파싱에 실패했습니다.",
    modalTitle: "모든 데이터를 초기화하시겠습니까?",
    modalMessage: "이 작업은 되돌릴 수 없습니다. 모든 사용자 지정 설정, 북마크, 할 일 목록 및 메모가 영구적으로 삭제됩니다.",
    modalConfirm: "초기화 확인",
    modalCancel: "취소"
  },
  Italian: {
    title: "IMPOSTAZIONI",
    generalSettings: "Impostazioni Generali",
    managePreferences: "Gestisci preferenze di base",
    customBoardName: "Nome Bacheca Personalizzato",
    boardNameDesc: "Questo nome verrà mostrato come firma elegante sulla home page.",
    defaultPlaceholder: "Predefinito: ",
    save: "Salva",
    saved: "Salvato",
    languageSelection: "Selezione Lingua",
    langDesc: "Scegli la lingua preferita per widget e controlli.",
    cardStyle: "Stile Sfondo Scheda",
    cardDesc: "Scegli tra Chiaro (bianco), Scuro (nero) o Vetro (vetro satinato).",
    whiteBg: "Chiaro",
    darkBg: "Scuro",
    darkGlass: "Vetro",
    dataBackup: "Backup e Ripristino Dati",
    dataDesc: "Esporta o importa i tuoi dati in un file JSON.",
    exportBackup: "Esporta Backup",
    importBackup: "Importa Backup",
    resetTitle: "Ripristina Predefiniti",
    resetDesc: "Ripristina tutte le impostazioni originali di fabbrica.",
    resetButton: "Ripristina e Cancella Dati",
    aboutTitle: "Chi Siamo",
    aboutDesc: "Scopri la nostra storia",
    aboutWelcome: "Benvenuti su GeekTabs",
    aboutText1: "GeekTabs è stato creato per trasformare la nuova scheda in una bacheca moderna e funzionale.",
    aboutText2: "Design pulito e ampia personalizzazione.",
    supportContact: "Supporto e Contatti",
    restoreSuccess: "Backup ripristinato con successo! La pagina verrà ricaricata.",
    invalidBackup: "File di backup non valido.",
    failParse: "Impossibile analizzare il file di backup.",
    modalTitle: "Ripristinare tutti i dati?",
    modalMessage: "Questa operazione è irreversibile.",
    modalConfirm: "Conferma Ripristino",
    modalCancel: "Annulla"
  },
  Russian: {
    title: "НАСТРОЙКИ",
    generalSettings: "Основные настройки",
    managePreferences: "Управление основными параметрами",
    customBoardName: "Название панели",
    boardNameDesc: "Это имя будет отображаться в качестве элегантной подписи на главной странице.",
    defaultPlaceholder: "По умолчанию: ",
    save: "Сохранить",
    saved: "Сохранено",
    languageSelection: "Выбор языка",
    langDesc: "Выберите предпочитаемый язык интерфейса.",
    cardStyle: "Стиль фона карточек",
    cardDesc: "Выберите стиль карточек: Светлая (белый), Тёмная (чёрный) или Стекло (матовое стекло).",
    whiteBg: "Светлая",
    darkBg: "Тёмная",
    darkGlass: "Стекло",
    dataBackup: "Резервное копирование и восстановление",
    dataDesc: "Экспортируйте или импортируйте данные в формате JSON.",
    exportBackup: "Экспорт резервной копии",
    importBackup: "Импорт резервной копии",
    resetTitle: "Сброс к настройкам по умолчанию",
    resetDesc: "Сбросить всю панель к исходным заводским настройкам.",
    resetButton: "Сбросить и удалить данные",
    aboutTitle: "О нас",
    aboutDesc: "Узнайте нашу историю",
    aboutWelcome: "Добро пожаловать в GeekTabs",
    aboutText1: "GeekTabs создан для превращения страницы новой вкладки в стильную и полезную панель.",
    aboutText2: "Лаконичный дизайн и гибкие настройки.",
    supportContact: "Поддержка и контакты",
    restoreSuccess: "Резервная копия успешно восстановлена!",
    invalidBackup: "Неверный файл резервной копии.",
    failParse: "Ошибка при чтении файла.",
    modalTitle: "Сбросить все данные?",
    modalMessage: "Это действие необратимо.",
    modalConfirm: "Подтвердить сброс",
    modalCancel: "Отмена"
  },
  Luxembourgish: {
    title: "Astellunge",
    generalSettings: "Allgemeng Astellungen",
    managePreferences: "Basispreferenzen verwalten",
    customBoardName: "Benotzerdefinéierten Numm",
    boardNameDesc: "Dësen Numm gëtt op der Haaptsäit ugewisen.",
    defaultPlaceholder: "Standard: ",
    save: "Späicheren",
    saved: "Gespäichert",
    languageSelection: "Sproochauswiel",
    langDesc: "Wielt Är Sprooch fir Widgets a Kontrollen.",
    cardStyle: "Kaarte-Hannergrondstil",
    cardDesc: "Wielt tëscht Hell (wäiss), Däischter (schwaarz) oder Glas.",
    whiteBg: "Hell",
    darkBg: "Däischter",
    darkGlass: "Glas",
    dataBackup: "Datesécherung & Erhuelung",
    dataDesc: "Exportéiert oder importéiert Är Donnéeën an eng JSON Datei.",
    exportBackup: "Backup exportéieren",
    importBackup: "Backup importéieren",
    resetTitle: "Op Standard zrécksetzen",
    resetDesc: "Setzt de ganzen Dashboard op d'Fabrécksastellungen zréck.",
    resetButton: "Zrécksetzen & Daten läschen",
    aboutTitle: "Iwwer eis",
    aboutDesc: "Entdeckt eis Geschicht",
    aboutWelcome: "Wëllkomm bei GeekTabs",
    aboutText1: "GeekTabs mécht Ären neien Tab zu engem schéinen an nëtzlechen Dashboard.",
    aboutText2: "Kloert Design a flexibel Funktiounen.",
    supportContact: "Support & Kontakt",
    restoreSuccess: "Backup erfollegräich hiergestallt!",
    invalidBackup: "Ongëlteg Backup-Datei.",
    failParse: "Feeler beim Liesen vun der Datei.",
    modalTitle: "All Donnéeën zrécksetzen?",
    modalMessage: "Dës Aktioun kann net réckgängeg gemaach ginn.",
    modalConfirm: "Bestätegen",
    modalCancel: "Ofbriechen"
  }
};

interface SettingsDropdownOption {
  value: string;
  label: string;
}

interface SettingsDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: SettingsDropdownOption[];
  isDarkGlass: boolean;
}

function SettingsDropdown({ value, onChange, options, isDarkGlass }: SettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full max-w-xs select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`settings-dropdown w-full flex items-center justify-between rounded-xl px-4 py-2.5 font-semibold text-sm transition-all outline-none cursor-pointer text-left bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-300 text-slate-900 shadow-sm ${isOpen ? 'ring-2 ring-indigo-500 border-transparent' : ''}`}
      >
        <span className="truncate pr-2 text-slate-900">{selectedOption?.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-200 text-neutral-600 ${isOpen ? 'rotate-180 text-indigo-500 opacity-100' : 'opacity-70'}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="settings-dropdown-menu absolute left-0 right-0 top-full mt-2 z-50 max-h-64 overflow-y-auto rounded-2xl p-1.5 shadow-xl focus:outline-none bg-white border border-neutral-200 text-slate-900"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'settings-option-selected bg-indigo-500 text-white font-bold'
                      : 'text-slate-700 hover:bg-black/5 hover:text-black'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check
                      size={16}
                      className="text-white shrink-0 ml-2"
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SettingsTab({
  currentTheme,
  setTheme,
  isDarkMode,
  customWallpapers,
  setCustomWallpapers,
  language,
  setLanguage,
  cardBgMode,
  setCardBgMode,
  textColor,
  setTextColor
}: SettingsTabProps) {
  const [internalTextColor, setInternalTextColor] = useLocalStorage('GeekTabs-text-color', 'default');
  const activeTextColor = textColor ?? internalTextColor;
  const handleSetTextColor = setTextColor ?? setInternalTextColor;

  const getGreetingByTime = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return t(language, 'good_morning');
    } else if (hour >= 12 && hour < 18) {
      return t(language, 'good_afternoon');
    } else {
      return t(language, 'good_evening');
    }
  };

  const [activeTab, setActiveTab] = useState<'general' | 'color' | 'wallpaper' | 'text' | 'browser' | 'download' | 'weather' | 'about'>('general');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pageName, setPageName] = useLocalStorage('GeekTabs-page-name', '');
  const [localName, setLocalName] = useState(() => {
    const initial = pageName && pageName !== 'have a good day' ? pageName : getGreetingByTime();
    if (initial === 'Good morning') return 'Good Morning';
    if (initial === 'Good afternoon') return 'Good Afternoon';
    if (initial === 'Good evening') return 'Good Evening';
    if (initial === 'Buenos días') return 'Buenos Días';
    if (initial === 'Buenas tardes') return 'Buenas Tardes';
    if (initial === 'Buenas noches') return 'Buenas Noches';
    return initial;
  });
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (pageName === 'Good morning') setPageName('Good Morning');
    else if (pageName === 'Good afternoon') setPageName('Good Afternoon');
    else if (pageName === 'Good evening') setPageName('Good Evening');
    else if (pageName === 'Buenos días') setPageName('Buenos Días');
    else if (pageName === 'Buenas tardes') setPageName('Buenas Tardes');
    else if (pageName === 'Buenas noches') setPageName('Buenas Noches');
  }, [pageName, setPageName]);

  const tData = SETTINGS_T[language] || SETTINGS_T['English'];
  const isDarkGlass = cardBgMode === 'dark-glass';

  const languageOptions: SettingsDropdownOption[] = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Korean', label: 'Korean' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Russian', label: 'Russian' },
    { value: 'Luxembourgish', label: 'Luxembourgish' },
  ];

  const cardStyleOptions: SettingsDropdownOption[] = [
    { value: 'white', label: tData.whiteBg },
    { value: 'dark', label: tData.darkBg },
    { value: 'dark-glass', label: tData.darkGlass },
  ];

  const handleSave = () => {
    setPageName(localName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    const defaultGreeting = getGreetingByTime();
    setLocalName(defaultGreeting);
    setPageName('');
  };

  const handleExportData = () => {
    try {
      const bookmarks = localStorage.getItem('GeekTabs-link-categories');
      const todo = localStorage.getItem('GeekTabs-tasks');
      const notesSections = localStorage.getItem('GeekTabs-one-sections');
      const notesList = localStorage.getItem('GeekTabs-one-notes');

      const exportObj = {
        bookmarks: bookmarks ? JSON.parse(bookmarks) : null,
        todo: todo ? JSON.parse(todo) : null,
        notes: {
          sections: notesSections ? JSON.parse(notesSections) : null,
          notes: notesList ? JSON.parse(notesList) : null
        },
        exportedAt: new Date().toISOString(),
        appName: "GeekTabs"
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `GeekTabs_Backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importObj = JSON.parse(event.target?.result as string);
        if (importObj.appName === "GeekTabs") {
          if (importObj.bookmarks) localStorage.setItem('GeekTabs-link-categories', JSON.stringify(importObj.bookmarks));
          if (importObj.todo) localStorage.setItem('GeekTabs-tasks', JSON.stringify(importObj.todo));
          if (importObj.notes?.sections) localStorage.setItem('GeekTabs-one-sections', JSON.stringify(importObj.notes.sections));
          if (importObj.notes?.notes) localStorage.setItem('GeekTabs-one-notes', JSON.stringify(importObj.notes.notes));
          alert(tData.restoreSuccess);
          window.location.reload();
        } else {
          alert(tData.invalidBackup);
        }
      } catch (err) {
        console.error(err);
        alert(tData.failParse);
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefault = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('GeekTabs-') || key.startsWith('tabgy-'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    localStorage.removeItem('GeekTabs-theme');
    localStorage.removeItem('GeekTabs-dark-mode');
    
    setShowResetConfirm(false);
    window.location.reload();
  };

  const navItems = [
    { id: 'general' as const, label: t(language, 'general'), icon: Layout },
    { id: 'color' as const, label: t(language, 'color'), icon: Palette },
    { id: 'wallpaper' as const, label: t(language, 'wallpaper'), icon: ImageIcon },
    { id: 'text' as const, label: t(language, 'text'), icon: Type },
    { id: 'browser' as const, label: t(language, 'browser'), icon: Compass },
    { id: 'download' as const, label: t(language, 'download_app'), icon: Download },
    { id: 'weather' as const, label: t(language, 'weather'), icon: CloudSun },
    { id: 'about' as const, label: t(language, 'about_us'), icon: Info },
  ];

  const currentNav = navItems.find(i => i.id === activeTab) || navItems[0];
  const CurrentIcon = currentNav.icon;

  return (
    <div className="settings-tab-card w-full h-full flex flex-row overflow-hidden relative z-10 backdrop-blur-2xl bg-white/70 dark:bg-[#0c1017]/80 text-slate-800 dark:text-slate-100">
      
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (Gemini Chat Style) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 md:w-80 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shrink-0 h-full flex flex-col border-r border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0e131d]/95 md:bg-black/[0.02] md:dark:bg-black/30 backdrop-blur-2xl ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top of Sidebar - Mobile close button only */}
        <div className="md:hidden flex items-center justify-end p-3 border-b border-black/10 dark:border-white/10">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            title="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items (Pill Buttons) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
          <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/35">
            Preferences
          </div>
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer select-none text-left ${
                  isActive
                    ? 'settings-nav-active-btn bg-indigo-500 hover:bg-indigo-600 !text-white text-white shadow-sm shadow-indigo-500/25'
                    : 'text-slate-700 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-white'
                }`}
                style={isActive ? { color: '#ffffff' } : undefined}
              >
                <IconComp
                  size={16}
                  className={`shrink-0 ${isActive ? 'text-white' : 'opacity-70'}`}
                  style={isActive ? { stroke: '#ffffff', color: '#ffffff' } : undefined}
                />
                <span
                  className={`truncate ${isActive ? '!text-white text-white font-bold' : ''}`}
                  style={isActive ? { color: '#ffffff', WebkitTextFillColor: '#ffffff' } : undefined}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-black/10 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-white/45 flex items-center justify-between select-none">
          <span className="text-[11px] uppercase tracking-wider font-bold">
            {language}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5">
            {cardBgMode === 'dark' ? tData.darkBg : cardBgMode === 'dark-glass' ? tData.darkGlass : tData.whiteBg}
          </span>
        </div>
      </aside>

      {/* RIGHT CONTENT PANE - Always Pure Solid White */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-white text-slate-900">
        
        {/* Workspace Top Header Bar */}
        <header className="h-16 px-6 sm:px-8 border-b border-black/10 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3 min-w-[40px]">
            {/* Mobile Hamburger to trigger Sidebar */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl hover:bg-black/5 text-slate-700 transition-colors cursor-pointer"
              title="Open Navigation"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Centered preference title at top */}
          <div className="flex items-center justify-center gap-2">
            <CurrentIcon size={18} className="text-[#5438dc] shrink-0" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
              {currentNav.label}
            </h2>
          </div>

          <div className="flex items-center justify-end min-w-[40px]">
            {saved ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 text-xs font-bold border border-emerald-500/20">
                <Check size={14} />
                <span>{tData.saved}</span>
              </div>
            ) : (
              <div className="w-10 pointer-events-none" />
            )}
          </div>
        </header>

        {/* Main Settings Content Area - Always Pure Solid White */}
        <main className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-16 py-6 sm:py-8 bg-white text-slate-900">
          <div className="max-w-4xl space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'general' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 sm:space-y-8"
                >
                  <div className="text-center flex flex-col items-center">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">
                      {tData.generalSettings}
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                      {tData.managePreferences}
                    </p>
                  </div>

                  <div className="space-y-6 sm:space-y-8 divide-y divide-black/5">
                    {/* Board Name */}
                    <div className="py-2 sm:py-4">
                      <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">
                        {tData.customBoardName}
                      </label>
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed max-w-2xl">
                        {tData.boardNameDesc}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-lg">
                        <input
                          type="text"
                          value={localName}
                          onChange={(e) => setLocalName(e.target.value)}
                          className="settings-input w-full sm:flex-1 min-w-0 bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold transition-all shadow-sm"
                          placeholder={`${tData.defaultPlaceholder}${getGreetingByTime()}`}
                        />
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={handleSave}
                            className="flex-1 sm:flex-initial px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 !text-white text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                            style={{ color: '#ffffff' }}
                          >
                            {saved ? (
                              <>
                                <Check size={14} className="!text-white text-white" style={{ color: '#ffffff', stroke: '#ffffff' }} />
                                {tData.saved}
                              </>
                            ) : (
                              tData.save
                            )}
                          </button>
                          
                          <button
                            onClick={handleDelete}
                            className="p-2.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                            title="Remove Name"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Language Selection */}
                    <div className="pt-6 pb-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 mb-2 flex items-center gap-2">
                        <Globe size={14} />
                        {tData.languageSelection}
                      </label>
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed max-w-2xl">
                        {tData.langDesc}
                      </p>
                      <div className="mb-4">
                        <SettingsDropdown
                          value={language}
                          onChange={setLanguage}
                          options={languageOptions}
                          isDarkGlass={isDarkGlass}
                        />
                      </div>
                    </div>

                    {/* Card Style */}
                    <div className="pt-6 pb-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 mb-2 flex items-center gap-2">
                        <Layout size={14} />
                        {tData.cardStyle}
                      </label>
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed max-w-2xl">
                        {tData.cardDesc}
                      </p>
                      <div className="mb-4">
                        <SettingsDropdown
                          value={cardBgMode}
                          onChange={(val) => setCardBgMode(val as 'white' | 'dark' | 'dark-glass')}
                          options={cardStyleOptions}
                          isDarkGlass={isDarkGlass}
                        />
                      </div>
                    </div>

                    {/* Export & Import (Restore) Section */}
                    <div className="pt-6 pb-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 mb-2 flex items-center gap-2">
                        <Download size={14} />
                        {tData.dataBackup}
                      </label>
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed max-w-2xl">
                        {tData.dataDesc}
                      </p>
                      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                        <button
                          onClick={handleExportData}
                          className="w-full sm:w-auto px-5 py-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                          <Download size={14} />
                          {tData.exportBackup}
                        </button>
                        
                        <label 
                          className="settings-backup-import-btn w-full sm:w-auto px-5 py-3 bg-indigo-500 hover:bg-indigo-600 !text-white text-white border border-transparent rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm select-none"
                          style={{ color: '#ffffff' }}
                        >
                          <RotateCcw size={14} className="!text-white text-white shrink-0" style={{ color: '#ffffff', stroke: '#ffffff' }} />
                          <span className="!text-white text-white font-bold" style={{ color: '#ffffff' }}>
                            {tData.importBackup}
                          </span>
                          <input 
                            type="file" 
                            accept=".json" 
                            onChange={handleImportData} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    </div>

                    {/* Reset to Default Section */}
                    <div className="pt-6 pb-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-red-600 mb-2 flex items-center gap-2">
                        <RotateCcw size={14} />
                        {tData.resetTitle}
                      </label>
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed max-w-2xl">
                        {tData.resetDesc}
                      </p>
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="w-full sm:w-auto px-5 py-3 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200/50 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <RotateCcw size={14} />
                        {tData.resetButton}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'color' && (
                <motion.div
                  key="color"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ThemesTab
                    currentTheme={currentTheme}
                    setTheme={setTheme}
                    isDarkMode={isDarkMode}
                    language={language}
                    cardBgMode={cardBgMode}
                  />
                </motion.div>
              )}

              {activeTab === 'wallpaper' && (
                <motion.div
                  key="wallpaper"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <WallpapersTab
                    customWallpapers={customWallpapers}
                    setCustomWallpapers={setCustomWallpapers}
                    currentTheme={currentTheme}
                    setTheme={setTheme}
                    isDarkMode={isDarkMode}
                    language={language}
                    cardBgMode={cardBgMode}
                  />
                </motion.div>
              )}

              {activeTab === 'text' && (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TextTab
                    textColor={activeTextColor}
                    setTextColor={handleSetTextColor}
                    currentTheme={currentTheme}
                    isDarkMode={isDarkMode}
                    language={language}
                    cardBgMode={cardBgMode}
                  />
                </motion.div>
              )}

              {activeTab === 'browser' && (
                <motion.div
                  key="browser"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <BrowserTab language={language} />
                </motion.div>
              )}

              {activeTab === 'download' && (
                <motion.div
                  key="download"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DownloadAppTab language={language} />
                </motion.div>
              )}

              {activeTab === 'weather' && (
                <motion.div
                  key="weather"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <WeatherSettingsTab language={language} />
                </motion.div>
              )}

              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="text-center flex flex-col items-center">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">
                      {tData.aboutTitle}
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                      {tData.aboutDesc}
                    </p>
                  </div>

                  <div className="space-y-6 max-w-3xl divide-y divide-black/5">
                    <div className="py-4">
                      <h3 className="text-lg font-bold text-slate-900 mb-3">
                        {tData.aboutWelcome}
                      </h3>
                      <p className="text-slate-700 text-sm leading-relaxed mb-4">
                        {tData.aboutText1}
                      </p>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {tData.aboutText2}
                      </p>
                    </div>
                    <div className="pt-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        {tData.supportContact}
                      </p>
                      <a href="mailto:support@geektabs.com" className="text-indigo-500 hover:underline font-bold text-sm">
                        support@geektabs.com
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={showResetConfirm}
        title={tData.modalTitle}
        message={tData.modalMessage}
        confirmText={tData.modalConfirm}
        cancelText={tData.modalCancel}
        onConfirm={handleResetToDefault}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
