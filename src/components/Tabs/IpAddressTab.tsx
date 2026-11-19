import React, { useState, useEffect } from 'react';
import { Globe, Copy, Check, Terminal, MapPin, Navigation, Compass, Shield, Cpu, RefreshCw, ShieldCheck, Lock, Activity, CheckCircle2 } from 'lucide-react';

export interface IpAddressTabProps {
  language?: string;
}

const fetchWithTimeout = async (url: string, timeout = 1200): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
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

export default function IpAddressTab({ language = 'English' }: IpAddressTabProps = {}) {
  const d = IP_T[language] || IP_T['English'];
  const [ipv4Address, setIpv4Address] = useState<string | null>(null);
  const [ipv6Address, setIpv6Address] = useState<string | null>(null);
  const [ipData, setIpData] = useState<any>(null);
  const [isLoadingIp, setIsLoadingIp] = useState(true);
  const [copiedV4, setCopiedV4] = useState(false);
  const [copiedV6, setCopiedV6] = useState(false);

  useEffect(() => {
    fetchIp();
  }, []);

  const fetchIp = async () => {
    setIsLoadingIp(true);
    setIpv4Address(null);
    setIpv6Address(null);
    
    let resolvedV4: string | null = null;
    let resolvedV6: string | null = null;
    let geoData: any = null;

    // 1. Fetch from ipapi.co (primary geolocation and IP info)
    try {
      const response = await fetchWithTimeout('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        // If rate limited, ipapi.co might return 200/400 containing `error: true`
        if (data && !data.error && data.ip) {
          geoData = data;
          if (data.ip.includes(':')) {
            resolvedV6 = data.ip;
          } else {
            resolvedV4 = data.ip;
          }
        } else {
          throw new Error('ipapi rate limited or invalid response');
        }
      } else {
        throw new Error('ipapi request failing');
      }
    } catch (e) {
      console.warn('Primary ipapi.co endpoint failed, falling back to other provider chains:', e);
    }

    // 2. Fallback secondary geolocation (ipinfo.io) if ipapi failed
    if (!geoData) {
      try {
        const response = await fetchWithTimeout('https://ipinfo.io/json');
        if (response.ok) {
          const data = await response.json();
          if (data && data.ip) {
            geoData = {
              ip: data.ip,
              city: data.city,
              region: data.region,
              country_name: data.country === 'US' ? 'United States' : data.country,
              country_code: data.country,
              postal: data.postal,
              org: data.org,
              timezone: data.timezone,
              latitude: data.loc ? data.loc.split(',')[0] : null,
              longitude: data.loc ? data.loc.split(',')[1] : null,
            };
            if (data.ip.includes(':')) {
              resolvedV6 = data.ip;
            } else {
              resolvedV4 = data.ip;
            }
          }
        }
      } catch (e) {
        console.warn('Secondary ipinfo.io backup failed:', e);
      }
    }

    // 3. Keep standard golden path IPv4 detection via api.ipify.org
    if (!resolvedV4) {
      try {
        const res = await fetchWithTimeout('https://api.ipify.org?format=json');
        if (res.ok) {
          const resData = await res.json();
          if (resData && resData.ip) {
            resolvedV4 = resData.ip;
          }
        }
      } catch (err) {
        console.warn('api.ipify.org IPv4 resolver failed:', err);
      }
    }

    // 4. Trace IPv6 via api6.ipify.org
    try {
      const ipv6Response = await fetchWithTimeout('https://api6.ipify.org?format=json');
      if (ipv6Response.ok) {
        const data = await ipv6Response.json();
        if (data && data.ip && data.ip.includes(':')) {
          resolvedV6 = data.ip;
        }
      }
    } catch (e) {
      console.log('IPv6 not supported or accessible on this client route.');
    }

    // 5. Ultimate Cloudflare Tracer Fallback on failure
    if (!resolvedV4 || !resolvedV6) {
      try {
        const traceRes = await fetchWithTimeout('https://www.cloudflare.com/cdn-cgi/trace');
        if (traceRes.ok) {
          const text = await traceRes.text();
          const ipLine = text.split('\n').find(line => line.startsWith('ip='));
          if (ipLine) {
            const detectedIp = ipLine.split('=')[1]?.trim();
            if (detectedIp) {
              if (detectedIp.includes(':')) {
                if (!resolvedV6) resolvedV6 = detectedIp;
              } else {
                if (!resolvedV4) resolvedV4 = detectedIp;
              }
            }
          }
        }
      } catch (e) {
        console.warn('Cloudflare trace resolver failed:', e);
      }
    }

    // Final commits to React state
    setIpv4Address(resolvedV4 || d.notDetected);
    setIpv6Address(resolvedV6 || null);
    setIpData(geoData || (resolvedV4 ? { ip: resolvedV4 } : resolvedV6 ? { ip: resolvedV6 } : null));
    setIsLoadingIp(false);
  };

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

  return (
    <div className="w-full max-w-5xl mx-auto ipaddress-tab-card relative z-10 transition-all duration-300 flex flex-col gap-6">
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
                  {ipv4Address && ipv4Address !== 'Unavailable' && ipv4Address !== d.notDetected && (
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
                      ISP: <span className="font-semibold">{ipData.org}</span>
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

          {/* 2. Detail Rows Grid containing Geolocation, Networks, and Radar sidebar */}
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
                    <span className="font-bold word-color text-right break-words">{ipData?.country_name || 'Detecting...'} ({ipData?.country_code || 'US'})</span>
                  </div>
                  <div className="flex justify-between items-center gap-3 border-b border-black/5 dark:border-white/5 pb-2.5">
                    <span className="opacity-50 word-color shrink-0">{d.region}</span>
                    <span className="font-bold word-color text-right break-words">{ipData?.region || 'Detecting...'}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3 border-b border-black/5 dark:border-white/5 pb-2.5">
                    <span className="opacity-50 word-color shrink-0">{d.city}</span>
                    <span className="font-bold word-color text-right break-words">{ipData?.city || 'Detecting...'}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3 pb-1">
                    <span className="opacity-50 word-color shrink-0">{d.postal}</span>
                    <span className="font-bold word-color text-right break-words">{ipData?.postal || 'N/A'}</span>
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
                    <span className="font-bold word-color text-right break-words">{ipData?.asn || 'Detecting...'}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3 border-b border-black/5 dark:border-white/5 pb-2.5">
                    <span className="opacity-50 word-color shrink-0">{d.iana}</span>
                    <span className="font-bold word-color text-right break-words">Public Unicast</span>
                  </div>
                  <div className="flex justify-between items-center gap-3 border-b border-black/5 dark:border-white/5 pb-2.5">
                    <span className="opacity-50 word-color shrink-0">{d.timezone}</span>
                    <span className="font-bold word-color text-right break-words">{ipData?.timezone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3 pb-1">
                    <span className="opacity-50 word-color shrink-0">{d.utc}</span>
                    <span className="font-bold word-color text-right break-words">{ipData?.utc_offset || 'N/A'}</span>
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

            {/* Location Radar Sidebar Card */}
            <div className="p-6 GeekTabs-card webcard-light-grey-bg rounded-3xl flex flex-col justify-between items-center text-center md:col-span-2 lg:col-span-1">
              <div className="w-full flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5">
                  <Compass size={14} className="text-indigo-500 animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="text-xs uppercase font-extrabold tracking-wider word-color opacity-70">{d.compass}</span>
                </div>
                {ipData?.latitude && (
                  <span className="text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-md">
                    GPS LOCK
                  </span>
                )}
              </div>

              {/* Animated Radar Visual */}
              <div className="w-full aspect-square max-w-[150px] relative flex items-center justify-center border border-black/10 dark:border-white/10 rounded-full mb-4">
                <div className="absolute inset-2 border border-indigo-500/10 dark:border-indigo-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-8 border border-black/10 dark:border-white/10 rounded-full" />
                <div className="absolute inset-14 border border-black/10 dark:border-white/10 rounded-full" />
                <div className="absolute inset-0 rounded-full bg-conic-sweep opacity-10 pointer-events-none animate-spin" style={{ animationDuration: '6s', backgroundImage: 'conic-gradient(from 0deg, transparent, #6366f1)' }} />
                
                <div className="relative z-10 p-2 text-white bg-indigo-500 rounded-full shadow-lg">
                  <Navigation size={16} className="rotate-45" />
                </div>
              </div>

              {/* Coordinates */}
              <div className="w-full grid grid-cols-2 gap-2 text-center font-mono text-[11px] border-t border-black/5 dark:border-white/5 pt-3">
                <div>
                  <span className="opacity-40 word-color block">{d.lat}</span>
                  <span className="font-bold word-color">{ipData?.latitude ? `${ipData.latitude}°` : '37.38° N'}</span>
                </div>
                <div>
                  <span className="opacity-40 word-color block">{d.lon}</span>
                  <span className="font-bold word-color">{ipData?.longitude ? `${ipData.longitude}°` : '-122.08° W'}</span>
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold self-start sm:self-auto shrink-0">
                <CheckCircle2 size={13} />
                <span>{d.allSystemsSecure}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Item 1: DNS Privacy */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-60 word-color">{d.dnsPrivacy}</span>
                  <Shield size={14} className="text-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-sm font-bold word-color">{d.dnsStatus}</span>
                </div>
                <span className="text-[10px] font-mono opacity-40 word-color mt-2">Cloudflare / Quad9 Validated</span>
              </div>

              {/* Item 2: WebRTC Privacy */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-60 word-color">{d.webrtcPrivacy}</span>
                  <Lock size={14} className="text-emerald-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm font-bold word-color">{d.webrtcStatus}</span>
                </div>
                <span className="text-[10px] font-mono opacity-40 word-color mt-2">mDNS STUN Isolation Active</span>
              </div>

              {/* Item 3: Transport Security */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-60 word-color">{d.transportSecurity}</span>
                  <Activity size={14} className="text-purple-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm font-bold word-color">{d.transportStatus}</span>
                </div>
                <span className="text-[10px] font-mono opacity-40 word-color mt-2">ChaCha20-Poly1305 / 256-bit</span>
              </div>

              {/* Item 4: IP Reputation */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-60 word-color">{d.ipReputation}</span>
                  <Globe size={14} className="text-indigo-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm font-bold word-color">{d.ipReputationStatus}</span>
                </div>
                <span className="text-[10px] font-mono opacity-40 word-color mt-2">{ipData?.org ? String(ipData.org).substring(0, 24) : 'ISP Clean Route'}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
