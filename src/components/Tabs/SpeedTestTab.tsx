import React, { useState } from 'react';
import { RefreshCw, Server, Gauge, Info } from 'lucide-react';

export interface SpeedTestTabProps {
  language?: string;
}

const ST_T: Record<string, Record<string, string>> = {
  English: {
    broadband: "Broadband Speed Diagnostics",
    analyzer: "Network Performance Analyzer",
    subtitle: "Measure exact download capabilities, upload bandwidth, jitter, and real-time packet latency.",
    hostServer: "Host Server",
    autoOptimized: "Auto-optimized",
    start: "START",
    beginTest: "Begin test",
    running: "Running diagnostics...",
    clickStart: "Click starting core button to measure real-time carrier speed.",
    downloadSpeed: "Download Speed",
    uploadSpeed: "Upload Speed",
    pingParams: "Ping Parameters",
    latency: "Latency",
    jitter: "Jitter",
    diagnosticsRunning: "Diagnostics Running...",
    retryBenchmark: "Retry Benchmark",
    runBenchmark: "Run Benchmark",
    latencyPhase: "latency",
    downloadPhase: "download",
    uploadPhase: "upload",
    completePhase: "complete",
    serviceReadiness: "Service Performance & Application Readiness",
    serviceSubtitle: "Real-time capability benchmarks based on current bandwidth and latency.",
    broadbandGrade: "Carrier Grade A+",
    streaming4k: "4K / 8K Streaming",
    streamingDesc: "Buffer-free playback on YouTube & Netflix",
    cloudGaming: "Online & Cloud Gaming",
    gamingExcellent: "Competitive Grade",
    gamingGood: "Smooth Play",
    gamingAverage: "Casual Grade",
    gamingDesc: "Optimized for low-latency multiplayer",
    latencyTag: "latency",
    videoConference: "Video Conferencing",
    conferenceGrade: "HD Multi-Party",
    conferenceDesc: "Seamless for Zoom, Teams & Google Meet",
    cloudBackup: "Cloud Sync & Bulk Transfer",
    backupFast: "Ultra Fast",
    backupStandard: "Fast & Stable",
    backupBasic: "Standard Speed",
    backupDesc: "Rapid sync with Google Drive, OneDrive & iCloud"
  },
  Spanish: {
    broadband: "Diagnósticos de velocidad de banda ancha",
    analyzer: "Analizador de rendimiento de red",
    subtitle: "Mida la capacidad exacta de descarga, ancho de banda de subida, jitter y latencia de paquetes en tiempo real.",
    hostServer: "Servidor de host",
    autoOptimized: "Optimizado automáticamente",
    start: "INICIAR",
    beginTest: "Comenzar prueba",
    running: "Ejecutando diagnósticos...",
    clickStart: "Haga clic en el botón central para medir la velocidad de la red en tiempo real.",
    downloadSpeed: "Velocidad de descarga",
    uploadSpeed: "Velocidad de subida",
    pingParams: "Parámetros de ping",
    latency: "Latencia",
    jitter: "Jitter",
    diagnosticsRunning: "Ejecutando diagnósticos...",
    retryBenchmark: "Reintentar prueba",
    runBenchmark: "Ejecutar prueba",
    latencyPhase: "latencia",
    downloadPhase: "descarga",
    uploadPhase: "subida",
    completePhase: "completado",
    serviceReadiness: "Rendimiento del servicio y disponibilidad",
    serviceSubtitle: "Puntos de referencia de capacidad en tiempo real basados en el ancho de banda actual.",
    broadbandGrade: "Grado operador A+",
    streaming4k: "Transmisión 4K / 8K",
    streamingDesc: "Reproducción sin búfer en YouTube y Netflix",
    cloudGaming: "Juegos en la nube y en línea",
    gamingExcellent: "Grado competitivo",
    gamingGood: "Juego fluido",
    gamingAverage: "Grado casual",
    gamingDesc: "Optimizado para multijugador de baja latencia",
    latencyTag: "latencia",
    videoConference: "Videoconferencias",
    conferenceGrade: "HD multipartidario",
    conferenceDesc: "Sin interrupciones para Zoom, Teams y Meet",
    cloudBackup: "Sincronización en la nube",
    backupFast: "Ultra rápido",
    backupStandard: "Rápido y estable",
    backupBasic: "Velocidad estándar",
    backupDesc: "Sincronización rápida con Google Drive y iCloud"
  },
  French: {
    broadband: "Diagnostic de vitesse haut débit",
    analyzer: "Analyseur de performances réseau",
    subtitle: "Mesurez les capacités de téléchargement exactes, la bande passante montante, le jitter et la latence des paquets en temps réel.",
    hostServer: "Serveur hôte",
    autoOptimized: "Optimisé automatiquement",
    start: "DÉMARRER",
    beginTest: "Commencer le test",
    running: "Diagnostics en cours...",
    clickStart: "Cliquez sur le bouton central pour mesurer la vitesse réseau en temps réel.",
    downloadSpeed: "Vitesse de téléchargement",
    uploadSpeed: "Vitesse d'envoi",
    pingParams: "Paramètres de ping",
    latency: "Latence",
    jitter: "Gigue (Jitter)",
    diagnosticsRunning: "Diagnostics en cours...",
    retryBenchmark: "Relancer le test",
    runBenchmark: "Lancer le test",
    latencyPhase: "latence",
    downloadPhase: "téléchargement",
    uploadPhase: "envoi",
    completePhase: "terminé",
    serviceReadiness: "Performance des services et disponibilité",
    serviceSubtitle: "Repères de capacité en temps réel basés sur la bande passante et la latence actuelles.",
    broadbandGrade: "Qualité opérateur A+",
    streaming4k: "Streaming 4K / 8K",
    streamingDesc: "Lecture fluide sur YouTube et Netflix",
    cloudGaming: "Jeux en ligne et cloud",
    gamingExcellent: "Qualité compétition",
    gamingGood: "Jeu fluide",
    gamingAverage: "Qualité standard",
    gamingDesc: "Optimisé pour le multijoueur faible latence",
    latencyTag: "latence",
    videoConference: "Visioconférence",
    conferenceGrade: "HD multipartite",
    conferenceDesc: "Parfait pour Zoom, Teams et Meet",
    cloudBackup: "Synchronisation cloud",
    backupFast: "Ultra rapide",
    backupStandard: "Rapide et stable",
    backupBasic: "Vitesse standard",
    backupDesc: "Synchronisation rapide avec Google Drive et iCloud"
  },
  German: {
    broadband: "Breitband-Geschwindigkeitsdiagnose",
    analyzer: "Netzwerk-Leistungsanalysator",
    subtitle: "Messen Sie die genaue Download-Geschwindigkeit, Upload-Bandbreite, Jitter und Paket-Latenz in Echtzeit.",
    hostServer: "Host-Server",
    autoOptimized: "Automatisch optimiert",
    start: "START",
    beginTest: "Test starten",
    running: "Diagnose läuft...",
    clickStart: "Klicken Sie auf den mittleren Button, um die Netzwerkgeschwindigkeit in Echtzeit zu messen.",
    downloadSpeed: "Download-Geschwindigkeit",
    uploadSpeed: "Upload-Geschwindigkeit",
    pingParams: "Ping-Parameter",
    latency: "Latenz",
    jitter: "Jitter",
    diagnosticsRunning: "Diagnose läuft...",
    retryBenchmark: "Benchmark wiederholen",
    runBenchmark: "Benchmark starten",
    latencyPhase: "Latenz",
    downloadPhase: "Download",
    uploadPhase: "Upload",
    completePhase: "fertig",
    serviceReadiness: "Dienstleistung & Anwendungsbereitschaft",
    serviceSubtitle: "Echtzeit-Benchmarks basierend auf aktueller Bandbreite und Latenz.",
    broadbandGrade: "Carrier-Grad A+",
    streaming4k: "4K / 8K Streaming",
    streamingDesc: "Pufferfreie Wiedergabe auf YouTube & Netflix",
    cloudGaming: "Online- & Cloud-Gaming",
    gamingExcellent: "Wettbewerbsfähig",
    gamingGood: "Flüssiges Spiel",
    gamingAverage: "Gelegenheitsspiel",
    gamingDesc: "Optimiert für Mehrspieler mit geringer Latenz",
    latencyTag: "Latenz",
    videoConference: "Videokonferenzen",
    conferenceGrade: "HD Mehrteilnehmer",
    conferenceDesc: "Nahtlos für Zoom, Teams & Google Meet",
    cloudBackup: "Cloud-Sync & Transfer",
    backupFast: "Ultraschnell",
    backupStandard: "Schnell & stabil",
    backupBasic: "Standard-Geschwindigkeit",
    backupDesc: "Schnelle Synchronisierung mit Google Drive & OneDrive"
  },
  Chinese: {
    broadband: "宽带速度诊断",
    analyzer: "网络性能分析仪",
    subtitle: "测量精确的下载能力、上传带宽、抖动和实时数据包延迟。",
    hostServer: "托管服务器",
    autoOptimized: "自动优化",
    start: "开始",
    beginTest: "开始测试",
    running: "正在运行诊断...",
    clickStart: "点击中心按钮开始测量实时网速。",
    downloadSpeed: "下载速度",
    uploadSpeed: "上传速度",
    pingParams: "Ping 参数",
    latency: "延迟",
    jitter: "抖动 (Jitter)",
    diagnosticsRunning: "正在诊断...",
    retryBenchmark: "重新测试",
    runBenchmark: "运行测试",
    latencyPhase: "延迟测试",
    downloadPhase: "下载测试",
    uploadPhase: "上传测试",
    completePhase: "测试完成",
    serviceReadiness: "网络服务与应用体验评级",
    serviceSubtitle: "基于当前带宽与网络延迟的实时应用场景评测。",
    broadbandGrade: "运营商卓越评级 A+",
    streaming4k: "4K / 8K 超清流媒体",
    streamingDesc: "YouTube 与 Netflix 零卡顿缓冲",
    cloudGaming: "在线联机与云游戏",
    gamingExcellent: "电竞赛事级",
    gamingGood: "流畅体验",
    gamingAverage: "休闲级别",
    gamingDesc: "超低延迟，无操作滞后感",
    latencyTag: "响应延迟",
    videoConference: "远程音视频会议",
    conferenceGrade: "高清多人会议",
    conferenceDesc: "Zoom、Teams 与 Google Meet 丝滑连接",
    cloudBackup: "云端同步与大文件传输",
    backupFast: "极速秒传",
    backupStandard: "高速稳定",
    backupBasic: "常规速率",
    backupDesc: "轻松同步 Google Drive、OneDrive 与 iCloud"
  },
  'Chinese Traditional': {
    broadband: "寬頻速度診斷",
    analyzer: "網路效能分析儀",
    subtitle: "精準測量下載速率、上傳頻寬、抖動與即時封包延遲。",
    hostServer: "託管伺服器",
    autoOptimized: "自動最佳化",
    start: "開始",
    beginTest: "開始測試",
    running: "正在執行診斷...",
    clickStart: "點擊中心按鈕開始測量即時網速。",
    downloadSpeed: "下載速度",
    uploadSpeed: "上傳速度",
    pingParams: "Ping 參數",
    latency: "延遲",
    jitter: "抖動 (Jitter)",
    diagnosticsRunning: "正在診斷...",
    retryBenchmark: "重新測試",
    runBenchmark: "執行測試",
    latencyPhase: "延遲測試",
    downloadPhase: "下載測試",
    uploadPhase: "上傳測試",
    completePhase: "測試完成",
    serviceReadiness: "網路服務與應用體驗評級",
    serviceSubtitle: "依據目前頻寬與網路延遲的即時應用場景評測。",
    broadbandGrade: "電信商卓越評級 A+",
    streaming4k: "4K / 8K 超高畫質串流",
    streamingDesc: "YouTube 與 Netflix 流暢播放不卡頓",
    cloudGaming: "線上連線與雲端遊戲",
    gamingExcellent: "電競賽事級",
    gamingGood: "流暢體驗",
    gamingAverage: "休閒等級",
    gamingDesc: "超低延遲，操作即時零遲滯",
    latencyTag: "回應延遲",
    videoConference: "遠端視訊會議",
    conferenceGrade: "高畫質多人會議",
    conferenceDesc: "Zoom、Teams 與 Google Meet 順暢連線",
    cloudBackup: "雲端同步與大檔案傳輸",
    backupFast: "極速秒傳",
    backupStandard: "高速穩定",
    backupBasic: "一般速率",
    backupDesc: "輕鬆同步 Google Drive、OneDrive 與 iCloud"
  },
  Japanese: {
    broadband: "ブロードバンド速度診断",
    analyzer: "ネットワーク性能アナライザー",
    subtitle: "正確なダウンロード容量、アップロード帯域幅、ジッター、リアルタイムのパケット遅延を測定します。",
    hostServer: "ホストサーバー",
    autoOptimized: "自動最適化",
    start: "スタート",
    beginTest: "テスト開始",
    running: "診断を実行中...",
    clickStart: "中心のボタンをクリックして、リアルタイムのキャリア速度を測定します。",
    downloadSpeed: "ダウンロード速度",
    uploadSpeed: "アップロード速度",
    pingParams: "Ping パラメータ",
    latency: "レイテンシ",
    jitter: "ジッター",
    diagnosticsRunning: "診断実行中...",
    retryBenchmark: "再ベンチマーク",
    runBenchmark: "ベンチマーク実行",
    latencyPhase: "レイテンシ",
    downloadPhase: "ダウンロード",
    uploadPhase: "アップロード",
    completePhase: "完了",
    serviceReadiness: "サービスパフォーマンスとアプリ準備状況",
    serviceSubtitle: "現在の帯域幅とレイテンシに基づくリアルタイム機能ベンチマーク。",
    broadbandGrade: "キャリアグレード A+",
    streaming4k: "4K / 8K ストリーミング",
    streamingDesc: "YouTube や Netflix でバッファなし再生",
    cloudGaming: "オンライン＆クラウドゲーム",
    gamingExcellent: "競技レベル",
    gamingGood: "スムーズ",
    gamingAverage: "カジュアル",
    gamingDesc: "低遅延マルチプレイヤーに最適",
    latencyTag: "レイテンシ",
    videoConference: "ビデオ会議",
    conferenceGrade: "HD複数人会議",
    conferenceDesc: "Zoom、Teams、Google Meet でシームレス",
    cloudBackup: "クラウド同期と大容量転送",
    backupFast: "超高速",
    backupStandard: "高速で安定",
    backupBasic: "標準速度",
    backupDesc: "Google Drive や iCloud と迅速に同期"
  },
  Korean: {
    broadband: "초고속 인터넷 속도 진단",
    analyzer: "네트워크 성능 분석기",
    subtitle: "정확한 다운로드 용량, 업로드 대역폭, 지터 및 실시간 패킷 지연 시간을 측정합니다.",
    hostServer: "호스트 서버",
    autoOptimized: "자동 최적화됨",
    start: "시작",
    beginTest: "테스트 시작",
    running: "진단 실행 중...",
    clickStart: "실시간 네트워크 속도를 측정하려면 중앙의 시작 버튼을 클릭하세요.",
    downloadSpeed: "다운로드 속도",
    uploadSpeed: "업로드 속도",
    pingParams: "Ping 매개변수",
    latency: "지연 시간",
    jitter: "지터",
    diagnosticsRunning: "진단 실행 중...",
    retryBenchmark: "벤치마크 재실행",
    runBenchmark: "벤치마크 실행",
    latencyPhase: "지연 시간",
    downloadPhase: "다운로드",
    uploadPhase: "업로드",
    completePhase: "완료",
    serviceReadiness: "서비스 성능 및 애플리케이션 준비 상태",
    serviceSubtitle: "현재 대역폭 및 지연 시간을 기반으로 한 실시간 기능 벤치마크.",
    broadbandGrade: "통신사 등급 A+",
    streaming4k: "4K / 8K 스트리밍",
    streamingDesc: "YouTube 및 Netflix 버퍼 없는 재생",
    cloudGaming: "온라인 및 클라우드 게임",
    gamingExcellent: "프로 경쟁 등급",
    gamingGood: "원활함",
    gamingAverage: "일반 캐주얼",
    gamingDesc: "낮은 지연 시간 멀티플레이어에 최적화",
    latencyTag: "지연 시간",
    videoConference: "화상 회의",
    conferenceGrade: "HD 다자간 회의",
    conferenceDesc: "Zoom, Teams 및 Meet에서 매끄러운 통화",
    cloudBackup: "클라우드 동기화 및 대용량 전송",
    backupFast: "초고속",
    backupStandard: "빠르고 안정적",
    backupBasic: "표준 속도",
    backupDesc: "Google Drive, OneDrive 및 iCloud 빠른 동기화"
  },
  Italian: {
    broadband: "Diagnostica Velocità Banda Larga",
    analyzer: "Analizzatore di Prestazioni di Rete",
    subtitle: "Misura l'esatta velocità di download, la larghezza di banda in upload, il jitter e la latenza dei pacchetti in tempo real.",
    hostServer: "Server Host",
    autoOptimized: "Ottimizzato automaticamente",
    start: "AVVIA",
    beginTest: "Inizia test",
    running: "Diagnostica in corso...",
    clickStart: "Fai clic sul pulsante centrale per misurare la velocità di rete in tempo reale.",
    downloadSpeed: "Velocità di Download",
    uploadSpeed: "Velocità di Upload",
    pingParams: "Parametri Ping",
    latency: "Latenza",
    jitter: "Jitter",
    diagnosticsRunning: "Diagnostica in corso...",
    retryBenchmark: "Ripeti Benchmark",
    runBenchmark: "Avvia Benchmark",
    latencyPhase: "latenza",
    downloadPhase: "download",
    uploadPhase: "upload",
    completePhase: "completato",
    serviceReadiness: "Prestazioni del servizio e idoneità",
    serviceSubtitle: "Benchmark di capacità in tempo reale basati sulla larghezza di banda e la latenza attuali.",
    broadbandGrade: "Grado operatore A+",
    streaming4k: "Streaming 4K / 8K",
    streamingDesc: "Riproduzione fluida su YouTube e Netflix",
    cloudGaming: "Gaming online e nel cloud",
    gamingExcellent: "Livello competitivo",
    gamingGood: "Gioco fluido",
    gamingAverage: "Livello casual",
    gamingDesc: "Ottimizzato per multiplayer a bassa latenza",
    latencyTag: "latenza",
    videoConference: "Videoconferenze",
    conferenceGrade: "HD multiparte",
    conferenceDesc: "Perfetto per Zoom, Teams e Google Meet",
    cloudBackup: "Sincronizzazione cloud e trasferimento",
    backupFast: "Ultra veloce",
    backupStandard: "Veloce e stabile",
    backupBasic: "Velocità standard",
    backupDesc: "Sincronizzazione rapida con Google Drive e OneDrive"
  },
  Russian: {
    broadband: "Диагностика скорости широкополосного интернета",
    analyzer: "Анализатор производительности сети",
    subtitle: "Измеряйте точную скорость загрузки, пропускную способность отдачи, джиттер и задержку пакетов в реальном времени.",
    hostServer: "Хост-сервер",
    autoOptimized: "Автоматически оптимизировано",
    start: "СТАРТ",
    beginTest: "Начать тест",
    running: "Запуск диагностики...",
    clickStart: "Нажмите центральную кнопку, чтобы измерить скорость подключения в реальном времени.",
    downloadSpeed: "Скорость загрузки",
    uploadSpeed: "Скорость отдачи",
    pingParams: "Параметры пинга",
    latency: "Задержка",
    jitter: "Джиттер",
    diagnosticsRunning: "Запуск диагностики...",
    retryBenchmark: "Повторить тест",
    runBenchmark: "Запустить тест",
    latencyPhase: "задержка",
    downloadPhase: "загрузка",
    uploadPhase: "отдача",
    completePhase: "завершено",
    serviceReadiness: "Производительность сервисов и готовность",
    serviceSubtitle: "Бенчмарки возможностей в реальном времени на основе текущей пропускной способности и задержки.",
    broadbandGrade: "Класс провайдера A+",
    streaming4k: "Стриминг 4K / 8K",
    streamingDesc: "Воспроизведение без буферизации на YouTube и Netflix",
    cloudGaming: "Онлайн и облачный гейминг",
    gamingExcellent: "Соревновательный уровень",
    gamingGood: "Плавная игра",
    gamingAverage: "Обычный уровень",
    gamingDesc: "Оптимизировано для мультиплеера с низкой задержкой",
    latencyTag: "задержка",
    videoConference: "Видеоконференции",
    conferenceGrade: "HD мульти-конференции",
    conferenceDesc: "Без задержек для Zoom, Teams и Meet",
    cloudBackup: "Синхронизация с облаком и передача файлов",
    backupFast: "Сверхбыстро",
    backupStandard: "Быстро и стабильно",
    backupBasic: "Стандартная скорость",
    backupDesc: "Быстрая синхронизация с Google Drive и OneDrive"
  },
  Luxembourgish: {
    broadband: "Breetband-Vitesse-Diagnostik",
    analyzer: "Netzwierk-Leeschtungsanalysateur",
    subtitle: "Moosst déi exakt Download-Vitesse, Upload-Bandbreet, Jitter an d'Paket-Latenz an Echtzäit.",
    hostServer: "Host-Server",
    autoOptimized: "Automatesch optimiséiert",
    start: "START",
    beginTest: "Test starten",
    running: "Diagnostik leeft...",
    clickStart: "Klickt op den mëttelste Knäppchen fir d'Netzwierk-Vitesse an Echtzäit ze moossen.",
    downloadSpeed: "Download-Vitesse",
    uploadSpeed: "Upload-Vitesse",
    pingParams: "Ping-Parameteren",
    latency: "Latenz",
    jitter: "Jitter",
    diagnosticsRunning: "Diagnostik leeft...",
    retryBenchmark: "Benchmark widderhuelen",
    runBenchmark: "Benchmark starten",
    latencyPhase: "Latenz",
    downloadPhase: "Download",
    uploadPhase: "Upload",
    completePhase: "fäerdeg",
    serviceReadiness: "Service-Leeschtung an Applikatiounsbereetschaft",
    serviceSubtitle: "Echtzäit-Kapazitéitsbenchmarks baséierend op der aktueller Bandbreet a Latenz.",
    broadbandGrade: "Carrier-Grad A+",
    streaming4k: "4K / 8K Streaming",
    streamingDesc: "Pufferfräi Playback op YouTube & Netflix",
    cloudGaming: "Online- & Cloud-Gaming",
    gamingExcellent: "Kompetitivt Niveau",
    gamingGood: "Flëssegt Spill",
    gamingAverage: "Geleeëntlech",
    gamingDesc: "Optiméiert fir niddreg Latenz",
    latencyTag: "Latenz",
    videoConference: "Videokonferenzen",
    conferenceGrade: "HD Méiparteien",
    conferenceDesc: "Reibungslos fir Zoom, Teams & Google Meet",
    cloudBackup: "Cloud-Sync & Groussdateien-Transfer",
    backupFast: "Ultraschnell",
    backupStandard: "Séier & stabil",
    backupBasic: "Standard-Vitesse",
    backupDesc: "Séier Synchroniséierung mat Google Drive an iCloud"
  },
  Dutch: {
    broadband: "Breedbandsnelheidsdiagnose",
    analyzer: "Netwerkprestatie-analysator",
    subtitle: "Meet nauwkeurig de downloadsnelheid, uploadbandbreedte, jitter en realtime pakketlatentie.",
    hostServer: "Hostserver",
    autoOptimized: "Automatisch geoptimaliseerd",
    start: "START",
    beginTest: "Test starten",
    running: "Diagnose uitvoeren...",
    clickStart: "Klik op de middelste startknop om de live netwerksnelheid te meten.",
    downloadSpeed: "Downloadsnelheid",
    uploadSpeed: "Uploadsnelheid",
    pingParams: "Ping-parameters",
    latency: "Latentie",
    jitter: "Jitter",
    diagnosticsRunning: "Diagnose uitvoeren...",
    retryBenchmark: "Benchmark herhalen",
    runBenchmark: "Benchmark starten",
    latencyPhase: "latentie",
    downloadPhase: "download",
    uploadPhase: "upload",
    completePhase: "voltooid",
    serviceReadiness: "Serviceprestaties en geschiktheid",
    serviceSubtitle: "Realtime capaciteitsbenchmarks op basis van uw huidige bandbreedte en latentie.",
    broadbandGrade: "Providerklasse A+",
    streaming4k: "4K / 8K Streaming",
    streamingDesc: "Bufferloos afspelen op YouTube & Netflix",
    cloudGaming: "Online & Cloud Gaming",
    gamingExcellent: "Pro-competitief",
    gamingGood: "Vloeiend spelen",
    gamingAverage: "Normale spellen",
    gamingDesc: "Geoptimaliseerd voor multiplayer met lage latentie",
    latencyTag: "latentie",
    videoConference: "Videovergaderen",
    conferenceGrade: "HD Multi-deelnemers",
    conferenceDesc: "Naadloos voor Zoom, Teams & Google Meet",
    cloudBackup: "Cloudsync & Grote overdrachten",
    backupFast: "Ultrasnel",
    backupStandard: "Snel & Stabiel",
    backupBasic: "Standaardsnelheid",
    backupDesc: "Snelle synchronisatie met Google Drive & iCloud"
  },
  Swedish: {
    broadband: "Bredbandshastighetsdiagnostik",
    analyzer: "Nätverksprestandaanalysator",
    subtitle: "Mät exakt nedladdningskapacitet, uppladdningsbandbredd, jitter och paketfördröjning i realtid.",
    hostServer: "Värdserver",
    autoOptimized: "Automatiskt optimerad",
    start: "START",
    beginTest: "Starta test",
    running: "Kör diagnostik...",
    clickStart: "Klicka på den mittersta startknappen för att mäta nätverkshastigheten i realtid.",
    downloadSpeed: "Nedladdningshastighet",
    uploadSpeed: "Uppladdningshastighet",
    pingParams: "Ping-parametrar",
    latency: "Latens",
    jitter: "Jitter",
    diagnosticsRunning: "Kör diagnostik...",
    retryBenchmark: "Kör test igen",
    runBenchmark: "Kör test",
    latencyPhase: "latens",
    downloadPhase: "nedladdning",
    uploadPhase: "uppladdning",
    completePhase: "klar",
    serviceReadiness: "Tjänsteprestanda och beredskap",
    serviceSubtitle: "Realtidsriktmärken baserade på din nuvarande bandbredd och latens.",
    broadbandGrade: "Operatörsklass A+",
    streaming4k: "4K / 8K-streaming",
    streamingDesc: "Buffertfri uppspelning på YouTube & Netflix",
    cloudGaming: "Online- & Molnspel",
    gamingExcellent: "Proffsnivå",
    gamingGood: "Smidigt spel",
    gamingAverage: "Vardagsspel",
    gamingDesc: "Optimerad för flerspelarläge med låg latens",
    latencyTag: "latens",
    videoConference: "Videomöten",
    conferenceGrade: "HD Flerpartsamtal",
    conferenceDesc: "Sömlöst för Zoom, Teams & Google Meet",
    cloudBackup: "Molnsynk & Stora filöverföringar",
    backupFast: "Ultrasnabb",
    backupStandard: "Snabb & Stabil",
    backupBasic: "Standardhastighet",
    backupDesc: "Snabb synkronisering med Google Drive & iCloud"
  },
  Finnish: {
    broadband: "Laajakaistan nopeusdiagnostiikka",
    analyzer: "Verkon suorituskykyanalysaattori",
    subtitle: "Mittaa tarkka latauskapasiteetti, lähetyskaista, värinä ja pakettiviive reaaliajassa.",
    hostServer: "Isäntäpalvelin",
    autoOptimized: "Automaattisesti optimoitu",
    start: "ALOITA",
    beginTest: "Aloita testi",
    running: "Suoritetaan diagnostiikkaa...",
    clickStart: "Napsauta keskimmäistä aloituspainiketta mitataksesi verkon nopeuden reaaliajassa.",
    downloadSpeed: "Latausnopeus",
    uploadSpeed: "Lähetysnopeus",
    pingParams: "Ping-parametrit",
    latency: "Viive",
    jitter: "Värinä (Jitter)",
    diagnosticsRunning: "Suoritetaan diagnostiikkaa...",
    retryBenchmark: "Toista testi",
    runBenchmark: "Suorita testi",
    latencyPhase: "viive",
    downloadPhase: "lataus",
    uploadPhase: "lähetys",
    completePhase: "valmis",
    serviceReadiness: "Palvelun suorituskyky ja valmius",
    serviceSubtitle: "Reaaliaikaiset suorituskykyarviot nykyisen kaistanleveyden ja viiveen perusteella.",
    broadbandGrade: "Operaattoritaso A+",
    streaming4k: "4K / 8K -suoratoisto",
    streamingDesc: "Puskuroimaton toisto YouTubessa ja Netflixissä",
    cloudGaming: "Verkko- ja pilvipelaaminen",
    gamingExcellent: "Kilpataso",
    gamingGood: "Sujuva pelaaminen",
    gamingAverage: "Peruspelaaminen",
    gamingDesc: "Optimoitu pienen viiveen moninpeliin",
    latencyTag: "viive",
    videoConference: "Videoneuvottelut",
    conferenceGrade: "HD-ryhmäpuhelut",
    conferenceDesc: "Sujuva Zoom-, Teams- ja Google Meet -käyttö",
    cloudBackup: "Pilvisynkronointi ja suuret tiedostot",
    backupFast: "Huippunopea",
    backupStandard: "Nopea ja vakaa",
    backupBasic: "Perusnopeus",
    backupDesc: "Nopea synkronointi Google Driven ja iCloudin kanssa"
  },
  Hindi: {
    broadband: "ब्रॉडबैंड गति निदान",
    analyzer: "नेटवर्क प्रदर्शन विश्लेषक",
    subtitle: "रीयल-टाइम में सटीक डाउनलोड क्षमता, अपलोड बैंडविड्थ, जिटर और पैकेट लेटेंसी मापें।",
    hostServer: "होस्ट सर्वर",
    autoOptimized: "स्वतः अनुकूलित",
    start: "शुरू करें",
    beginTest: "टेस्ट शुरू करें",
    running: "जांच चल रही है...",
    clickStart: "लाइव नेटवर्क गति मापने के लिए बीच वाले स्टार्ट बटन पर क्लिक करें।",
    downloadSpeed: "डाउनलोड गति",
    uploadSpeed: "अपलोड गति",
    pingParams: "पिंग पैरामीटर",
    latency: "लेटेंसी",
    jitter: "जिटर",
    diagnosticsRunning: "जांच चल रही है...",
    retryBenchmark: "पुनः परीक्षण करें",
    runBenchmark: "बेंचमार्क चलाएँ",
    latencyPhase: "लेटेंसी",
    downloadPhase: "डाउनलोड",
    uploadPhase: "अपलोड",
    completePhase: "पूर्ण",
    serviceReadiness: "सेवा प्रदर्शन और एप्लिकेशन तत्परता",
    serviceSubtitle: "आपकी वर्तमान बैंडविड्थ और लेटेंसी पर आधारित लाइव क्षमता बेंचमार्क।",
    broadbandGrade: "कैरियर ग्रेड A+",
    streaming4k: "4K / 8K स्ट्रीमिंग",
    streamingDesc: "YouTube और Netflix पर बिना बफर के प्लेबैक",
    cloudGaming: "ऑनलाइन और क्लाउड गेमिंग",
    gamingExcellent: "प्रो प्रतिस्पर्धी",
    gamingGood: "सुचारू गेमिंग",
    gamingAverage: "सामान्य गेमिंग",
    gamingDesc: "कम लेटेंसी वाले मल्टीप्लेयर के लिए अनुकूलित",
    latencyTag: "लेटेंसी",
    videoConference: "वीडियो कॉन्फ्रेंसिंग",
    conferenceGrade: "HD मल्टी-पार्टी",
    conferenceDesc: "Zoom, Teams और Google Meet के लिए सहज",
    cloudBackup: "क्लाउड सिंक और बड़ी फ़ाइल ट्रांसफ़र",
    backupFast: "अल्ट्रा फ़ास्ट",
    backupStandard: "तेज़ और स्थिर",
    backupBasic: "मानक गति",
    backupDesc: "Google Drive और iCloud के साथ तेज़ सिंक"
  },
  Norwegian: {
    broadband: "Bredbåndshastighetsdiagnostikk",
    analyzer: "Nettverksytelsesanalysator",
    subtitle: "Mål nøyaktig nedlastingskapasitet, opplastingsbåndbredde, jitter og pakkeforsinkelse i sanntid.",
    hostServer: "Vertsserver",
    autoOptimized: "Automatisk optimalisert",
    start: "START",
    beginTest: "Start test",
    running: "Kjører diagnostikk...",
    clickStart: "Klikk på startknappen i midten for å måle nettverkshastigheten i sanntid.",
    downloadSpeed: "Nedlastingshastighet",
    uploadSpeed: "Opplastingshastighet",
    pingParams: "Ping-parametere",
    latency: "Forsinkelse",
    jitter: "Jitter",
    diagnosticsRunning: "Kjører diagnostikk...",
    retryBenchmark: "Kjør test på nytt",
    runBenchmark: "Kjør hastighetstest",
    latencyPhase: "forsinkelse",
    downloadPhase: "nedlasting",
    uploadPhase: "opplasting",
    completePhase: "fullført",
    serviceReadiness: "Tjenesteytelse og klarhet",
    serviceSubtitle: "Sanntidsmålinger basert på din nåværende båndbredde og forsinkelse.",
    broadbandGrade: "Operatørklasse A+",
    streaming4k: "4K / 8K-strømming",
    streamingDesc: "Bufferfri avspilling på YouTube & Netflix",
    cloudGaming: "Online- & Skyspilling",
    gamingExcellent: "Proffnivå",
    gamingGood: "Jevn spilling",
    gamingAverage: "Vanlig spilling",
    gamingDesc: "Optimalisert for flerspiller med lav forsinkelse",
    latencyTag: "forsinkelse",
    videoConference: "Videokonferanser",
    conferenceGrade: "HD Flerpartsamtale",
    conferenceDesc: "Sømløst for Zoom, Teams & Google Meet",
    cloudBackup: "Skysynkronisering & Store filer",
    backupFast: "Ultrarask",
    backupStandard: "Rask & Stabil",
    backupBasic: "Standardhastighet",
    backupDesc: "Rask synkronisering med Google Drive & iCloud"
  },
  Thai: {
    broadband: "การวินิจฉัยความเร็วบรอดแบนด์",
    analyzer: "ตัววิเคราะห์ประสิทธิภาพเครือข่าย",
    subtitle: "วัดความเร็วดาวน์โหลด แบนด์วิดท์อัปโหลด จิตเตอร์ และความหน่วงแพ็กเก็ตแบบเรียลไทม์อย่างแม่นยำ",
    hostServer: "เซิร์ฟเวอร์โฮสต์",
    autoOptimized: "ปรับแต่งอัตโนมัติ",
    start: "เริ่ม",
    beginTest: "เริ่มทดสอบ",
    running: "กำลังวินิจฉัย...",
    clickStart: "คลิกปุ่มเริ่มตรงกลางเพื่อวัดความเร็วเครือข่ายแบบเรียลไทม์",
    downloadSpeed: "ความเร็วดาวน์โหลด",
    uploadSpeed: "ความเร็วอัปโหลด",
    pingParams: "พารามิเตอร์ Ping",
    latency: "ความหน่วง (Latency)",
    jitter: "จิตเตอร์ (Jitter)",
    diagnosticsRunning: "กำลังวินิจฉัย...",
    retryBenchmark: "ทดสอบอีกครั้ง",
    runBenchmark: "เริ่มทดสอบความเร็ว",
    latencyPhase: "ความหน่วง",
    downloadPhase: "ดาวน์โหลด",
    uploadPhase: "อัปโหลด",
    completePhase: "เสร็จสิ้น",
    serviceReadiness: "ประสิทธิภาพบริการและความพร้อมใช้งาน",
    serviceSubtitle: "เกณฑ์วัดประสิทธิภาพสดจากแบนด์วิดท์และความหน่วงปัจจุบันของคุณ",
    broadbandGrade: "ระดับผู้ให้บริการ A+",
    streaming4k: "สตรีมมิง 4K / 8K",
    streamingDesc: "เล่นวิดีโอราบรื่นไม่สะดุดบน YouTube และ Netflix",
    cloudGaming: "เกมออนไลน์และคลาวด์เกมมิง",
    gamingExcellent: "ระดับแข่งขันมืออาชีพ",
    gamingGood: "เล่นเกมลื่นไหล",
    gamingAverage: "เล่นเกมทั่วไป",
    gamingDesc: "ปรับแต่งเพื่อมัลติเพลเยอร์ที่มีความหน่วงต่ำ",
    latencyTag: "ความหน่วง",
    videoConference: "การประชุมทางวิดีโอ",
    conferenceGrade: "HD หลายสายพร้อมกัน",
    conferenceDesc: "ราบรื่นสำหรับ Zoom, Teams และ Google Meet",
    cloudBackup: "ซิงค์คลาวด์และโอนไฟล์ขนาดใหญ่",
    backupFast: "เร็วเป็นพิเศษ",
    backupStandard: "เร็วและเสถียร",
    backupBasic: "ความเร็วมาตรฐาน",
    backupDesc: "ซิงค์รวดเร็วกับ Google Drive และ iCloud"
  },
  Portuguese: {
    broadband: "Diagnóstico de Velocidade de Banda Larga",
    analyzer: "Analisador de Desempenho de Rede",
    subtitle: "Meça a taxa de transferência de download, largura de banda de upload, jitter e latência de pacotes em tempo real com precisão.",
    hostServer: "Servidor Anfitrião",
    autoOptimized: "Otimizado Automaticamente",
    start: "INICIAR",
    beginTest: "Iniciar Teste",
    running: "A Executar Diagnóstico...",
    clickStart: "Clique no botão Iniciar ao centro para avaliar o desempenho da sua rede em tempo real.",
    downloadSpeed: "Velocidade de Download",
    uploadSpeed: "Velocidade de Upload",
    pingParams: "Parâmetros de Ping",
    latency: "Latência",
    jitter: "Jitter",
    diagnosticsRunning: "Diagnóstico em Curso...",
    retryBenchmark: "Repetir Teste",
    runBenchmark: "Executar Teste de Velocidade",
    latencyPhase: "Latência",
    downloadPhase: "Download",
    uploadPhase: "Upload",
    completePhase: "Concluído",
    serviceReadiness: "Desempenho e Prontidão de Serviços",
    serviceSubtitle: "Referências ao vivo derivadas das suas métricas atuais de largura de banda e latência.",
    broadbandGrade: "Grau de Operadora A+",
    streaming4k: "Streaming 4K / 8K",
    streamingDesc: "Reprodução sem interrupções no YouTube & Netflix",
    cloudGaming: "Jogos Online e na Nuvem",
    gamingExcellent: "Nível Competitivo Pro",
    gamingGood: "Jogabilidade Fluida",
    gamingAverage: "Jogos Casuais",
    gamingDesc: "Otimizado para multijogador de baixa latência",
    latencyTag: "latência",
    videoConference: "Videoconferência",
    conferenceGrade: "Múltiplas Chamadas HD",
    conferenceDesc: "Fluido para Zoom, Teams & Google Meet",
    cloudBackup: "Sincronização na Nuvem e Ficheiros Grandes",
    backupFast: "Ultrarrápido",
    backupStandard: "Rápido e Estável",
    backupBasic: "Velocidade Padrão",
    backupDesc: "Sincronização rápida com Google Drive & iCloud"
  },
  Vietnamese: {
    broadband: "Chẩn đoán tốc độ băng thông rộng",
    analyzer: "Trình phân tích hiệu suất mạng",
    subtitle: "Đo lường thông lượng tải xuống, băng thông tải lên, độ dao động và độ trễ gói tin theo thời gian thực với độ chính xác cao.",
    hostServer: "Máy chủ lưu trữ",
    autoOptimized: "Tự động tối ưu",
    start: "BẮT ĐẦU",
    beginTest: "Bắt đầu kiểm tra",
    running: "Đang chạy chẩn đoán...",
    clickStart: "Nhấn nút Bắt đầu ở giữa để đánh giá hiệu suất mạng của bạn theo thời gian thực.",
    downloadSpeed: "Tốc độ tải xuống",
    uploadSpeed: "Tốc độ tải lên",
    pingParams: "Thông số Ping",
    latency: "Độ trễ",
    jitter: "Độ dao động (Jitter)",
    diagnosticsRunning: "Đang chẩn đoán...",
    retryBenchmark: "Kiểm tra lại",
    runBenchmark: "Chạy kiểm tra tốc độ",
    latencyPhase: "Độ trễ",
    downloadPhase: "Tải xuống",
    uploadPhase: "Tải lên",
    completePhase: "Hoàn tất",
    serviceReadiness: "Hiệu suất dịch vụ & Mức độ sẵn sàng",
    serviceSubtitle: "Đánh giá trực tiếp dựa trên băng thông và độ trễ hiện tại của bạn.",
    broadbandGrade: "Chuẩn nhà mạng A+",
    streaming4k: "Phát trực tuyến 4K / 8K",
    streamingDesc: "Phát mượt mà không giật lag trên YouTube & Netflix",
    cloudGaming: "Chơi game trực tuyến & Đám mây",
    gamingExcellent: "Chuẩn thi đấu Pro",
    gamingGood: "Chơi game mượt mà",
    gamingAverage: "Chơi game giải trí",
    gamingDesc: "Tối ưu cho chơi nhiều người với độ trễ thấp",
    latencyTag: "độ trễ",
    videoConference: "Hội nghị truyền hình",
    conferenceGrade: "Nhiều luồng HD đồng thời",
    conferenceDesc: "Ổn định cho Zoom, Teams & Google Meet",
    cloudBackup: "Đồng bộ đám mây & Tệp lớn",
    backupFast: "Siêu nhanh",
    backupStandard: "Nhanh & Ổn định",
    backupBasic: "Tốc độ tiêu chuẩn",
    backupDesc: "Đồng bộ nhanh với Google Drive & iCloud"
  },
  Polish: {
    broadband: "Diagnostyka prędkości łącza",
    analyzer: "Analizator wydajności sieci",
    subtitle: "Mierz w czasie rzeczywistym przepustowość pobierania, wysyłania, jitter oraz opóźnienia pakietów z wysoką precyzją.",
    hostServer: "Serwer docelowy",
    autoOptimized: "Automatyczna optymalizacja",
    start: "START",
    beginTest: "Rozpocznij test",
    running: "Trwa diagnostyka...",
    clickStart: "Kliknij przycisk Start na środku, aby ocenić wydajność sieci w czasie rzeczywistym.",
    downloadSpeed: "Prędkość pobierania",
    uploadSpeed: "Prędkość wysyłania",
    pingParams: "Parametry Ping",
    latency: "Opóźnienie",
    jitter: "Jitter",
    diagnosticsRunning: "Diagnostyka w toku...",
    retryBenchmark: "Powtórz test",
    runBenchmark: "Uruchom test prędkości",
    latencyPhase: "Opóźnienie",
    downloadPhase: "Pobieranie",
    uploadPhase: "Wysyłanie",
    completePhase: "Zakończono",
    serviceReadiness: "Wydajność i gotowość usług",
    serviceSubtitle: "Wyniki na żywo obliczone na podstawie bieżącej przepustowości i opóźnień.",
    broadbandGrade: "Klasa operatorska A+",
    streaming4k: "Streaming 4K / 8K",
    streamingDesc: "Płynne odtwarzanie bez buforowania w YouTube i Netflix",
    cloudGaming: "Gry online i w chmurze",
    gamingExcellent: "Poziom turniejowy Pro",
    gamingGood: "Płynna rozgrywka",
    gamingAverage: "Gry rekreacyjne",
    gamingDesc: "Zoptymalizowane pod kątem niskich opóźnień w trybie wieloosobowym",
    latencyTag: "opóźnienie",
    videoConference: "Wideokonferencje",
    conferenceGrade: "Wiele połączeń HD naraz",
    conferenceDesc: "Płynna praca w Zoom, Teams i Google Meet",
    cloudBackup: "Synchronizacja z chmurą i duże pliki",
    backupFast: "Ultraszybko",
    backupStandard: "Szybko i stabilnie",
    backupBasic: "Standardowa prędkość",
    backupDesc: "Szybka synchronizacja z Google Drive i iCloud"
  },
  Danish: {
    broadband: "Bredbåndshastighedsdiagnostik",
    analyzer: "Netværksydelsesanalysator",
    subtitle: "Mål downloadhastighed, uploadbåndbredde, jitter og pakkeforsinkelse i realtid med høj præcision.",
    hostServer: "Værtsserver",
    autoOptimized: "Automatisk optimeret",
    start: "START",
    beginTest: "Start test",
    running: "Kører diagnostik...",
    clickStart: "Klik på Start-knappen i midten for at måle din netværksydelse i realtid.",
    downloadSpeed: "Downloadhastighed",
    uploadSpeed: "Uploadhastighed",
    pingParams: "Ping-parametre",
    latency: "Forsinkelse",
    jitter: "Jitter",
    diagnosticsRunning: "Diagnostik kører...",
    retryBenchmark: "Gentag test",
    runBenchmark: "Kør hastighedstest",
    latencyPhase: "Forsinkelse",
    downloadPhase: "Download",
    uploadPhase: "Upload",
    completePhase: "Færdig",
    serviceReadiness: "Tjenesteydelse og parathed",
    serviceSubtitle: "Live-målinger udledt af din aktuelle båndbredde og forsinkelse.",
    broadbandGrade: "Udbyderkvalitet A+",
    streaming4k: "4K / 8K-streaming",
    streamingDesc: "Bufferfri afspilning på YouTube & Netflix",
    cloudGaming: "Online- og cloudgaming",
    gamingExcellent: "Pro-konkurrenceniveau",
    gamingGood: "Flydende gameplay",
    gamingAverage: "Almindelig gaming",
    gamingDesc: "Optimeret til multiplayer med lav forsinkelse",
    latencyTag: "forsinkelse",
    videoConference: "Videokonference",
    conferenceGrade: "Flere HD-streams",
    conferenceDesc: "Stabilt til Zoom, Teams & Google Meet",
    cloudBackup: "Cloud-synkronisering og store filer",
    backupFast: "Ultrahurtig",
    backupStandard: "Hurtig og stabil",
    backupBasic: "Standardhastighed",
    backupDesc: "Hurtig synkronisering til Google Drive & iCloud"
  },
  Turkish: {
    broadband: "Geniş Bant Hız Tanılama",
    analyzer: "Ağ Performans Analizörü",
    subtitle: "Gerçek zamanlı indirme aktarım hızını, yükleme bant genişliğini, jitter ve paket gecikmesini hassas şekilde ölçün.",
    hostServer: "Ana Sunucu",
    autoOptimized: "Otomatik Optimize",
    start: "BAŞLAT",
    beginTest: "Testi Başlat",
    running: "Tanılama Çalışıyor...",
    clickStart: "Gerçek zamanlı ağ performansınızı ölçmek için ortadaki Başlat düğmesine tıklayın.",
    downloadSpeed: "İndirme Hızı",
    uploadSpeed: "Yükleme Hızı",
    pingParams: "Ping Parametreleri",
    latency: "Gecikme",
    jitter: "Jitter",
    diagnosticsRunning: "Tanılama Sürüyor...",
    retryBenchmark: "Testi Yenile",
    runBenchmark: "Hız Testini Çalıştır",
    latencyPhase: "Gecikme",
    downloadPhase: "İndirme",
    uploadPhase: "Yükleme",
    completePhase: "Tamamlandı",
    serviceReadiness: "Servis Performansı ve Hazır Oluş",
    serviceSubtitle: "Mevcut bant genişliği ve gecikme ölçümlerinizden elde edilen canlı kıyaslamalar.",
    broadbandGrade: "Operatör Sınıfı A+",
    streaming4k: "4K / 8K Yayın",
    streamingDesc: "YouTube ve Netflix'te kesintisiz oynatma",
    cloudGaming: "Çevrimiçi ve Bulut Oyunları",
    gamingExcellent: "Pro Rekabetçi Seviye",
    gamingGood: "Akıcı Oynanış",
    gamingAverage: "Gündelik Oyun",
    gamingDesc: "Düşük gecikmeli çok oyunculu oyunlar için optimize edildi",
    latencyTag: "gecikme",
    videoConference: "Video Konferans",
    conferenceGrade: "Çoklu HD Akış",
    conferenceDesc: "Zoom, Teams ve Google Meet için sorunsuz",
    cloudBackup: "Bulut Eşitleme ve Büyük Dosyalar",
    backupFast: "Ultra Hızlı",
    backupStandard: "Hızlı ve Kararlı",
    backupBasic: "Standart Hız",
    backupDesc: "Google Drive ve iCloud ile hızlı eşitleme"
  },
  Greek: {
    broadband: "Διαγνωστικό Ταχύτητας Ευρυζωνικής Σύνδεσης",
    analyzer: "Αναλυτής Απόδοσης Δικτύου",
    subtitle: "Μετρήστε σε πραγματικό χρόνο την ταχύτητα λήψης, αποστολής, το jitter και την καθυστέρηση πακέτων με ακρίβεια.",
    hostServer: "Κεντρικός Διακομιστής",
    autoOptimized: "Αυτόματη Βελτιστοποίηση",
    start: "ΕΝΑΡΞΗ",
    beginTest: "Έναρξη Δοκιμής",
    running: "Εκτέλεση διαγνωστικού...",
    clickStart: "Κάντε κλικ στο κεντρικό κουμπί Έναρξης για να αξιολογήσετε την απόδοση του δικτύου σας σε πραγματικό χρόνο.",
    downloadSpeed: "Ταχύτητα Λήψης",
    uploadSpeed: "Ταχύτητα Αποστολής",
    pingParams: "Παράμετροι Ping",
    latency: "Καθυστέρηση",
    jitter: "Jitter",
    diagnosticsRunning: "Διάγνωση σε εξέλιξη...",
    retryBenchmark: "Επανάληψη Δοκιμής",
    runBenchmark: "Εκτέλεση Δοκιμής Ταχύτητας",
    latencyPhase: "Καθυστέρηση",
    downloadPhase: "Λήψη",
    uploadPhase: "Αποστολή",
    completePhase: "Ολοκληρώθηκε",
    serviceReadiness: "Απόδοση & Ετοιμότητα Υπηρεσιών",
    serviceSubtitle: "Ζωντανές μετρήσεις βάσει του τρέχοντος εύρους ζώνης και της καθυστέρησής σας.",
    broadbandGrade: "Κατηγορία Παρόχου A+",
    streaming4k: "Streaming 4K / 8K",
    streamingDesc: "Αναπαραγωγή χωρίς διακοπές σε YouTube & Netflix",
    cloudGaming: "Online & Cloud Gaming",
    gamingExcellent: "Επαγγελματικό Επίπεδο",
    gamingGood: "Ομαλό Παιχνίδι",
    gamingAverage: "Καθημερινό Παιχνίδι",
    gamingDesc: "Βελτιστοποιημένο για multiplayer χαμηλής καθυστέρησης",
    latencyTag: "καθυστέρηση",
    videoConference: "Τηλεδιάσκεψη",
    conferenceGrade: "Πολλαπλές Ροές HD",
    conferenceDesc: "Απρόσκοπτο για Zoom, Teams & Google Meet",
    cloudBackup: "Συγχρονισμός Cloud & Μεγάλα Αρχεία",
    backupFast: "Υπερταχύ",
    backupStandard: "Γρήγορο & Σταθερό",
    backupBasic: "Τυπική Ταχύτητα",
    backupDesc: "Ταχύς συγχρονισμός με Google Drive & iCloud"
  }
};

