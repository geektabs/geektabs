import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, Palette, Image as ImageIcon, Layout, Check, Trash2, Info, Globe, Compass, Download, RotateCcw, Type, Sparkles, ChevronDown, CloudSun } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ThemesTab from './ThemesTab';
import WallpapersTab from './WallpapersTab';
import TextTab from './TextTab';
import BrowserTab from './BrowserTab';
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
  cardBgMode: 'white' | 'dark-glass';
  setCardBgMode: (mode: 'white' | 'dark-glass') => void;
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
    cardDesc: "Choose between classic white cards or transparent glass cards with modern depth.",
    whiteBg: "White Background (Default)",
    darkGlass: "Transparent Glass Style",
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
    cardDesc: "在经典白色卡片与晶莹通透的透明玻璃卡片之间进行选择。",
    whiteBg: "白色背景 (默认)",
    darkGlass: "透明玻璃风格",
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
    cardDesc: "Elige el color de fondo y estilo para todas las tarjetas de la página.",
    whiteBg: "Fondo Blanco (Por defecto)",
    darkGlass: "Estilo de Vidrio Transparente",
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
    cardDesc: "Choisissez la couleur de fond et le style de toutes les cartes de la page.",
    whiteBg: "Fond Blanc (Par défaut)",
    darkGlass: "Style Verre Transparent",
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
    cardDesc: "Wählen Sie die Hintergrundfarbe und den Stil für alle Webkarten der Seite.",
    whiteBg: "Weißer Hintergrund (Standard)",
    darkGlass: "Transparenter Glasstil",
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
    cardDesc: "すべてのページカードの背景色と表示スタイルを選択します。",
    whiteBg: "白背景 (デフォルト)",
    darkGlass: "透明ガラススタイル",
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
    langDesc: "위젯 및 제어 컨트롤에 적용할 선호 언어를 선택하세요.",
    cardStyle: "카드 배경 스타일",
    cardDesc: "모든 페이지 웹 카드의 배경색과 표시 스타일을 설정합니다.",
    whiteBg: "흰색 배경 (기본값)",
    darkGlass: "투명 글래스 스타일",
    dataBackup: "데이터 백업 및 복원 (복원 지점)",
    dataDesc: "모든 북마크, 할 일 목록, 개인 노트를 JSON 파일로 내보내거나, 이전에 저장한 백업 파일을 불러와서 데이터를 완전히 복원합니다.",
    exportBackup: "백업 내보내기 (복원 지점 생성)",
    importBackup: "백업 불러오기 (해당 지점으로 복원)",
    resetTitle: "기본값으로 리셋",
    resetDesc: "전체 대시보드를 초기 기본 설정으로 되돌립니다. 사용자 정의 테마, 배경화면, 북마크, 작업 및 메모가 모두 영구적으로 삭제됩니다!",
    resetButton: "리셋 및 모든 데이터 소거",
    aboutTitle: "소개",
    aboutDesc: "우리의 이야기 발견하기",
    aboutWelcome: "GeekTabs에 오신 것을 환영합니다",
    aboutText1: "GeekTabs는 평범한 '새 탭' 페이지를 아름답고 개인화되며 고도로 기능적인 대시보드로 바꾼다는 단순한 사명으로 만들어졌습니다. 우리는 디지털 환경이 사용자의 생산성과 창의성에 깊은 영향을 미친다고 믿습니다.",
    aboutText2: "깔끔한 디자인, 세심한 기능, 광범위한 맞춤 설정에 집중한 GeekTabs는 웹 전반에 걸친 사용자의 여정 바로 시작점에 자리하고 있습니다. 매일의 영감이 필요하든, 작업을 구성할 장소가 필요하든, 차분함을 유지해줄 우아한 시계가 필요하든 모두 준비되어 있습니다.",
    supportContact: "지원 및 문의",
    restoreSuccess: "백업이 성공적으로 복원되었습니다! 페이지가 곧 새로고침됩니다.",
    invalidBackup: "유효하지 않은 백업 파일입니다.",
    failParse: "백업 파일 구문 분석에 실패했습니다.",
    modalTitle: "모든 데이터를 리셋하시겠습니까?",
    modalMessage: "이 작업은 되돌릴 수 없습니다. 모든 사용자 정의 설정, 북마크, 할 일 목록 및 노트가 영구적으로 삭제됩니다. 리셋 후 페이지가 새로고침됩니다.",
    modalConfirm: "리셋 확인",
    modalCancel: "취소"
  },
  Italian: {
    title: "IMPOSTAZIONI",
    generalSettings: "Impostazioni Generali",
    managePreferences: "Gestisci preferenze di base",
    customBoardName: "Nome Lavagna Personalizzato",
    boardNameDesc: "Questo nome verrà visualizzato como una firma elegante del marchio sulla home page. Per impostazione predefinita viene mostrato un saluto basato sull'orario (Buongiorno / Buon Pomeriggio / Buonasera).",
    defaultPlaceholder: "Predefinito: ",
    save: "Salva",
    saved: "Salvato",
    languageSelection: "Selezione Lingua",
    langDesc: "Scegli la tua lingua preferita per widget e controlli.",
    cardStyle: "Stile Sfondo Carta",
    cardDesc: "Scegli il colore di sfondo e lo stile per tutte le schede della pagina.",
    whiteBg: "Sfondo Bianco (Predefinito)",
    darkGlass: "Stile Vetro Trasparente",
    dataBackup: "Backup e Ripristino dei Dati",
    dataDesc: "Esporta i segnalibri, i compiti e le note in un file JSON o importa un backup salvato in precedenza per ripristinare completamente i dati.",
    exportBackup: "Esporta Backup (Crea Punto di Ripristino)",
    importBackup: "Importa Backup (Ripristina al Punto)",
    resetTitle: "Ripristina Predefiniti",
    resetDesc: "Ripristina l'intero dashboard alle impostazioni di fabbrica originali. Questo eliminerà definitivamente tutti i temi personalizzati, gli sfondi, i segnalibri, i compiti e le note!",
    resetButton: "Ripristina e Cancella Tutti i Dati",
    aboutTitle: "Chi Siamo",
    aboutDesc: "Scopri la nostra storia",
    aboutWelcome: "Benvenuto su GeekTabs",
    aboutText1: "GeekTabs è stato creato con una missione semplice: trasformare la banale pagina di \"nuova scheda\" in un cruscotto bello, personalizzato e altamente funzionale. Crediamo che il tuo ambiente digitale influenzi profondamente la tua produttività e creatività.",
    aboutText2: "Con particolare attenzione al design pulito, alle funzionalità pensate e a un'ampia personalizzazione, GeekTabs si trova proprio all'inizio del tuo viaggio sul web. Che tu abbia bisogno di una dose quotidiana di ispirazione, di un posto per organizzare i tuoi compiti o semplicemente di un orologio elegante per tenerti ancorato a terra, siamo qui per te.",
    supportContact: "Supporto & Contatti",
    restoreSuccess: "Backup ripristinato con successo! La pagina verrà ricaricata.",
    invalidBackup: "File di backup non valido.",
    failParse: "Impossibile analizzare il file di backup.",
    modalTitle: "Ripristinare tutti i dati?",
    modalMessage: "Questa azione è irreversibile. Questo eliminerà definitivamente tutte le tue impostazioni personalizzate, i segnalibri, i compiti e le note. La pagina verrà ricaricata dopo il ripristino.",
    modalConfirm: "Conferma",
    modalCancel: "Annulla"
  },
  Russian: {
    title: "НАСТРОЙКИ",
    generalSettings: "Общие настройки",
    managePreferences: "Управление базовыми предпочтениями",
    customBoardName: "Пользовательское имя доски",
    boardNameDesc: "Это имя будет отображаться как элегантная подпись бренда на главной странице. По умолчанию используется приветствие по времени суток (Доброе утро / Добрый день / Добрый вечер).",
    defaultPlaceholder: "По умолчанию: ",
    save: "Сохранить",
    saved: "Сохранено",
    languageSelection: "Выбор языка",
    langDesc: "Выберите предпочтительный язык для виджетов и элементов управления.",
    cardStyle: "Стиль фона карточки",
    cardDesc: "Выберите цвет фона и стиль для всех карточек страницы.",
    whiteBg: "Белый фон (По умолчанию)",
    darkGlass: "Стиль прозрачного стекла",
    dataBackup: "Резервное копирование и восстановление",
    dataDesc: "Экспортируйте ваши закладки, задачи и личные заметки в файл JSON или импортируйте ранее сохраненную копию, чтобы полностью восстановить данные.",
    exportBackup: "Экспортировать бэкап (Создать точку восстановления)",
    importBackup: "Импортировать бэкап (Восстановить точку)",
    resetTitle: "Сбросить по умолчанию",
    resetDesc: "Сбросить всю панель обратно к заводским настройкам. Это навсегда удалит все ваши темы, обои, закладки, задачи и заметки!",
    resetButton: "Сбросить и очистить все данные",
    aboutTitle: "О нас",
    aboutDesc: "Узнайте нашу историю",
    aboutWelcome: "Добро пожаловать в GeekTabs",
    aboutText1: "GeekTabs был создан с простой миссией: превратить обычную страницу «новой вкладки» в красивую, персонализированную и функциональную панель инструментов. Мы верим, что цифровое окружение глубоко влияет на вашу продуктивность и творчество.",
    aboutText2: "Сочетая чистый дизайн, продуманные функции и широкие возможности кастомизации, GeekTabs находится в самом начале вашего пути по Сети. Нужна ли вам ежедневная доза вдохновения, список для организации задач или просто элегантные часы – мы готовы вам помочь.",
    supportContact: "Поддержка и контакты",
    restoreSuccess: "Резервная копия успешно восстановлена! Страница будет перезагружена.",
    invalidBackup: "Недопустимый файл резервной копии.",
    failParse: "Не удалось проанализировать файл резервной копии.",
    modalTitle: "Сбросить все данные?",
    modalMessage: "Это действие необратимо. Это навсегда удалит все ваши пользовательские настройки, закладки, задачи и заметки. Страница перезагрузится после сброса.",
    modalConfirm: "Сбросить",
    modalCancel: "Отмена"
  },
  Luxembourgish: {
    title: "ASTELLUNGEN",
    generalSettings: "Allgemeng Astellungen",
    managePreferences: "Basis Astellunge verwalten",
    customBoardName: "Eegene Board-Numm",
    boardNameDesc: "Dësen Numm gëtt als elegant Markensignatur op der Startsäit ugewisen. Standardméisseg gëtt eng Begréissung jee no Auerzäit benotzt (Gudde Moien / Gudden Nomëtteg / Gudden Owend).",
    defaultPlaceholder: "Standard: ",
    save: "Späicheren",
    saved: "Gespäichert",
    languageSelection: "Sproochenauswiel",
    langDesc: "Wielt Är Liiblingssprooch fir Widgets a Kontrollen.",
    cardStyle: "Kaarten-Hannergrondstil",
    cardDesc: "Wielt den Hannergrond an de Stil fir all Kaarten op der Säit.",
    whiteBg: "Wäissen Hannergrond (Standard)",
    darkGlass: "Transparent Glasstil",
    dataBackup: "Datensécherung & Erhuelung",
    dataDesc: "Exportéiert Är Lesezeechen, Aufgaben an Notizen an eng JSON-Datei, oder importéiert e Backup fir Är Donnéeën komplett erëm hierzestellen.",
    exportBackup: "Backup exportéieren (Erhuelungspunkt erstellen)",
    importBackup: "Backup importéieren (Erëm hierstellen)",
    resetTitle: "Op Standard zrécksetzen",
    resetDesc: "Setzt de ganzen Dashboard op d'original Fabrécksastellungen zréck. Dëst geläscht permanent all Är eegen Themen, Hannergrënn, Lesezeechen, Aufgaben an Notizen!",
    resetButton: "Zrécksetzen an all Donnéeën läschen",
    aboutTitle: "Iwwer eis",
    aboutDesc: "Entdeckt eis Geschicht",
    aboutWelcome: "Wëllkomm bei GeekTabs",
    aboutText1: "GeekTabs gouf mat enger einfacher Missioun entwéckelt: Déi normal \"Neien Tab\" Säit an e schéinen, personaliséierten an héich funktionellen Dashboard ze verwandelen. Mir gleewen, datt Är digitaler Ëmgéigend Är Produktivitéit a Kreativitéit staark beaflosst.",
    aboutText2: "Mat engem Fokus op e proppert Design, duerchduechten Fonctiounen an extensiv Personnalisatioun, steet GeekTabs direkt um Ufank vun Ärer Rees duerch de Web. Egal ob Dir deeglech Inspiratioun braucht, eng Plaz fir Är Aufgaben ze organiséieren oder einfach eng elegant Auer sicht – mir hunn déi passend Léisung.",
    supportContact: "Support & Kontakt",
    restoreSuccess: "Backup erfolgräich erëm hiergestallt! D'Säit gëtt elo nei gelueden.",
    invalidBackup: "Ongëlteg Backup-Datei.",
    failParse: "Feeler beim Parsen vun der Backup-Datei.",
    modalTitle: "All Donnéeën zrécksetzen?",
    modalMessage: "Dës Aktioun kann net réckgängeg gemaach ginn. Dëst geläscht permanent all Är personaliséiert Astellungen, Lesezeechen, Aufgaben an Notizen. D'Säit gëtt no der Erhuelung nei gelueden.",
    modalConfirm: "Confirméieren",
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
        className={`settings-dropdown w-full flex items-center justify-between rounded-xl px-4 py-2.5 font-semibold text-sm transition-all outline-none cursor-pointer text-left ${
          isDarkGlass
            ? 'bg-white/[0.12] hover:bg-white/[0.18] border border-white/25 text-white shadow-sm backdrop-blur-xl'
            : 'bg-neutral-100 dark:bg-black/25 hover:bg-neutral-200/70 dark:hover:bg-black/35 border border-neutral-300 dark:border-white/10 text-black dark:text-white shadow-sm'
        } ${isOpen ? 'ring-2 ring-indigo-500 border-transparent' : ''}`}
      >
        <span className="truncate pr-2">{selectedOption?.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-200 ${
            isDarkGlass ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'
          } ${isOpen ? 'rotate-180 text-indigo-400 opacity-100' : 'opacity-70'}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`settings-dropdown-menu absolute left-0 right-0 top-full mt-2 z-50 max-h-64 overflow-y-auto rounded-2xl p-1.5 shadow-2xl focus:outline-none ${
              isDarkGlass
                ? 'bg-slate-900/85 backdrop-blur-2xl border border-white/20 text-white shadow-black/50'
                : 'bg-white dark:bg-[#1a1f2e] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white shadow-xl'
            }`}
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
                      ? isDarkGlass
                        ? 'settings-option-selected bg-indigo-500/40 text-white font-bold'
                        : 'settings-option-selected bg-indigo-500 text-white font-bold'
                      : isDarkGlass
                        ? 'text-white/90 hover:text-white hover:bg-white/15'
                        : 'text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check
                      size={16}
                      className={
                        isSelected && !isDarkGlass
                          ? 'text-white shrink-0 ml-2'
                          : 'text-indigo-400 shrink-0 ml-2'
                      }
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

  const [activeTab, setActiveTab] = useState<'general' | 'color' | 'wallpaper' | 'text' | 'browser' | 'weather' | 'about'>('general');
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
    { id: 'weather' as const, label: t(language, 'weather'), icon: CloudSun },
    { id: 'about' as const, label: t(language, 'about_us'), icon: Info },
  ];

  const isDefaultTheme = currentTheme === 'light-grey' || currentTheme === 'light-slate' || currentTheme === 'white-clean' || currentTheme === 'pastel-waves' || currentTheme === 'mix-neonpurple';
  const isColorOrTextTab = activeTab === 'color' || activeTab === 'text';
  const isColorOrTextGlass = isDarkGlass && isDefaultTheme && !isDarkMode && isColorOrTextTab;

  return (
    <div className={`w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-10 relative z-10 p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-[2.5rem] GeekTabs-card ${isColorOrTextGlass ? 'settings-color-text-glass-bg' : 'webcard-light-grey-bg'} transition-all duration-300`}>
      {/* Sidebar - Responsive (Top bar on mobile/tablet, sidebar on desktop) */}
      <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4 lg:gap-6 lg:border-r border-black/10 dark:border-white/10 lg:pr-8 lg:min-h-[480px]">
        <div className="flex items-center gap-3">
          <SettingsIcon size={24} className="text-violet-500 fill-violet-500/15 shrink-0" />
          <h1 className="text-2xl font-black italic tracking-tighter text-black dark:text-white">{tData.title}</h1>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:flex lg:flex-col gap-1.5 lg:gap-1 pb-3 lg:pb-0 border-b lg:border-b-0 border-black/10 dark:border-white/10">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`settings-nav-btn flex items-center justify-center lg:justify-start gap-1 sm:gap-1.5 lg:gap-2 px-1.5 sm:px-2 md:px-2.5 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 rounded-xl lg:rounded-full text-[10px] sm:text-[10.5px] md:text-[11px] lg:text-xs transition-all font-bold tracking-tight lg:tracking-wide border cursor-pointer select-none min-w-0 ${
                  isActive
                    ? 'settings-nav-active-btn bg-indigo-500 hover:bg-indigo-600 !text-white text-white border-indigo-500 shadow-sm shadow-indigo-500/25'
                    : 'border-black/5 dark:border-white/5 lg:border-transparent bg-black/[0.02] dark:bg-white/[0.02] lg:bg-transparent text-neutral-600 dark:text-neutral-400 hover:text-indigo-500 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={isActive ? { color: '#ffffff' } : undefined}
              >
                <IconComp 
                  className={`w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 lg:w-[15px] lg:h-[15px] shrink-0 ${isActive ? 'settings-nav-active-icon !text-white text-white' : ''}`}
                  style={isActive ? { color: '#ffffff', stroke: '#ffffff' } : undefined}
                />
                <span 
                  className={`whitespace-nowrap ${isActive ? 'settings-nav-active-label !text-white text-white' : ''}`}
                  style={isActive ? { color: '#ffffff' } : undefined}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area - Unbordered & Open */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {activeTab === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 sm:space-y-8"
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight mb-1">{tData.generalSettings}</h2>
                <p className="text-black/40 dark:text-white/40 font-bold uppercase tracking-widest text-[9px]">{tData.managePreferences}</p>
              </div>

              <div className="space-y-6 sm:space-y-8 divide-y divide-black/5 dark:divide-white/5">
                <div className="py-2 sm:py-4">
                  <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
                    {tData.customBoardName}
                  </label>
                  <p className="text-xs text-black/60 dark:text-white/60 mb-4 leading-relaxed">
                    {tData.boardNameDesc}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-lg">
                    <input
                      type="text"
                      value={localName}
                      onChange={(e) => setLocalName(e.target.value)}
                      className="settings-input w-full sm:flex-1 min-w-0 bg-neutral-100 dark:bg-black/25 border border-neutral-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold transition-all shadow-sm"
                      placeholder={`${tData.defaultPlaceholder}${getGreetingByTime()}`}
                    />
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleSave}
                        className="flex-1 sm:flex-initial px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 !text-white text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        style={{ color: '#ffffff' }}
                      >
                        {saved ? <><Check size={14} className="!text-white text-white" style={{ color: '#ffffff', stroke: '#ffffff' }} /> {tData.saved}</> : tData.save}
                      </button>
                      
                      <button
                        onClick={handleDelete}
                        className="p-2.5 bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                        title="Remove Name"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 pb-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                    <Globe size={14} />
                    {tData.languageSelection}
                  </label>
                  <p className="text-xs text-black/60 dark:text-white/60 mb-4 leading-relaxed">
                    {tData.langDesc}
                  </p>
                  <div className="mb-8">
                    <SettingsDropdown
                      value={language}
                      onChange={setLanguage}
                      options={languageOptions}
                      isDarkGlass={isDarkGlass}
                    />
                  </div>
                </div>

                <div className="pt-4 pb-2 border-t border-black/5 dark:border-white/5">
                  <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                    <Layout size={14} />
                    {tData.cardStyle}
                  </label>
                  <p className="text-xs text-black/60 dark:text-white/60 mb-4 leading-relaxed">
                    {tData.cardDesc}
                  </p>
                  <div className="mb-6">
                    <SettingsDropdown
                      value={cardBgMode}
                      onChange={(val) => setCardBgMode(val as 'white' | 'dark-glass')}
                      options={cardStyleOptions}
                      isDarkGlass={isDarkGlass}
                    />
                  </div>
                </div>

                {/* Export & Import (Restore) Section */}
                <div className="pt-6 pb-2 border-t border-black/5 dark:border-white/5">
                  <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                    <Download size={14} />
                    {tData.dataBackup}
                  </label>
                  <p className="text-xs text-black/60 dark:text-white/60 mb-4 leading-relaxed">
                    {tData.dataDesc}
                  </p>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                    <button
                      onClick={handleExportData}
                      className="w-full sm:w-auto px-5 py-3 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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
                  <label className="block text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                    <RotateCcw size={14} />
                    {tData.resetTitle}
                  </label>
                  <p className="text-xs text-black/60 dark:text-white/60 mb-4 leading-relaxed">
                    {tData.resetDesc}
                  </p>
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full sm:w-auto px-5 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/20 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BrowserTab language={language} />
            </motion.div>
          )}

          {activeTab === 'weather' && (
            <motion.div
              key="weather"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WeatherSettingsTab language={language} />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight mb-1">{tData.aboutTitle}</h2>
                <p className="text-black/40 dark:text-white/40 font-bold uppercase tracking-widest text-[9px]">{tData.aboutDesc}</p>
              </div>

              <div className="space-y-6 max-w-3xl divide-y divide-black/5 dark:divide-white/5">
                <div className="py-4">
                  <h3 className="text-lg font-bold text-black dark:text-white mb-3">{tData.aboutWelcome}</h3>
                  <p className="text-black/70 dark:text-white/70 text-sm leading-relaxed mb-4">
                    {tData.aboutText1}
                  </p>
                  <p className="text-black/70 dark:text-white/70 text-sm leading-relaxed">
                    {tData.aboutText2}
                  </p>
                </div>
                <div className="pt-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">{tData.supportContact}</p>
                  <a href="mailto:support@geektabs.com" className="text-indigo-500 hover:underline font-bold text-sm">support@geektabs.com</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
