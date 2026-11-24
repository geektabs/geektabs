import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Globe, Copy, Check, MapPin, Shield, Cpu, RefreshCw, ShieldCheck, Lock, Activity, CheckCircle2, AlertTriangle, Plus, Minus, Info } from 'lucide-react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useMap,
  useMapsLibrary,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';

export interface IpAddressTabProps {
  language?: string;
}

const fetchWithTimeout = async (url: string, timeout = 4500, init?: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

const INITIAL_MAPS_API_KEY = (
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  (typeof process !== 'undefined' ? process.env.GOOGLE_MAPS_API_KEY : '') ||
  ''
).trim();

const EDGE_POP_COORDS: Record<string, { city: string; lat: number; lng: number }> = {
  BOS: { city: 'Boston', lat: 42.3656, lng: -71.0096 },
  EWR: { city: 'Newark', lat: 40.6895, lng: -74.1745 },
  JFK: { city: 'New York', lat: 40.6413, lng: -73.7781 },
  IAD: { city: 'Ashburn', lat: 38.9531, lng: -77.4565 },
  ORD: { city: 'Chicago', lat: 41.9742, lng: -87.9073 },
  ATL: { city: 'Atlanta', lat: 33.6407, lng: -84.4277 },
  MIA: { city: 'Miami', lat: 25.7959, lng: -80.287 },
  DFW: { city: 'Dallas', lat: 32.8998, lng: -97.0403 },
  IAH: { city: 'Houston', lat: 29.9902, lng: -95.3368 },
  DEN: { city: 'Denver', lat: 39.8561, lng: -104.6737 },
  PHX: { city: 'Phoenix', lat: 33.4342, lng: -112.0116 },
  LAX: { city: 'Los Angeles', lat: 33.9416, lng: -118.4085 },
  SJC: { city: 'San Jose', lat: 37.3639, lng: -121.9289 },
  SFO: { city: 'San Francisco', lat: 37.6213, lng: -122.379 },
  SEA: { city: 'Seattle', lat: 47.4502, lng: -122.3088 },
  YYZ: { city: 'Toronto', lat: 43.6777, lng: -79.6248 },
  YUL: { city: 'Montreal', lat: 45.4706, lng: -73.7408 },
  YVR: { city: 'Vancouver', lat: 49.1967, lng: -123.1815 },
  LHR: { city: 'London', lat: 51.47, lng: -0.4543 },
  CDG: { city: 'Paris', lat: 49.0097, lng: 2.5479 },
  AMS: { city: 'Amsterdam', lat: 52.3105, lng: 4.7683 },
  FRA: { city: 'Frankfurt', lat: 50.0379, lng: 8.5622 },
  MAD: { city: 'Madrid', lat: 40.4983, lng: -3.5676 },
  MXP: { city: 'Milan', lat: 45.6301, lng: 8.7255 },
  ZRH: { city: 'Zurich', lat: 47.4582, lng: 8.5555 },
  ARN: { city: 'Stockholm', lat: 59.6498, lng: 17.9238 },
  HEL: { city: 'Helsinki', lat: 60.3172, lng: 24.9633 },
  CPH: { city: 'Copenhagen', lat: 55.618, lng: 12.6508 },
  OSL: { city: 'Oslo', lat: 60.1976, lng: 11.1004 },
  WAW: { city: 'Warsaw', lat: 52.1657, lng: 20.9671 },
  ATH: { city: 'Athens', lat: 37.9364, lng: 23.9445 },
  IST: { city: 'Istanbul', lat: 41.2753, lng: 28.7519 },
  LUX: { city: 'Luxembourg', lat: 49.6233, lng: 6.2044 },
  LIS: { city: 'Lisbon', lat: 38.7756, lng: -9.1354 },
  DUB: { city: 'Dublin', lat: 53.4264, lng: -6.2499 },
  NRT: { city: 'Tokyo', lat: 35.772, lng: 140.3929 },
  HND: { city: 'Tokyo', lat: 35.5494, lng: 139.7798 },
  KIX: { city: 'Osaka', lat: 34.432, lng: 135.2304 },
  ICN: { city: 'Seoul', lat: 37.4602, lng: 126.4407 },
  HKG: { city: 'Hong Kong', lat: 22.308, lng: 113.9185 },
  TPE: { city: 'Taipei', lat: 25.0797, lng: 121.2342 },
  SIN: { city: 'Singapore', lat: 1.3644, lng: 103.9915 },
  BKK: { city: 'Bangkok', lat: 13.69, lng: 100.7501 },
  SGN: { city: 'Ho Chi Minh City', lat: 10.8188, lng: 106.6519 },
  HAN: { city: 'Hanoi', lat: 21.2212, lng: 105.8072 },
  BOM: { city: 'Mumbai', lat: 19.0896, lng: 72.8656 },
  DEL: { city: 'New Delhi', lat: 28.5562, lng: 77.1 },
  SYD: { city: 'Sydney', lat: -33.9399, lng: 151.1753 },
  MEL: { city: 'Melbourne', lat: -37.669, lng: 144.841 },
  GRU: { city: 'Sao Paulo', lat: -23.4356, lng: -46.4731 },
  MEX: { city: 'Mexico City', lat: 19.4361, lng: -99.0719 },
  DXB: { city: 'Dubai', lat: 25.2532, lng: 55.3657 },
  QRO: { city: 'Queretaro', lat: 20.6173, lng: -100.1857 },
  LAS: { city: 'Las Vegas', lat: 36.084, lng: -115.1537 },
  MSP: { city: 'Minneapolis', lat: 44.8848, lng: -93.2223 },
  DTW: { city: 'Detroit', lat: 42.2162, lng: -83.3554 },
  CLT: { city: 'Charlotte', lat: 35.2144, lng: -80.9473 },
};

const IP_T: Record<string, Record<string, string>> = {
  English: {
    identifier: "Global IP Identifier",
    title: "What is my IP address?",
    subtitle: "Quickly detect and locate your active public IPv4 and IPv6 addresses.",
    resolving: "Resolving IP packet headers...",
    ipv4: "Public IPv4 Address",
    typeUnicast: "Type: public unicast",
    notDetected: "Not Detected",
    copied: "Copied!",
    copyV4: "Copy IPv4",
    copyV6: "Copy IPv6",
    ipv6: "Public IPv6 Address",
    supported: "IPv6 Supported",
    notSupported: "No IPv6 Detected",
    noIpv6: "Not detected (ISP does not routing IPv6)",
    nextGen: "Next-Generation IP Protocol",
    legacyRails: "Your connection is fully operating on legacy IPv4 rails.",
    geoLoc: "Geographical Location",
    country: "Country",
    region: "Region / State",
    city: "City",
    postal: "Postal Code",
    secured: "Secured Node",
    networkParams: "Network Parameters",
    asn: "ASN Identifier",
    iana: "IANA Range",
    timezone: "Timezone",
    utc: "UTC Offset",
    reidentify: "Re-identify",
    compass: "Compass Radar",
    lat: "Latitude",
    lon: "Longitude",
    secDiagnostics: "Network Protocol & Security Diagnostics",
    secSubtitle: "Active TLS transport encryption, DNS leak protection and routing privacy audit.",
    allSystemsSecure: "All Systems Secure",
    dnsPrivacy: "DNS Leak Protection",
    dnsStatus: "Encrypted DoH/DoT",
    webrtcPrivacy: "WebRTC Shield",
    webrtcStatus: "No Leaks Detected",
    transportSecurity: "Transport Security",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "IP Route Reputation",
    ipReputationStatus: "Clean / Low Risk"
  },
  Spanish: {
    identifier: "Identificador global de IP",
    title: "¿Cuál es mi dirección IP?",
    subtitle: "Detecte y localice rápidamente sus direcciones públicas IPv4 e IPv6 activas.",
    resolving: "Resolviendo encabezados de paquetes IP...",
    ipv4: "Dirección IPv4 pública",
    typeUnicast: "Tipo: unicast público",
    notDetected: "No detectado",
    copied: "¡Copiado!",
    copyV4: "Copiar IPv4",
    copyV6: "Copiar IPv6",
    ipv6: "Dirección IPv6 pública",
    supported: "Compatible con IPv6",
    notSupported: "No se detectó IPv6",
    noIpv6: "No detectado (el ISP no enruta IPv6)",
    nextGen: "Protocolo IP de próxima generación",
    legacyRails: "Su conexión está funcionando completamente sobre IPv4.",
    geoLoc: "Ubicación geográfica",
    country: "País",
    region: "Región / Estado",
    city: "Ciudad",
    postal: "Código postal",
    secured: "Nodo seguro",
    networkParams: "Parámetros de red",
    asn: "Identificador ASN",
    iana: "Rango IANA",
    timezone: "Zona horaria",
    utc: "Desviación UTC",
    reidentify: "Volver a identificar",
    compass: "Radar de brújula",
    lat: "Latitud",
    lon: "Longitud",
    secDiagnostics: "Protocolo de red y diagnóstico de seguridad",
    secSubtitle: "Cifrado de transporte TLS activo, protección contra fugas de DNS y auditoría de privacidad.",
    allSystemsSecure: "Sistemas seguros",
    dnsPrivacy: "Protección de fugas DNS",
    dnsStatus: "DoH/DoT cifrado",
    webrtcPrivacy: "Escudo WebRTC",
    webrtcStatus: "Sin fugas detectadas",
    transportSecurity: "Seguridad de transporte",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "Reputación de IP",
    ipReputationStatus: "Limpio / Riesgo bajo"
  },
  French: {
    identifier: "Identifiant IP global",
    title: "Quelle est mon adresse IP ?",
    subtitle: "Détectez et localisez rapidement vos adresses IPv4 et IPv6 publiques actives.",
    resolving: "Résolution des en-têtes de paquets IP...",
    ipv4: "Adresse IPv4 publique",
    typeUnicast: "Type: unicast public",
    notDetected: "Non détecté",
    copied: "Copié !",
    copyV4: "Copier l'IPv4",
    copyV6: "Copier l'IPv6",
    ipv6: "Adresse IPv6 publique",
    supported: "IPv6 pris en charge",
    notSupported: "Aucun IPv6 détecté",
    noIpv6: "Non détecté (le FAI ne route pas l'IPv6)",
    nextGen: "Protocole IP de nouvelle génération",
    legacyRails: "Votre connexion fonctionne entièrement sur IPv4.",
    geoLoc: "Localisation géographique",
    country: "Pays",
    region: "Région / État",
    city: "Ville",
    postal: "Code postal",
    secured: "Nœud sécurisé",
    networkParams: "Paramètres réseau",
    asn: "Identifiant ASN",
    iana: "Plage IANA",
    timezone: "Fuseau horaire",
    utc: "Décalage UTC",
    reidentify: "Réidentifier",
    compass: "Radar boussole",
    lat: "Latitude",
    lon: "Longitude",
    secDiagnostics: "Protocole réseau et diagnostic de sécurité",
    secSubtitle: "Chiffrement de transport TLS actif, protection contre les fuites DNS et audit de confidentialité.",
    allSystemsSecure: "Systèmes sécurisés",
    dnsPrivacy: "Protection fuite DNS",
    dnsStatus: "DoH/DoT chiffré",
    webrtcPrivacy: "Bouclier WebRTC",
    webrtcStatus: "Aucune fuite détectée",
    transportSecurity: "Sécurité de transport",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "Réputation IP",
    ipReputationStatus: "Propre / Risque faible"
  },
  German: {
    identifier: "Globaler IP-Identifikator",
    title: "Wie lautet meine IP-Adresse?",
    subtitle: "Erkennen und lokalisieren Sie schnell Ihre aktiven öffentlichen IPv4- und IPv6-Adressen.",
    resolving: "IP-Paket-Header werden aufgelöst...",
    ipv4: "Öffentliche IPv4-Adresse",
    typeUnicast: "Typ: Öffentliche Unicast",
    notDetected: "Nicht erkannt",
    copied: "Kopiert!",
    copyV4: "IPv4 kopieren",
    copyV6: "IPv6 kopieren",
    ipv6: "Öffentliche IPv6-Adresse",
    supported: "IPv6 unterstützt",
    notSupported: "Keine IPv6 erkannt",
    noIpv6: "Nicht erkannt (ISP leitet IPv6 nicht weiter)",
    nextGen: "IP-Protokoll der nächsten Generation",
    legacyRails: "Ihre Verbindung läuft vollständig über herkömmliches IPv4.",
    geoLoc: "Geografischer Standort",
    country: "Land",
    region: "Region / Bundesland",
    city: "Stadt",
    postal: "Postleitzahl",
    secured: "Sicherer Knoten",
    networkParams: "Netzwerkparameter",
    asn: "ASN-Kennung",
    iana: "IANA-Bereich",
    timezone: "Zeitzone",
    utc: "UTC-Offset",
    reidentify: "Neu identifizieren",
    compass: "Kompass-Radar",
    lat: "Breitengrad",
    lon: "Längengrad",
    secDiagnostics: "Netzwerkprotokoll- & Sicherheitsdiagnose",
    secSubtitle: "Aktive TLS-Transportverschlüsselung, DNS-Leak-Schutz und Routing-Privatsphären-Audit.",
    allSystemsSecure: "Systeme geschützt",
    dnsPrivacy: "DNS-Leak-Schutz",
    dnsStatus: "DoH/DoT verschlüsselt",
    webrtcPrivacy: "WebRTC-Schild",
    webrtcStatus: "Keine Leaks erkannt",
    transportSecurity: "Transportsicherheit",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "IP-Reputation",
    ipReputationStatus: "Sauber / Geringes Risiko"
  },
  Chinese: {
    identifier: "全球 IP 标识符",
    title: "我的 IP 地址是什么？",
    subtitle: "快速检测并定位您当前的公网 IPv4 和 IPv6 地址。",
    resolving: "正在解析 IP 数据包标头...",
    ipv4: "公网 IPv4 地址",
    typeUnicast: "类型: 公网单播",
    notDetected: "未检测到",
    copied: "已复制！",
    copyV4: "复制 IPv4",
    copyV6: "复制 IPv6",
    ipv6: "公网 IPv6 地址",
    supported: "支持 IPv6",
    notSupported: "未检测到 IPv6",
    noIpv6: "未检测到（运营商不支持 IPv6 路由）",
    nextGen: "下一代 IP 协议",
    legacyRails: "您的网络连接完全运行在传统的 IPv4 轨道上。",
    geoLoc: "地理位置",
    country: "国家",
    region: "省份 / 州",
    city: "城市",
    postal: "邮政编码",
    secured: "安全节点",
    networkParams: "网络参数",
    asn: "ASN 标识符",
    iana: "IANA 范围",
    timezone: "时区",
    utc: "UTC 偏差",
    reidentify: "重新检测",
    compass: "罗盘雷达",
    lat: "纬度",
    lon: "经度",
    secDiagnostics: "网络协议与连接安全检测",
    secSubtitle: "实时 TLS 传输加密、DNS 泄漏防护与网络路由隐私审计。",
    allSystemsSecure: "所有协议安全运行",
    dnsPrivacy: "DNS 泄漏防护",
    dnsStatus: "已启用 DoH/DoT 加密",
    webrtcPrivacy: "WebRTC 隐私隔离",
    webrtcStatus: "未检测到本地公网泄露",
    transportSecurity: "传输层安全",
    transportStatus: "TLS 1.3 / HTTP/3 握手",
    ipReputation: "IP 路由与信誉",
    ipReputationStatus: "优良 / 无黑名单风险"
  },
  'Chinese Traditional': {
    identifier: "全球 IP 識別碼",
    title: "我的 IP 位址是什麼？",
    subtitle: "快速偵測並定位您目前的公網 IPv4 與 IPv6 位址。",
    resolving: "正在解析 IP 封包標頭...",
    ipv4: "公網 IPv4 位址",
    typeUnicast: "類型: 公網單播",
    notDetected: "未偵測到",
    copied: "已複製！",
    copyV4: "複製 IPv4",
    copyV6: "複製 IPv6",
    ipv6: "公網 IPv6 位址",
    supported: "支援 IPv6",
    notSupported: "未偵測到 IPv6",
    noIpv6: "未偵測到（電信業者不支援 IPv6 路由）",
    nextGen: "次世代 IP 協定",
    legacyRails: "您的網路連線完全運行於傳統的 IPv4 架構上。",
    geoLoc: "地理位置",
    country: "國家",
    region: "省份 / 州",
    city: "城市",
    postal: "郵遞區號",
    secured: "安全節點",
    networkParams: "網路參數",
    asn: "ASN 識別碼",
    iana: "IANA 範圍",
    timezone: "時區",
    utc: "UTC 時差",
    reidentify: "重新偵測",
    compass: "羅盤雷達",
    lat: "緯度",
    lon: "經度",
    secDiagnostics: "網路協定與連線安全診斷",
    secSubtitle: "即時 TLS 傳輸加密、DNS 洩漏防護與網路路由隱私稽核。",
    allSystemsSecure: "所有協定安全運行",
    dnsPrivacy: "DNS 洩漏防護",
    dnsStatus: "已啟用 DoH/DoT 加密",
    webrtcPrivacy: "WebRTC 隱私隔離",
    webrtcStatus: "未偵測到本地公網洩漏",
    transportSecurity: "傳輸層安全",
    transportStatus: "TLS 1.3 / HTTP/3 握手",
    ipReputation: "IP 路由與信譽",
    ipReputationStatus: "優良 / 無黑名單風險"
  },
  Japanese: {
    identifier: "グローバル IP 識別子",
    title: "私の IP アドレスは何ですか？",
    subtitle: "アクティブなパブリック IPv4 および IPv6 アドレスを迅速に検出して特定します。",
    resolving: "IP パケットヘッダーを解析中...",
    ipv4: "パブリック IPv4 アドレス",
    typeUnicast: "タイプ: パブリックユニキャスト",
    notDetected: "未検出",
    copied: "コピーされました！",
    copyV4: "IPv4 をコピー",
    copyV6: "IPv6 をコピー",
    ipv6: "パブリック IPv6 アドレス",
    supported: "IPv6 サポート中",
    notSupported: "IPv6 未検出",
    noIpv6: "未検出（プロバイダが IPv6 ルーティングに非対応）",
    nextGen: "次世代 IP プロトコル",
    legacyRails: "接続は完全に従来の IPv4 経由で稼働しています。",
    geoLoc: "地理的位置",
    country: "国",
    region: "都道府県 / 州",
    city: "市区町村",
    postal: "郵便番号",
    secured: "安全なノード",
    networkParams: "ネットワークパラメータ",
    asn: "ASN 識別子",
    iana: "IANA 範囲",
    timezone: "タイムゾーン",
    utc: "UTC オフセット",
    reidentify: "再検出",
    compass: "コンパスレーダー",
    lat: "緯度",
    lon: "経度",
    secDiagnostics: "ネットワークプロトコルとセキュリティ診断",
    secSubtitle: "アクティブなTLS転送暗号化、DNSリーク保護、ルーティングプライバシー監査。",
    allSystemsSecure: "全システム保護中",
    dnsPrivacy: "DNS リーク保護",
    dnsStatus: "DoH/DoT 暗号化済み",
    webrtcPrivacy: "WebRTC シールド",
    webrtcStatus: "漏洩は検出されません",
    transportSecurity: "トランスポートセキュリティ",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "IP ルートの評判",
    ipReputationStatus: "良好 / 低リスク"
  },
  Korean: {
    identifier: "글로벌 IP 식별자",
    title: "내 IP 주소는 무엇인가요?",
    subtitle: "활성화된 공인 IPv4 및 IPv6 주소를 신속하게 감지하고 위치를 확인합니다.",
    resolving: "IP 패킷 헤더 분석 중...",
    ipv4: "공인 IPv4 주소",
    typeUnicast: "유형: 공인 유니캐스트",
    notDetected: "감지되지 않음",
    copied: "복사됨!",
    copyV4: "IPv4 복사",
    copyV6: "IPv6 복사",
    ipv6: "공인 IPv6 주소",
    supported: "IPv6 지원됨",
    notSupported: "IPv6 감지되지 않음",
    noIpv6: "감지되지 않음 (ISP가 IPv6 라우팅을 지원하지 않음)",
    nextGen: "차세대 IP 프로토콜",
    legacyRails: "현재 연결이 레거시 IPv4 레일에서 전적으로 작동 중입니다.",
    geoLoc: "지리적 위치",
    country: "국가",
    region: "시 / 도",
    city: "도시",
    postal: "우편번호",
    secured: "보안 노드",
    networkParams: "네트워크 매개변수",
    asn: "ASN 식별자",
    iana: "IANA 범위",
    timezone: "시간대",
    utc: "UTC 편차",
    reidentify: "재측정",
    compass: "나침반 레이더",
    lat: "위도",
    lon: "경도",
    secDiagnostics: "네트워크 프로토콜 및 보안 진단",
    secSubtitle: "활성 TLS 전송 암호화, DNS 유출 방지 및 라우팅 프라이버시 감사.",
    allSystemsSecure: "모든 시스템 보안 정상",
    dnsPrivacy: "DNS 유출 방지",
    dnsStatus: "DoH/DoT 암호화 활성",
    webrtcPrivacy: "WebRTC 보안 차단",
    webrtcStatus: "유출 감지되지 않음",
    transportSecurity: "전송 계층 보안",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "IP 라우트 평판",
    ipReputationStatus: "우수 / 위험 없음"
  },
  Italian: {
    identifier: "Identificatore IP Globale",
    title: "Qual è il mio indirizzo IP?",
    subtitle: "Rileva e localizza rapidamente i tuoi indirizzi IPv4 e IPv6 pubblici attivi.",
    resolving: "Risoluzione degli header dei pacchetti IP...",
    ipv4: "Indirizzo IPv4 Pubblico",
    typeUnicast: "Tipo: unicast pubblico",
    notDetected: "Non rilevato",
    copied: "Copiato!",
    copyV4: "Copia IPv4",
    copyV6: "Copia IPv6",
    ipv6: "Indirizzo IPv6 Pubblico",
    supported: "IPv6 Supportato",
    notSupported: "Nessun IPv6 Rilevato",
    noIpv6: "Non rilevato (l'ISP non instrada l'IPv6)",
    nextGen: "Protocollo IP di Nuova Generazione",
    legacyRails: "La tua connessione opera interamente sulla rete legacy IPv4.",
    geoLoc: "Posizione Geografica",
    country: "Paese",
    region: "Regione / Stato",
    city: "Città",
    postal: "Codice Postale",
    secured: "Nodo Sicuro",
    networkParams: "Parametri di Rete",
    asn: "Identificatore ASN",
    iana: "Intervallo IANA",
    timezone: "Fuso Orario",
    utc: "Differenza UTC",
    reidentify: "Rileva di nuovo",
    compass: "Radar della Bussola",
    lat: "Latitudine",
    lon: "Longitudine",
    secDiagnostics: "Protocollo di rete e diagnostica di sicurezza",
    secSubtitle: "Crittografia di trasporto TLS attiva, protezione da perdite DNS e audit della privacy.",
    allSystemsSecure: "Sistemi sicuri",
    dnsPrivacy: "Protezione perdite DNS",
    dnsStatus: "DoH/DoT crittografato",
    webrtcPrivacy: "Scudo WebRTC",
    webrtcStatus: "Nessuna perdita rilevata",
    transportSecurity: "Sicurezza del trasporto",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "Reputazione dell'IP",
    ipReputationStatus: "Pulito / Rischio basso"
  },
  Russian: {
    identifier: "Глобальный IP-идентификатор",
    title: "Какой у меня IP-адрес?",
    subtitle: "Быстрое определение и поиск ваших активных публичных IPv4 и IPv6 адресов.",
    resolving: "Анализ заголовков IP-пакетов...",
    ipv4: "Публичный IPv4-адрес",
    typeUnicast: "Тип: публичный одноадресный",
    notDetected: "Не определен",
    copied: "Скопировано!",
    copyV4: "Копировать IPv4",
    copyV6: "Копировать IPv6",
    ipv6: "Публичный IPv6-адрес",
    supported: "IPv6 поддерживается",
    notSupported: "IPv6 не обнаружен",
    noIpv6: "Не обнаружен (провайдер не маршрутизирует IPv6)",
    nextGen: "Протокол IP следующего поколения",
    legacyRails: "Ваше подключение полностью работает на устаревших рельсах IPv4.",
    geoLoc: "Географическое положение",
    country: "Страна",
    region: "Регион / Область",
    city: "Город",
    postal: "Почтовый индекс",
    secured: "Защищенный узел",
    networkParams: "Параметры сети",
    asn: "Идентификатор ASN",
    iana: "Диапазон IANA",
    timezone: "Часовой пояс",
    utc: "Смещение UTC",
    reidentify: "Переопределить",
    compass: "Компас-радар",
    lat: "Широта",
    lon: "Долгота",
    secDiagnostics: "Сетевые протоколы и диагностика безопасности",
    secSubtitle: "Активное шифрование TLS, защита от утечек DNS и аудит конфиденциальности маршрутизации.",
    allSystemsSecure: "Все системы защищены",
    dnsPrivacy: "Защита от утечки DNS",
    dnsStatus: "DoH/DoT зашифрован",
    webrtcPrivacy: "Защита WebRTC",
    webrtcStatus: "Утечек не обнаружено",
    transportSecurity: "Безопасность транспорта",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "Репутация IP",
    ipReputationStatus: "Чистый / Низкий риск"
  },
  Luxembourgish: {
    identifier: "Globalen IP-Identifikateur",
    title: "Wat ass meng IP-Adress?",
    subtitle: "Erkennt a lokaliséiert séier Är aktiv ëffentlech IPv4- an IPv6-Adressen.",
    resolving: "IP-Paket-Headeren ginn opgeléist...",
    ipv4: "Ëffentlech IPv4-Adress",
    typeUnicast: "Typ: ëffentlech Unicast",
    notDetected: "Net erkannt",
    copied: "Kopéiert!",
    copyV4: "IPv4 kopéieren",
    copyV6: "IPv6 kopéieren",
    ipv6: "Ëffentlech IPv6-Adress",
    supported: "IPv6 ënnerstëtzt",
    notSupported: "Keen IPv6 erkannt",
    noIpv6: "Net erkannt (ISP leet IPv6 net weider)",
    nextGen: "IP-Protokoll vun der nächster Generatioun",
    legacyRails: "Är Verbindung leeft komplett iwwer déi al IPv4-Schinnen.",
    geoLoc: "Geografesch Lag",
    country: "Land",
    region: "Regioun / Kanton",
    city: "Stad",
    postal: "Postleitzuel",
    secured: "Sécherten Node",
    networkParams: "Netzwierk-Parameteren",
    asn: "ASN-Identifikateur",
    iana: "IANA-Beräich",
    timezone: "Zäitzon",
    utc: "UTC-Offset",
    reidentify: "Nei identifizéieren",
    compass: "Kompass-Radar",
    lat: "Breedegrad",
    lon: "Längtegrad",
    secDiagnostics: "Netzwierkprotokoll- & Sécherheetsdiagnostik",
    secSubtitle: "Aktiv TLS-Transportverschlësselung, DNS-Leak-Schutz an Audit vun der Privatsphär.",
    allSystemsSecure: "All Systemer sécher",
    dnsPrivacy: "DNS-Leak-Schutz",
    dnsStatus: "DoH/DoT verschlësselt",
    webrtcPrivacy: "WebRTC-Schutz",
    webrtcStatus: "Keng Leaks erkannt",
    transportSecurity: "Transportsécherheet",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "IP-Ruff",
    ipReputationStatus: "Propper / Niddrege Risiko"
  },
  Dutch: {
    identifier: "Wereldwijde IP-identificatie",
    title: "Wat is mijn IP-adres?",
    subtitle: "Detecteer en lokaliseer snel uw actieve openbare IPv4- en IPv6-adressen.",
    resolving: "IP-pakketheaders worden opgehaald...",
    ipv4: "Openbaar IPv4-adres",
    typeUnicast: "Type: openbaar unicast",
    notDetected: "Niet gedetecteerd",
    copied: "Gekopieerd!",
    copyV4: "Kopieer IPv4",
    copyV6: "Kopieer IPv6",
    ipv6: "Openbaar IPv6-adres",
    supported: "IPv6 ondersteund",
    notSupported: "Geen IPv6 gedetecteerd",
    noIpv6: "Niet gedetecteerd (provider routeert geen IPv6)",
    nextGen: "Next-gen IP-protocol",
    legacyRails: "Uw verbinding werkt volledig via de traditionele IPv4-infrastructuur.",
    geoLoc: "Geografische locatie",
    country: "Land",
    region: "Regio / Provincie",
    city: "Stad",
    postal: "Postcode",
    secured: "Beveiligd knooppunt",
    networkParams: "Netwerkparameters",
    asn: "ASN-identificatie",
    iana: "IANA-bereik",
    timezone: "Tijdzone",
    utc: "UTC-afwijking",
    reidentify: "Opnieuw detecteren",
    compass: "Kompasradar",
    lat: "Breedtegraad",
    lon: "Lengtegraad",
    secDiagnostics: "Netwerkprotocol- en beveiligingsdiagnostiek",
    secSubtitle: "Actieve TLS-transportversleuteling, DNS-lekbescherming en privacycontrole van de routering.",
    allSystemsSecure: "Alle systemen veilig",
    dnsPrivacy: "DNS-lekbescherming",
    dnsStatus: "DoH/DoT versleuteld",
    webrtcPrivacy: "WebRTC-schild",
    webrtcStatus: "Geen lekken gedetecteerd",
    transportSecurity: "Transportbeveiliging",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "IP-routereputatie",
    ipReputationStatus: "Schoon / Laag risico"
  },
  Swedish: {
    identifier: "Global IP-identifierare",
    title: "Vad är min IP-adress?",
    subtitle: "Identifiera och lokalisera snabbt dina aktiva publika IPv4- och IPv6-adresser.",
    resolving: "Analyserar IP-pakethuvuden...",
    ipv4: "Publik IPv4-adress",
    typeUnicast: "Typ: publik unicast",
    notDetected: "Ej upptäckt",
    copied: "Kopierad!",
    copyV4: "Kopiera IPv4",
    copyV6: "Kopiera IPv6",
    ipv6: "Publik IPv6-adress",
    supported: "IPv6 stöds",
    notSupported: "Ingen IPv6 upptäckt",
    noIpv6: "Ej upptäckt (ISP dirigerar inte IPv6)",
    nextGen: "Nästa generations IP-protokoll",
    legacyRails: "Din anslutning körs helt över traditionella IPv4-nät.",
    geoLoc: "Geografisk plats",
    country: "Land",
    region: "Region / Län",
    city: "Stad",
    postal: "Postnummer",
    secured: "Säkrad nod",
    networkParams: "Nätverksparametrar",
    asn: "ASN-identifierare",
    iana: "IANA-intervall",
    timezone: "Tidszon",
    utc: "UTC-skillnad",
    reidentify: "Identifiera igen",
    compass: "Kompassradar",
    lat: "Latitud",
    lon: "Longitud",
    secDiagnostics: "Nätverksprotokoll & säkerhetsdiagnostik",
    secSubtitle: "Aktiv TLS-transportkryptering, DNS-läckageskydd och integritetsgranskning.",
    allSystemsSecure: "Alla system säkra",
    dnsPrivacy: "DNS-läckageskydd",
    dnsStatus: "DoH/DoT-krypterad",
    webrtcPrivacy: "WebRTC-skydd",
    webrtcStatus: "Inga läckor upptäckta",
    transportSecurity: "Transportsäkerhet",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "IP-rykte",
    ipReputationStatus: "Rent / Låg risk"
  },
  Finnish: {
    identifier: "Globaali IP-tunniste",
    title: "Mikä on IP-osoitteeni?",
    subtitle: "Tunnista ja paikanna aktiiviset julkiset IPv4- ja IPv6-osoitteesi nopeasti.",
    resolving: "Selvitetään IP-pakettien otsikoita...",
    ipv4: "Julkinen IPv4-osoite",
    typeUnicast: "Tyyppi: julkinen unicast",
    notDetected: "Ei havaittu",
    copied: "Kopioitu!",
    copyV4: "Kopioi IPv4",
    copyV6: "Kopioi IPv6",
    ipv6: "Julkinen IPv6-osoite",
    supported: "IPv6 tuettu",
    notSupported: "IPv6:ta ei havaittu",
    noIpv6: "Ei havaittu (palveluntarjoaja ei reititä IPv6:ta)",
    nextGen: "Seuraavan sukupolven IP-protokolla",
    legacyRails: "Yhteytesi toimii kokonaan perinteisen IPv4-verkon kautta.",
    geoLoc: "Maantieteellinen sijainti",
    country: "Maa",
    region: "Alue / Maakunta",
    city: "Kaupunki",
    postal: "Postinumero",
    secured: "Suojattu solmu",
    networkParams: "Verkkoparametrit",
    asn: "ASN-tunniste",
    iana: "IANA-alue",
    timezone: "Aikavyöhyke",
    utc: "UTC-ero",
    reidentify: "Tunnista uudelleen",
    compass: "Kompassitutka",
    lat: "Leveysaste",
    lon: "Pituusaste",
    secDiagnostics: "Verkkoprotokolla- ja tietoturvadiagnostiikka",
    secSubtitle: "Aktiivinen TLS-salaus, DNS-vuotosuojaus ja reitityksen tietosuojatarkastus.",
    allSystemsSecure: "Kaikki järjestelmät suojattu",
    dnsPrivacy: "DNS-vuotosuojaus",
    dnsStatus: "DoH/DoT-salattu",
    webrtcPrivacy: "WebRTC-suojaus",
    webrtcStatus: "Ei vuotoja havaittu",
    transportSecurity: "Siirtoturvallisuus",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "IP-maine",
    ipReputationStatus: "Puhdas / Alhainen riski"
  },
  Hindi: {
    identifier: "वैश्विक IP पहचानकर्ता",
    title: "मेरा IP पता क्या है?",
    subtitle: "अपने सक्रिय सार्वजनिक IPv4 और IPv6 पतों का तुरंत पता लगाएँ और स्थान जानें।",
    resolving: "IP पैकेट हेडर की जाँच हो रही है...",
    ipv4: "सार्वजनिक IPv4 पता",
    typeUnicast: "प्रकार: सार्वजनिक यूनिकास्ट",
    notDetected: "पता नहीं चला",
    copied: "कॉपी किया गया!",
    copyV4: "IPv4 कॉपी करें",
    copyV6: "IPv6 कॉपी करें",
    ipv6: "सार्वजनिक IPv6 पता",
    supported: "IPv6 समर्थित",
    notSupported: "कोई IPv6 नहीं मिला",
    noIpv6: "पता नहीं चला (ISP द्वारा IPv6 रूटिंग उपलब्ध नहीं)",
    nextGen: "नेक्स्ट-जेन IP प्रोटोकॉल",
    legacyRails: "आपका कनेक्शन पूरी तरह से पारंपरिक IPv4 नेटवर्क पर चल रहा है।",
    geoLoc: "भौगोलिक स्थान",
    country: "देश",
    region: "क्षेत्र / राज्य",
    city: "शहर",
    postal: "पिन कोड",
    secured: "सुरक्षित नोड",
    networkParams: "नेटवर्क पैरामीटर",
    asn: "ASN पहचानकर्ता",
    iana: "IANA रेंज",
    timezone: "समय क्षेत्र",
    utc: "UTC अंतर",
    reidentify: "पुनः पहचानें",
    compass: "कम्पास रडार",
    lat: "अक्षांश",
    lon: "देशांतर",
    secDiagnostics: "नेटवर्क प्रोटोकॉल और सुरक्षा जांच",
    secSubtitle: "सक्रिय TLS ट्रांसपोर्ट एन्क्रिप्शन, DNS लीक सुरक्षा और रूटिंग गोपनीयता ऑडिट।",
    allSystemsSecure: "सभी सिस्टम सुरक्षित",
    dnsPrivacy: "DNS लीक सुरक्षा",
    dnsStatus: "DoH/DoT एन्क्रिप्टेड",
    webrtcPrivacy: "WebRTC शील्ड",
    webrtcStatus: "कोई लीक नहीं मिला",
    transportSecurity: "ट्रांसपोर्ट सुरक्षा",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "IP रूट प्रतिष्ठा",
    ipReputationStatus: "स्वच्छ / कम जोखिम"
  },
  Norwegian: {
    identifier: "Global IP-identifikator",
    title: "Hva er min IP-adresse?",
    subtitle: "Oppdag og lokaliser dine aktive offentlige IPv4- og IPv6-adresser raskt.",
    resolving: "Analyserer IP-pakkehoder...",
    ipv4: "Offentlig IPv4-adresse",
    typeUnicast: "Type: offentlig unicast",
    notDetected: "Ikke oppdaget",
    copied: "Kopiert!",
    copyV4: "Kopier IPv4",
    copyV6: "Kopier IPv6",
    ipv6: "Offentlig IPv6-adresse",
    supported: "IPv6 støttet",
    notSupported: "Ingen IPv6 oppdaget",
    noIpv6: "Ikke oppdaget (ISP ruter ikke IPv6)",
    nextGen: "Neste generasjons IP-protokoll",
    legacyRails: "Tilkoblingen din kjører helt over tradisjonelle IPv4-linjer.",
    geoLoc: "Geografisk plassering",
    country: "Land",
    region: "Region / Fylke",
    city: "By",
    postal: "Postnummer",
    secured: "Sikret node",
    networkParams: "Nettverksparametere",
    asn: "ASN-identifikator",
    iana: "IANA-område",
    timezone: "Tidssone",
    utc: "UTC-avvik",
    reidentify: "Identifiser på nytt",
    compass: "Kompassradar",
    lat: "Breddegrad",
    lon: "Lengdegrad",
    secDiagnostics: "Nettverksprotokoll- og sikkerhetsdiagnostikk",
    secSubtitle: "Aktiv TLS-transportkryptering, DNS-lekkasjebeskyttelse og personvernkontroll.",
    allSystemsSecure: "Alle systemer sikre",
    dnsPrivacy: "DNS-lekkasjebeskyttelse",
    dnsStatus: "DoH/DoT-kryptert",
    webrtcPrivacy: "WebRTC-skjold",
    webrtcStatus: "Ingen lekkasjer oppdaget",
    transportSecurity: "Transportsikkerhet",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "IP-rykte",
    ipReputationStatus: "Ren / Lav risiko"
  },
  Thai: {
    identifier: "ตัวระบุ IP ระดับสากล",
    title: "IP แอดเดรสของฉันคืออะไร?",
    subtitle: "ตรวจจับและระบุตำแหน่ง IPv4 และ IPv6 สาธารณะที่ใช้งานอยู่ของคุณอย่างรวดเร็ว",
    resolving: "กำลังตรวจสอบส่วนหัวแพ็กเก็ต IP...",
    ipv4: "ที่อยู่ IPv4 สาธารณะ",
    typeUnicast: "ประเภท: unicast สาธารณะ",
    notDetected: "ตรวจไม่พบ",
    copied: "คัดลอกแล้ว!",
    copyV4: "คัดลอก IPv4",
    copyV6: "คัดลอก IPv6",
    ipv6: "ที่อยู่ IPv6 สาธารณะ",
    supported: "รองรับ IPv6",
    notSupported: "ไม่พบ IPv6",
    noIpv6: "ตรวจไม่พบ (ผู้ให้บริการไม่ได้กำหนดเส้นทาง IPv6)",
    nextGen: "โปรโตคอล IP ยุคใหม่",
    legacyRails: "การเชื่อมต่อของคุณทำงานผ่านโครงข่าย IPv4 แบบดั้งเดิมทั้งหมด",
    geoLoc: "ตำแหน่งทางภูมิศาสตร์",
    country: "ประเทศ",
    region: "ภูมิภาค / จังหวัด",
    city: "เมือง",
    postal: "รหัสไปรษณีย์",
    secured: "โหนดปลอดภัย",
    networkParams: "พารามิเตอร์เครือข่าย",
    asn: "ตัวระบุ ASN",
    iana: "ช่วง IANA",
    timezone: "เขตเวลา",
    utc: "ส่วนต่าง UTC",
    reidentify: "ตรวจสอบใหม่",
    compass: "เรดาร์เข็มทิศ",
    lat: "ละติจูด",
    lon: "ลองจิจูด",
    secDiagnostics: "การวินิจฉัยโปรโตคอลและความปลอดภัยเครือข่าย",
    secSubtitle: "การเข้ารหัส TLS ที่ใช้งานอยู่ การป้องกัน DNS รั่วไหล และการตรวจสอบความเป็นส่วนตัว",
    allSystemsSecure: "ระบบทั้งหมดปลอดภัย",
    dnsPrivacy: "การป้องกัน DNS รั่วไหล",
    dnsStatus: "เข้ารหัส DoH/DoT แล้ว",
    webrtcPrivacy: "เกราะป้องกัน WebRTC",
    webrtcStatus: "ไม่พบการรั่วไหล",
    transportSecurity: "ความปลอดภัยการรับส่งข้อมูล",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "ชื่อเสียงเส้นทาง IP",
    ipReputationStatus: "สะอาด / ความเสี่ยงต่ำ"
  },
  Portuguese: {
    identifier: "Identificador Global de IP",
    title: "Qual é o Meu Endereço IP?",
    subtitle: "Detete e geolocalize instantaneamente os seus endereços IPv4 e IPv6 públicos ativos.",
    resolving: "A resolver cabeçalhos de pacotes IP...",
    ipv4: "Endereço IPv4 Público",
    typeUnicast: "Tipo: unicast público",
    notDetected: "Não detetado",
    copied: "Copiado!",
    copyV4: "Copiar IPv4",
    copyV6: "Copiar IPv6",
    ipv6: "Endereço IPv6 Público",
    supported: "IPv6 Suportado",
    notSupported: "Nenhum IPv6 detetado",
    noIpv6: "Não detetado (O ISP não encaminha IPv6)",
    nextGen: "Protocolo IP de Nova Geração",
    legacyRails: "A sua ligação opera inteiramente em infraestrutura IPv4 tradicional.",
    geoLoc: "Localização Geográfica",
    country: "País",
    region: "Região / Distrito",
    city: "Cidade",
    postal: "Código Postal",
    secured: "Nó Seguro",
    networkParams: "Parâmetros de Rede",
    asn: "Identificador ASN",
    iana: "Intervalo IANA",
    timezone: "Fuso Horário",
    utc: "Diferença UTC",
    reidentify: "Reidentificar",
    compass: "Radar de Bússola",
    lat: "Latitude",
    lon: "Longitude",
    secDiagnostics: "Diagnóstico de Protocolo de Rede e Segurança",
    secSubtitle: "Encriptação de transporte TLS ativa, proteção contra fugas de DNS e verificações de privacidade.",
    allSystemsSecure: "Todos os Sistemas Seguros",
    dnsPrivacy: "Proteção de Fuga DNS",
    dnsStatus: "Encriptado DoH/DoT",
    webrtcPrivacy: "Escudo WebRTC",
    webrtcStatus: "Nenhuma Fuga Detetada",
    transportSecurity: "Segurança de Transporte",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "Reputação da Rota IP",
    ipReputationStatus: "Limpo / Baixo Risco"
  },
  Vietnamese: {
    identifier: "Định danh IP toàn cầu",
    title: "Địa chỉ IP của tôi là gì?",
    subtitle: "Phát hiện và định vị tức thì địa chỉ IPv4 và IPv6 công khai đang hoạt động của bạn.",
    resolving: "Đang phân giải tiêu đề gói tin IP...",
    ipv4: "Địa chỉ IPv4 công khai",
    typeUnicast: "Loại: unicast công khai",
    notDetected: "Không phát hiện",
    copied: "Đã sao chép!",
    copyV4: "Sao chép IPv4",
    copyV6: "Sao chép IPv6",
    ipv6: "Địa chỉ IPv6 công khai",
    supported: "Hỗ trợ IPv6",
    notSupported: "Không phát hiện IPv6",
    noIpv6: "Không phát hiện (Nhà mạng không định tuyến IPv6)",
    nextGen: "Giao thức IP thế hệ mới",
    legacyRails: "Kết nối của bạn đang hoạt động hoàn toàn trên hạ tầng IPv4 truyền thống.",
    geoLoc: "Vị trí địa lý",
    country: "Quốc gia",
    region: "Khu vực / Tỉnh thành",
    city: "Thành phố",
    postal: "Mã bưu chính",
    secured: "Nút bảo mật",
    networkParams: "Thông số mạng",
    asn: "Mã định danh ASN",
    iana: "Dải IANA",
    timezone: "Múi giờ",
    utc: "Độ lệch UTC",
    reidentify: "Nhận diện lại",
    compass: "La bàn định hướng",
    lat: "Vĩ độ",
    lon: "Kinh độ",
    secDiagnostics: "Chẩn đoán giao thức & bảo mật mạng",
    secSubtitle: "Mã hóa truyền tải TLS đang hoạt động, bảo vệ rò rỉ DNS và kiểm tra quyền riêng tư.",
    allSystemsSecure: "Mọi hệ thống đều an toàn",
    dnsPrivacy: "Bảo vệ rò rỉ DNS",
    dnsStatus: "Đã mã hóa DoH/DoT",
    webrtcPrivacy: "Lá chắn WebRTC",
    webrtcStatus: "Không phát hiện rò rỉ",
    transportSecurity: "Bảo mật truyền tải",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "Độ tin cậy tuyến IP",
    ipReputationStatus: "Sạch / Rủi ro thấp"
  },
  Polish: {
    identifier: "Globalny Identyfikator IP",
    title: "Jaki jest mój adres IP?",
    subtitle: "Natychmiast wykrywaj i lokalizuj swoje aktywne publiczne adresy IPv4 i IPv6.",
    resolving: "Rozpoznawanie nagłówków pakietów IP...",
    ipv4: "Publiczny adres IPv4",
    typeUnicast: "Typ: publiczny unicast",
    notDetected: "Nie wykryto",
    copied: "Skopiowano!",
    copyV4: "Kopiuj IPv4",
    copyV6: "Kopiuj IPv6",
    ipv6: "Publiczny adres IPv6",
    supported: "IPv6 obsługiwane",
    notSupported: "Nie wykryto IPv6",
    noIpv6: "Nie wykryto (Dostawca nie obsługuje IPv6)",
    nextGen: "Protokół IP nowej generacji",
    legacyRails: "Twoje połączenie działa w całości na klasycznej infrastrukturze IPv4.",
    geoLoc: "Lokalizacja geograficzna",
    country: "Kraj",
    region: "Region / Województwo",
    city: "Miasto",
    postal: "Kod pocztowy",
    secured: "Bezpieczny węzeł",
    networkParams: "Parametry sieci",
    asn: "Identyfikator ASN",
    iana: "Zakres IANA",
    timezone: "Strefa czasowa",
    utc: "Przesunięcie UTC",
    reidentify: "Wykryj ponownie",
    compass: "Radar kompasu",
    lat: "Szerokość geogr.",
    lon: "Długość geogr.",
    secDiagnostics: "Diagnostyka protokołów i bezpieczeństwa sieci",
    secSubtitle: "Aktywne szyfrowanie transportu TLS, ochrona przed wyciekiem DNS i testy prywatności.",
    allSystemsSecure: "Wszystkie systemy bezpieczne",
    dnsPrivacy: "Ochrona wycieku DNS",
    dnsStatus: "Zaszyfrowano DoH/DoT",
    webrtcPrivacy: "Osłona WebRTC",
    webrtcStatus: "Nie wykryto wycieków",
    transportSecurity: "Bezpieczeństwo transportu",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "Reputacja trasy IP",
    ipReputationStatus: "Czysta / Niskie ryzyko"
  },
  Danish: {
    identifier: "Global IP-identifikator",
    title: "Hvad er min IP-adresse?",
    subtitle: "Registrer og geolokaliser øjeblikkeligt dine aktive offentlige IPv4- og IPv6-adresser.",
    resolving: "Analyserer IP-pakkehoveder...",
    ipv4: "Offentlig IPv4-adresse",
    typeUnicast: "Type: offentlig unicast",
    notDetected: "Ikke registreret",
    copied: "Kopieret!",
    copyV4: "Kopiér IPv4",
    copyV6: "Kopiér IPv6",
    ipv6: "Offentlig IPv6-adresse",
    supported: "IPv6 understøttet",
    notSupported: "Ingen IPv6 registreret",
    noIpv6: "Ikke registreret (Internetudbyder router ikke IPv6)",
    nextGen: "Næste generations IP-protokol",
    legacyRails: "Din forbindelse kører udelukkende på traditionel IPv4-infrastruktur.",
    geoLoc: "Geografisk placering",
    country: "Land",
    region: "Region / Område",
    city: "By",
    postal: "Postnummer",
    secured: "Sikker node",
    networkParams: "Netværksparametre",
    asn: "ASN-identifikator",
    iana: "IANA-område",
    timezone: "Tidszone",
    utc: "UTC-forskydning",
    reidentify: "Genidentificer",
    compass: "Kompasradar",
    lat: "Breddegrad",
    lon: "Længdegrad",
    secDiagnostics: "Diagnostik af netværksprotokol og sikkerhed",
    secSubtitle: "Aktiv TLS-transportkryptering, DNS-lækagebeskyttelse og privatlivstjek.",
    allSystemsSecure: "Alle systemer er sikre",
    dnsPrivacy: "DNS-lækagebeskyttelse",
    dnsStatus: "DoH/DoT-krypteret",
    webrtcPrivacy: "WebRTC-skjold",
    webrtcStatus: "Ingen lækager registreret",
    transportSecurity: "Transportsikkerhed",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "IP-rutens omdømme",
    ipReputationStatus: "Ren / Lav risiko"
  },
  Turkish: {
    identifier: "Küresel IP Tanımlayıcı",
    title: "IP Adresim Nedir?",
    subtitle: "Etkin genel IPv4 ve IPv6 adreslerinizi anında tespit edin ve konumlandırın.",
    resolving: "IP paket başlıkları çözümleniyor...",
    ipv4: "Genel IPv4 Adresi",
    typeUnicast: "Tür: genel unicast",
    notDetected: "Algılanmadı",
    copied: "Kopyalandı!",
    copyV4: "IPv4 Kopyala",
    copyV6: "IPv6 Kopyala",
    ipv6: "Genel IPv6 Adresi",
    supported: "IPv6 Destekleniyor",
    notSupported: "IPv6 algılanmadı",
    noIpv6: "Algılanmadı (İSS IPv6 yönlendirmiyor)",
    nextGen: "Yeni Nesil IP Protokolü",
    legacyRails: "Bağlantınız tamamen geleneksel IPv4 altyapısı üzerinde çalışıyor.",
    geoLoc: "Coğrafi Konum",
    country: "Ülke",
    region: "Bölge / İl",
    city: "Şehir",
    postal: "Posta Kodu",
    secured: "Güvenli Düğüm",
    networkParams: "Ağ Parametreleri",
    asn: "ASN Tanımlayıcı",
    iana: "IANA Aralığı",
    timezone: "Saat Dilimi",
    utc: "UTC Farkı",
    reidentify: "Yeniden Tanımla",
    compass: "Pusula Radarı",
    lat: "Enlem",
    lon: "Boylam",
    secDiagnostics: "Ağ Protokolü ve Güvenlik Tanılama",
    secSubtitle: "Etkin TLS aktarım şifrelemesi, DNS sızıntı koruması ve gizlilik denetimleri.",
    allSystemsSecure: "Tüm Sistemler Güvenli",
    dnsPrivacy: "DNS Sızıntı Koruması",
    dnsStatus: "DoH/DoT Şifreli",
    webrtcPrivacy: "WebRTC Kalkanı",
    webrtcStatus: "Sızıntı Algılanmadı",
    transportSecurity: "Aktarım Güvenliği",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "IP Rota İtibarı",
    ipReputationStatus: "Temiz / Düşük Risk"
  },
  Greek: {
    identifier: "Καθολικός Αναγνωριστής IP",
    title: "Ποια είναι η Διεύθυνση IP μου;",
    subtitle: "Εντοπίστε και προσδιορίστε γεωγραφικά αμέσως τις ενεργές δημόσιες διευθύνσεις IPv4 και IPv6 σας.",
    resolving: "Ανάλυση κεφαλίδων πακέτων IP...",
    ipv4: "Δημόσια Διεύθυνση IPv4",
    typeUnicast: "Τύπος: δημόσιο unicast",
    notDetected: "Δεν εντοπίστηκε",
    copied: "Αντιγράφηκε!",
    copyV4: "Αντιγραφή IPv4",
    copyV6: "Αντιγραφή IPv6",
    ipv6: "Δημόσια Διεύθυνση IPv6",
    supported: "Υποστηρίζεται IPv6",
    notSupported: "Δεν εντοπίστηκε IPv6",
    noIpv6: "Δεν εντοπίστηκε (Ο πάροχος δεν δρομολογεί IPv6)",
    nextGen: "Πρωτόκολλο IP Νέας Γενιάς",
    legacyRails: "Η σύνδεσή σας λειτουργεί εξ ολοκλήρου σε κλασική υποδομή IPv4.",
    geoLoc: "Γεωγραφική Τοποθεσία",
    country: "Χώρα",
    region: "Περιφέρεια / Περιοχή",
    city: "Πόλη",
    postal: "Ταχυδρομικός Κώδικας",
    secured: "Ασφαλής Κόμβος",
    networkParams: "Παράμετροι Δικτύου",
    asn: "Αναγνωριστικό ASN",
    iana: "Εύρος IANA",
    timezone: "Ζώνη Ώρας",
    utc: "Απόκλιση UTC",
    reidentify: "Επανεντοπισμός",
    compass: "Ραντάρ Πυξίδας",
    lat: "Γεωγρ. Πλάτος",
    lon: "Γεωγρ. Μήκος",
    secDiagnostics: "Διαγνωστικά Πρωτοκόλλου Δικτύου & Ασφάλειας",
    secSubtitle: "Ενεργή κρυπτογράφηση μεταφοράς TLS, προστασία διαρροής DNS και έλεγχοι απορρήτου.",
    allSystemsSecure: "Όλα τα Συστήματα Ασφαλή",
    dnsPrivacy: "Προστασία Διαρροής DNS",
    dnsStatus: "Κρυπτογραφημένο DoH/DoT",
    webrtcPrivacy: "Ασπίδα WebRTC",
    webrtcStatus: "Καμία Διαρροή",
    transportSecurity: "Ασφάλεια Μεταφοράς",
    transportStatus: "TLS 1.3 / HTTP/3",
    ipReputation: "Φήμη Διαδρομής IP",
    ipReputationStatus: "Καθαρή / Χαμηλού Κινδύνου"
  }
};

const MAP_T: Record<string, {
  liveMap: string;
  liveGeo: string;
  yourLocation: string;
  edgeServer: string;
  distance: string;
  approxNote: string;
  mapLoading: string;
  mapUnavailable: string;
  dualStack: string;
  ipv4Only: string;
  attention: string;
}> = {
  English: {
    liveMap: "Network Route Map",
    liveGeo: "LIVE GEO",
    yourLocation: "Your IP Location",
    edgeServer: "Connected Edge Node",
    distance: "Route Distance",
    approxNote: "IP geolocation reflects your ISP or regional PoP routing area.",
    mapLoading: "Loading live map...",
    mapUnavailable: "Map preview requires a valid location or Maps API key.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "IPv4 Direct Route",
    attention: "Attention Advised"
  },
  Spanish: {
    liveMap: "Mapa de ruta de red",
    liveGeo: "GEO EN VIVO",
    yourLocation: "Tu ubicación IP",
    edgeServer: "Nodo perimetral conectado",
    distance: "Distancia de ruta",
    approxNote: "La geolocalización IP refleja el área de enrutamiento de su ISP.",
    mapLoading: "Cargando mapa en vivo...",
    mapUnavailable: "La vista de mapa requiere una ubicación válida o clave de Maps.",
    dualStack: "Doble pila (IPv4 + IPv6)",
    ipv4Only: "Ruta directa IPv4",
    attention: "Revisión recomendada"
  },
  French: {
    liveMap: "Carte de routage réseau",
    liveGeo: "GÉO EN DIRECT",
    yourLocation: "Votre position IP",
    edgeServer: "Nœud Edge connecté",
    distance: "Distance de routage",
    approxNote: "La géolocalisation IP reflète la zone de routage de votre FAI.",
    mapLoading: "Chargement de la carte...",
    mapUnavailable: "L'aperçu carte nécessite une position valide ou une clé Maps.",
    dualStack: "Double pile (IPv4 + IPv6)",
    ipv4Only: "Route directe IPv4",
    attention: "Vérification conseillée"
  },
  German: {
    liveMap: "Netzwerk-Routenkarte",
    liveGeo: "LIVE-GEO",
    yourLocation: "Ihr IP-Standort",
    edgeServer: "Verbundener Edge-Knoten",
    distance: "Routendistanz",
    approxNote: "IP-Geolokalisierung spiegelt den regionalen ISP-Routingbereich wider.",
    mapLoading: "Live-Karte wird geladen...",
    mapUnavailable: "Kartenansicht erfordert gültigen Standort oder Maps-Schlüssel.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "Direkte IPv4-Route",
    attention: "Prüfung empfohlen"
  },
  Chinese: {
    liveMap: "网络路由地图",
    liveGeo: "实时定位",
    yourLocation: "当前 IP 位置",
    edgeServer: "连接的边缘节点",
    distance: "节点距离",
    approxNote: "IP 地理定位反映运营商或区域接入节点的路由区域。",
    mapLoading: "正在加载实时地图...",
    mapUnavailable: "需要有效坐标或 Maps API 密钥才能加载地图。",
    dualStack: "双栈连接 (IPv4 + IPv6)",
    ipv4Only: "IPv4 直连路由",
    attention: "建议关注"
  },
  'Chinese Traditional': {
    liveMap: "網路路由地圖",
    liveGeo: "即時定位",
    yourLocation: "目前 IP 位置",
    edgeServer: "連線邊緣節點",
    distance: "節點距離",
    approxNote: "IP 地理定位反映電信業者或區域接入節點的路由範圍。",
    mapLoading: "正在載入即時地圖...",
    mapUnavailable: "需要有效座標或 Maps API 金鑰才能顯示地圖。",
    dualStack: "雙堆疊連線 (IPv4 + IPv6)",
    ipv4Only: "IPv4 直連路由",
    attention: "建議留意"
  },
  Japanese: {
    liveMap: "ネットワーク経路マップ",
    liveGeo: "ライブ位置",
    yourLocation: "現在の IP 位置",
    edgeServer: "接続エッジノード",
    distance: "ノード間距離",
    approxNote: "IP位置情報はISPまたは接続先エッジの地域を示します。",
    mapLoading: "ライブマップを読み込み中...",
    mapUnavailable: "地図表示には有効な座標またはMaps APIキーが必要です。",
    dualStack: "デュアルスタック (IPv4 + IPv6)",
    ipv4Only: "IPv4 直接ルート",
    attention: "要確認"
  },
  Korean: {
    liveMap: "네트워크 경로 지도",
    liveGeo: "실시간 위치",
    yourLocation: "현재 IP 위치",
    edgeServer: "연결된 엣지 노드",
    distance: "경로 거리",
    approxNote: "IP 위치 정보는 ISP 또는 지역 라우팅 거점을 기준으로 표시됩니다.",
    mapLoading: "실시간 지도 불러오는 중...",
    mapUnavailable: "지도를 표시하려면 유효한 좌표 또는 Maps API 키가 필요합니다.",
    dualStack: "듀얼 스택 (IPv4 + IPv6)",
    ipv4Only: "IPv4 직접 경로",
    attention: "확인 권장"
  },
  Italian: {
    liveMap: "Mappa percorso di rete",
    liveGeo: "GEO LIVE",
    yourLocation: "Tua posizione IP",
    edgeServer: "Nodo Edge connesso",
    distance: "Distanza percorso",
    approxNote: "La geolocalizzazione IP riflette l'area di instradamento ISP.",
    mapLoading: "Caricamento mappa live...",
    mapUnavailable: "La mappa richiede coordinate valide o una chiave Maps.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "Rotta diretta IPv4",
    attention: "Verifica consigliata"
  },
  Russian: {
    liveMap: "Карта сетевого маршрута",
    liveGeo: "ГЕО ОНЛАЙН",
    yourLocation: "Ваше IP-положение",
    edgeServer: "Подключённый узел Edge",
    distance: "Дистанция маршрута",
    approxNote: "IP-геолокация отражает региональный узел маршрутизации провайдера.",
    mapLoading: "Загрузка карты...",
    mapUnavailable: "Для карты нужны корректные координаты или ключ Maps API.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "Прямой маршрут IPv4",
    attention: "Требует внимания"
  },
  Luxembourgish: {
    liveMap: "Netzwierk-Routekaart",
    liveGeo: "LIVE GEO",
    yourLocation: "Är IP-Positioun",
    edgeServer: "Verbonnen Edge-Node",
    distance: "Streckendistanz",
    approxNote: "D'IP-Geolokalisatioun weist d'Routing-Regioun vun Ärem ISP.",
    mapLoading: "Live-Kaart gëtt gelueden...",
    mapUnavailable: "Fir d'Kaart si gülteg Koordinaten oder e Maps-Schlëssel néideg.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "Direkt IPv4-Route",
    attention: "Kontroll recommandéiert"
  },
  Dutch: {
    liveMap: "Netwerkroutekaart",
    liveGeo: "LIVE GEO",
    yourLocation: "Uw IP-locatie",
    edgeServer: "Verbonden Edge-knooppunt",
    distance: "Route-afstand",
    approxNote: "IP-geolocatie toont het regionale routeringsgebied van uw provider.",
    mapLoading: "Livekaart laden...",
    mapUnavailable: "Voor kaartweergave zijn geldige coördinaten of Maps-sleutel vereist.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "Directe IPv4-route",
    attention: "Controle aanbevolen"
  },
  Swedish: {
    liveMap: "Nätverksruttskarta",
    liveGeo: "LIVE GEO",
    yourLocation: "Din IP-plats",
    edgeServer: "Ansluten Edge-nod",
    distance: "Ruttavstånd",
    approxNote: "IP-geolokalisering visar din internetleverantörs regionala nod.",
    mapLoading: "Laddar livekarta...",
    mapUnavailable: "Kartan kräver giltiga koordinater eller Maps API-nyckel.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "Direkt IPv4-rutt",
    attention: "Kontroll rekommenderas"
  },
  Finnish: {
    liveMap: "Verkkoreittikartta",
    liveGeo: "LIVE-SIJAINTI",
    yourLocation: "IP-sijaintisi",
    edgeServer: "Yhdistetty Edge-solmu",
    distance: "Reittietäisyys",
    approxNote: "IP-paikannus näyttää operaattorin alueellisen reititysalueen.",
    mapLoading: "Ladataan live-karttaa...",
    mapUnavailable: "Kartta vaatii kelvolliset koordinaatit tai Maps-avaimen.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "Suora IPv4-reitti",
    attention: "Tarkistus suositeltavaa"
  },
  Hindi: {
    liveMap: "नेटवर्क रूट मानचित्र",
    liveGeo: "लाइव लोकेशन",
    yourLocation: "आपका IP स्थान",
    edgeServer: "कनेक्टेड एज नोड",
    distance: "रूट दूरी",
    approxNote: "IP जियोलोकेशन आपके ISP के क्षेत्रीय रूटिंग क्षेत्र को दर्शाता है।",
    mapLoading: "लाइव मानचित्र लोड हो रहा है...",
    mapUnavailable: "मानचित्र के लिए मान्य स्थान या Maps API कुंजी आवश्यक है।",
    dualStack: "डुअल-स्टैक (IPv4 + IPv6)",
    ipv4Only: "प्रत्यक्ष IPv4 रूट",
    attention: "ध्यान देना उचित"
  },
  Norwegian: {
    liveMap: "Nettverksrutekart",
    liveGeo: "LIVE GEO",
    yourLocation: "Din IP-plassering",
    edgeServer: "Tilkoblet Edge-node",
    distance: "Ruteavstand",
    approxNote: "IP-geolokalisering viser internettleverandørens regionale rutingområde.",
    mapLoading: "Laster live-kart...",
    mapUnavailable: "Kartvisning krever gyldige koordinater eller Maps API-nøkkel.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "Direkte IPv4-rute",
    attention: "Gjennomgang anbefales"
  },
  Thai: {
    liveMap: "แผนที่เส้นทางเครือข่าย",
    liveGeo: "ตำแหน่งสด",
    yourLocation: "ตำแหน่ง IP ของคุณ",
    edgeServer: "โหนด Edge ที่เชื่อมต่อ",
    distance: "ระยะทางเส้นทาง",
    approxNote: "ตำแหน่ง IP อ้างอิงจากพื้นที่กำหนดเส้นทางของผู้ให้บริการเครือข่าย",
    mapLoading: "กำลังโหลดแผนที่สด...",
    mapUnavailable: "ต้องมีพิกัดที่ถูกต้องหรือ Maps API Key เพื่อแสดงแผนที่",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "เส้นทาง IPv4 โดยตรง",
    attention: "ควรตรวจสอบ"
  },
  Portuguese: {
    liveMap: "Mapa de Rota de Rede",
    liveGeo: "GEO AO VIVO",
    yourLocation: "A Sua Localização IP",
    edgeServer: "Nó Edge Ligado",
    distance: "Distância da Rota",
    approxNote: "A geolocalização IP reflete a área regional de encaminhamento do ISP.",
    mapLoading: "A carregar mapa em direto...",
    mapUnavailable: "O mapa requer coordenadas válidas ou chave Maps API.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "Rota Direta IPv4",
    attention: "Atenção Recomendada"
  },
  Vietnamese: {
    liveMap: "Bản đồ tuyến mạng",
    liveGeo: "ĐỊNH VỊ TRỰC TIẾP",
    yourLocation: "Vị trí IP của bạn",
    edgeServer: "Nút Edge đang kết nối",
    distance: "Khoảng cách tuyến",
    approxNote: "Định vị IP phản ánh khu vực định tuyến của nhà mạng.",
    mapLoading: "Đang tải bản đồ trực tiếp...",
    mapUnavailable: "Cần tọa độ hợp lệ hoặc khóa Maps API để hiển thị bản đồ.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "Tuyến trực tiếp IPv4",
    attention: "Nên kiểm tra"
  },
  Polish: {
    liveMap: "Mapa trasy sieci",
    liveGeo: "GEO NA ŻYWO",
    yourLocation: "Twoja lokalizacja IP",
    edgeServer: "Połączony węzeł Edge",
    distance: "Dystans trasy",
    approxNote: "Geolokalizacja IP odzwierciedla regionalny obszar routingu dostawcy.",
    mapLoading: "Ładowanie mapy na żywo...",
    mapUnavailable: "Mapa wymaga prawidłowych współrzędnych lub klucza Maps API.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "Bezpośrednia trasa IPv4",
    attention: "Zalecana uwaga"
  },
  Danish: {
    liveMap: "Netværksrutekort",
    liveGeo: "LIVE GEO",
    yourLocation: "Din IP-placering",
    edgeServer: "Tilsluttet Edge-node",
    distance: "Ruteafstand",
    approxNote: "IP-geolokalisering afspejler internetudbyderens regionale område.",
    mapLoading: "Indlæser live-kort...",
    mapUnavailable: "Kortvisning kræver gyldige koordinater eller Maps API-nøgle.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "Direkte IPv4-rute",
    attention: "Kontrol anbefales"
  },
  Turkish: {
    liveMap: "Ağ Rota Haritası",
    liveGeo: "CANLI KONUM",
    yourLocation: "IP Konumunuz",
    edgeServer: "Bağlı Edge Düğümü",
    distance: "Rota Mesafesi",
    approxNote: "IP konumu, İSS veya bölgesel yönlendirme alanını yansıtır.",
    mapLoading: "Canlı harita yükleniyor...",
    mapUnavailable: "Harita için geçerli konum veya Maps API anahtarı gerekir.",
    dualStack: "Çift Yığın (IPv4 + IPv6)",
    ipv4Only: "Doğrudan IPv4 Rotası",
    attention: "Kontrol Önerilir"
  },
  Greek: {
    liveMap: "Χάρτης Διαδρομής Δικτύου",
    liveGeo: "ΖΩΝΤΑΝΗ ΘΕΣΗ",
    yourLocation: "Η Τοποθεσία IP σας",
    edgeServer: "Συνδεδεμένος Κόμβος Edge",
    distance: "Απόσταση Διαδρομής",
    approxNote: "Η γεωτοποθεσία IP αντικατοπτρίζει την περιοχή δρομολόγησης του παρόχου.",
    mapLoading: "Φόρτωση ζωντανού χάρτη...",
    mapUnavailable: "Απαιτούνται έγκυρες συντεταγμένες ή κλειδί Maps API.",
    dualStack: "Dual-Stack (IPv4 + IPv6)",
    ipv4Only: "Άμεση διαδρομή IPv4",
    attention: "Συνιστάται έλεγχος"
  }
};

const IP_LOCALES: Record<string, string> = {
  English: 'en-US',
  Spanish: 'es-ES',
  French: 'fr-FR',
  German: 'de-DE',
  Chinese: 'zh-CN',
  'Chinese Traditional': 'zh-TW',
  Japanese: 'ja-JP',
  Korean: 'ko-KR',
  Italian: 'it-IT',
  Russian: 'ru-RU',
  Luxembourgish: 'lb-LU',
  Dutch: 'nl-NL',
  Swedish: 'sv-SE',
  Finnish: 'fi-FI',
  Hindi: 'hi-IN',
  Norwegian: 'nb-NO',
  Thai: 'th-TH',
  Portuguese: 'pt-PT',
  Vietnamese: 'vi-VN',
  Polish: 'pl-PL',
  Danish: 'da-DK',
  Turkish: 'tr-TR',
  Greek: 'el-GR',
};

interface DiagStrings {
  na: string;
  unavailable: string;
  ispLabel: string;
  probing: string;
  zoomIn: string;
  zoomOut: string;
  close: string;
  ianaPrivate: string;
  ianaCgnat: string;
  ianaDualStack: string;
  ianaIpv4: string;
  ianaIpv6: string;
  dohVerified: string;
  dnssecReady: string;
  systemDns: string;
  dohBlocked: string;
  webrtcDisabled: string;
  peerConnUnavailable: string;
  iceExposed: string;
  differsPublicIp: string;
  matchedPublicStun: string;
  mdnsLanMasked: string;
  sameAsPublicIp: string;
  mdnsIsolated: string;
  maskedLocalHost: string;
  lanIpExposed: string;
  localIceVisible: string;
  noStunLeaks: string;
  zeroExposedHosts: string;
  httpsTls: string;
  httpUnencrypted: string;
  secureContext: string;
  insecureContext: string;
  proxyVpnRelay: string;
  directIspRouting: string;
}

const DIAG_T: Record<string, DiagStrings> = {
  English: {
    na: 'N/A',
    unavailable: 'Unavailable',
    ispLabel: 'ISP',
    probing: 'Probing...',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    close: 'Close',
    ianaPrivate: 'Private RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Dual-Stack Global Unicast',
    ianaIpv4: 'IPv4 Global Unicast',
    ianaIpv6: 'IPv6 Global Unicast',
    dohVerified: 'DoH Verified (1.1.1.1)',
    dnssecReady: 'DNSSEC Ready',
    systemDns: 'Standard System DNS',
    dohBlocked: 'DoH probe blocked or offline',
    webrtcDisabled: 'WebRTC Disabled',
    peerConnUnavailable: 'PeerConnection API unavailable',
    iceExposed: 'ICE Exposed',
    differsPublicIp: 'Differs from HTTP public IP',
    matchedPublicStun: 'Matched Public STUN',
    mdnsLanMasked: 'mDNS LAN masked',
    sameAsPublicIp: 'Same as public IP',
    mdnsIsolated: 'mDNS Isolated',
    maskedLocalHost: 'masked .local ICE host',
    lanIpExposed: 'LAN IP Exposed',
    localIceVisible: 'Local host ICE candidate visible',
    noStunLeaks: 'No STUN Leaks',
    zeroExposedHosts: 'Zero exposed host candidates',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP Unencrypted',
    secureContext: 'Secure Browser Context Verified',
    insecureContext: 'Insecure Origin Context',
    proxyVpnRelay: 'Proxy / VPN Relay',
    directIspRouting: 'Direct ISP Routing',
  },
  Chinese: {
    na: '暂无',
    unavailable: '不可用',
    ispLabel: '运营商',
    probing: '检测中...',
    zoomIn: '放大',
    zoomOut: '缩小',
    close: '关闭',
    ianaPrivate: '私有网段 RFC 1918',
    ianaCgnat: '运营商级 NAT RFC 6598',
    ianaDualStack: '双栈公网单播',
    ianaIpv4: 'IPv4 公网单播',
    ianaIpv6: 'IPv6 公网单播',
    dohVerified: 'DoH 已验证 (1.1.1.1)',
    dnssecReady: '支持 DNSSEC',
    systemDns: '标准系统 DNS',
    dohBlocked: 'DoH 探测受阻或离线',
    webrtcDisabled: 'WebRTC 已禁用',
    peerConnUnavailable: 'PeerConnection 接口不可用',
    iceExposed: 'ICE 地址暴露',
    differsPublicIp: '与 HTTP 公网 IP 不一致',
    matchedPublicStun: '已匹配公网 STUN',
    mdnsLanMasked: 'mDNS 局域网已隐藏',
    sameAsPublicIp: '与公网 IP 一致',
    mdnsIsolated: 'mDNS 已隔离',
    maskedLocalHost: '个已屏蔽的 .local ICE 主机',
    lanIpExposed: '局域网 IP 暴露',
    localIceVisible: '检测到本地主机 ICE 候选地址',
    noStunLeaks: '无 STUN 泄漏',
    zeroExposedHosts: '无暴露的主机候选地址',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP 未加密',
    secureContext: '安全浏览器上下文已验证',
    insecureContext: '不安全源上下文',
    proxyVpnRelay: '代理 / VPN 中继',
    directIspRouting: '运营商直连路由',
  },
  'Chinese Traditional': {
    na: '暫無',
    unavailable: '無法使用',
    ispLabel: '電信業者',
    probing: '偵測中...',
    zoomIn: '放大',
    zoomOut: '縮小',
    close: '關閉',
    ianaPrivate: '私有網段 RFC 1918',
    ianaCgnat: '電信商級 NAT RFC 6598',
    ianaDualStack: '雙堆疊公網單播',
    ianaIpv4: 'IPv4 公網單播',
    ianaIpv6: 'IPv6 公網單播',
    dohVerified: 'DoH 已驗證 (1.1.1.1)',
    dnssecReady: '支援 DNSSEC',
    systemDns: '標準系統 DNS',
    dohBlocked: 'DoH 探測受阻或離線',
    webrtcDisabled: 'WebRTC 已停用',
    peerConnUnavailable: 'PeerConnection API 不可用',
    iceExposed: 'ICE 位址暴露',
    differsPublicIp: '與 HTTP 公網 IP 不同',
    matchedPublicStun: '符合公網 STUN',
    mdnsLanMasked: 'mDNS 區網已遮罩',
    sameAsPublicIp: '與公網 IP 相同',
    mdnsIsolated: 'mDNS 已隔離',
    maskedLocalHost: '個已遮罩的 .local ICE 主機',
    lanIpExposed: '區網 IP 暴露',
    localIceVisible: '可見本機 ICE 候選位址',
    noStunLeaks: '無 STUN 洩漏',
    zeroExposedHosts: '零個暴露的主機候選位址',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP 未加密',
    secureContext: '已驗證安全瀏覽器環境',
    insecureContext: '不安全的來源環境',
    proxyVpnRelay: '代理 / VPN 中繼',
    directIspRouting: '電信商直連路由',
  },
  Spanish: {
    na: 'N/D',
    unavailable: 'No disponible',
    ispLabel: 'ISP',
    probing: 'Analizando...',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    close: 'Cerrar',
    ianaPrivate: 'Privada RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Unicast global Dual-Stack',
    ianaIpv4: 'Unicast global IPv4',
    ianaIpv6: 'Unicast global IPv6',
    dohVerified: 'DoH verificado (1.1.1.1)',
    dnssecReady: 'Compatible con DNSSEC',
    systemDns: 'DNS estándar del sistema',
    dohBlocked: 'Sonda DoH bloqueada o sin conexión',
    webrtcDisabled: 'WebRTC desactivado',
    peerConnUnavailable: 'API PeerConnection no disponible',
    iceExposed: 'ICE expuesto',
    differsPublicIp: 'Difiere de la IP pública HTTP',
    matchedPublicStun: 'STUN público coincidente',
    mdnsLanMasked: 'LAN mDNS enmascarada',
    sameAsPublicIp: 'Igual que la IP pública',
    mdnsIsolated: 'mDNS aislado',
    maskedLocalHost: 'hosts ICE .local enmascarados',
    lanIpExposed: 'IP LAN expuesta',
    localIceVisible: 'Candidato ICE local visible',
    noStunLeaks: 'Sin fugas STUN',
    zeroExposedHosts: 'Cero candidatos expuestos',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP sin cifrar',
    secureContext: 'Contexto seguro verificado',
    insecureContext: 'Contexto de origen inseguro',
    proxyVpnRelay: 'Retransmisión Proxy / VPN',
    directIspRouting: 'Enrutamiento ISP directo',
  },
  French: {
    na: 'N/D',
    unavailable: 'Indisponible',
    ispLabel: 'FAI',
    probing: 'Analyse...',
    zoomIn: 'Zoom avant',
    zoomOut: 'Zoom arrière',
    close: 'Fermer',
    ianaPrivate: 'Privée RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Unicast global double pile',
    ianaIpv4: 'Unicast global IPv4',
    ianaIpv6: 'Unicast global IPv6',
    dohVerified: 'DoH vérifié (1.1.1.1)',
    dnssecReady: 'Compatible DNSSEC',
    systemDns: 'DNS système standard',
    dohBlocked: 'Sonde DoH bloquée ou hors ligne',
    webrtcDisabled: 'WebRTC désactivé',
    peerConnUnavailable: 'API PeerConnection indisponible',
    iceExposed: 'ICE exposé',
    differsPublicIp: "Diffère de l'IP publique HTTP",
    matchedPublicStun: 'STUN public concordant',
    mdnsLanMasked: 'LAN mDNS masqué',
    sameAsPublicIp: "Identique à l'IP publique",
    mdnsIsolated: 'mDNS isolé',
    maskedLocalHost: 'hôtes ICE .local masqués',
    lanIpExposed: 'IP LAN exposée',
    localIceVisible: 'Candidat ICE local visible',
    noStunLeaks: 'Aucune fuite STUN',
    zeroExposedHosts: 'Zéro candidat exposé',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP non chiffré',
    secureContext: 'Contexte navigateur sécurisé vérifié',
    insecureContext: "Contexte d'origine non sécurisé",
    proxyVpnRelay: 'Relais Proxy / VPN',
    directIspRouting: 'Routage FAI direct',
  },
  German: {
    na: 'k. A.',
    unavailable: 'Nicht verfügbar',
    ispLabel: 'ISP',
    probing: 'Wird geprüft...',
    zoomIn: 'Vergrößern',
    zoomOut: 'Verkleinern',
    close: 'Schließen',
    ianaPrivate: 'Privat RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Dual-Stack Global Unicast',
    ianaIpv4: 'IPv4 Global Unicast',
    ianaIpv6: 'IPv6 Global Unicast',
    dohVerified: 'DoH verifiziert (1.1.1.1)',
    dnssecReady: 'DNSSEC-bereit',
    systemDns: 'Standard-System-DNS',
    dohBlocked: 'DoH-Test blockiert oder offline',
    webrtcDisabled: 'WebRTC deaktiviert',
    peerConnUnavailable: 'PeerConnection-API nicht verfügbar',
    iceExposed: 'ICE offengelegt',
    differsPublicIp: 'Weicht von öffentlicher HTTP-IP ab',
    matchedPublicStun: 'Öffentliches STUN abgeglichen',
    mdnsLanMasked: 'mDNS-LAN maskiert',
    sameAsPublicIp: 'Identisch mit öffentlicher IP',
    mdnsIsolated: 'mDNS isoliert',
    maskedLocalHost: 'maskierte .local-ICE-Hosts',
    lanIpExposed: 'LAN-IP offengelegt',
    localIceVisible: 'Lokaler ICE-Kandidat sichtbar',
    noStunLeaks: 'Keine STUN-Leaks',
    zeroExposedHosts: 'Keine offengelegten Host-Kandidaten',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP unverschlüsselt',
    secureContext: 'Sicherer Browserkontext bestätigt',
    insecureContext: 'Unsicherer Ursprungskontext',
    proxyVpnRelay: 'Proxy- / VPN-Relay',
    directIspRouting: 'Direktes ISP-Routing',
  },
  Japanese: {
    na: '該当なし',
    unavailable: '利用不可',
    ispLabel: 'ISP',
    probing: '診断中...',
    zoomIn: '拡大',
    zoomOut: '縮小',
    close: '閉じる',
    ianaPrivate: 'プライベート RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'デュアルスタック・グローバルユニキャスト',
    ianaIpv4: 'IPv4 グローバルユニキャスト',
    ianaIpv6: 'IPv6 グローバルユニキャスト',
    dohVerified: 'DoH 検証済み (1.1.1.1)',
    dnssecReady: 'DNSSEC 対応',
    systemDns: '標準システム DNS',
    dohBlocked: 'DoH プローブがブロックまたはオフライン',
    webrtcDisabled: 'WebRTC 無効',
    peerConnUnavailable: 'PeerConnection API 利用不可',
    iceExposed: 'ICE 露出',
    differsPublicIp: 'HTTP グローバル IP と異なります',
    matchedPublicStun: 'パブリック STUN 一致',
    mdnsLanMasked: 'mDNS LAN マスク済み',
    sameAsPublicIp: 'パブリック IP と同一',
    mdnsIsolated: 'mDNS 分離済み',
    maskedLocalHost: '件のマスク済み .local ICE ホスト',
    lanIpExposed: 'LAN IP 露出',
    localIceVisible: 'ローカルホスト ICE 候補が検出されました',
    noStunLeaks: 'STUN リークなし',
    zeroExposedHosts: '露出したホスト候補はありません',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP 非暗号化',
    secureContext: '安全なブラウザコンテキスト確認済み',
    insecureContext: '安全でないオリジンコンテキスト',
    proxyVpnRelay: 'プロキシ / VPN リレー',
    directIspRouting: 'ISP 直接ルーティング',
  },
  Korean: {
    na: '해당 없음',
    unavailable: '사용 불가',
    ispLabel: 'ISP',
    probing: '점검 중...',
    zoomIn: '확대',
    zoomOut: '축소',
    close: '닫기',
    ianaPrivate: '사설 대역 RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: '듀얼 스택 공인 유니캐스트',
    ianaIpv4: 'IPv4 공인 유니캐스트',
    ianaIpv6: 'IPv6 공인 유니캐스트',
    dohVerified: 'DoH 검증됨 (1.1.1.1)',
    dnssecReady: 'DNSSEC 지원',
    systemDns: '표준 시스템 DNS',
    dohBlocked: 'DoH 프로브 차단됨 또는 오프라인',
    webrtcDisabled: 'WebRTC 비활성화됨',
    peerConnUnavailable: 'PeerConnection API 사용 불가',
    iceExposed: 'ICE 노출됨',
    differsPublicIp: 'HTTP 공인 IP와 다름',
    matchedPublicStun: '공인 STUN 일치',
    mdnsLanMasked: 'mDNS LAN 마스킹됨',
    sameAsPublicIp: '공인 IP와 동일',
    mdnsIsolated: 'mDNS 격리됨',
    maskedLocalHost: '개의 마스킹된 .local ICE 호스트',
    lanIpExposed: 'LAN IP 노출됨',
    localIceVisible: '로컬 호스트 ICE 후보 노출됨',
    noStunLeaks: 'STUN 유출 없음',
    zeroExposedHosts: '노출된 호스트 후보 없음',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP 암호화되지 않음',
    secureContext: '보안 브라우저 컨텍스트 확인됨',
    insecureContext: '안전하지 않은 출처 컨텍스트',
    proxyVpnRelay: '프록시 / VPN 중계',
    directIspRouting: 'ISP 직접 라우팅',
  },
  Italian: {
    na: 'N/D',
    unavailable: 'Non disponibile',
    ispLabel: 'ISP',
    probing: 'Verifica in corso...',
    zoomIn: 'Ingrandisci',
    zoomOut: 'Riduci',
    close: 'Chiudi',
    ianaPrivate: 'Privato RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Unicast globale Dual-Stack',
    ianaIpv4: 'Unicast globale IPv4',
    ianaIpv6: 'Unicast globale IPv6',
    dohVerified: 'DoH verificato (1.1.1.1)',
    dnssecReady: 'Pronto per DNSSEC',
    systemDns: 'DNS di sistema standard',
    dohBlocked: 'Probe DoH bloccato o offline',
    webrtcDisabled: 'WebRTC disabilitato',
    peerConnUnavailable: 'API PeerConnection non disponibile',
    iceExposed: 'ICE esposto',
    differsPublicIp: "Diverso dall'IP pubblico HTTP",
    matchedPublicStun: 'STUN pubblico corrispondente',
    mdnsLanMasked: 'LAN mDNS mascherata',
    sameAsPublicIp: "Uguale all'IP pubblico",
    mdnsIsolated: 'mDNS isolato',
    maskedLocalHost: 'host ICE .local mascherati',
    lanIpExposed: 'IP LAN esposto',
    localIceVisible: 'Candidato ICE locale visibile',
    noStunLeaks: 'Nessuna perdita STUN',
    zeroExposedHosts: 'Zero candidati esposti',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP non crittografato',
    secureContext: 'Contesto browser sicuro verificato',
    insecureContext: 'Contesto di origine non sicuro',
    proxyVpnRelay: 'Relay Proxy / VPN',
    directIspRouting: 'Instradamento ISP diretto',
  },
  Russian: {
    na: 'Н/Д',
    unavailable: 'Недоступно',
    ispLabel: 'Провайдер',
    probing: 'Проверка...',
    zoomIn: 'Увеличить',
    zoomOut: 'Уменьшить',
    close: 'Закрыть',
    ianaPrivate: 'Частная сеть RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Двухстековый глобальный unicast',
    ianaIpv4: 'IPv4 глобальный unicast',
    ianaIpv6: 'IPv6 глобальный unicast',
    dohVerified: 'DoH подтверждён (1.1.1.1)',
    dnssecReady: 'Поддержка DNSSEC',
    systemDns: 'Стандартный системный DNS',
    dohBlocked: 'Зонд DoH заблокирован или офлайн',
    webrtcDisabled: 'WebRTC отключён',
    peerConnUnavailable: 'API PeerConnection недоступен',
    iceExposed: 'Утечка ICE',
    differsPublicIp: 'Отличается от публичного HTTP IP',
    matchedPublicStun: 'Совпадает с публичным STUN',
    mdnsLanMasked: 'mDNS LAN скрыт',
    sameAsPublicIp: 'Совпадает с публичным IP',
    mdnsIsolated: 'mDNS изолирован',
    maskedLocalHost: 'скрытых .local ICE-хостов',
    lanIpExposed: 'Раскрыт локальный IP',
    localIceVisible: 'Виден локальный ICE-кандидат',
    noStunLeaks: 'Утечек STUN нет',
    zeroExposedHosts: 'Нет раскрытых хост-кандидатов',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP без шифрования',
    secureContext: 'Защищённый контекст подтверждён',
    insecureContext: 'Незащищённый контекст источника',
    proxyVpnRelay: 'Прокси / VPN-ретранслятор',
    directIspRouting: 'Прямая маршрутизация провайдера',
  },
  Luxembourgish: {
    na: 'N/A',
    unavailable: 'Net verfügbar',
    ispLabel: 'ISP',
    probing: 'Prüfung leeft...',
    zoomIn: 'Eranzoomen',
    zoomOut: 'Erauszoomen',
    close: 'Zoumaachen',
    ianaPrivate: 'Privat RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Dual-Stack Global Unicast',
    ianaIpv4: 'IPv4 Global Unicast',
    ianaIpv6: 'IPv6 Global Unicast',
    dohVerified: 'DoH verifizéiert (1.1.1.1)',
    dnssecReady: 'DNSSEC-bereet',
    systemDns: 'Standard-System-DNS',
    dohBlocked: 'DoH-Test blockéiert oder offline',
    webrtcDisabled: 'WebRTC ausgeschalt',
    peerConnUnavailable: 'PeerConnection-API net verfügbar',
    iceExposed: 'ICE opgedeckt',
    differsPublicIp: 'Ënnerscheet sech vun der HTTP-IP',
    matchedPublicStun: 'Ëffentlech STUN stëmmt iwwereneen',
    mdnsLanMasked: 'mDNS-LAN maskéiert',
    sameAsPublicIp: 'Selwecht wéi ëffentlech IP',
    mdnsIsolated: 'mDNS isoléiert',
    maskedLocalHost: 'maskéiert .local ICE-Hosten',
    lanIpExposed: 'LAN-IP opgedeckt',
    localIceVisible: 'Lokalen ICE-Kandidat siichtbar',
    noStunLeaks: 'Keng STUN-Leaks',
    zeroExposedHosts: 'Keng opgedeckt Host-Kandidaten',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP onverschlësselt',
    secureContext: 'Séchere Browser-Kontext bestätegt',
    insecureContext: 'Onsécheren Originn-Kontext',
    proxyVpnRelay: 'Proxy- / VPN-Relay',
    directIspRouting: 'Direkt ISP-Routing',
  },
  Dutch: {
    na: 'N.v.t.',
    unavailable: 'Niet beschikbaar',
    ispLabel: 'Provider',
    probing: 'Controleren...',
    zoomIn: 'Inzoomen',
    zoomOut: 'Uitzoomen',
    close: 'Sluiten',
    ianaPrivate: 'Privé RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Dual-Stack Global Unicast',
    ianaIpv4: 'IPv4 Global Unicast',
    ianaIpv6: 'IPv6 Global Unicast',
    dohVerified: 'DoH geverifieerd (1.1.1.1)',
    dnssecReady: 'DNSSEC gereed',
    systemDns: 'Standaard systeem-DNS',
    dohBlocked: 'DoH-meting geblokkeerd of offline',
    webrtcDisabled: 'WebRTC uitgeschakeld',
    peerConnUnavailable: 'PeerConnection API niet beschikbaar',
    iceExposed: 'ICE blootgesteld',
    differsPublicIp: 'Wijkt af van openbaar HTTP-IP',
    matchedPublicStun: 'Komt overeen met openbare STUN',
    mdnsLanMasked: 'mDNS LAN gemaskeerd',
    sameAsPublicIp: 'Gelijk aan openbaar IP',
    mdnsIsolated: 'mDNS geïsoleerd',
    maskedLocalHost: 'gemaskeerde .local ICE-hosts',
    lanIpExposed: 'LAN-IP blootgesteld',
    localIceVisible: 'Lokale ICE-kandidaat zichtbaar',
    noStunLeaks: 'Geen STUN-lekken',
    zeroExposedHosts: 'Geen blootgestelde hostkandidaten',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP niet versleuteld',
    secureContext: 'Beveiligde browsercontext geverifieerd',
    insecureContext: 'Onveilige oorsprongcontext',
    proxyVpnRelay: 'Proxy / VPN-relay',
    directIspRouting: 'Directe providerroutering',
  },
  Swedish: {
    na: 'Ej tillg.',
    unavailable: 'Ej tillgänglig',
    ispLabel: 'Operatör',
    probing: 'Testar...',
    zoomIn: 'Zooma in',
    zoomOut: 'Zooma ut',
    close: 'Stäng',
    ianaPrivate: 'Privat RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Dual-Stack Global Unicast',
    ianaIpv4: 'IPv4 Global Unicast',
    ianaIpv6: 'IPv6 Global Unicast',
    dohVerified: 'DoH verifierad (1.1.1.1)',
    dnssecReady: 'DNSSEC redo',
    systemDns: 'Standard system-DNS',
    dohBlocked: 'DoH-test blockerad eller offline',
    webrtcDisabled: 'WebRTC inaktiverad',
    peerConnUnavailable: 'PeerConnection API ej tillgängligt',
    iceExposed: 'ICE exponerad',
    differsPublicIp: 'Skiljer sig från publik HTTP-IP',
    matchedPublicStun: 'Matchar publik STUN',
    mdnsLanMasked: 'mDNS LAN maskerad',
    sameAsPublicIp: 'Samma som publik IP',
    mdnsIsolated: 'mDNS isolerad',
    maskedLocalHost: 'maskerade .local ICE-värdar',
    lanIpExposed: 'LAN-IP exponerad',
    localIceVisible: 'Lokal ICE-kandidat synlig',
    noStunLeaks: 'Inga STUN-läckor',
    zeroExposedHosts: 'Inga exponerade värdkandidater',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'Okrypterad HTTP',
    secureContext: 'Säker webbläsarkontext verifierad',
    insecureContext: 'Osäker ursprungskontext',
    proxyVpnRelay: 'Proxy / VPN-relä',
    directIspRouting: 'Direkt ISP-dirigering',
  },
  Finnish: {
    na: 'Ei saatavilla',
    unavailable: 'Ei käytettävissä',
    ispLabel: 'Palveluntarjoaja',
    probing: 'Tutkitaan...',
    zoomIn: 'Lähennä',
    zoomOut: 'Loitonna',
    close: 'Sulje',
    ianaPrivate: 'Yksityinen RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Dual-Stack Global Unicast',
    ianaIpv4: 'IPv4 Global Unicast',
    ianaIpv6: 'IPv6 Global Unicast',
    dohVerified: 'DoH vahvistettu (1.1.1.1)',
    dnssecReady: 'DNSSEC valmis',
    systemDns: 'Tavallinen järjestelmän DNS',
    dohBlocked: 'DoH-testi estetty tai offline',
    webrtcDisabled: 'WebRTC pois käytöstä',
    peerConnUnavailable: 'PeerConnection-rajapinta ei käytettävissä',
    iceExposed: 'ICE paljastunut',
    differsPublicIp: 'Poikkeaa julkisesta HTTP-IP:stä',
    matchedPublicStun: 'Vastaa julkista STUN-osoitetta',
    mdnsLanMasked: 'mDNS LAN suojattu',
    sameAsPublicIp: 'Sama kuin julkinen IP',
    mdnsIsolated: 'mDNS eristetty',
    maskedLocalHost: 'suojattua .local ICE-isäntää',
    lanIpExposed: 'LAN-IP paljastunut',
    localIceVisible: 'Paikallinen ICE-ehdokas näkyvissä',
    noStunLeaks: 'Ei STUN-vuotoja',
    zeroExposedHosts: 'Ei paljastuneita isäntäehdokkaita',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'Salaamaton HTTP',
    secureContext: 'Suojattu selainympäristö vahvistettu',
    insecureContext: 'Suojaamaton lähdeympäristö',
    proxyVpnRelay: 'Välityspalvelin / VPN',
    directIspRouting: 'Suora palveluntarjoajan reititys',
  },
  Hindi: {
    na: 'लागू नहीं',
    unavailable: 'अनुपलब्ध',
    ispLabel: 'ISP',
    probing: 'जाँच हो रही है...',
    zoomIn: 'ज़ूम इन',
    zoomOut: 'ज़ूम आउट',
    close: 'बंद करें',
    ianaPrivate: 'निजी RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'डुअल-स्टैक ग्लोबल यूनिकास्ट',
    ianaIpv4: 'IPv4 ग्लोबल यूनिकास्ट',
    ianaIpv6: 'IPv6 ग्लोबल यूनिकास्ट',
    dohVerified: 'DoH सत्यापित (1.1.1.1)',
    dnssecReady: 'DNSSEC तैयार',
    systemDns: 'मानक सिस्टम DNS',
    dohBlocked: 'DoH जांच अवरुद्ध या ऑफ़लाइन',
    webrtcDisabled: 'WebRTC अक्षम',
    peerConnUnavailable: 'PeerConnection API अनुपलब्ध',
    iceExposed: 'ICE उजागर',
    differsPublicIp: 'HTTP सार्वजनिक IP से भिन्न',
    matchedPublicStun: 'सार्वजनिक STUN से मेल खाता है',
    mdnsLanMasked: 'mDNS LAN छिपा हुआ',
    sameAsPublicIp: 'सार्वजनिक IP के समान',
    mdnsIsolated: 'mDNS पृथक',
    maskedLocalHost: 'मास्क किए गए .local ICE होस्ट',
    lanIpExposed: 'LAN IP उजागर',
    localIceVisible: 'स्थानीय ICE कैंडिडेट दृश्यमान',
    noStunLeaks: 'कोई STUN लीक नहीं',
    zeroExposedHosts: 'कोई उजागर होस्ट नहीं',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'असुरक्षित HTTP',
    secureContext: 'सुरक्षित ब्राउज़र संदर्भ सत्यापित',
    insecureContext: 'असुरक्षित मूल संदर्भ',
    proxyVpnRelay: 'प्रॉक्सी / VPN रिले',
    directIspRouting: 'सीधी ISP रूटिंग',
  },
  Norwegian: {
    na: 'I/T',
    unavailable: 'Utilgjengelig',
    ispLabel: 'ISP',
    probing: 'Tester...',
    zoomIn: 'Zoom inn',
    zoomOut: 'Zoom ut',
    close: 'Lukk',
    ianaPrivate: 'Privat RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Dual-Stack Global Unicast',
    ianaIpv4: 'IPv4 Global Unicast',
    ianaIpv6: 'IPv6 Global Unicast',
    dohVerified: 'DoH bekreftet (1.1.1.1)',
    dnssecReady: 'DNSSEC klar',
    systemDns: 'Standard system-DNS',
    dohBlocked: 'DoH-probe blokkert eller frakoblet',
    webrtcDisabled: 'WebRTC deaktivert',
    peerConnUnavailable: 'PeerConnection API utilgjengelig',
    iceExposed: 'ICE eksponert',
    differsPublicIp: 'Avviker fra offentlig HTTP-IP',
    matchedPublicStun: 'Samsvarer med offentlig STUN',
    mdnsLanMasked: 'mDNS LAN maskert',
    sameAsPublicIp: 'Samme som offentlig IP',
    mdnsIsolated: 'mDNS isolert',
    maskedLocalHost: 'maskerte .local ICE-verter',
    lanIpExposed: 'LAN-IP eksponert',
    localIceVisible: 'Lokal ICE-kandidat synlig',
    noStunLeaks: 'Ingen STUN-lekkasjer',
    zeroExposedHosts: 'Ingen eksponerte vertskandidater',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'Ukryptert HTTP',
    secureContext: 'Sikker nettleserkontekst bekreftet',
    insecureContext: 'Usikker opprinnelseskontekst',
    proxyVpnRelay: 'Proxy / VPN-relé',
    directIspRouting: 'Direkte ISP-ruting',
  },
  Thai: {
    na: 'ไม่มีข้อมูล',
    unavailable: 'ไม่พร้อมใช้งาน',
    ispLabel: 'ผู้ให้บริการ',
    probing: 'กำลังตรวจสอบ...',
    zoomIn: 'ซูมเข้า',
    zoomOut: 'ซูมออก',
    close: 'ปิด',
    ianaPrivate: 'เครือข่ายส่วนตัว RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Dual-Stack Global Unicast',
    ianaIpv4: 'IPv4 Global Unicast',
    ianaIpv6: 'IPv6 Global Unicast',
    dohVerified: 'ยืนยัน DoH แล้ว (1.1.1.1)',
    dnssecReady: 'รองรับ DNSSEC',
    systemDns: 'DNS ระบบมาตรฐาน',
    dohBlocked: 'การทดสอบ DoH ถูกบล็อกหรือออฟไลน์',
    webrtcDisabled: 'ปิดใช้งาน WebRTC',
    peerConnUnavailable: 'ไม่พบ PeerConnection API',
    iceExposed: 'พบการเปิดเผย ICE',
    differsPublicIp: 'ต่างจาก IP สาธารณะ HTTP',
    matchedPublicStun: 'ตรงกับ STUN สาธารณะ',
    mdnsLanMasked: 'ซ่อน LAN mDNS แล้ว',
    sameAsPublicIp: 'ตรงกับ IP สาธารณะ',
    mdnsIsolated: 'แยก mDNS แล้ว',
    maskedLocalHost: 'โฮสต์ ICE .local ที่ซ่อนไว้',
    lanIpExposed: 'พบการเปิดเผย LAN IP',
    localIceVisible: 'ตรวจพบแคนดิเดต ICE ภายในเครื่อง',
    noStunLeaks: 'ไม่พบการรั่วไหล STUN',
    zeroExposedHosts: 'ไม่มีโฮสต์แคนดิเดตที่ถูกเปิดเผย',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP ไม่ได้เข้ารหัส',
    secureContext: 'ยืนยันบริบทเบราว์เซอร์ที่ปลอดภัยแล้ว',
    insecureContext: 'บริบทต้นทางไม่ปลอดภัย',
    proxyVpnRelay: 'พร็อกซี / VPN รีเลย์',
    directIspRouting: 'เส้นทาง ISP โดยตรง',
  },
  Portuguese: {
    na: 'N/D',
    unavailable: 'Indisponível',
    ispLabel: 'ISP',
    probing: 'A analisar...',
    zoomIn: 'Ampliar',
    zoomOut: 'Reduzir',
    close: 'Fechar',
    ianaPrivate: 'Privada RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Unicast Global Dual-Stack',
    ianaIpv4: 'Unicast Global IPv4',
    ianaIpv6: 'Unicast Global IPv6',
    dohVerified: 'DoH Verificado (1.1.1.1)',
    dnssecReady: 'Compatível com DNSSEC',
    systemDns: 'DNS Padrão do Sistema',
    dohBlocked: 'Sonda DoH bloqueada ou offline',
    webrtcDisabled: 'WebRTC Desativado',
    peerConnUnavailable: 'API PeerConnection indisponível',
    iceExposed: 'ICE Exposto',
    differsPublicIp: 'Difere do IP público HTTP',
    matchedPublicStun: 'STUN Público Correspondente',
    mdnsLanMasked: 'LAN mDNS mascarada',
    sameAsPublicIp: 'Igual ao IP público',
    mdnsIsolated: 'mDNS Isolado',
    maskedLocalHost: 'hosts ICE .local mascarados',
    lanIpExposed: 'IP LAN Exposto',
    localIceVisible: 'Candidato ICE local visível',
    noStunLeaks: 'Sem Fugas STUN',
    zeroExposedHosts: 'Zero candidatos expostos',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP Não Encriptado',
    secureContext: 'Contexto Seguro Verificado',
    insecureContext: 'Contexto de Origem Inseguro',
    proxyVpnRelay: 'Retransmissão Proxy / VPN',
    directIspRouting: 'Encaminhamento Direto do ISP',
  },
  Vietnamese: {
    na: 'Không có',
    unavailable: 'Không khả dụng',
    ispLabel: 'Nhà mạng',
    probing: 'Đang kiểm tra...',
    zoomIn: 'Phóng to',
    zoomOut: 'Thu nhỏ',
    close: 'Đóng',
    ianaPrivate: 'Mạng riêng RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Unicast toàn cầu Dual-Stack',
    ianaIpv4: 'Unicast toàn cầu IPv4',
    ianaIpv6: 'Unicast toàn cầu IPv6',
    dohVerified: 'DoH đã xác minh (1.1.1.1)',
    dnssecReady: 'Sẵn sàng DNSSEC',
    systemDns: 'DNS hệ thống tiêu chuẩn',
    dohBlocked: 'Kiểm tra DoH bị chặn hoặc ngoại tuyến',
    webrtcDisabled: 'Đã tắt WebRTC',
    peerConnUnavailable: 'API PeerConnection không khả dụng',
    iceExposed: 'ICE bị lộ',
    differsPublicIp: 'Khác với IP công khai HTTP',
    matchedPublicStun: 'Khớp STUN công khai',
    mdnsLanMasked: 'LAN mDNS đã được ẩn',
    sameAsPublicIp: 'Trùng với IP công khai',
    mdnsIsolated: 'mDNS đã được cô lập',
    maskedLocalHost: 'máy chủ ICE .local đã ẩn',
    lanIpExposed: 'IP mạng LAN bị lộ',
    localIceVisible: 'Hiển thị ứng viên ICE cục bộ',
    noStunLeaks: 'Không rò rỉ STUN',
    zeroExposedHosts: 'Không có ứng viên máy chủ bị lộ',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'HTTP chưa mã hóa',
    secureContext: 'Ngữ cảnh trình duyệt an toàn đã xác minh',
    insecureContext: 'Ngữ cảnh nguồn không an toàn',
    proxyVpnRelay: 'Chuyển tiếp Proxy / VPN',
    directIspRouting: 'Định tuyến trực tiếp qua nhà mạng',
  },
  Polish: {
    na: 'Brak',
    unavailable: 'Niedostępny',
    ispLabel: 'Dostawca',
    probing: 'Sprawdzanie...',
    zoomIn: 'Powiększ',
    zoomOut: 'Pomniejsz',
    close: 'Zamknij',
    ianaPrivate: 'Prywatny RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Dual-Stack Global Unicast',
    ianaIpv4: 'IPv4 Global Unicast',
    ianaIpv6: 'IPv6 Global Unicast',
    dohVerified: 'DoH zweryfikowano (1.1.1.1)',
    dnssecReady: 'Obsługa DNSSEC',
    systemDns: 'Standardowy DNS systemu',
    dohBlocked: 'Test DoH zablokowany lub offline',
    webrtcDisabled: 'WebRTC wyłączone',
    peerConnUnavailable: 'API PeerConnection niedostępne',
    iceExposed: 'Ujawniono ICE',
    differsPublicIp: 'Różni się od publicznego IP HTTP',
    matchedPublicStun: 'Zgodny z publicznym STUN',
    mdnsLanMasked: 'Sieć LAN mDNS zamaskowana',
    sameAsPublicIp: 'Taki sam jak publiczny IP',
    mdnsIsolated: 'mDNS odizolowane',
    maskedLocalHost: 'zamaskowanych hostów ICE .local',
    lanIpExposed: 'Ujawniono lokalne IP',
    localIceVisible: 'Widoczny lokalny kandydat ICE',
    noStunLeaks: 'Brak wycieków STUN',
    zeroExposedHosts: 'Brak ujawnionych hostów',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'Nieszyfrowany HTTP',
    secureContext: 'Zweryfikowano bezpieczny kontekst przeglądarki',
    insecureContext: 'Niezabezpieczony kontekst źródła',
    proxyVpnRelay: 'Przekaźnik Proxy / VPN',
    directIspRouting: 'Bezpośredni routing ISP',
  },
  Danish: {
    na: 'Ikke tilg.',
    unavailable: 'Utilgængelig',
    ispLabel: 'Udbyder',
    probing: 'Undersøger...',
    zoomIn: 'Zoom ind',
    zoomOut: 'Zoom ud',
    close: 'Luk',
    ianaPrivate: 'Privat RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Dual-Stack Global Unicast',
    ianaIpv4: 'IPv4 Global Unicast',
    ianaIpv6: 'IPv6 Global Unicast',
    dohVerified: 'DoH bekræftet (1.1.1.1)',
    dnssecReady: 'DNSSEC klar',
    systemDns: 'Standard system-DNS',
    dohBlocked: 'DoH-probe blokeret eller offline',
    webrtcDisabled: 'WebRTC deaktiveret',
    peerConnUnavailable: 'PeerConnection API utilgængeligt',
    iceExposed: 'ICE eksponeret',
    differsPublicIp: 'Afviger fra offentlig HTTP-IP',
    matchedPublicStun: 'Matcher offentlig STUN',
    mdnsLanMasked: 'mDNS LAN maskeret',
    sameAsPublicIp: 'Samme som offentlig IP',
    mdnsIsolated: 'mDNS isoleret',
    maskedLocalHost: 'maskerede .local ICE-værter',
    lanIpExposed: 'LAN-IP eksponeret',
    localIceVisible: 'Lokal ICE-kandidat synlig',
    noStunLeaks: 'Ingen STUN-lækager',
    zeroExposedHosts: 'Ingen eksponerede værtskandidater',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'Ukrypteret HTTP',
    secureContext: 'Sikker browserkontekst bekræftet',
    insecureContext: 'Usikker oprindelseskontekst',
    proxyVpnRelay: 'Proxy / VPN-relæ',
    directIspRouting: 'Direkte udbyderrouting',
  },
  Turkish: {
    na: 'Yok',
    unavailable: 'Kullanılamıyor',
    ispLabel: 'İSS',
    probing: 'Kontrol ediliyor...',
    zoomIn: 'Yakınlaştır',
    zoomOut: 'Uzaklaştır',
    close: 'Kapat',
    ianaPrivate: 'Özel RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Çift Yığın Genel Unicast',
    ianaIpv4: 'IPv4 Genel Unicast',
    ianaIpv6: 'IPv6 Genel Unicast',
    dohVerified: 'DoH Doğrulandı (1.1.1.1)',
    dnssecReady: 'DNSSEC Hazır',
    systemDns: 'Standart Sistem DNS',
    dohBlocked: 'DoH testi engellendi veya çevrimdışı',
    webrtcDisabled: 'WebRTC Devre Dışı',
    peerConnUnavailable: 'PeerConnection API kullanılamıyor',
    iceExposed: 'ICE İfşa Oldu',
    differsPublicIp: 'Genel HTTP IP adresinden farklı',
    matchedPublicStun: 'Genel STUN ile Eşleşti',
    mdnsLanMasked: 'mDNS LAN maskelendi',
    sameAsPublicIp: 'Genel IP ile aynı',
    mdnsIsolated: 'mDNS Yalıtılmış',
    maskedLocalHost: 'maskelenmiş .local ICE ana bilgisayarı',
    lanIpExposed: 'Yerel Ağ IP İfşa Oldu',
    localIceVisible: 'Yerel ICE adayı görünür durumda',
    noStunLeaks: 'STUN Sızıntısı Yok',
    zeroExposedHosts: 'İfşa olmuş ana bilgisayar adayı yok',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'Şifrelenmemiş HTTP',
    secureContext: 'Güvenli Tarayıcı Bağlamı Doğrulandı',
    insecureContext: 'Güvenli Olmayan Kaynak Bağlamı',
    proxyVpnRelay: 'Proxy / VPN Aktarımı',
    directIspRouting: 'Doğrudan İSS Yönlendirmesi',
  },
  Greek: {
    na: 'Μ/Δ',
    unavailable: 'Μη διαθέσιμο',
    ispLabel: 'Πάροχος',
    probing: 'Έλεγχος...',
    zoomIn: 'Μεγέθυνση',
    zoomOut: 'Σμίκρυνση',
    close: 'Κλείσιμο',
    ianaPrivate: 'Ιδιωτικό RFC 1918',
    ianaCgnat: 'CGNAT RFC 6598',
    ianaDualStack: 'Dual-Stack Global Unicast',
    ianaIpv4: 'IPv4 Global Unicast',
    ianaIpv6: 'IPv6 Global Unicast',
    dohVerified: 'Επαληθεύτηκε DoH (1.1.1.1)',
    dnssecReady: 'Έτοιμο DNSSEC',
    systemDns: 'Τυπικό DNS Συστήματος',
    dohBlocked: 'Ο έλεγχος DoH αποκλείστηκε ή εκτός σύνδεσης',
    webrtcDisabled: 'WebRTC Απενεργοποιημένο',
    peerConnUnavailable: 'Το PeerConnection API δεν είναι διαθέσιμο',
    iceExposed: 'Εκτεθειμένο ICE',
    differsPublicIp: 'Διαφέρει από τη δημόσια HTTP IP',
    matchedPublicStun: 'Αντιστοιχήθηκε Δημόσιο STUN',
    mdnsLanMasked: 'mDNS LAN καλυμμένο',
    sameAsPublicIp: 'Ίδιο με τη δημόσια IP',
    mdnsIsolated: 'Απομονωμένο mDNS',
    maskedLocalHost: 'καλυμμένοι κεντρικοί ICE .local',
    lanIpExposed: 'Εκτεθειμένη τοπική IP LAN',
    localIceVisible: 'Ορατός τοπικός υποψήφιος ICE',
    noStunLeaks: 'Καμία Διαρροή STUN',
    zeroExposedHosts: 'Κανένας εκτεθειμένος υποψήφιος',
    httpsTls: 'HTTPS / TLS',
    httpUnencrypted: 'Μη κρυπτογραφημένο HTTP',
    secureContext: 'Ασφαλές περιβάλλον προγράμματος περιήγησης',
    insecureContext: 'Μη ασφαλές περιβάλλον προέλευσης',
    proxyVpnRelay: 'Αναμετάδοση Proxy / VPN',
    directIspRouting: 'Άμεση δρομολόγηση παρόχου',
  },
};

interface NormalizedIpData {
  ip: string;
  country_name: string;
  country_code: string;
  region: string;
  city: string;
  postal: string;
  org: string;
  asn: string;
  network?: string;
  timezone: string;
  utc_offset: string;
  latitude: number | null;
  longitude: number | null;
  colo?: string;
  coloCoords?: { code: string; city: string; lat: number; lng: number } | null;
  tls?: string;
  http?: string;
  isProxyOrVpn?: boolean;
}

interface SecurityDiagnostics {
  dnsStatus: string;
  dnsDetail: string;
  dnsOk: boolean;
  webrtcStatus: string;
  webrtcDetail: string;
  webrtcOk: boolean;
  transportStatus: string;
  transportDetail: string;
  transportOk: boolean;
  reputationStatus: string;
  reputationDetail: string;
  reputationOk: boolean;
}

function resolveCountryName(code?: string, fallbackName?: string, locale = 'en-US'): string {
  if (code && code.length === 2) {
    try {
      const display = new Intl.DisplayNames([locale], { type: 'region' });
      const localized = display.of(code.toUpperCase());
      if (localized) return localized;
    } catch {
      // fall through
    }
  }
  if (fallbackName && fallbackName.length > 2) return fallbackName;
  return code ? code.toUpperCase() : '';
}

function computeUtcOffsetFromTimezone(tz?: string, rawOffset?: string): string {
  if (rawOffset && /^[+-]\d{2}:?\d{2}$/.test(rawOffset.trim())) {
    const clean = rawOffset.trim();
    const formatted = clean.includes(':') ? clean : `${clean.slice(0, 3)}:${clean.slice(3)}`;
    return `UTC${formatted}`;
  }
  if (!tz) return '';
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date());
    const offsetPart = parts.find((p) => p.type === 'timeZoneName')?.value;
    if (offsetPart) {
      return offsetPart.replace('GMT', 'UTC');
    }
  } catch {
    // ignore invalid timezone
  }
  return '';
}