const NQS_T: Record<string, {
  title: string;
  streaming: string;
  gaming: string;
  videoCalls: string;
  desc: string;
  pending: string;
  streamingHint: string;
  gamingHint: string;
  videoCallsHint: string;
}> = {
  English: {
    title: "Network Quality Score",
    streaming: "Streaming",
    gaming: "Gaming",
    videoCalls: "Video Calls",
    desc: "Network Quality Score rates real-world experience on a 1 to 5 star scale (5 / 5 = optimal) using your live download speed, upload bandwidth, round-trip latency, and jitter.",
    pending: "Run the speed test above to calculate your live Network Quality Score.",
    streamingHint: "Based on download throughput and jitter for smooth 4K/HDR playback.",
    gamingHint: "Based on latency, jitter, and packet consistency for responsive multiplayer.",
    videoCallsHint: "Based on upload/download symmetry, latency, and jitter for HD calls."
  },
  Spanish: {
    title: "Puntuación de calidad de red",
    streaming: "Streaming",
    gaming: "Gaming",
    videoCalls: "Videollamadas",
    desc: "La puntuación evalúa la experiencia real en una escala de 1 a 5 estrellas (5 / 5 = óptimo) según la velocidad de descarga, subida, latencia y jitter en vivo.",
    pending: "Ejecute la prueba de velocidad para calcular su puntuación en vivo.",
    streamingHint: "Basado en velocidad de descarga y jitter para reproducción 4K fluida.",
    gamingHint: "Basado en latencia y jitter para partidas multijugador fluidas.",
    videoCallsHint: "Basado en ancho de banda de subida/bajada y latencia para videollamadas HD."
  },
  French: {
    title: "Score de qualité réseau",
    streaming: "Streaming",
    gaming: "Jeux vidéo",
    videoCalls: "Appels vidéo",
    desc: "Le score évalue l'expérience réelle sur une échelle de 1 à 5 étoiles (5 / 5 = optimal) à partir du débit descendant, montant, de la latence et de la gigue.",
    pending: "Lancez le test de vitesse ci-dessus pour calculer votre score en direct.",
    streamingHint: "Basé sur le débit descendant et la gigue pour une lecture 4K fluide.",
    gamingHint: "Basé sur la latence et la gigue pour le jeu multijoueur réactif.",
    videoCallsHint: "Basé sur la symétrie débit/latence pour des appels vidéo HD stables."
  },
  German: {
    title: "Netzwerkqualitätswert",
    streaming: "Streaming",
    gaming: "Gaming",
    videoCalls: "Videoanrufe",
    desc: "Der Qualitätswert bewertet die reale Nutzung auf einer Skala von 1 bis 5 Sternen (5 / 5 = optimal) anhand von Download-, Upload-Rate, Latenz und Jitter.",
    pending: "Starten Sie den Geschwindigkeitstest oben für Ihre Live-Bewertung.",
    streamingHint: "Basierend auf Download-Rate und Jitter für flüssiges 4K-Streaming.",
    gamingHint: "Basierend auf Latenz und Jitter für reaktionsschnelles Multiplayer-Gaming.",
    videoCallsHint: "Basierend auf Upload-/Download-Balance und Latenz für HD-Konferenzen."
  },
  Chinese: {
    title: "网络质量评分",
    streaming: "流媒体播放",
    gaming: "在线游戏",
    videoCalls: "视频通话",
    desc: "网络质量评分采用 1 至 5 星评级标准（5 / 5 为最佳），基于实测下载速度、上传带宽、往返延迟和抖动，综合评估三大真实场景体验。",
    pending: "请运行上方测速以计算实时网络质量评分。",
    streamingHint: "依据下载带宽与网络抖动评估 4K/HDR 超清播放流畅度。",
    gamingHint: "依据响应延迟与抖动评估多人联机实时响应表现。",
    videoCallsHint: "依据上下行带宽与延迟评估高清多人视频通话稳定性。"
  },
  'Chinese Traditional': {
    title: "網路品質評分",
    streaming: "串流影音",
    gaming: "線上遊戲",
    videoCalls: "視訊通話",
    desc: "網路品質評分採用 1 至 5 星評級標準（5 / 5 為最佳），依據實測下載速度、上傳頻寬、往返延遲與抖動，綜合評估三大真實使用情境。",
    pending: "請執行上方測速以計算即時網路品質評分。",
    streamingHint: "依據下載頻寬與抖動評估 4K/HDR 串流播放流暢度。",
    gamingHint: "依據延遲與抖動評估多人連線即時反應表現。",
    videoCallsHint: "依據上下行頻寬與延遲評估高畫質視訊通話穩定性。"
  },
  Japanese: {
    title: "ネットワーク品質スコア",
    streaming: "ストリーミング",
    gaming: "ゲーム",
    videoCalls: "ビデオ通話",
    desc: "実測のダウンロード・アップロード速度、レイテンシ、ジッターから実用品質を1〜5つ星（5 / 5 が最高）で評価します。",
    pending: "上の速度テストを実行するとリアルタイム品質スコアが算出されます。",
    streamingHint: "ダウンロード速度とジッターから4K再生の安定性を評価。",
    gamingHint: "レイテンシとジッターからオンライン対戦の応答性を評価。",
    videoCallsHint: "送受信速度と遅延のバランスからHD通話品質を評価。"
  },
  Korean: {
    title: "네트워크 품질 점수",
    streaming: "스트리밍",
    gaming: "게이밍",
    videoCalls: "화상 통화",
    desc: "실시간 다운로드·업로드 속도, 지연 시간, 지터를 바탕으로 실제 체감 품질을 1~5점 척도(5 / 5 만점)로 평가합니다.",
    pending: "위의 속도 측정을 실행하면 실시간 품질 점수가 계산됩니다.",
    streamingHint: "다운로드 대역폭과 지터를 기반으로 4K 재생 안정성을 평가합니다.",
    gamingHint: "지연 시간과 지터를 기반으로 멀티플레이 반응성을 평가합니다.",
    videoCallsHint: "업로드·다운로드 대칭성과 지연 시간으로 HD 통화 품질을 평가합니다."
  },
  Italian: {
    title: "Punteggio qualità della rete",
    streaming: "Streaming",
    gaming: "Gaming",
    videoCalls: "Videochiamate",
    desc: "Valuta l'esperienza reale su una scala da 1 a 5 stelle (5 / 5 = ottimale) utilizzando velocità di download, upload, latenza e jitter misurati.",
    pending: "Esegui il test di velocità sopra per calcolare il punteggio in tempo reale.",
    streamingHint: "Basato su velocità di download e jitter per riproduzione 4K fluida.",
    gamingHint: "Basato su latenza e jitter per multiplayer reattivo.",
    videoCallsHint: "Basato su banda upload/download e latenza per chiamate HD."
  },
  Russian: {
    title: "Оценка качества сети",
    streaming: "Стриминг",
    gaming: "Игры",
    videoCalls: "Видеозвонки",
    desc: "Оценка качества подключения по шкале от 1 до 5 звёзд (5 / 5 — максимум) на основе скорости загрузки, отдачи, пинга и джиттера.",
    pending: "Запустите тест скорости выше, чтобы рассчитать оценку качества сети.",
    streamingHint: "На основе скорости загрузки и джиттера для плавного 4K-видео.",
    gamingHint: "На основе задержки и джиттера для отзывчивой онлайн-игры.",
    videoCallsHint: "На основе баланса отдачи/загрузки и задержки для HD-звонков."
  },
  Luxembourgish: {
    title: "Netzwierkqualitéits-Score",
    streaming: "Streaming",
    gaming: "Gaming",
    videoCalls: "Video-Uriff",
    desc: "Bewäert d'Alldagsqualitéit op enger Skala vun 1 bis 5 Stären (5 / 5 = optimal) op Basis vun Download-, Upload-Vitesse, Latenz a Jitter.",
    pending: "Start de Vitesse-Test uewen fir Äre Live-Score ze berechnen.",
    streamingHint: "Baséiert op Download-Vitesse a Jitter fir flëssegt 4K-Streaming.",
    gamingHint: "Baséiert op Latenz a Jitter fir séier Multiplayer-Reaktiounen.",
    videoCallsHint: "Baséiert op Upload/Download a Latenz fir stabil HD-Konferenzen."
  },
  Dutch: {
    title: "Netwerkkwaliteitsscore",
    streaming: "Streaming",
    gaming: "Gaming",
    videoCalls: "Videogesprekken",
    desc: "Beoordeelt uw praktijkervaring op een schaal van 1 tot 5 sterren (5 / 5 = optimaal) op basis van downloadsnelheid, uploadsnelheid, latentie en jitter.",
    pending: "Voer de snelheidstest hierboven uit om uw live score te berekenen.",
    streamingHint: "Gebaseerd op downloadsnelheid en jitter voor vloeiende 4K-streams.",
    gamingHint: "Gebaseerd op latentie en jitter voor responsieve multiplayer.",
    videoCallsHint: "Gebaseerd op upload-/downloadsnelheid en latentie voor HD-gesprekken."
  },
  Swedish: {
    title: "Nätverkskvalitetspoäng",
    streaming: "Streaming",
    gaming: "Gaming",
    videoCalls: "Videosamtal",
    desc: "Bedömer verklig upplevelse på en skala från 1 till 5 stjärnor (5 / 5 = optimalt) utifrån uppmätt nedladdning, uppladdning, latens och jitter.",
    pending: "Kör hastighetstestet ovan för att beräkna din poäng i realtid.",
    streamingHint: "Baseras på nedladdningshastighet och jitter för jämn 4K-strömning.",
    gamingHint: "Baseras på latens och jitter för snabb respons i spel.",
    videoCallsHint: "Baseras på uppladdning, nedladdning och latens för HD-samtal."
  },
  Finnish: {
    title: "Verkon laatupisteet",
    streaming: "Suoratoisto",
    gaming: "Pelaaminen",
    videoCalls: "Videopuhelut",
    desc: "Arvioi todellista käyttökokemusta asteikolla 1–5 tähteä (5 / 5 = paras) mitatun lataus-, lähetysnopeuden, viiveen ja värinän perusteella.",
    pending: "Suorita yllä oleva nopeustesti nähdäksesi reaaliaikaiset laatupisteet.",
    streamingHint: "Perustuu latausnopeuteen ja värinään 4K-toiston vakaudessa.",
    gamingHint: "Perustuu viiveeseen ja värinään verkkopelien vasteajassa.",
    videoCallsHint: "Perustuu lähetys-/latausnopeuteen ja viiveeseen HD-puheluissa."
  },
  Hindi: {
    title: "नेटवर्क गुणवत्ता स्कोर",
    streaming: "स्ट्रीमिंग",
    gaming: "गेमिंग",
    videoCalls: "वीडियो कॉल",
    desc: "यह स्कोर लाइव डाउनलोड, अपलोड गति, लेटेंसी और जिटर के आधार पर 1 से 5 स्टार पैमाने (5 / 5 = सर्वश्रेष्ठ) पर वास्तविक अनुभव दर्शाता है।",
    pending: "लाइव नेटवर्क गुणवत्ता स्कोर देखने के लिए ऊपर स्पीड टेस्ट चलाएँ।",
    streamingHint: "सुचारू 4K प्लेबैक के लिए डाउनलोड गति और जिटर पर आधारित।",
    gamingHint: "कम लेटेंसी और जिटर के साथ मल्टीप्लेयर प्रतिक्रिया पर आधारित।",
    videoCallsHint: "HD वीडियो कॉल के लिए अपलोड/डाउनलोड और लेटेंसी पर आधारित।"
  },
  Norwegian: {
    title: "Nettverkskvalitetspoeng",
    streaming: "Strømming",
    gaming: "Spilling",
    videoCalls: "Videosamtaler",
    desc: "Vurderer brukeropplevelsen på en skala fra 1 til 5 stjerner (5 / 5 = optimalt) basert på målt nedlasting, opplasting, forsinkelse og jitter.",
    pending: "Kjør hastighetstesten ovenfor for å beregne din sanntidsscore.",
    streamingHint: "Basert på nedlastingshastighet og jitter for jevn 4K-avspilling.",
    gamingHint: "Basert på forsinkelse og jitter for rask respons i flerspiller.",
    videoCallsHint: "Basert på opplasting, nedlasting og forsinkelse for HD-samtaler."
  },
  Thai: {
    title: "คะแนนคุณภาพเครือข่าย",
    streaming: "สตรีมมิง",
    gaming: "เล่นเกม",
    videoCalls: "วิดีโอคอล",
    desc: "ประเมินคุณภาพการใช้งานจริงบนระดับ 1 ถึง 5 ดาว (5 / 5 = ดีที่สุด) จากความเร็วดาวน์โหลด อัปโหลด ความหน่วง และจิตเตอร์ที่วัดได้",
    pending: "กดเริ่มทดสอบความเร็วด้านบนเพื่อคำนวณคะแนนคุณภาพแบบเรียลไทม์",
    streamingHint: "คำนวณจากความเร็วดาวน์โหลดและจิตเตอร์สำหรับการรับชม 4K",
    gamingHint: "คำนวณจากความหน่วงและจิตเตอร์เพื่อการตอบสนองในเกมออนไลน์",
    videoCallsHint: "คำนวณจากความเร็วอัปโหลด/ดาวน์โหลดและความหน่วงสำหรับวิดีโอคอล HD"
  },
  Portuguese: {
    title: "Pontuação de Qualidade da Rede",
    streaming: "Streaming",
    gaming: "Jogos",
    videoCalls: "Videochamadas",
    desc: "Avalia a experiência real numa escala de 1 a 5 estrelas (5 / 5 = ótimo) com base na velocidade de download, upload, latência e jitter medidos.",
    pending: "Execute o teste de velocidade acima para calcular a sua pontuação em direto.",
    streamingHint: "Baseado na largura de banda de download e jitter para reprodução 4K.",
    gamingHint: "Baseado na latência e jitter para jogos multijogador reativos.",
    videoCallsHint: "Baseado na simetria de upload/download e latência para chamadas HD."
  },
  Vietnamese: {
    title: "Điểm chất lượng mạng",
    streaming: "Phát trực tuyến",
    gaming: "Chơi game",
    videoCalls: "Gọi video",
    desc: "Đánh giá trải nghiệm thực tế theo thang điểm 1 đến 5 sao (5 / 5 = tối ưu) dựa trên tốc độ tải xuống, tải lên, độ trễ và độ dao động đo được.",
    pending: "Chạy kiểm tra tốc độ ở trên để tính điểm chất lượng mạng trực tiếp.",
    streamingHint: "Dựa trên tốc độ tải xuống và độ dao động cho phát 4K mượt mà.",
    gamingHint: "Dựa trên độ trễ và độ ổn định gói tin cho game trực tuyến.",
    videoCallsHint: "Dựa trên cân bằng tải lên/xuống và độ trễ cho cuộc gọi HD."
  },
  Polish: {
    title: "Ocena jakości sieci",
    streaming: "Streaming",
    gaming: "Gry",
    videoCalls: "Rozmowy wideo",
    desc: "Ocenia rzeczywistą jakość połączenia w skali od 1 do 5 gwiazdek (5 / 5 = optymalnie) na podstawie prędkości pobierania, wysyłania, opóźnień i jittera.",
    pending: "Uruchom powyższy test prędkości, aby obliczyć wynik jakości na żywo.",
    streamingHint: "Na podstawie pobierania i jittera dla płynnego odtwarzania 4K.",
    gamingHint: "Na podstawie opóźnienia i jittera dla szybkiej gry wieloosobowej.",
    videoCallsHint: "Na podstawie równowagi wysyłania/pobierania i opóźnienia dla HD."
  },
  Danish: {
    title: "Netværkskvalitetsscore",
    streaming: "Streaming",
    gaming: "Gaming",
    videoCalls: "Videoopkald",
    desc: "Vurderer den reelle oplevelse på en skala fra 1 til 5 stjerner (5 / 5 = optimalt) ud fra målt download, upload, forsinkelse og jitter.",
    pending: "Kør hastighedstesten ovenfor for at beregne din live-score.",
    streamingHint: "Baseret på downloadhastighed og jitter for jævn 4K-afspilning.",
    gamingHint: "Baseret på forsinkelse og jitter for hurtig multiplayer-respons.",
    videoCallsHint: "Baseret på upload/download og forsinkelse for HD-opkald."
  },
  Turkish: {
    title: "Ağ Kalite Puanı",
    streaming: "Yayın İzleme",
    gaming: "Oyun",
    videoCalls: "Görüntülü Görüşme",
    desc: "Ölçülen indirme, yükleme hızı, gecikme ve jitter değerleriyle gerçek kullanım deneyimini 1 ile 5 yıldız arasında (5 / 5 = en iyi) puanlar.",
    pending: "Canlı Ağ Kalite Puanınızı hesaplamak için yukarıdaki hız testini çalıştırın.",
    streamingHint: "Akıcı 4K oynatma için indirme hızı ve jitter değerine dayanır.",
    gamingHint: "Hızlı çevrimiçi oyun tepkisi için gecikme ve jitter değerine dayanır.",
    videoCallsHint: "HD görüntülü görüşmeler için yükleme/indirme ve gecikmeye dayanır."
  },
  Greek: {
    title: "Βαθμολογία Ποιότητας Δικτύου",
    streaming: "Streaming",
    gaming: "Παιχνίδια",
    videoCalls: "Βιντεοκλήσεις",
    desc: "Αξιολογεί την πραγματική εμπειρία σε κλίμακα 1 έως 5 αστέρων (5 / 5 = άριστη) βάσει ταχύτητας λήψης, αποστολής, καθυστέρησης και jitter.",
    pending: "Εκτελέστε τη δοκιμή ταχύτητας παραπάνω για να υπολογιστεί η βαθμολογία σας.",
    streamingHint: "Βασίζεται στην ταχύτητα λήψης και το jitter για ομαλή αναπαραγωγή 4K.",
    gamingHint: "Βασίζεται στην καθυστέρηση και το jitter για άμεση απόκριση multiplayer.",
    videoCallsHint: "Βασίζεται στη συμμετρία αποστολής/λήψης και την καθυστέρηση για HD κλήσεις."
  }
};