function classifyIanaRange(ipv4: string | null, ipv6: string | null, networkCidr: string | undefined, diag: DiagStrings): string {
  if (networkCidr) {
    return networkCidr;
  }
  if (ipv4 && ipv4.includes('.')) {
    const parts = ipv4.split('.').map(Number);
    if (parts[0] === 10 || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168)) {
      return diag.ianaPrivate;
    }
    if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) {
      return diag.ianaCgnat;
    }
    if (ipv6) return diag.ianaDualStack;
    return diag.ianaIpv4;
  }
  if (ipv6) return diag.ianaIpv6;
  return diag.na;
}

function formatCoord(val: number | null | undefined, posDir: string, negDir: string, naLabel: string): string {
  if (val === null || val === undefined || !Number.isFinite(val)) return naLabel;
  const dir = val >= 0 ? posDir : negDir;
  return `${Math.abs(val).toFixed(4)}° ${dir}`;
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function probeDnsOverHttps(diag: DiagStrings): Promise<{ ok: boolean; status: string; detail: string }> {
  try {
    const t0 = performance.now();
    const res = await fetchWithTimeout(
      'https://cloudflare-dns.com/dns-query?name=cloudflare.com&type=A',
      2500,
      { headers: { Accept: 'application/dns-json' }, cache: 'no-store' }
    );
    const rtt = Math.max(1, Math.round(performance.now() - t0));
    if (res.ok) {
      const json = await res.json();
      if (json && json.Status === 0) {
        return {
          ok: true,
          status: diag.dohVerified,
          detail: `${diag.dnssecReady} • ${rtt} ms RTT`,
        };
      }
    }
  } catch {
    // fallback if blocked
  }
  return {
    ok: true,
    status: diag.systemDns,
    detail: diag.dohBlocked,
  };
}

async function probeWebRtcLeak(publicV4: string | null, publicV6: string | null, diag: DiagStrings): Promise<{ ok: boolean; status: string; detail: string }> {
  if (typeof window === 'undefined' || typeof RTCPeerConnection === 'undefined') {
    return {
      ok: true,
      status: diag.webrtcDisabled,
      detail: diag.peerConnUnavailable,
    };
  }
  return new Promise((resolve) => {
    let pc: RTCPeerConnection | null = null;
    let settled = false;
    const foundPublic = new Set<string>();
    const foundMdns = new Set<string>();
    const foundLocal = new Set<string>();

    const finish = () => {
      if (settled) return;
      settled = true;
      try {
        pc?.close();
      } catch {
        // ignore close errors
      }
      const externalCandidates = Array.from(foundPublic).filter((ip) => ip !== publicV4 && ip !== publicV6);
      if (externalCandidates.length > 0) {
        resolve({
          ok: false,
          status: `${diag.iceExposed} (${externalCandidates[0]})`,
          detail: diag.differsPublicIp,
        });
      } else if (foundPublic.size > 0) {
        resolve({
          ok: true,
          status: diag.matchedPublicStun,
          detail: `${foundMdns.size > 0 ? diag.mdnsLanMasked : diag.sameAsPublicIp}`,
        });
      } else if (foundMdns.size > 0) {
        resolve({
          ok: true,
          status: diag.mdnsIsolated,
          detail: `${foundMdns.size} ${diag.maskedLocalHost}`,
        });
      } else if (foundLocal.size > 0) {
        resolve({
          ok: false,
          status: `${diag.lanIpExposed} (${Array.from(foundLocal)[0]})`,
          detail: diag.localIceVisible,
        });
      } else {
        resolve({
          ok: true,
          status: diag.noStunLeaks,
          detail: diag.zeroExposedHosts,
        });
      }
    };

    try {
      pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      pc.createDataChannel('probe');
      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          finish();
          return;
        }
        const cand = event.candidate.candidate || '';
        const mdnsMatch = cand.match(/([a-f0-9-]+\.local)/i);
        if (mdnsMatch) {
          foundMdns.add(mdnsMatch[1]);
        }
        const ipMatch = cand.match(/(\d{1,3}(?:\.\d{1,3}){3})|([0-9a-f]{1,4}(?::[0-9a-f]{0,4}){2,7})/i);
        if (ipMatch) {
          const ip = ipMatch[0];
          if (
            ip.startsWith('10.') ||
            ip.startsWith('192.168.') ||
            /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
            ip.startsWith('127.') ||
            ip.startsWith('fe80:')
          ) {
            foundLocal.add(ip);
          } else {
            foundPublic.add(ip);
          }
        }
      };
      pc.createOffer()
        .then((offer) => pc?.setLocalDescription(offer))
        .catch(() => finish());
      setTimeout(finish, 1800);
    } catch {
      finish();
    }
  });
}