function QualityStars({ score, rated }: { score: number; rated: boolean }) {
  return (
    <div className="flex items-center gap-1 mt-1" aria-label={rated ? `${score.toFixed(1)} out of 5 stars` : 'Not rated yet'}>
      {[1, 2, 3, 4, 5].map((idx) => {
        const fillRatio = !rated ? 0 : Math.max(0, Math.min(1, score - (idx - 1)));
        const gradId = `nqs-half-${idx}-${Math.round(score * 10)}`;
        return (
          <svg
            key={idx}
            viewBox="0 0 24 24"
            className="nqs-star w-[17px] h-[17px] shrink-0 transition-transform duration-300"
            style={{ transform: rated && fillRatio > 0 ? 'scale(1)' : 'scale(0.96)' }}
          >
            {fillRatio > 0 && fillRatio < 1 && (
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset={`${fillRatio * 100}%`} stopColor="#9333ea" />
                  <stop offset={`${fillRatio * 100}%`} stopColor="rgba(147, 51, 234, 0.2)" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M12 2.4l2.86 5.79 6.39.93-4.62 4.51 1.09 6.36L12 16.98l-5.72 3.01 1.09-6.36L2.75 9.12l6.39-.93L12 2.4z"
              fill={
                !rated || fillRatio === 0
                  ? 'rgba(147, 51, 234, 0.16)'
                  : fillRatio >= 1
                  ? '#9333ea'
                  : `url(#${gradId})`
              }
              stroke={
                !rated || fillRatio === 0
                  ? 'rgba(147, 51, 234, 0.38)'
                  : '#7e22ce'
              }
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
}

export default function SpeedTestTab({ language = 'English' }: SpeedTestTabProps = {}) {
  const d = ST_T[language] || ST_T['English'];
  const nqs = NQS_T[language] || NQS_T['English'];
  const [speed, setSpeed] = useState<string | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);
  const [testPhase, setTestPhase] = useState<'idle' | 'latency' | 'download' | 'upload' | 'complete'>('idle');
  const [liveValue, setLiveValue] = useState<number>(0);

  const runSpeedTest = async () => {
    setIsTestingSpeed(true);
    setSpeed(null);
    setUploadSpeed(null);
    setLatency(null);
    setJitter(null);
    setLiveValue(0);

    // Phase 1: Accurate RTT Latency & Jitter using Server-Timing TCP RTT + ResourceTiming (excluding Worker CPU delay)
    setTestPhase('latency');
    const samples: number[] = [];
    const l4VarSamples: number[] = [];
    try {
      // Warm-up keep-alive HTTP/2+TLS sockets
      await Promise.allSettled([
        fetch(`https://speed.cloudflare.com/__down?bytes=0&w=1_${Date.now()}`, { cache: 'no-store' }),
        fetch(`https://speed.cloudflare.com/__down?bytes=0&w=2_${Date.now()}`, { cache: 'no-store' }),
      ]);
      for (let i = 0; i < 10; i++) {
        const url = `https://speed.cloudflare.com/__down?bytes=0&r=${Date.now()}_${i}`;
        const t0 = performance.now();
        const res = await fetch(url, { cache: 'no-store' });
        const elapsed = performance.now() - t0;

        const st = res.headers.get('server-timing') || '';
        const l4RttMatch = st.match(/\brtt=(\d+)/);
        const l4VarMatch = st.match(/\brtt_var=(\d+)/);
        const workerMatch = st.match(/cfSpeedWorker;dur=([\d.]+)/i);
        const workerDur = workerMatch ? Number(workerMatch[1]) : 0;

        if (l4VarMatch) {
          const varMs = Number(l4VarMatch[1]) / 1000;
          if (Number.isFinite(varMs) && varMs > 0) l4VarSamples.push(varMs);
        }

        if (l4RttMatch) {
          const rttMs = Number(l4RttMatch[1]) / 1000;
          if (Number.isFinite(rttMs) && rttMs > 0 && rttMs < 2000) {
            samples.push(rttMs);
            continue;
          }
        }

        const perfEntry = typeof performance !== 'undefined'
          ? (performance.getEntriesByName(url).pop() as PerformanceResourceTiming | undefined)
          : undefined;
        const httpRtt =
          perfEntry && perfEntry.responseStart > 0 && perfEntry.requestStart > 0
            ? perfEntry.responseStart - perfEntry.requestStart
            : elapsed;

        const cleanRtt = httpRtt > workerDur + 1 ? httpRtt - workerDur : httpRtt;
        samples.push(Math.max(1, cleanRtt));
      }
    } catch {
      // fallback handled below
    }

    let finalLatency = 18;
    let finalJitter = 3;
    if (samples.length >= 2) {
      const sorted = [...samples].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      finalLatency = Math.max(1, Math.round(median));
      const clean = samples.filter((s) => s <= Math.max(median * 3, median + 35));
      if (clean.length >= 2) {
        let diffSum = 0;
        for (let i = 1; i < clean.length; i++) {
          diffSum += Math.abs(clean[i] - clean[i - 1]);
        }
        const rawJitter = diffSum / (clean.length - 1);
        finalJitter = Math.max(0.5, Number(rawJitter.toFixed(1)));
      } else if (l4VarSamples.length > 0) {
        const medVar = l4VarSamples[Math.floor(l4VarSamples.length / 2)];
        finalJitter = Math.max(0.5, Number(medVar.toFixed(1)));
      }
    }
    setLatency(finalLatency);
    setJitter(finalJitter);

    // Phase 2: Genuine Download Throughput via sequential complete transfers & PerformanceResourceTiming (responseEnd - responseStart)
    setTestPhase('download');
    setLiveValue(0);
    let finalDownloadMbps = 0;

    const measureSingleDownload = async (bytes: number, stepLabel: string) => {
      const url = `https://speed.cloudflare.com/__down?bytes=${bytes}&r=${Date.now()}_${stepLabel}`;
      const res = await fetch(url, { cache: 'no-store' });
      const tHeaders = performance.now();
      let receivedBytes = 0;
      let lastVisualUpdate = tHeaders;

      if (res.body) {
        const reader = res.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            receivedBytes += value.byteLength;
            const now = performance.now();
            const elapsedSec = (now - tHeaders) / 1000;
            if (elapsedSec > 0.12 && now - lastVisualUpdate >= 120) {
              lastVisualUpdate = now;
              const liveMbps = (receivedBytes * 8) / elapsedSec / (1000 * 1000);
              if (Number.isFinite(liveMbps) && liveMbps > 0) {
                setLiveValue(liveMbps);
                setSpeed(liveMbps.toFixed(2));
              }
            }
          }
        }
      } else {
        const buf = await res.arrayBuffer();
        receivedBytes = buf.byteLength;
      }

      const fallbackEnd = performance.now();
      await new Promise((resolve) => setTimeout(resolve, 0));

      const perfEntry = typeof performance !== 'undefined'
        ? (performance.getEntriesByName(url).pop() as PerformanceResourceTiming | undefined)
        : undefined;

      const wireMs =
        perfEntry && perfEntry.responseEnd > perfEntry.responseStart && perfEntry.responseStart > 0
          ? perfEntry.responseEnd - perfEntry.responseStart
          : Math.max(15, fallbackEnd - tHeaders);

      const exactBytes = receivedBytes > 0 ? receivedBytes : bytes;
      const mbps = (exactBytes * 8) / (wireMs / 1000) / (1000 * 1000);
      return { bytes: exactBytes, wireMs, mbps };
    };

    try {
      // Warm up TCP congestion window (CWND) with 1 MB transfer (excluded from final average)
      const warmup = await measureSingleDownload(1_000_000, 'dl_warmup');
      if (Number.isFinite(warmup.mbps) && warmup.mbps > 0) {
        setLiveValue(warmup.mbps);
        setSpeed(warmup.mbps.toFixed(2));
      }

      let totalPostWarmupBytes = 0;
      let totalPostWarmupWireMs = 0;

      // Step 1: 5 MB measurement
      const step1 = await measureSingleDownload(5_000_000, 'dl_step1');
      if (Number.isFinite(step1.mbps) && step1.mbps > 0) {
        totalPostWarmupBytes += step1.bytes;
        totalPostWarmupWireMs += step1.wireMs;
        const runningMbps = (totalPostWarmupBytes * 8) / (totalPostWarmupWireMs / 1000) / (1000 * 1000);
        setLiveValue(runningMbps);
        setSpeed(runningMbps.toFixed(2));
      }

      // Step 2: Adaptive 15 MB (or 5 MB on slower links)
      const step2Size = step1.mbps >= 15 ? 15_000_000 : 5_000_000;
      const step2 = await measureSingleDownload(step2Size, 'dl_step2');
      if (Number.isFinite(step2.mbps) && step2.mbps > 0) {
        totalPostWarmupBytes += step2.bytes;
        totalPostWarmupWireMs += step2.wireMs;
        const runningMbps = (totalPostWarmupBytes * 8) / (totalPostWarmupWireMs / 1000) / (1000 * 1000);
        setLiveValue(runningMbps);
        setSpeed(runningMbps.toFixed(2));
      }

      // Step 3: 25 MB on >=35 Mbps links (or 10 MB on 15-35 Mbps links) to measure steady-state sustained throughput
      if (step2.mbps >= 15) {
        const step3Size = step2.mbps >= 35 ? 25_000_000 : 10_000_000;
        const step3 = await measureSingleDownload(step3Size, 'dl_step3');
        if (Number.isFinite(step3.mbps) && step3.mbps > 0) {
          totalPostWarmupBytes += step3.bytes;
          totalPostWarmupWireMs += step3.wireMs;
        }
      }

      if (totalPostWarmupBytes > 0 && totalPostWarmupWireMs > 0) {
        finalDownloadMbps = (totalPostWarmupBytes * 8) / (totalPostWarmupWireMs / 1000) / (1000 * 1000);
      }
    } catch {
      finalDownloadMbps = 0;
    }

    if (!Number.isFinite(finalDownloadMbps) || finalDownloadMbps <= 0) {
      finalDownloadMbps = 0;
    }
    setSpeed(finalDownloadMbps.toFixed(2));
    setLiveValue(finalDownloadMbps);

    // Phase 3: Genuine Server-Acknowledged Upload Throughput via sequential complete POST transfers
    setTestPhase('upload');
    setLiveValue(0);
    let finalUploadMbps = 0;

    const measureSingleUpload = (bytes: number, stepLabel: string) =>
      new Promise<{ bytes: number; wireMs: number; mbps: number } | null>((resolve) => {
        const url = `https://speed.cloudflare.com/__up?u=${Date.now()}_${stepLabel}`;
        const body = new Uint8Array(bytes);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        const reqStart = performance.now();
        let lastVisualUpdate = reqStart;

        xhr.upload.onprogress = (ev) => {
          const now = performance.now();
          const elapsedMs = now - reqStart;
          // Skip the initial 250ms OS TCP send-buffer burst when animating the visual gauge
          if (elapsedMs > 250 && ev.loaded > 0 && now - lastVisualUpdate >= 120) {
            lastVisualUpdate = now;
            const visualMbps = (ev.loaded * 8) / (elapsedMs / 1000) / (1000 * 1000);
            if (Number.isFinite(visualMbps) && visualMbps > 0) {
              setLiveValue(visualMbps);
              setUploadSpeed(visualMbps.toFixed(2));
            }
          }
        };

        xhr.onload = () => {
          const fallbackEnd = performance.now();
          if (xhr.status < 200 || xhr.status >= 400) {
            resolve(null);
            return;
          }
          const st = xhr.getResponseHeader('server-timing') || '';
          const l4RttMatch = st.match(/\brtt=(\d+)/);
          const rttMs = l4RttMatch ? Number(l4RttMatch[1]) / 1000 : finalLatency;

          setTimeout(() => {
            const perfEntry = typeof performance !== 'undefined'
              ? (performance.getEntriesByName(url).pop() as PerformanceResourceTiming | undefined)
              : undefined;
            const rawRoundTripMs =
              perfEntry && perfEntry.responseStart > perfEntry.requestStart && perfEntry.requestStart > 0
                ? perfEntry.responseStart - perfEntry.requestStart
                : fallbackEnd - reqStart;
            // Subtract ~1 RTT between last byte uploaded and server response arrival (never subtract cfSpeedWorker on __up as it includes body upload read time)
            const wireMs = Math.max(25, rawRoundTripMs - Math.min(rttMs, rawRoundTripMs * 0.25));
            const mbps = (bytes * 8) / (wireMs / 1000) / (1000 * 1000);
            resolve({ bytes, wireMs, mbps });
          }, 0);
        };

        xhr.onerror = () => resolve(null);
        xhr.onabort = () => resolve(null);
        xhr.send(body);
      });

    try {
      // Warm up HTTP/2 upload stream with 512 KB (excluded from final average)
      await measureSingleUpload(512 * 1024, 'ul_warmup');

      const uploadSteps =
        finalDownloadMbps >= 80
          ? [3_000_000, 6_000_000]
          : finalDownloadMbps >= 25
          ? [2_000_000, 4_000_000]
          : [1_000_000, 2_000_000];

      let totalUpBytes = 0;
      let totalUpWireMs = 0;

      for (let i = 0; i < uploadSteps.length; i++) {
        const res = await measureSingleUpload(uploadSteps[i], `ul_step${i + 1}`);
        if (res && Number.isFinite(res.mbps) && res.mbps > 0) {
          totalUpBytes += res.bytes;
          totalUpWireMs += res.wireMs;
          const runningUpMbps = (totalUpBytes * 8) / (totalUpWireMs / 1000) / (1000 * 1000);
          setLiveValue(runningUpMbps);
          setUploadSpeed(runningUpMbps.toFixed(2));
        }
      }

      if (totalUpBytes > 0 && totalUpWireMs > 0) {
        finalUploadMbps = (totalUpBytes * 8) / (totalUpWireMs / 1000) / (1000 * 1000);
      }
    } catch {
      finalUploadMbps = 0;
    }

    if (!Number.isFinite(finalUploadMbps) || finalUploadMbps < 0) {
      finalUploadMbps = 0;
    }

    setUploadSpeed(finalUploadMbps.toFixed(2));
    setLiveValue(finalDownloadMbps);
    setTestPhase('complete');
    setIsTestingSpeed(false);
  };

  const parsedDownload = speed ? parseFloat(speed) : 0;
  const parsedUpload = uploadSpeed ? parseFloat(uploadSpeed) : 0;
  const hasQualityScore = speed !== null && latency !== null;

  const computeQualityScores = () => {
    if (!hasQualityScore) {
      return { streaming: 0, gaming: 0, videoCalls: 0 };
    }
    const dl = parsedDownload;
    const ul = parsedUpload > 0 ? parsedUpload : dl * 0.3;
    const ping = latency ?? 40;
    const jit = jitter ?? 5;

    let streaming = 1;
    if (dl >= 50) streaming = 5;
    else if (dl >= 25) streaming = 4.5;
    else if (dl >= 15) streaming = 4;
    else if (dl >= 8) streaming = 3;
    else if (dl >= 3) streaming = 2;
    if (jit > 30) streaming = Math.max(1, streaming - 0.5);
    if (ping > 150) streaming = Math.max(1, streaming - 0.5);

    let gaming = 1;
    if (ping <= 25 && jit <= 8 && dl >= 15) gaming = 5;
    else if (ping <= 45 && jit <= 15 && dl >= 10) gaming = 4.5;
    else if (ping <= 70 && jit <= 25 && dl >= 5) gaming = 4;
    else if (ping <= 105 && jit <= 35) gaming = 3;
    else if (ping <= 150) gaming = 2;

    let videoCalls = 1;
    if (ul >= 15 && dl >= 20 && ping <= 60 && jit <= 18) videoCalls = 5;
    else if (ul >= 8 && dl >= 10 && ping <= 95 && jit <= 28) videoCalls = 4.5;
    else if (ul >= 4 && dl >= 5 && ping <= 130) videoCalls = 4;
    else if (ul >= 1.5 && dl >= 3) videoCalls = 3;
    else if (ul >= 0.5) videoCalls = 2;

    return { streaming, gaming, videoCalls };
  };

  const qualityScores = computeQualityScores();

  // Convert current speed metric to rotation angle (max metric range 500mbps = 270 deg)
  const maxSpeedRange = 400;
  const currentRotation = Math.min((liveValue / maxSpeedRange) * 270, 270) - 135;

  const getPhaseLabel = (phase: string) => {
    switch(phase) {
      case 'latency': return d.latencyPhase;
      case 'download': return d.downloadPhase;
      case 'upload': return d.uploadPhase;
      case 'complete': return d.completePhase;
      default: return phase;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto speedtest-tab-card relative z-10 transition-all duration-300 flex flex-col gap-6">
      
      {/* Broadband Speed Diagnostics Webcard Header */}
      <div className="w-full GeekTabs-card weather-huawei-style webcard-light-grey-bg rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Gauge size={18} className="text-purple-500 animate-pulse" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-purple-500">{d.broadband}</span>
          </div>
          <h1 
            className="speedtest-analyzer-title text-2xl sm:text-3xl font-black tracking-tight word-color"
          >
            {d.analyzer}
          </h1>
          <p className="text-sm word-color opacity-50 mt-1.5 font-medium">{d.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-mono shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <Server size={14} className="text-purple-500" />
            <span className="opacity-60 word-color">{d.hostServer}:</span>
            <span className="font-bold word-color">{d.autoOptimized}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* BIG INTERACTIVE CIRCULAR GAUGE AND STATUS AREA */}
        <div className="lg:col-span-8 flex flex-col justify-center items-center GeekTabs-card weather-huawei-style webcard-light-grey-bg rounded-3xl lg:rounded-[2.5rem] p-5 sm:p-8 min-h-[360px] sm:min-h-[420px] lg:min-h-[480px] relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          {/* Circular speeddial wrapper */}
          <div className="relative w-60 h-60 sm:w-68 sm:h-68 lg:w-72 lg:h-72 flex items-center justify-center">
            
            {/* Center core dial elements */}
            <svg viewBox="0 0 256 256" className="absolute inset-0 -rotate-90 w-full h-full p-4 pointer-events-none">
              <circle
                cx="128"
                cy="128"
                r="104"
                className="stroke-black/5 dark:stroke-white/5 fill-none"
                strokeWidth="10"
                strokeDasharray="490"
                strokeDashoffset="160"
                transform="rotate(135 128 128)"
              />
              <circle
                cx="128"
                cy="128"
                r="104"
                className={`transition-all duration-300 fill-none ${
                  testPhase === 'download' ? 'stroke-purple-500' : testPhase === 'upload' ? 'stroke-indigo-500' : 'stroke-purple-500/20'
                }`}
                strokeWidth="10"
                strokeDasharray="491"
                strokeDashoffset={491 - (491 * Math.min(liveValue, maxSpeedRange)) / maxSpeedRange}
                transform="rotate(135 128 128)"
              />
            </svg>

            {/* Glowing gauge arrow */}
            <div 
              className="absolute inset-0 flex items-center justify-center transition-transform duration-100 ease-out pointer-events-none"
              style={{ transform: `rotate(${currentRotation}deg)` }}
            >
              <div className="w-1.5 h-24 bg-gradient-to-t from-purple-500 to-transparent rounded-full -translate-y-12" />
            </div>

            {/* Center Interactive Button / Live readout */}
            <div className="speedtest-center-circle absolute inset-8 rounded-full shadow-2xl flex flex-col items-center justify-center text-center p-6 z-10 select-none transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-500/35 shadow-purple-500/20">
              {testPhase === 'idle' ? (
                <button
                  onClick={runSpeedTest}
                  style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                  className="speedtest-start-button speedtest-start-btn w-full h-full rounded-full flex flex-col items-center justify-center gap-1.5 group/btn cursor-pointer transition-colors !text-white text-white"
                >
                  <span className="speedtest-btn-text speedtest-start-label text-2xl font-black tracking-tight !text-white text-white group-hover/btn:scale-105 transition-transform" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{d.start}</span>
                  <span className="speedtest-btn-text speedtest-start-sublabel text-[10px] !text-white text-white uppercase tracking-widest font-extrabold group-hover/btn:!text-white transition-colors" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{d.beginTest}</span>
                </button>
              ) : testPhase === 'complete' ? (
                <div className="flex flex-col items-center justify-center" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>
                  <span className="speedtest-btn-text text-xl sm:text-2xl font-black uppercase tracking-widest !text-white text-white" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>
                    {getPhaseLabel('complete')}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                    testPhase === 'download' ? 'text-purple-400' : testPhase === 'upload' ? 'text-indigo-400' : 'text-neutral-400'
                  }`}>
                    {getPhaseLabel(testPhase)}
                  </span>
                  <span className="speedtest-btn-text text-5xl font-black font-mono tracking-tighter !text-white text-white leading-none my-1" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>
                    {liveValue.toFixed(0)}
                  </span>
                  <span className="speedtest-btn-text text-xs uppercase font-bold !text-white text-white tracking-wider" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>Mbps</span>
                </div>
              )}
            </div>

          </div>

          {/* Diagnostics Live Status Subtitle */}
          <div className="mt-8 text-center flex flex-col items-center">
            {isTestingSpeed ? (
              <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-500 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest animate-pulse">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                <span>{d.running} ({getPhaseLabel(testPhase)})</span>
              </div>
            ) : (
              <span className="text-xs word-color opacity-50 font-medium">{d.clickStart}</span>
            )}
          </div>

        </div>

        {/* METRICS RESULTS & DETAILED SYSTEM READOUTS */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-4 sm:gap-5 lg:gap-6">
          
          {/* Main Download Metric Panel */}
          <div className="p-5 sm:p-6 GeekTabs-card weather-huawei-style webcard-light-grey-bg rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[124px] lg:min-h-[140px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-[30px]" />
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>{d.downloadSpeed}</span>
              </span>
              <span className="text-xs font-mono font-medium word-color opacity-40">CARRIER RX</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="speedtest-metric-val text-4xl md:text-5xl font-black tracking-tighter font-mono word-color">
                {speed || '0.00'}
              </span>
              <span className="speedtest-metric-unit text-sm font-black word-color">Mbps</span>
            </div>
          </div>

          {/* Upload Metric Panel */}
          <div className="p-5 sm:p-6 GeekTabs-card weather-huawei-style webcard-light-grey-bg rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[124px] lg:min-h-[140px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[30px]" />
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>{d.uploadSpeed}</span>
              </span>
              <span className="text-xs font-mono font-medium word-color opacity-40">CARRIER TX</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="speedtest-metric-val text-4xl md:text-5xl font-black tracking-tighter font-mono word-color">
                {uploadSpeed || '0.00'}
              </span>
              <span className="speedtest-metric-unit text-sm font-black word-color">Mbps</span>
            </div>
          </div>

          {/* Jitter & Latency side parameters stats */}
          <div className="sm:col-span-2 lg:col-span-1 p-5 sm:p-6 GeekTabs-card weather-huawei-style webcard-light-grey-bg rounded-3xl">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest opacity-40 word-color mb-4">{d.pingParams}</h3>
            <div className="grid grid-cols-2 gap-4">
              
              <div className="flex flex-col">
                <span className="text-[10px] font-mono opacity-50 word-color">{d.latency}</span>
                <span className="speedtest-metric-val text-2xl font-extrabold tracking-tight font-mono word-color mt-1">
                  {latency !== null ? `${latency} ms` : '--'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-mono opacity-50 word-color">{d.jitter}</span>
                <span className="speedtest-metric-val text-2xl font-extrabold tracking-tight font-mono word-color mt-1">
                  {jitter !== null ? `${jitter} ms` : '--'}
                </span>
              </div>

            </div>
          </div>

          {/* Controls Resume / Trigger */}
          <button
            onClick={runSpeedTest}
            disabled={isTestingSpeed}
            style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
            className={`speedtest-action-button sm:col-span-2 lg:col-span-1 w-full min-h-[48px] py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer !text-white text-white ${
              isTestingSpeed
                ? 'bg-black/10 dark:bg-white/11 !text-white text-white cursor-not-allowed border border-black/5 dark:border-white/5 opacity-80'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 !text-white text-white shadow-lg shadow-purple-500/10 hover:shadow-purple-500/25'
            }`}
          >
            <RefreshCw size={16} className={`!text-white text-white ${isTestingSpeed ? 'animate-spin' : ''}`} style={{ color: '#ffffff', stroke: '#ffffff' }} />
            <span className="speedtest-btn-text !text-white text-white font-bold" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>
              {isTestingSpeed ? d.diagnosticsRunning : testPhase === 'complete' ? d.retryBenchmark : d.runBenchmark}
            </span>
          </button>

        </div>

      </div>

      {/* Network Quality Score Webcard */}
      <div className="w-full GeekTabs-card weather-huawei-style webcard-light-grey-bg rounded-3xl p-6 sm:p-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info size={18} className="text-purple-500 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight word-color">
              {nqs.title}
            </h2>
          </div>
          {!hasQualityScore && (
            <span className="text-xs font-medium word-color opacity-50">
              {nqs.pending}
            </span>
          )}
        </div>

        <div className="nqs-rate-card w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/75 dark:bg-white/[0.04] px-5 sm:px-8 py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 items-center">
          {/* Streaming */}
          <div className="flex items-center justify-start sm:justify-center gap-4">
            <div className="shrink-0 word-color opacity-85" aria-hidden="true">
              <svg viewBox="0 0 42 36" className="w-10 h-9" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="36" height="24" rx="3" />
                <polygon points="18,11 27,16 18,21" />
                <line x1="14" y1="32" x2="28" y2="32" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-[15px] font-semibold word-color">{nqs.streaming}</span>
                <span className="text-xs font-mono font-bold text-purple-500">
                  {hasQualityScore ? `${qualityScores.streaming.toFixed(1)} / 5` : '— / 5'}
                </span>
              </div>
              <QualityStars score={qualityScores.streaming} rated={hasQualityScore} />
            </div>
          </div>

          {/* Gaming */}
          <div className="flex items-center justify-start sm:justify-center gap-4">
            <div className="shrink-0 word-color opacity-85" aria-hidden="true">
              <svg viewBox="0 0 44 34" className="w-11 h-9" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8h20a7 7 0 0 1 6.7 5l2.1 7.8a4.2 4.2 0 0 1-7.2 3.8L29.5 21H14.5l-4.1 3.6a4.2 4.2 0 0 1-7.2-3.8L5.3 13A7 7 0 0 1 12 8z" />
                <line x1="12" y1="12.5" x2="12" y2="17.5" />
                <line x1="9.5" y1="15" x2="14.5" y2="15" />
                <circle cx="30" cy="13.5" r="1" fill="currentColor" stroke="none" />
                <circle cx="33" cy="16" r="1" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-[15px] font-semibold word-color">{nqs.gaming}</span>
                <span className="text-xs font-mono font-bold text-purple-500">
                  {hasQualityScore ? `${qualityScores.gaming.toFixed(1)} / 5` : '— / 5'}
                </span>
              </div>
              <QualityStars score={qualityScores.gaming} rated={hasQualityScore} />
            </div>
          </div>

          {/* Video Calls */}
          <div className="flex items-center justify-start sm:justify-center gap-4">
            <div className="shrink-0 word-color opacity-85" aria-hidden="true">
              <svg viewBox="0 0 42 32" className="w-10 h-8" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="25" height="22" rx="2.5" />
                <path d="M28 12.5l10-5.5v18l-10-5.5z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-[15px] font-semibold word-color">{nqs.videoCalls}</span>
                <span className="text-xs font-mono font-bold text-purple-500">
                  {hasQualityScore ? `${qualityScores.videoCalls.toFixed(1)} / 5` : '— / 5'}
                </span>
              </div>
              <QualityStars score={qualityScores.videoCalls} rated={hasQualityScore} />
            </div>
          </div>
        </div>

        <div className="nqs-details-card rounded-2xl border border-purple-500/20 bg-purple-500/5 px-5 py-4 text-xs sm:text-sm space-y-3">
          <p className="word-color opacity-80 leading-relaxed">{nqs.desc}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5">
              <div className="font-bold text-purple-500 mb-0.5">{nqs.streaming}</div>
              <p className="text-xs word-color opacity-70">{nqs.streamingHint}</p>
            </div>
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5">
              <div className="font-bold text-purple-500 mb-0.5">{nqs.gaming}</div>
              <p className="text-xs word-color opacity-70">{nqs.gamingHint}</p>
            </div>
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5">
              <div className="font-bold text-purple-500 mb-0.5">{nqs.videoCalls}</div>
              <p className="text-xs word-color opacity-70">{nqs.videoCallsHint}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