function IpRouteMapInner({
  userPos,
  edgeNode,
  mapLabels,
  diagLabels,
}: {
  userPos: { lat: number; lng: number };
  edgeNode: { code: string; city: string; lat: number; lng: number } | null;
  mapLabels: typeof MAP_T['English'];
  diagLabels: DiagStrings;
}) {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const coreLib = useMapsLibrary('core');
  const apiStatus = useApiLoadingStatus();
  const [showInfo, setShowInfo] = useState(false);

  const hasDistinctEdge = useMemo(() => {
    if (!edgeNode) return false;
    return haversineKm(userPos, { lat: edgeNode.lat, lng: edgeNode.lng }) > 2;
  }, [userPos, edgeNode]);

  const distanceKm = useMemo(() => {
    if (!edgeNode || !hasDistinctEdge) return null;
    return haversineKm(userPos, { lat: edgeNode.lat, lng: edgeNode.lng });
  }, [userPos, edgeNode, hasDistinctEdge]);

  useEffect(() => {
    if (!map || !coreLib) return;
    if (edgeNode && hasDistinctEdge) {
      const bounds = new coreLib.LatLngBounds();
      bounds.extend(userPos);
      bounds.extend({ lat: edgeNode.lat, lng: edgeNode.lng });
      map.fitBounds(bounds, { top: 32, right: 54, bottom: 38, left: 32 });
    } else {
      map.setCenter(userPos);
      map.setZoom(10);
    }
  }, [map, coreLib, userPos, edgeNode, hasDistinctEdge]);

  useEffect(() => {
    if (!map || !mapsLib || !edgeNode || !hasDistinctEdge) return;
    const routeLine = new mapsLib.Polyline({
      path: [userPos, { lat: edgeNode.lat, lng: edgeNode.lng }],
      geodesic: false,
      strokeColor: '#d97745',
      strokeOpacity: 0.92,
      strokeWeight: 2.2,
    });
    routeLine.setMap(map);
    return () => {
      routeLine.setMap(null);
    };
  }, [map, mapsLib, userPos, edgeNode, hasDistinctEdge]);

  const handleZoomIn = useCallback(() => {
    if (!map) return;
    const z = map.getZoom() ?? 8;
    map.setZoom(Math.min(18, z + 1));
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (!map) return;
    const z = map.getZoom() ?? 8;
    map.setZoom(Math.max(2, z - 1));
  }, [map]);

  if (apiStatus === APILoadingStatus.FAILED || apiStatus === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs word-color opacity-60 bg-black/5 dark:bg-white/5">
        {mapLabels.mapUnavailable}
      </div>
    );
  }

  return (
    <>
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={userPos}
        defaultZoom={8}
        colorScheme="LIGHT"
        disableDefaultUI={true}
        gestureHandling="cooperative"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        <AdvancedMarker
          position={userPos}
          anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM}
          title={mapLabels.yourLocation}
        >
          <div className="ip-map-marker drop-shadow-md" aria-label={mapLabels.yourLocation}>
            <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
              <path
                d="M13 1C6.925 1 2 5.925 2 12c0 7.75 11 20.5 11 20.5S24 19.75 24 12C24 5.925 19.075 1 13 1z"
                fill="#c81e1e"
                stroke="#ffffff"
                strokeWidth="1.6"
              />
              <circle cx="13" cy="12" r="4" fill="#ffffff" />
            </svg>
          </div>
        </AdvancedMarker>

        {edgeNode && hasDistinctEdge && (
          <AdvancedMarker
            position={{ lat: edgeNode.lat, lng: edgeNode.lng }}
            anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
            title={`${mapLabels.edgeServer}: ${edgeNode.city} (${edgeNode.code})`}
          >
            <div className="ip-map-marker drop-shadow-sm" aria-label={`${edgeNode.city} (${edgeNode.code})`}>
              <svg width="34" height="22" viewBox="0 0 40 24" fill="none">
                <path
                  d="M27.8 20H8.6C4.95 20 2 17.15 2 13.65c0-3.15 2.4-5.78 5.52-6.26C8.62 3.74 12.1 1 16.25 1c4.52 0 8.27 3.2 8.99 7.42.73-.29 1.53-.45 2.36-.45 3.31 0 6 2.61 6 5.83 0 .28-.02.55-.07.82C36.02 15.16 38 17.34 38 20H27.8z"
                  fill="#f38020"
                  stroke="#ffffff"
                  strokeWidth="1.4"
                />
                <path
                  d="M31.6 14.6a4.4 4.4 0 0 1 4.4 4.4v1h-7.8v-4.2c1.05-.76 2.18-1.2 3.4-1.2z"
                  fill="#fbbf24"
                />
              </svg>
            </div>
          </AdvancedMarker>
        )}
      </GoogleMap>

      {/* Custom Bottom-Right Zoom & Info Controls matching iptest_4053d726.jpg */}
      <div className="absolute bottom-6 right-2.5 z-10 flex flex-col items-center gap-2">
        <div className="ip-map-control-group rounded-lg shadow-md overflow-hidden flex flex-col w-8 bg-white border border-black/15">
          <button
            type="button"
            onClick={handleZoomIn}
            title={diagLabels.zoomIn}
            aria-label={diagLabels.zoomIn}
            className="ip-map-control-btn w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
          >
            <Plus size={15} strokeWidth={2.5} />
          </button>
          <div className="h-px w-full bg-slate-200" />
          <button
            type="button"
            onClick={handleZoomOut}
            title={diagLabels.zoomOut}
            aria-label={diagLabels.zoomOut}
            className="ip-map-control-btn w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
          >
            <Minus size={15} strokeWidth={2.5} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowInfo((v) => !v)}
          title={mapLabels.liveMap}
          aria-label={mapLabels.liveMap}
          aria-expanded={showInfo}
          className="ip-map-info-btn w-8 h-8 rounded-full shadow-md flex items-center justify-center cursor-pointer transition-colors bg-white border border-black/15"
        >
          <Info size={15} strokeWidth={2.2} />
        </button>
      </div>

      {showInfo && (
        <div className="ip-map-info-popup absolute top-2.5 left-2.5 right-12 z-20 rounded-xl bg-white/95 text-slate-800 border border-slate-200 shadow-lg p-3 text-left text-[11px] leading-snug backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2 font-bold text-slate-900 mb-1">
            <span>{mapLabels.liveMap}</span>
            <button
              type="button"
              onClick={() => setShowInfo(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1 cursor-pointer"
              aria-label={diagLabels.close}
            >
              ×
            </button>
          </div>
          <div className="space-y-0.5 font-mono text-[10px] text-slate-600">
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-red-600 mr-1.5" />
              {mapLabels.yourLocation}: {userPos.lat.toFixed(4)}, {userPos.lng.toFixed(4)}
            </div>
            {edgeNode && hasDistinctEdge && (
              <div>
                <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-1.5" />
                {mapLabels.edgeServer}: {edgeNode.city} ({edgeNode.code})
              </div>
            )}
            {distanceKm !== null && (
              <div>
                {mapLabels.distance}: {distanceKm.toFixed(1)} km ({(distanceKm * 0.621371).toFixed(1)} mi)
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5">{mapLabels.approxNote}</p>
        </div>
      )}
    </>
  );
}

export default function IpAddressTab({ language = 'English' }: IpAddressTabProps = {}) {
  const d = IP_T[language] || IP_T['English'];
  const mT = MAP_T[language] || MAP_T['English'];
  const diagT = DIAG_T[language] || DIAG_T['English'];
  const ipLocale = IP_LOCALES[language] || 'en-US';
  const [ipv4Address, setIpv4Address] = useState<string | null>(null);
  const [ipv6Address, setIpv6Address] = useState<string | null>(null);
  const [ipData, setIpData] = useState<NormalizedIpData | null>(null);
  const [secDiag, setSecDiag] = useState<SecurityDiagnostics | null>(null);
  const [mapsApiKey, setMapsApiKey] = useState<string>(INITIAL_MAPS_API_KEY);
  const [isLoadingIp, setIsLoadingIp] = useState(true);
  const [copiedV4, setCopiedV4] = useState(false);
  const [copiedV6, setCopiedV6] = useState(false);

  useEffect(() => {
    if (!mapsApiKey) {
      fetch('/api/maps-config', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((cfg) => {
          if (cfg?.apiKey && typeof cfg.apiKey === 'string') {
            setMapsApiKey(cfg.apiKey.trim());
          }
        })
        .catch(() => {});
    }
  }, [mapsApiKey]);

  const fetchIp = useCallback(async () => {
    setIsLoadingIp(true);
    setIpv4Address(null);
    setIpv6Address(null);
    setSecDiag(null);

    let resolvedV4: string | null = null;
    let resolvedV6: string | null = null;
    let traceColo: string | undefined;
    let traceTls: string | undefined;
    let traceHttp: string | undefined;
    let traceLoc: string | undefined;

    interface CfMetaPayload {
      clientIp?: string;
      httpProtocol?: string;
      asn?: number | string;
      asOrganization?: string;
      country?: string;
      city?: string;
      region?: string;
      postalCode?: string;
      latitude?: number | string;
      longitude?: number | string;
      colo?: {
        iata?: string;
        city?: string;
        lat?: number | string;
        lon?: number | string;
      };
    }

    let cfMeta: CfMetaPayload | null = null;
    let metaColoCoords: { code: string; city: string; lat: number; lng: number } | null = null;

    // 1. Query IPv4, IPv6, Cloudflare Edge Trace, and Cloudflare /meta Geolocation in parallel
    const [ipifyV4Res, ipifyV6Res, cfTraceRes, cfMetaRes] = await Promise.allSettled([
      fetchWithTimeout('https://api.ipify.org?format=json', 4500, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)),
      fetchWithTimeout('https://api6.ipify.org?format=json', 3500, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)),
      fetchWithTimeout('https://www.cloudflare.com/cdn-cgi/trace', 4000, { cache: 'no-store' }).then((r) => (r.ok ? r.text() : '')),
      fetchWithTimeout('https://speed.cloudflare.com/meta', 4500, { cache: 'no-store' }).then(async (r) => {
        if (!r.ok) return null;
        const txt = await r.text();
        return txt ? (JSON.parse(txt) as CfMetaPayload) : null;
      }),
    ]);

    if (ipifyV4Res.status === 'fulfilled' && ipifyV4Res.value?.ip && !String(ipifyV4Res.value.ip).includes(':')) {
      resolvedV4 = String(ipifyV4Res.value.ip).trim();
    }
    if (ipifyV6Res.status === 'fulfilled' && ipifyV6Res.value?.ip && String(ipifyV6Res.value.ip).includes(':')) {
      resolvedV6 = String(ipifyV6Res.value.ip).trim();
    }
    if (cfTraceRes.status === 'fulfilled' && cfTraceRes.value) {
      const lines = cfTraceRes.value.split('\n');
      const kv: Record<string, string> = {};
      for (const line of lines) {
        const idx = line.indexOf('=');
        if (idx > 0) kv[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
      }
      if (kv.ip) {
        if (kv.ip.includes(':')) {
          if (!resolvedV6) resolvedV6 = kv.ip;
        } else if (!resolvedV4) {
          resolvedV4 = kv.ip;
        }
      }
      if (kv.colo) traceColo = kv.colo.toUpperCase();
      if (kv.tls) traceTls = kv.tls;
      if (kv.http) traceHttp = kv.http.toUpperCase();
      if (kv.loc) traceLoc = kv.loc.toUpperCase();
    }
    if (cfMetaRes.status === 'fulfilled' && cfMetaRes.value && typeof cfMetaRes.value === 'object') {
      cfMeta = cfMetaRes.value;
      if (cfMeta.clientIp) {
        const cip = String(cfMeta.clientIp).trim();
        if (cip.includes(':')) {
          if (!resolvedV6) resolvedV6 = cip;
        } else if (!resolvedV4) {
          resolvedV4 = cip;
        }
      }
      if (cfMeta.httpProtocol && !traceHttp) {
        traceHttp = String(cfMeta.httpProtocol).toUpperCase();
      }
      if (cfMeta.colo?.iata) {
        const code = String(cfMeta.colo.iata).toUpperCase();
        if (!traceColo) traceColo = code;
        const cLat = Number(cfMeta.colo.lat);
        const cLng = Number(cfMeta.colo.lon);
        if (Number.isFinite(cLat) && Number.isFinite(cLng)) {
          metaColoCoords = {
            code,
            city: cfMeta.colo.city || EDGE_POP_COORDS[code]?.city || code,
            lat: cLat,
            lng: cLng,
          };
        }
      }
    }

    // 2. Fetch auxiliary ASN/Timezone/Security metadata and backup geolocation
    const targetIp = resolvedV4 || resolvedV6 || '';
    let auxGeo: NormalizedIpData | null = null;

    // Auxiliary 1: ipwho.is (timezone, security flags, backup geo)
    try {
      const url = targetIp ? `https://ipwho.is/${encodeURIComponent(targetIp)}` : 'https://ipwho.is/';
      const res = await fetchWithTimeout(url, 4500, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success !== false && data.ip) {
          if (String(data.ip).includes(':')) {
            if (!resolvedV6) resolvedV6 = String(data.ip);
          } else if (!resolvedV4) {
            resolvedV4 = String(data.ip);
          }
          const asnRaw = data.connection?.asn ? `AS${String(data.connection.asn).replace(/^AS/i, '')}` : diagT.na;
          const orgRaw = data.connection?.isp || data.connection?.org || '';
          const tzId = data.timezone?.id || '';
          auxGeo = {
            ip: data.ip,
            country_code: (data.country_code || traceLoc || '').toUpperCase(),
            country_name: resolveCountryName(data.country_code || traceLoc, data.country, ipLocale) || diagT.na,
            region: data.region || diagT.na,
            city: data.city || diagT.na,
            postal: data.postal || diagT.na,
            org: orgRaw,
            asn: asnRaw,
            timezone: tzId || diagT.na,
            utc_offset: computeUtcOffsetFromTimezone(tzId, data.timezone?.utc) || diagT.na,
            latitude: typeof data.latitude === 'number' && Number.isFinite(data.latitude) ? data.latitude : null,
            longitude: typeof data.longitude === 'number' && Number.isFinite(data.longitude) ? data.longitude : null,
            colo: traceColo,
            coloCoords: metaColoCoords,
            tls: traceTls,
            http: traceHttp,
            isProxyOrVpn: Boolean(data.security?.proxy || data.security?.vpn || data.security?.tor),
          };
        }
      }
    } catch {
      // fall through to ipapi.co
    }

    // Auxiliary 2: ipapi.co (also provides CIDR network range if needed)
    if (!auxGeo) {
      try {
        const url = targetIp ? `https://ipapi.co/${encodeURIComponent(targetIp)}/json/` : 'https://ipapi.co/json/';
        const res = await fetchWithTimeout(url, 4500, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && !data.error && data.ip) {
            if (String(data.ip).includes(':')) {
              if (!resolvedV6) resolvedV6 = String(data.ip);
            } else if (!resolvedV4) {
              resolvedV4 = String(data.ip);
            }
            const lat = Number(data.latitude);
            const lng = Number(data.longitude);
            auxGeo = {
              ip: data.ip,
              country_code: (data.country_code || traceLoc || '').toUpperCase(),
              country_name: resolveCountryName(data.country_code || traceLoc, data.country_name, ipLocale) || diagT.na,
              region: data.region || diagT.na,
              city: data.city || diagT.na,
              postal: data.postal || diagT.na,
              org: data.org || '',
              asn: data.asn || diagT.na,
              network: data.network || undefined,
              timezone: data.timezone || diagT.na,
              utc_offset: computeUtcOffsetFromTimezone(data.timezone, data.utc_offset) || diagT.na,
              latitude: Number.isFinite(lat) ? lat : null,
              longitude: Number.isFinite(lng) ? lng : null,
              colo: traceColo,
              coloCoords: metaColoCoords,
              tls: traceTls,
              http: traceHttp,
            };
          }
        }
      } catch {
        // fall through to ipinfo.io
      }
    }

    // Auxiliary 3: ipinfo.io
    if (!auxGeo) {
      try {
        const url = targetIp ? `https://ipinfo.io/${encodeURIComponent(targetIp)}/json` : 'https://ipinfo.io/json';
        const res = await fetchWithTimeout(url, 4500, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.ip) {
            if (String(data.ip).includes(':')) {
              if (!resolvedV6) resolvedV6 = String(data.ip);
            } else if (!resolvedV4) {
              resolvedV4 = String(data.ip);
            }
            const [latStr, lngStr] = typeof data.loc === 'string' ? data.loc.split(',') : [];
            const lat = Number(latStr);
            const lng = Number(lngStr);
            const orgStr = String(data.org || '');
            const asnMatch = orgStr.match(/^(AS\d+)\s*(.*)$/i);
            const cc = (data.country || traceLoc || '').toUpperCase();
            auxGeo = {
              ip: data.ip,
              country_code: cc,
              country_name: resolveCountryName(cc, undefined, ipLocale) || diagT.na,
              region: data.region || diagT.na,
              city: data.city || diagT.na,
              postal: data.postal || diagT.na,
              org: asnMatch ? asnMatch[2] || orgStr : orgStr,
              asn: asnMatch ? asnMatch[1].toUpperCase() : diagT.na,
              timezone: data.timezone || diagT.na,
              utc_offset: computeUtcOffsetFromTimezone(data.timezone) || diagT.na,
              latitude: Number.isFinite(lat) ? lat : null,
              longitude: Number.isFinite(lng) ? lng : null,
              colo: traceColo,
              coloCoords: metaColoCoords,
              tls: traceTls,
              http: traceHttp,
            };
          }
        }
      } catch {
        // fallback minimal object below
      }
    }

    // 3. Prioritize Cloudflare /meta geolocation when present (matches Cloudflare IP check)
    let normalized: NormalizedIpData | null = auxGeo;
    const cfLat = cfMeta?.latitude !== undefined ? Number(cfMeta.latitude) : NaN;
    const cfLng = cfMeta?.longitude !== undefined ? Number(cfMeta.longitude) : NaN;
    const hasCfGeo = Boolean(cfMeta && (cfMeta.city || (Number.isFinite(cfLat) && Number.isFinite(cfLng))));

    if (hasCfGeo && cfMeta) {
      const cfCountryCode = (cfMeta.country || traceLoc || auxGeo?.country_code || '').toUpperCase();
      const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const tz = auxGeo?.timezone && auxGeo.timezone !== diagT.na ? auxGeo.timezone : browserTz || diagT.na;
      const utcOffset =
        auxGeo?.utc_offset && auxGeo.utc_offset !== diagT.na
          ? auxGeo.utc_offset
          : computeUtcOffsetFromTimezone(tz !== diagT.na ? tz : undefined) || diagT.na;
      const cfAsn = cfMeta.asn ? `AS${String(cfMeta.asn).replace(/^AS/i, '')}` : auxGeo?.asn || diagT.na;

      normalized = {
        ip: resolvedV4 || resolvedV6 || cfMeta.clientIp || auxGeo?.ip || '',
        country_code: cfCountryCode,
        country_name: resolveCountryName(cfCountryCode, auxGeo?.country_code === cfCountryCode ? auxGeo?.country_name : undefined, ipLocale) || diagT.na,
        region: cfMeta.region || auxGeo?.region || diagT.na,
        city: cfMeta.city || auxGeo?.city || diagT.na,
        postal: cfMeta.postalCode || auxGeo?.postal || diagT.na,
        org: cfMeta.asOrganization || auxGeo?.org || '',
        asn: cfAsn,
        network: auxGeo?.network,
        timezone: tz,
        utc_offset: utcOffset,
        latitude: Number.isFinite(cfLat) ? cfLat : auxGeo?.latitude ?? null,
        longitude: Number.isFinite(cfLng) ? cfLng : auxGeo?.longitude ?? null,
        colo: traceColo,
        coloCoords: metaColoCoords,
        tls: traceTls,
        http: traceHttp,
        isProxyOrVpn: auxGeo?.isProxyOrVpn,
      };
    }

    if (!normalized && (resolvedV4 || resolvedV6)) {
      const cc = traceLoc || '';
      const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      normalized = {
        ip: resolvedV4 || resolvedV6 || '',
        country_code: cc,
        country_name: resolveCountryName(cc, undefined, ipLocale) || diagT.na,
        region: diagT.na,
        city: diagT.na,
        postal: diagT.na,
        org: '',
        asn: diagT.na,
        timezone: browserTz || diagT.na,
        utc_offset: computeUtcOffsetFromTimezone(browserTz) || diagT.na,
        latitude: null,
        longitude: null,
        colo: traceColo,
        coloCoords: metaColoCoords,
        tls: traceTls,
        http: traceHttp,
      };
    }

    setIpv4Address(resolvedV4);
    setIpv6Address(resolvedV6);
    setIpData(normalized);
    setIsLoadingIp(false);

    // 3. Real Browser & Network Security Probes (DNS-over-HTTPS + WebRTC ICE + Navigation TLS)
    const [dohProbe, webrtcProbe] = await Promise.all([
      probeDnsOverHttps(diagT),
      probeWebRtcLeak(resolvedV4, resolvedV6, diagT),
    ]);

    const navEntries = typeof performance !== 'undefined'
      ? (performance.getEntriesByType('navigation') as PerformanceNavigationTiming[])
      : [];
    const navProto = navEntries?.[0]?.nextHopProtocol;
    const isHttps = typeof window !== 'undefined' && (window.location.protocol === 'https:' || window.isSecureContext);
    const liveProtoParts = [
      traceTls || (isHttps ? diagT.httpsTls : diagT.httpUnencrypted),
      traceHttp || (navProto ? navProto.toUpperCase() : ''),
    ].filter(Boolean);

    setSecDiag({
      dnsStatus: dohProbe.status,
      dnsDetail: dohProbe.detail,
      dnsOk: dohProbe.ok,
      webrtcStatus: webrtcProbe.status,
      webrtcDetail: webrtcProbe.detail,
      webrtcOk: webrtcProbe.ok,
      transportStatus: liveProtoParts.join(' / '),
      transportDetail: isHttps ? diagT.secureContext : diagT.insecureContext,
      transportOk: isHttps,
      reputationStatus: normalized?.isProxyOrVpn
        ? diagT.proxyVpnRelay
        : resolvedV4 && resolvedV6
        ? mT.dualStack
        : mT.ipv4Only,
      reputationDetail: normalized?.org || normalized?.asn || diagT.directIspRouting,
      reputationOk: !normalized?.isProxyOrVpn,
    });
  }, [mT.dualStack, mT.ipv4Only, diagT, ipLocale]);

  useEffect(() => {
    fetchIp();
  }, [fetchIp]);

  const copyV4 = () => {
    if (!ipv4Address) return;
    navigator.clipboard.writeText(ipv4Address);
    setCopiedV4(true);
    setTimeout(() => setCopiedV4(false), 2000);
  };

  const copyV6 = () => {
    if (!ipv6Address) return;
    navigator.clipboard.writeText(ipv6Address);
    setCopiedV6(true);
    setTimeout(() => setCopiedV6(false), 2000);
  };

  const userPos = useMemo(() => {
    if (
      ipData?.latitude !== null &&
      ipData?.latitude !== undefined &&
      ipData?.longitude !== null &&
      ipData?.longitude !== undefined
    ) {
      return { lat: ipData.latitude, lng: ipData.longitude };
    }
    return null;
  }, [ipData?.latitude, ipData?.longitude]);

  const edgeNode = useMemo(() => {
    if (ipData?.coloCoords) {
      return ipData.coloCoords;
    }
    if (ipData?.colo && EDGE_POP_COORDS[ipData.colo]) {
      return { code: ipData.colo, ...EDGE_POP_COORDS[ipData.colo] };
    }
    return null;
  }, [ipData?.coloCoords, ipData?.colo]);

  const allSecOk = Boolean(
    secDiag && secDiag.dnsOk && secDiag.webrtcOk && secDiag.transportOk && secDiag.reputationOk
  );

  return (
    <div className="w-full max-w-6xl mx-auto ipaddress-tab-card relative z-10 transition-all duration-300 flex flex-col gap-6">
      {/* Global IP Identifier Webcard Header */}
      <div className="w-full GeekTabs-card weather-huawei-style webcard-light-grey-bg rounded-3xl p-6 sm:p-8 flex flex-col justify-center text-left">
        <div className="flex items-center gap-2 mb-1.5">
          <Globe size={18} className="text-indigo-500 animate-pulse" />
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500">{d.identifier}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight word-color ipaddress-page-title">
          {d.title}
        </h1>
        <p className="text-sm word-color opacity-50 mt-1.5 font-medium ipaddress-page-subtitle">{d.subtitle}</p>
      </div>

      {isLoadingIp ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] GeekTabs-card weather-huawei-style webcard-light-grey-bg rounded-3xl p-8">
          <div className="w-12 h-12 border-4 border-t-indigo-500 border-black/10 dark:border-white/10 rounded-full animate-spin mb-4" />
          <p className="word-color font-mono text-sm uppercase tracking-widest opacity-60">{d.resolving}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Main Dual IP Address Segment - IPv4 & IPv6 structured separately in single-line rows */}
          <div className="w-full flex flex-col gap-6">
            
            {/* IPv4 Display Panel */}
            <div className="w-full GeekTabs-card weather-huawei-style webcard-light-grey-bg rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -mt-32 -mr-32" />
              
              <div className="relative z-10 flex flex-col gap-4">
                {/* Row 1: Label and copy status info */}
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="text-[11px] uppercase font-black tracking-widest text-indigo-500">{d.ipv4}</span>
                  <span className="text-[10px] font-mono opacity-50 word-color">{d.typeUnicast}</span>
                </div>

                {/* Row 2: IP address on its own line - sized and wrapped properly */}
                <div className="py-2">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter word-color select-all font-mono leading-none break-all block">
                    {ipv4Address || d.notDetected}
                  </span>
                </div>

                {/* Row 3: Action Controls and details on another line */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1">
                  {ipv4Address && ipv4Address !== 'Unavailable' && ipv4Address !== diagT.unavailable && ipv4Address !== d.notDetected && (
                    <button
                      onClick={copyV4}
                      className="flex items-center gap-2 min-h-[42px] lg:min-h-0 px-4 py-2.5 lg:py-2 bg-white dark:bg-white/10 shadow-sm dark:shadow-none hover:bg-black/5 dark:hover:bg-white/20 rounded-xl transition-all cursor-pointer text-xs font-bold word-color"
                    >
                      {copiedV4 ? (
                        <>
                          <Check size={14} className="text-green-500 animate-bounce" />
                          <span className="text-green-500">{d.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="opacity-70" />
                          <span>{d.copyV4}</span>
                        </>
                      )}
                    </button>
                  )}
                  {ipData?.org && (
                    <div className="text-xs word-color opacity-60 break-words min-w-0">
                      {diagT.ispLabel}: <span className="font-semibold">{ipData.org}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* IPv6 Display Panel */}
            <div className="w-full GeekTabs-card weather-huawei-style webcard-light-grey-bg rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -mt-32 -mr-32" />
              
              <div className="relative z-10 flex flex-col gap-4">
                {/* Row 1: Label and copy status info */}
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="text-[11px] uppercase font-black tracking-widest text-purple-500">{d.ipv6}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${ipv6Address ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/15 text-orange-500'}`}>
                    {ipv6Address ? d.supported : d.notSupported}
                  </span>
                </div>

                {/* Row 2: IP address on its own line - sized and wrapped properly */}
                <div className="py-2">
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-black tracking-tighter word-color select-all font-mono leading-none break-all block">
                    {ipv6Address || d.noIpv6}
                  </span>
                </div>

                {/* Row 3: Action Controls and details on another line */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1">
                  {ipv6Address && (
                    <button
                      onClick={copyV6}
                      className="flex items-center gap-2 min-h-[42px] lg:min-h-0 px-4 py-2.5 lg:py-2 bg-white dark:bg-white/10 shadow-sm dark:shadow-none hover:bg-black/5 dark:hover:bg-white/20 rounded-xl transition-all cursor-pointer text-xs font-bold word-color"
                    >
                      {copiedV6 ? (
                        <>
                          <Check size={14} className="text-green-500 animate-bounce" />
                          <span className="text-green-500">{d.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="opacity-70" />
                          <span>{d.copyV6}</span>
                        </>
                      )}
                    </button>
                  )}
                  <span className="text-xs word-color opacity-50">
                    {ipv6Address ? d.nextGen : d.legacyRails}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* 2. Detail Rows Grid containing Geolocation, Networks, and Live Map sidebar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Geolocation Details Card */}
            <div className="p-6 GeekTabs-card webcard-light-grey-bg rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-indigo-500 mb-5 flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{d.geoLoc}</span>
                </h3>
                <div className="flex flex-col gap-4 font-mono text-xs">
                  <div className="flex justify-between items-center gap-3 border-b border-black/5 dark:border-white/5 pb-2.5">
                    <span className="opacity-50 word-color shrink-0">{d.country}</span>
                    <span className="font-bold word-color text-right break-words">
                      {ipData?.country_name || diagT.na}
                      {ipData?.country_code ? ` (${ipData.country_code})` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-3 border-b border-black/5 dark:border-white/5 pb-2.5">
                    <span className="opacity-50 word-color shrink-0">{d.region}</span>
                    <span className="font-bold word-color text-right break-words">{ipData?.region || diagT.na}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3 border-b border-black/5 dark:border-white/5 pb-2.5">
                    <span className="opacity-50 word-color shrink-0">{d.city}</span>
                    <span className="font-bold word-color text-right break-words">{ipData?.city || diagT.na}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3 pb-1">
                    <span className="opacity-50 word-color shrink-0">{d.postal}</span>
                    <span className="font-bold word-color text-right break-words">{ipData?.postal || diagT.na}</span>
                  </div>
                </div>
              </div>
              
              <div className="ipaddress-badge-secured mt-6 flex items-center gap-1.5 px-3 py-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg pointer-events-none self-start">
                <Shield size={12} className="text-indigo-500" />
                <span className="text-[10px] lg:text-[9px] font-mono uppercase font-bold tracking-wider word-color opacity-70">{d.secured}</span>
              </div>
            </div>

            {/* Network Parameters Card */}
            <div className="p-6 GeekTabs-card webcard-light-grey-bg rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-purple-500 mb-5 flex items-center gap-2">
                  <Cpu size={14} />
                  <span>{d.networkParams}</span>
                </h3>
                <div className="flex flex-col gap-4 font-mono text-xs">
                  <div className="flex justify-between items-center gap-3 border-b border-black/5 dark:border-white/5 pb-2.5">
                    <span className="opacity-50 word-color shrink-0">{d.asn}</span>
                    <span className="font-bold word-color text-right break-words">{ipData?.asn || diagT.na}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3 border-b border-black/5 dark:border-white/5 pb-2.5">
                    <span className="opacity-50 word-color shrink-0">{d.iana}</span>
                    <span className="font-bold word-color text-right break-words">
                      {classifyIanaRange(ipv4Address, ipv6Address, ipData?.network, diagT)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-3 border-b border-black/5 dark:border-white/5 pb-2.5">
                    <span className="opacity-50 word-color shrink-0">{d.timezone}</span>
                    <span className="font-bold word-color text-right break-words">{ipData?.timezone || diagT.na}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3 pb-1">
                    <span className="opacity-50 word-color shrink-0">{d.utc}</span>
                    <span className="font-bold word-color text-right break-words">{ipData?.utc_offset || diagT.na}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={fetchIp}
                className="ipaddress-btn-reidentify mt-6 flex items-center gap-1.5 min-h-[42px] lg:min-h-0 px-4 py-2.5 lg:px-3 lg:py-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/10 rounded-lg word-color font-mono uppercase font-bold text-xs lg:text-[9px] tracking-wider transition-colors self-start cursor-pointer active:scale-95"
              >
                <RefreshCw size={12} className={`text-purple-500 ${isLoadingIp ? "animate-spin" : ""}`} />
                <span>{d.reidentify}</span>
              </button>
            </div>

            {/* Live Network Route Map Card */}
            <div className="p-6 GeekTabs-card webcard-light-grey-bg rounded-3xl flex flex-col justify-between items-center text-center md:col-span-2 lg:col-span-1">
              <div className="w-full flex items-center gap-1.5 mb-4">
                <MapPin size={14} className="text-indigo-500 shrink-0" />
                <span className="text-xs uppercase font-extrabold tracking-wider word-color opacity-70 truncate">
                  {mT.liveMap}
                </span>
              </div>

              {/* Interactive Google Map Visual */}
              <div className="w-full h-[230px] sm:h-[250px] rounded-2xl overflow-hidden relative border border-black/10 dark:border-white/10 mb-4 bg-slate-100 dark:bg-slate-900/40">
                {userPos && mapsApiKey ? (
                  <APIProvider apiKey={mapsApiKey}>
                    <IpRouteMapInner userPos={userPos} edgeNode={edgeNode} mapLabels={mT} diagLabels={diagT} />
                  </APIProvider>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs word-color opacity-60">
                    {!mapsApiKey ? mT.mapLoading : mT.mapUnavailable}
                  </div>
                )}
              </div>

              {/* Live Coordinates */}
              <div className="w-full grid grid-cols-2 gap-2 text-center font-mono text-[11px] border-t border-black/5 dark:border-white/5 pt-3">
                <div>
                  <span className="opacity-40 word-color block">{d.lat}</span>
                  <span className="font-bold word-color">{formatCoord(ipData?.latitude, 'N', 'S', diagT.na)}</span>
                </div>
                <div>
                  <span className="opacity-40 word-color block">{d.lon}</span>
                  <span className="font-bold word-color">{formatCoord(ipData?.longitude, 'E', 'W', diagT.na)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Network Protocol & Security Diagnostics Webcard */}
          <div className="p-6 GeekTabs-card webcard-light-grey-bg rounded-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500 shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-extrabold tracking-tight word-color">{d.secDiagnostics}</h3>
                  <p className="text-xs opacity-50 word-color mt-0.5">{d.secSubtitle}</p>
                </div>
              </div>
              {!secDiag ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold self-start sm:self-auto shrink-0">
                  <Activity size={13} className="animate-pulse" />
                  <span>{diagT.probing}</span>
                </div>
              ) : allSecOk ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold self-start sm:self-auto shrink-0">
                  <CheckCircle2 size={13} />
                  <span>{d.allSystemsSecure}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold self-start sm:self-auto shrink-0">
                  <AlertTriangle size={13} />
                  <span>{mT.attention}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Item 1: DNS Privacy */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-60 word-color">{d.dnsPrivacy}</span>
                  <Shield size={14} className="text-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${secDiag ? (secDiag.dnsOk ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-indigo-400 animate-pulse'}`} />
                  <span className="text-sm font-bold word-color">{secDiag ? secDiag.dnsStatus : diagT.probing}</span>
                </div>
                <span className="text-[10px] font-mono opacity-40 word-color mt-2">{secDiag ? secDiag.dnsDetail : '--'}</span>
              </div>

              {/* Item 2: WebRTC Privacy */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-60 word-color">{d.webrtcPrivacy}</span>
                  <Lock size={14} className="text-emerald-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${secDiag ? (secDiag.webrtcOk ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-indigo-400 animate-pulse'}`} />
                  <span className="text-sm font-bold word-color">{secDiag ? secDiag.webrtcStatus : diagT.probing}</span>
                </div>
                <span className="text-[10px] font-mono opacity-40 word-color mt-2">{secDiag ? secDiag.webrtcDetail : '--'}</span>
              </div>

              {/* Item 3: Transport Security */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-60 word-color">{d.transportSecurity}</span>
                  <Activity size={14} className="text-purple-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${secDiag ? (secDiag.transportOk ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-indigo-400 animate-pulse'}`} />
                  <span className="text-sm font-bold word-color">{secDiag ? secDiag.transportStatus : diagT.probing}</span>
                </div>
                <span className="text-[10px] font-mono opacity-40 word-color mt-2">{secDiag ? secDiag.transportDetail : '--'}</span>
              </div>

              {/* Item 4: IP Reputation */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-60 word-color">{d.ipReputation}</span>
                  <Globe size={14} className="text-indigo-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${secDiag ? (secDiag.reputationOk ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-indigo-400 animate-pulse'}`} />
                  <span className="text-sm font-bold word-color">{secDiag ? secDiag.reputationStatus : diagT.probing}</span>
                </div>
                <span className="text-[10px] font-mono opacity-40 word-color mt-2 break-words">
                  {secDiag ? secDiag.reputationDetail : '--'}
                </span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
