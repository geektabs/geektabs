import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, Mark, Node as TiptapNode, Extension, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  Palette,
  Check,
  ImagePlus,
  Link2,
  Upload,
  Unlink,
  X,
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  statusActions?: React.ReactNode;
  language?: string;
}

interface TipTapLocale {
  fontSize: string;
  textColor: string;
  reset: string;
  customColor: string;
  bold: string;
  italic: string;
  underline: string;
  bulletList: string;
  numberedList: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  addPhoto: string;
  uploadPhoto: string;
  addLink: string;
  enterLinkText: string;
  enterLink: string;
  remove: string;
  cancel: string;
  apply: string;
  notePhotoAlt: string;
  presets: Record<string, string>;
  colors: Record<string, string>;
}

const TIPTAP_T: Record<string, TipTapLocale> = {
  English: {
    fontSize: 'Font Size', textColor: 'Text Color', reset: 'Reset', customColor: 'Custom Color',
    bold: 'Bold', italic: 'Italic', underline: 'Underline', bulletList: 'Bullet List', numberedList: 'Numbered List',
    alignLeft: 'Align Left', alignCenter: 'Align Center', alignRight: 'Align Right',
    addPhoto: 'Add Photo', uploadPhoto: 'Upload Photo', addLink: 'Add Link',
    enterLinkText: 'Enter link text', enterLink: 'Enter link', remove: 'Remove', cancel: 'Cancel', apply: 'Apply', notePhotoAlt: 'Note photo',
    presets: { title: 'Title', subtitle: 'Subtitle', heading: 'Heading', subheading: 'Subheading', section: 'Section', subsection: 'Subsection', body: 'Body' },
    colors: { Default: 'Default', Slate: 'Slate', Red: 'Red', Orange: 'Orange', Amber: 'Amber', Green: 'Green', Teal: 'Teal', Blue: 'Blue', Indigo: 'Indigo', Purple: 'Purple', Pink: 'Pink' },
  },
  Chinese: {
    fontSize: '字号', textColor: '文字颜色', reset: '重置', customColor: '自定义颜色',
    bold: '加粗', italic: '斜体', underline: '下划线', bulletList: '无序列表', numberedList: '有序列表',
    alignLeft: '左对齐', alignCenter: '居中对齐', alignRight: '右对齐',
    addPhoto: '添加图片', uploadPhoto: '上传图片', addLink: '添加链接',
    enterLinkText: '输入链接文字', enterLink: '输入链接地址', remove: '移除', cancel: '取消', apply: '应用', notePhotoAlt: '笔记图片',
    presets: { title: '标题', subtitle: '副标题', heading: '大标题', subheading: '小标题', section: '章节标题', subsection: '子章节', body: '正文' },
    colors: { Default: '默认', Slate: '石板灰', Red: '红色', Orange: '橙色', Amber: '琥珀黄', Green: '绿色', Teal: '青色', Blue: '蓝色', Indigo: '靛蓝', Purple: '紫色', Pink: '粉色' },
  },
  'Chinese Traditional': {
    fontSize: '字級', textColor: '文字顏色', reset: '重設', customColor: '自訂顏色',
    bold: '粗體', italic: '斜體', underline: '底線', bulletList: '項目符號清單', numberedList: '編號清單',
    alignLeft: '靠左對齊', alignCenter: '置中對齊', alignRight: '靠右對齊',
    addPhoto: '新增圖片', uploadPhoto: '上傳圖片', addLink: '新增連結',
    enterLinkText: '輸入連結文字', enterLink: '輸入連結網址', remove: '移除', cancel: '取消', apply: '套用', notePhotoAlt: '筆記圖片',
    presets: { title: '標題', subtitle: '副標題', heading: '大標題', subheading: '小標題', section: '章節標題', subsection: '子章節', body: '內文' },
    colors: { Default: '預設', Slate: '石板灰', Red: '紅色', Orange: '橙色', Amber: '琥珀黃', Green: '綠色', Teal: '青色', Blue: '藍色', Indigo: '靛藍', Purple: '紫色', Pink: '粉色' },
  },
  Spanish: {
    fontSize: 'Tamaño de fuente', textColor: 'Color de texto', reset: 'Restablecer', customColor: 'Color personalizado',
    bold: 'Negrita', italic: 'Cursiva', underline: 'Subrayado', bulletList: 'Lista con viñetas', numberedList: 'Lista numerada',
    alignLeft: 'Alinear a la izquierda', alignCenter: 'Centrar', alignRight: 'Alinear a la derecha',
    addPhoto: 'Añadir foto', uploadPhoto: 'Subir foto', addLink: 'Añadir enlace',
    enterLinkText: 'Introduce el texto del enlace', enterLink: 'Introduce el enlace', remove: 'Quitar', cancel: 'Cancelar', apply: 'Aplicar', notePhotoAlt: 'Foto de la nota',
    presets: { title: 'Título', subtitle: 'Subtítulo', heading: 'Encabezado', subheading: 'Subencabezado', section: 'Sección', subsection: 'Subsección', body: 'Cuerpo' },
    colors: { Default: 'Predeterminado', Slate: 'Pizarra', Red: 'Rojo', Orange: 'Naranja', Amber: 'Ámbar', Green: 'Verde', Teal: 'Verde azulado', Blue: 'Azul', Indigo: 'Índigo', Purple: 'Morado', Pink: 'Rosa' },
  },
  French: {
    fontSize: 'Taille de police', textColor: 'Couleur du texte', reset: 'Réinitialiser', customColor: 'Couleur personnalisée',
    bold: 'Gras', italic: 'Italique', underline: 'Souligné', bulletList: 'Liste à puces', numberedList: 'Liste numérotée',
    alignLeft: 'Aligner à gauche', alignCenter: 'Centrer', alignRight: 'Aligner à droite',
    addPhoto: 'Ajouter une photo', uploadPhoto: 'Téléverser une photo', addLink: 'Ajouter un lien',
    enterLinkText: 'Saisir le texte du lien', enterLink: 'Saisir le lien', remove: 'Supprimer', cancel: 'Annuler', apply: 'Appliquer', notePhotoAlt: 'Photo de note',
    presets: { title: 'Titre', subtitle: 'Sous-titre', heading: 'En-tête', subheading: 'Sous-en-tête', section: 'Section', subsection: 'Sous-section', body: 'Corps' },
    colors: { Default: 'Par défaut', Slate: 'Ardoise', Red: 'Rouge', Orange: 'Orange', Amber: 'Ambre', Green: 'Vert', Teal: 'Sarcelle', Blue: 'Bleu', Indigo: 'Indigo', Purple: 'Violet', Pink: 'Rose' },
  },
  German: {
    fontSize: 'Schriftgröße', textColor: 'Textfarbe', reset: 'Zurücksetzen', customColor: 'Benutzerdefinierte Farbe',
    bold: 'Fett', italic: 'Kursiv', underline: 'Unterstrichen', bulletList: 'Aufzählungsliste', numberedList: 'Nummerierte Liste',
    alignLeft: 'Linksbündig', alignCenter: 'Zentriert', alignRight: 'Rechtsbündig',
    addPhoto: 'Foto hinzufügen', uploadPhoto: 'Foto hochladen', addLink: 'Link hinzufügen',
    enterLinkText: 'Linktext eingeben', enterLink: 'Link eingeben', remove: 'Entfernen', cancel: 'Abbrechen', apply: 'Anwenden', notePhotoAlt: 'Notizfoto',
    presets: { title: 'Titel', subtitle: 'Untertitel', heading: 'Überschrift', subheading: 'Unterüberschrift', section: 'Abschnitt', subsection: 'Unterabschnitt', body: 'Textkörper' },
    colors: { Default: 'Standard', Slate: 'Schiefer', Red: 'Rot', Orange: 'Orange', Amber: 'Bernstein', Green: 'Grün', Teal: 'Blaugrün', Blue: 'Blau', Indigo: 'Indigo', Purple: 'Lila', Pink: 'Rosa' },
  },
  Japanese: {
    fontSize: 'フォントサイズ', textColor: '文字色', reset: 'リセット', customColor: 'カスタムカラー',
    bold: '太字', italic: '斜体', underline: '下線', bulletList: '箇条書き', numberedList: '番号付きリスト',
    alignLeft: '左揃え', alignCenter: '中央揃え', alignRight: '右揃え',
    addPhoto: '写真を追加', uploadPhoto: '写真をアップロード', addLink: 'リンクを追加',
    enterLinkText: 'リンクテキストを入力', enterLink: 'リンクを入力', remove: '削除', cancel: 'キャンセル', apply: '適用', notePhotoAlt: 'ノートの写真',
    presets: { title: 'タイトル', subtitle: 'サブタイトル', heading: '見出し', subheading: '小見出し', section: 'セクション', subsection: 'サブセクション', body: '本文' },
    colors: { Default: 'デフォルト', Slate: 'スレート', Red: '赤', Orange: 'オレンジ', Amber: 'アンバー', Green: '緑', Teal: 'ティール', Blue: '青', Indigo: 'インディゴ', Purple: '紫', Pink: 'ピンク' },
  },
  Korean: {
    fontSize: '글꼴 크기', textColor: '텍스트 색상', reset: '재설정', customColor: '사용자 지정 색상',
    bold: '굵게', italic: '기울임꼴', underline: '밑줄', bulletList: '글머리 기호 목록', numberedList: '번호 매기기 목록',
    alignLeft: '왼쪽 맞춤', alignCenter: '가운데 맞춤', alignRight: '오른쪽 맞춤',
    addPhoto: '사진 추가', uploadPhoto: '사진 업로드', addLink: '링크 추가',
    enterLinkText: '링크 텍스트 입력', enterLink: '링크 입력', remove: '제거', cancel: '취소', apply: '적용', notePhotoAlt: '노트 사진',
    presets: { title: '제목', subtitle: '부제목', heading: '머리글', subheading: '소제목', section: '섹션', subsection: '하위 섹션', body: '본문' },
    colors: { Default: '기본값', Slate: '슬레이트', Red: '빨강', Orange: '주황', Amber: '호박색', Green: '초록', Teal: '청록', Blue: '파랑', Indigo: '남색', Purple: '보라', Pink: '분홍' },
  },
  Italian: {
    fontSize: 'Dimensione carattere', textColor: 'Colore testo', reset: 'Ripristina', customColor: 'Colore personalizzato',
    bold: 'Grassetto', italic: 'Corsivo', underline: 'Sottolineato', bulletList: 'Elenco puntato', numberedList: 'Elenco numerato',
    alignLeft: 'Allinea a sinistra', alignCenter: 'Centra', alignRight: 'Allinea a destra',
    addPhoto: 'Aggiungi foto', uploadPhoto: 'Carica foto', addLink: 'Aggiungi link',
    enterLinkText: 'Inserisci testo del link', enterLink: 'Inserisci link', remove: 'Rimuovi', cancel: 'Annulla', apply: 'Applica', notePhotoAlt: 'Foto della nota',
    presets: { title: 'Titolo', subtitle: 'Sottotitolo', heading: 'Intestazione', subheading: 'Sottointestazione', section: 'Sezione', subsection: 'Sottosezione', body: 'Corpo' },
    colors: { Default: 'Predefinito', Slate: 'Ardesia', Red: 'Rosso', Orange: 'Arancione', Amber: 'Ambra', Green: 'Verde', Teal: 'Ottanio', Blue: 'Blu', Indigo: 'Indaco', Purple: 'Viola', Pink: 'Rosa' },
  },
  Russian: {
    fontSize: 'Размер шрифта', textColor: 'Цвет текста', reset: 'Сбросить', customColor: 'Свой цвет',
    bold: 'Жирный', italic: 'Курсив', underline: 'Подчёркнутый', bulletList: 'Маркированный список', numberedList: 'Нумерованный список',
    alignLeft: 'По левому краю', alignCenter: 'По центру', alignRight: 'По правому краю',
    addPhoto: 'Добавить фото', uploadPhoto: 'Загрузить фото', addLink: 'Добавить ссылку',
    enterLinkText: 'Введите текст ссылки', enterLink: 'Введите ссылку', remove: 'Удалить', cancel: 'Отмена', apply: 'Применить', notePhotoAlt: 'Фото заметки',
    presets: { title: 'Заголовок', subtitle: 'Подзаголовок', heading: 'Рубрика', subheading: 'Подрубрика', section: 'Раздел', subsection: 'Подраздел', body: 'Основной текст' },
    colors: { Default: 'По умолчанию', Slate: 'Сланцевый', Red: 'Красный', Orange: 'Оранжевый', Amber: 'Янтарный', Green: 'Зелёный', Teal: 'Бирюзовый', Blue: 'Синий', Indigo: 'Индиго', Purple: 'Фиолетовый', Pink: 'Розовый' },
  },
  Luxembourgish: {
    fontSize: 'Schrëftgréisst', textColor: 'Textfaarf', reset: 'Zrécksetzen', customColor: 'Eegen Faarf',
    bold: 'Fett', italic: 'Kursiv', underline: 'Ënnerstrach', bulletList: 'Opzielungslëscht', numberedList: 'Nummeréiert Lëscht',
    alignLeft: 'Lénks ausriichten', alignCenter: 'Zentréieren', alignRight: 'Riets ausriichten',
    addPhoto: 'Foto derbäisetzen', uploadPhoto: 'Foto eroplueden', addLink: 'Link derbäisetzen',
    enterLinkText: 'Linktext aginn', enterLink: 'Link aginn', remove: 'Ewechhuelen', cancel: 'Ofbriechen', apply: 'Uwenden', notePhotoAlt: 'Notizfoto',
    presets: { title: 'Titel', subtitle: 'Ënnertitel', heading: 'Iwwerschrëft', subheading: 'Ënneriwwerschrëft', section: 'Sektioun', subsection: 'Ënnersektioun', body: 'Haapttext' },
    colors: { Default: 'Standard', Slate: 'Schiefer', Red: 'Rout', Orange: 'Orange', Amber: 'Amber', Green: 'Gréng', Teal: 'Türkis', Blue: 'Blo', Indigo: 'Indigo', Purple: 'Violett', Pink: 'Rosa' },
  },
  Dutch: {
    fontSize: 'Tekengrootte', textColor: 'Tekstkleur', reset: 'Herstellen', customColor: 'Aangepaste kleur',
    bold: 'Vet', italic: 'Cursief', underline: 'Onderstreept', bulletList: 'Lijst met opsommingstekens', numberedList: 'Genummerde lijst',
    alignLeft: 'Links uitlijnen', alignCenter: 'Centreren', alignRight: 'Rechts uitlijnen',
    addPhoto: 'Foto toevoegen', uploadPhoto: 'Foto uploaden', addLink: 'Link toevoegen',
    enterLinkText: 'Voer linktekst in', enterLink: 'Voer link in', remove: 'Verwijderen', cancel: 'Annuleren', apply: 'Toepassen', notePhotoAlt: 'Notitiefoto',
    presets: { title: 'Titel', subtitle: 'Ondertitel', heading: 'Kop', subheading: 'Subkop', section: 'Sectie', subsection: 'Subsectie', body: 'Hoofdtekst' },
    colors: { Default: 'Standaard', Slate: 'Leisteen', Red: 'Rood', Orange: 'Oranje', Amber: 'Amber', Green: 'Groen', Teal: 'Zeegroen', Blue: 'Blauw', Indigo: 'Indigo', Purple: 'Paars', Pink: 'Roze' },
  },
  Swedish: {
    fontSize: 'Teckenstorlek', textColor: 'Textfärg', reset: 'Återställ', customColor: 'Anpassad färg',
    bold: 'Fet', italic: 'Kursiv', underline: 'Understruken', bulletList: 'Punktlista', numberedList: 'Numrerad lista',
    alignLeft: 'Vänsterjustera', alignCenter: 'Centrera', alignRight: 'Högerjustera',
    addPhoto: 'Lägg till foto', uploadPhoto: 'Ladda upp foto', addLink: 'Lägg till länk',
    enterLinkText: 'Ange länktext', enterLink: 'Ange länk', remove: 'Ta bort', cancel: 'Avbryt', apply: 'Använd', notePhotoAlt: 'Anteckningsfoto',
    presets: { title: 'Titel', subtitle: 'Undertitel', heading: 'Rubrik', subheading: 'Underrubrik', section: 'Avsnitt', subsection: 'Underavsnitt', body: 'Brödtext' },
    colors: { Default: 'Standard', Slate: 'Skiffer', Red: 'Röd', Orange: 'Orange', Amber: 'Bärnsten', Green: 'Grön', Teal: 'Blågrön', Blue: 'Blå', Indigo: 'Indigo', Purple: 'Lila', Pink: 'Rosa' },
  },
  Finnish: {
    fontSize: 'Fonttikoko', textColor: 'Tekstin väri', reset: 'Palauta', customColor: 'Mukautettu väri',
    bold: 'Lihavointi', italic: 'Kursivointi', underline: 'Alleviivaus', bulletList: 'Luettelomerkit', numberedList: 'Numeroitu luettelo',
    alignLeft: 'Tasaa vasemmalle', alignCenter: 'Keskitä', alignRight: 'Tasaa oikealle',
    addPhoto: 'Lisää kuva', uploadPhoto: 'Lataa kuva', addLink: 'Lisää linkki',
    enterLinkText: 'Kirjoita linkin teksti', enterLink: 'Kirjoita linkki', remove: 'Poista', cancel: 'Peruuta', apply: 'Käytä', notePhotoAlt: 'Muistiinpanokuva',
    presets: { title: 'Otsikko', subtitle: 'Alaotsikko', heading: 'Pääotsikko', subheading: 'Väliotsikko', section: 'Osio', subsection: 'Alaosio', body: 'Leipäteksti' },
    colors: { Default: 'Oletus', Slate: 'Liuskekivi', Red: 'Punainen', Orange: 'Oranssi', Amber: 'Meripihka', Green: 'Vihreä', Teal: 'Sinivihreä', Blue: 'Sininen', Indigo: 'Indigo', Purple: 'Violetti', Pink: 'Vaaleanpunainen' },
  },
  Hindi: {
    fontSize: 'फ़ॉन्ट आकार', textColor: 'टेक्स्ट रंग', reset: 'रीसेट', customColor: 'कस्टम रंग',
    bold: 'बोल्ड', italic: 'इटैलिक', underline: 'अंडरलाइन', bulletList: 'बुलेट सूची', numberedList: 'क्रमांकित सूची',
    alignLeft: 'बाएँ संरेखित करें', alignCenter: 'केंद्र में संरेखित करें', alignRight: 'दाएँ संरेखित करें',
    addPhoto: 'फ़ोटो जोड़ें', uploadPhoto: 'फ़ोटो अपलोड करें', addLink: 'लिंक जोड़ें',
    enterLinkText: 'लिंक टेक्स्ट दर्ज करें', enterLink: 'लिंक दर्ज करें', remove: 'हटाएँ', cancel: 'रद्द करें', apply: 'लागू करें', notePhotoAlt: 'नोट फ़ोटो',
    presets: { title: 'शीर्षक', subtitle: 'उपशीर्षक', heading: 'मुख्य शीर्षक', subheading: 'उप-शीर्षक', section: 'अनुभाग', subsection: 'उप-अनुभाग', body: 'मुख्य पाठ' },
    colors: { Default: 'डिफ़ॉल्ट', Slate: 'स्लेट', Red: 'लाल', Orange: 'नारंगी', Amber: 'एम्बर', Green: 'हरा', Teal: 'टील', Blue: 'नीला', Indigo: 'इंडिगो', Purple: 'बैंगनी', Pink: 'गुलाबी' },
  },
  Norwegian: {
    fontSize: 'Skriftstørrelse', textColor: 'Tekstfarge', reset: 'Tilbakestill', customColor: 'Egendefinert farge',
    bold: 'Fet', italic: 'Kursiv', underline: 'Understreket', bulletList: 'Punktliste', numberedList: 'Nummerert liste',
    alignLeft: 'Venstrejuster', alignCenter: 'Midtstill', alignRight: 'Høyrejuster',
    addPhoto: 'Legg til bilde', uploadPhoto: 'Last opp bilde', addLink: 'Legg til lenke',
    enterLinkText: 'Skriv inn lenketekst', enterLink: 'Skriv inn lenke', remove: 'Fjern', cancel: 'Avbryt', apply: 'Bruk', notePhotoAlt: 'Notatbilde',
    presets: { title: 'Tittel', subtitle: 'Undertittel', heading: 'Overskrift', subheading: 'Underoverskrift', section: 'Seksjon', subsection: 'Underseksjon', body: 'Brødtekst' },
    colors: { Default: 'Standard', Slate: 'Skifer', Red: 'Rød', Orange: 'Oransje', Amber: 'Rav', Green: 'Grønn', Teal: 'Blågrønn', Blue: 'Blå', Indigo: 'Indigo', Purple: 'Lilla', Pink: 'Rosa' },
  },
  Thai: {
    fontSize: 'ขนาดตัวอักษร', textColor: 'สีข้อความ', reset: 'รีเซ็ต', customColor: 'สีกำหนดเอง',
    bold: 'ตัวหนา', italic: 'ตัวเอียง', underline: 'ขีดเส้นใต้', bulletList: 'รายการสัญลักษณ์', numberedList: 'รายการตัวเลข',
    alignLeft: 'จัดชิดซ้าย', alignCenter: 'จัดกึ่งกลาง', alignRight: 'จัดชิดขวา',
    addPhoto: 'เพิ่มรูปภาพ', uploadPhoto: 'อัปโหลดรูปภาพ', addLink: 'เพิ่มลิงก์',
    enterLinkText: 'กรอกข้อความลิงก์', enterLink: 'กรอกลิงก์', remove: 'ลบ', cancel: 'ยกเลิก', apply: 'นำไปใช้', notePhotoAlt: 'รูปภาพบันทึก',
    presets: { title: 'หัวเรื่อง', subtitle: 'หัวเรื่องรอง', heading: 'หัวข้อใหญ่', subheading: 'หัวข้อย่อย', section: 'หมวด', subsection: 'หมวดย่อย', body: 'เนื้อหา' },
    colors: { Default: 'ค่าเริ่มต้น', Slate: 'เทาหินชนวน', Red: 'แดง', Orange: 'ส้ม', Amber: 'เหลืองอำพัน', Green: 'เขียว', Teal: 'เขียวน้ำทะเล', Blue: 'น้ำเงิน', Indigo: 'คราม', Purple: 'ม่วง', Pink: 'ชมพู' },
  },
  Portuguese: {
    fontSize: 'Tamanho da letra', textColor: 'Cor do texto', reset: 'Repor', customColor: 'Cor personalizada',
    bold: 'Negrito', italic: 'Itálico', underline: 'Sublinhado', bulletList: 'Lista com marcadores', numberedList: 'Lista numerada',
    alignLeft: 'Alinhar à esquerda', alignCenter: 'Centrar', alignRight: 'Alinhar à direita',
    addPhoto: 'Adicionar foto', uploadPhoto: 'Carregar foto', addLink: 'Adicionar ligação',
    enterLinkText: 'Introduza o texto da ligação', enterLink: 'Introduza a ligação', remove: 'Remover', cancel: 'Cancelar', apply: 'Aplicar', notePhotoAlt: 'Foto da nota',
    presets: { title: 'Título', subtitle: 'Subtítulo', heading: 'Cabeçalho', subheading: 'Subcabeçalho', section: 'Secção', subsection: 'Subsecção', body: 'Corpo' },
    colors: { Default: 'Predefinida', Slate: 'Ardósia', Red: 'Vermelho', Orange: 'Laranja', Amber: 'Âmbar', Green: 'Verde', Teal: 'Azul-petróleo', Blue: 'Azul', Indigo: 'Índigo', Purple: 'Roxo', Pink: 'Rosa' },
  },
  Vietnamese: {
    fontSize: 'Cỡ chữ', textColor: 'Màu chữ', reset: 'Đặt lại', customColor: 'Màu tùy chỉnh',
    bold: 'In đậm', italic: 'In nghiêng', underline: 'Gạch chân', bulletList: 'Danh sách dấu đầu dòng', numberedList: 'Danh sách đánh số',
    alignLeft: 'Căn trái', alignCenter: 'Căn giữa', alignRight: 'Căn phải',
    addPhoto: 'Thêm ảnh', uploadPhoto: 'Tải ảnh lên', addLink: 'Thêm liên kết',
    enterLinkText: 'Nhập văn bản liên kết', enterLink: 'Nhập liên kết', remove: 'Gỡ bỏ', cancel: 'Hủy', apply: 'Áp dụng', notePhotoAlt: 'Ảnh ghi chú',
    presets: { title: 'Tiêu đề', subtitle: 'Phụ đề', heading: 'Đề mục', subheading: 'Đề mục phụ', section: 'Phần', subsection: 'Tiểu mục', body: 'Nội dung' },
    colors: { Default: 'Mặc định', Slate: 'Xám đá', Red: 'Đỏ', Orange: 'Cam', Amber: 'Hổ phách', Green: 'Xanh lá', Teal: 'Xanh mòng két', Blue: 'Xanh dương', Indigo: 'Chàm', Purple: 'Tím', Pink: 'Hồng' },
  },
  Polish: {
    fontSize: 'Rozmiar czcionki', textColor: 'Kolor tekstu', reset: 'Resetuj', customColor: 'Własny kolor',
    bold: 'Pogrubienie', italic: 'Kursywa', underline: 'Podkreślenie', bulletList: 'Lista punktowana', numberedList: 'Lista numerowana',
    alignLeft: 'Wyrównaj do lewej', alignCenter: 'Wyśrodkuj', alignRight: 'Wyrównaj do prawej',
    addPhoto: 'Dodaj zdjęcie', uploadPhoto: 'Prześlij zdjęcie', addLink: 'Dodaj link',
    enterLinkText: 'Wpisz tekst linku', enterLink: 'Wpisz link', remove: 'Usuń', cancel: 'Anuluj', apply: 'Zastosuj', notePhotoAlt: 'Zdjęcie z notatki',
    presets: { title: 'Tytuł', subtitle: 'Podtytuł', heading: 'Nagłówek', subheading: 'Podnagłówek', section: 'Sekcja', subsection: 'Podsekcja', body: 'Treść' },
    colors: { Default: 'Domyślny', Slate: 'Łupkowy', Red: 'Czerwony', Orange: 'Pomarańczowy', Amber: 'Bursztynowy', Green: 'Zielony', Teal: 'Morski', Blue: 'Niebieski', Indigo: 'Indygo', Purple: 'Fioletowy', Pink: 'Różowy' },
  },
  Danish: {
    fontSize: 'Skriftstørrelse', textColor: 'Tekstfarve', reset: 'Nulstil', customColor: 'Tilpasset farve',
    bold: 'Fed', italic: 'Kursiv', underline: 'Understreget', bulletList: 'Punktliste', numberedList: 'Nummereret liste',
    alignLeft: 'Venstrestil', alignCenter: 'Centrer', alignRight: 'Højrestil',
    addPhoto: 'Tilføj billede', uploadPhoto: 'Upload billede', addLink: 'Tilføj link',
    enterLinkText: 'Indtast linktekst', enterLink: 'Indtast link', remove: 'Fjern', cancel: 'Annuller', apply: 'Anvend', notePhotoAlt: 'Notebillede',
    presets: { title: 'Titel', subtitle: 'Undertitel', heading: 'Overskrift', subheading: 'Underoverskrift', section: 'Sektion', subsection: 'Undersektion', body: 'Brødtekst' },
    colors: { Default: 'Standard', Slate: 'Skifer', Red: 'Rød', Orange: 'Orange', Amber: 'Rav', Green: 'Grøn', Teal: 'Blågrøn', Blue: 'Blå', Indigo: 'Indigo', Purple: 'Lilla', Pink: 'Lyserød' },
  },
  Turkish: {
    fontSize: 'Yazı Tipi Boyutu', textColor: 'Metin Rengi', reset: 'Sıfırla', customColor: 'Özel Renk',
    bold: 'Kalın', italic: 'İtalik', underline: 'Altı Çizili', bulletList: 'Madde İşaretli Liste', numberedList: 'Numaralı Liste',
    alignLeft: 'Sola Hizala', alignCenter: 'Ortala', alignRight: 'Sağa Hizala',
    addPhoto: 'Fotoğraf Ekle', uploadPhoto: 'Fotoğraf Yükle', addLink: 'Bağlantı Ekle',
    enterLinkText: 'Bağlantı metnini girin', enterLink: 'Bağlantıyı girin', remove: 'Kaldır', cancel: 'İptal', apply: 'Uygula', notePhotoAlt: 'Not fotoğrafı',
    presets: { title: 'Başlık', subtitle: 'Alt Başlık', heading: 'Ana Başlık', subheading: 'Ara Başlık', section: 'Bölüm', subsection: 'Alt Bölüm', body: 'Gövde Metni' },
    colors: { Default: 'Varsayılan', Slate: 'Arduvaz', Red: 'Kırmızı', Orange: 'Turuncu', Amber: 'Kehribar', Green: 'Yeşil', Teal: 'Deniz Mavisi', Blue: 'Mavi', Indigo: 'Çivit', Purple: 'Mor', Pink: 'Pembe' },
  },
  Greek: {
    fontSize: 'Μέγεθος γραμματοσειράς', textColor: 'Χρώμα κειμένου', reset: 'Επαναφορά', customColor: 'Προσαρμοσμένο χρώμα',
    bold: 'Έντονα', italic: 'Πλάγια', underline: 'Υπογράμμιση', bulletList: 'Λίστα με κουκκίδες', numberedList: 'Αριθμημένη λίστα',
    alignLeft: 'Στοίχιση αριστερά', alignCenter: 'Κεντράρισμα', alignRight: 'Στοίχιση δεξιά',
    addPhoto: 'Προσθήκη φωτογραφίας', uploadPhoto: 'Μεταφόρτωση φωτογραφίας', addLink: 'Προσθήκη συνδέσμου',
    enterLinkText: 'Εισαγάγετε κείμενο συνδέσμου', enterLink: 'Εισαγάγετε σύνδεσμο', remove: 'Αφαίρεση', cancel: 'Ακύρωση', apply: 'Εφαρμογή', notePhotoAlt: 'Φωτογραφία σημείωσης',
    presets: { title: 'Τίτλος', subtitle: 'Υπότιτλος', heading: 'Κεφαλίδα', subheading: 'Υποκεφαλίδα', section: 'Ενότητα', subsection: 'Υποενότητα', body: 'Κυρίως κείμενο' },
    colors: { Default: 'Προεπιλογή', Slate: 'Σχιστόλιθος', Red: 'Κόκκινο', Orange: 'Πορτοκαλί', Amber: 'Κεχριμπαρί', Green: 'Πράσινο', Teal: 'Πετρόλ', Blue: 'Μπλε', Indigo: 'Λουλακί', Purple: 'Μωβ', Pink: 'Ροζ' },
  },
};

export interface NotepadFontPreset {
  id: string;
  label: string;
  fontSize: string;
  fontWeight: string;
  previewSize: string;
}

export const NOTEPAD_FONT_PRESETS: NotepadFontPreset[] = [
  { id: 'title', label: 'Title', fontSize: '32px', fontWeight: '700', previewSize: '20px' },
  { id: 'subtitle', label: 'Subtitle', fontSize: '26px', fontWeight: '600', previewSize: '18px' },
  { id: 'heading', label: 'Heading', fontSize: '22px', fontWeight: '700', previewSize: '16px' },
  { id: 'subheading', label: 'Subheading', fontSize: '19px', fontWeight: '600', previewSize: '15px' },
  { id: 'section', label: 'Section', fontSize: '17px', fontWeight: '600', previewSize: '14px' },
  { id: 'subsection', label: 'Subsection', fontSize: '16px', fontWeight: '500', previewSize: '13.5px' },
  { id: 'body', label: 'Body', fontSize: '', fontWeight: '', previewSize: '13px' },
];

export const TEXT_COLOR_PALETTE = [
  { label: 'Default', value: '' },
  { label: 'Slate', value: '#475569' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Amber', value: '#d97706' },
  { label: 'Green', value: '#16a34a' },
  { label: 'Teal', value: '#0d9488' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Pink', value: '#db2777' },
];

const TextColorMark = Mark.create({
  name: 'textColor',
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).style.color || null,
        renderHTML: (attributes) => {
          if (!attributes.color) return {};
          return {
            style: `color: ${attributes.color}; -webkit-text-fill-color: ${attributes.color};`,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (element) => {
          const color = (element as HTMLElement).style?.color;
          return color ? { color } : false;
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },
});

const FontSizeMark = Mark.create({
  name: 'fontSize',
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).style.fontSize || null,
      },
      weight: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).style.fontWeight || null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (element) => {
          const el = element as HTMLElement;
          const size = el.style?.fontSize;
          if (!size) return false;
          return { size, weight: el.style?.fontWeight || null };
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const { size, weight, ...rest } = HTMLAttributes;
    const styleParts: string[] = [];
    if (size) styleParts.push(`font-size: ${size}`);
    if (weight) styleParts.push(`font-weight: ${weight}`);
    if (size) styleParts.push('line-height: 1.35');
    return [
      'span',
      mergeAttributes(rest, styleParts.length ? { style: styleParts.join('; ') } : {}),
      0,
    ];
  },
});

const ImageNode = TiptapNode.create({
  name: 'noteImage',
  group: 'block',
  inline: false,
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      textAlign: {
        default: 'left',
        parseHTML: (element) => {
          const el = element as HTMLElement;
          if (el.style.marginLeft === 'auto' && el.style.marginRight === 'auto') return 'center';
          if (el.style.marginLeft === 'auto') return 'right';
          return 'left';
        },
        renderHTML: () => ({}),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'img[src]' }];
  },
  renderHTML({ HTMLAttributes }) {
    const align = HTMLAttributes.textAlign || 'left';
    const alignMargin =
      align === 'center'
        ? 'margin-left: auto; margin-right: auto;'
        : align === 'right'
        ? 'margin-left: auto; margin-right: 0;'
        : '';
    return [
      'img',
      mergeAttributes(HTMLAttributes, {
        referrerpolicy: 'no-referrer',
        style: `max-width: 100%; height: auto; display: block; ${alignMargin}`,
        class: 'max-w-full max-h-[420px] rounded-xl my-3 object-contain border border-black/10 shadow-xs block',
      }),
    ];
  },
});

const TextAlignExtension = Extension.create({
  name: 'textAlign',
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading', 'listItem'],
        attributes: {
          textAlign: {
            default: 'left',
            parseHTML: (element) => (element as HTMLElement).style.textAlign || 'left',
            renderHTML: (attributes) => {
              if (!attributes.textAlign || attributes.textAlign === 'left') {
                return {};
              }
              return { style: `text-align: ${attributes.textAlign}` };
            },
          },
        },
      },
    ];
  },
});

const IMAGE_URL_EXT_REGEX = /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)(\?|#|$)/i;

function isLikelyImageUrl(url: string): boolean {
  const clean = url.trim();
  return /^data:image\//i.test(clean) || IMAGE_URL_EXT_REGEX.test(clean);
}

function compressNoteImageDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const rawUrl = reader.result as string;
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 960;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/webp', 0.82);
        if (compressed && compressed.startsWith('data:image/webp')) {
          resolve(compressed);
        } else {
          resolve(canvas.toDataURL('image/jpeg', 0.84));
        }
      };
      img.onerror = () => resolve(rawUrl);
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  });
}

const MenuBar = ({ editor, statusActions, language = 'English' }: { editor: any; statusActions?: React.ReactNode; language?: string }) => {
  const t = TIPTAP_T[language] || TIPTAP_T['English'];
  const [openMenu, setOpenMenu] = useState<'size' | 'color' | 'photo' | 'link' | null>(null);
  const [linkUrlInput, setLinkUrlInput] = useState('');
  const [linkTextInput, setLinkTextInput] = useState('');

  const toolbarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) {
    return null;
  }

  const activeFontAttrs = editor.getAttributes('fontSize') || {};
  const activePreset =
    NOTEPAD_FONT_PRESETS.find((p) => p.fontSize && p.fontSize === activeFontAttrs.size) ||
    NOTEPAD_FONT_PRESETS[NOTEPAD_FONT_PRESETS.length - 1];

  const activeColorAttrs = editor.getAttributes('textColor') || {};
  const activeColor: string = activeColorAttrs.color || '';

  const activeAlign: 'left' | 'center' | 'right' =
    editor.getAttributes('paragraph')?.textAlign ||
    editor.getAttributes('heading')?.textAlign ||
    editor.getAttributes('listItem')?.textAlign ||
    editor.getAttributes('noteImage')?.textAlign ||
    'left';

  const applyTextAlign = (alignment: 'left' | 'center' | 'right') => {
    editor
      .chain()
      .focus()
      .command(({ tr, state }) => {
        const { from, to } = state.selection;
        let updated = false;
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (['paragraph', 'heading', 'listItem', 'noteImage'].includes(node.type.name)) {
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, textAlign: alignment });
            updated = true;
          }
        });
        return updated;
      })
      .run();
  };

  const applyFontPreset = (preset: NotepadFontPreset) => {
    if (!preset.fontSize) {
      editor.chain().focus().unsetMark('fontSize').run();
    } else {
      editor
        .chain()
        .focus()
        .setMark('fontSize', { size: preset.fontSize, weight: preset.fontWeight })
        .run();
    }
    setOpenMenu(null);
  };

  const applyTextColor = (colorValue: string) => {
    if (!colorValue) {
      editor.chain().focus().unsetMark('textColor').run();
    } else {
      editor.chain().focus().setMark('textColor', { color: colorValue }).run();
    }
    setOpenMenu(null);
  };

  const insertPhotoSrc = (src: string) => {
    const clean = src.trim();
    if (!clean) return;
    editor
      .chain()
      .focus()
      .insertContent([
        { type: 'noteImage', attrs: { src: clean, alt: t.notePhotoAlt } },
        { type: 'paragraph' },
      ])
      .run();
    setOpenMenu(null);
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await compressNoteImageDataUrl(file);
      insertPhotoSrc(dataUrl);
    } catch (err) {
      console.error('Failed to add photo to note', err);
    }
  };

  const openLinkPopover = () => {
    if (openMenu === 'link') {
      setOpenMenu(null);
      return;
    }
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    const currentHref = editor.getAttributes('link')?.href || '';
    setLinkTextInput(selectedText);
    setLinkUrlInput(currentHref);
    setOpenMenu('link');
  };

  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    let url = linkUrlInput.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url) && !/^data:image\//i.test(url)) {
      url = `https://${url}`;
    }

    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;
    const displayText = linkTextInput.trim() || url;
    const knownPhotoLink = isLikelyImageUrl(url);

    const contentToInsert: any[] = [
      {
        type: 'text',
        text: displayText,
        marks: [{ type: 'link', attrs: { href: url } }],
      },
      { type: 'text', text: ' ' },
    ];

    if (hasSelection) {
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(contentToInsert)
        .run();
    } else {
      editor.chain().focus().insertContent(contentToInsert).run();
    }

    if (knownPhotoLink) {
      editor
        .chain()
        .focus()
        .insertContent([
          { type: 'noteImage', attrs: { src: url, alt: displayText } },
          { type: 'paragraph' },
        ])
        .run();
    } else if (/^https?:\/\//i.test(url)) {
      const probe = new window.Image();
      probe.referrerPolicy = 'no-referrer';
      probe.onload = () => {
        if (probe.naturalWidth > 0 && !editor.isDestroyed) {
          editor
            .chain()
            .focus()
            .insertContent([
              { type: 'noteImage', attrs: { src: url, alt: displayText } },
              { type: 'paragraph' },
            ])
            .run();
        }
      };
      probe.src = url;
    }

    setLinkUrlInput('');
    setLinkTextInput('');
    setOpenMenu(null);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkUrlInput('');
    setLinkTextInput('');
    setOpenMenu(null);
  };

  return (
    <div
      ref={toolbarRef}
      className="flex flex-wrap items-center justify-between gap-2 mb-4 pt-1 pb-2.5 border-b border-black/10 sticky top-[7.5rem] z-10 bg-white w-full"
    >
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      {/* Microsoft Notepad-style Font Size Presets ("Aa" design) */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpenMenu((prev) => (prev === 'size' ? null : 'size'))}
          className="h-9 lg:h-8 px-2.5 rounded-lg border border-black/10 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer select-none"
          title={t.fontSize}
        >
          <span className="text-[13px] font-black tracking-tight text-indigo-600 shrink-0 leading-none">
            Aa
          </span>
          <span className="min-w-[66px] text-left truncate">{t.presets[activePreset.id] || activePreset.label}</span>
          <ChevronDown size={13} className="opacity-60 shrink-0" />
        </button>

        {openMenu === 'size' && (
          <div className="absolute left-0 top-full mt-1.5 w-48 rounded-xl bg-white border border-black/10 shadow-xl py-1.5 z-40">
            {NOTEPAD_FONT_PRESETS.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyFontPreset(preset)}
                  className={`w-full px-3 py-1.5 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span
                    style={{
                      fontSize: preset.previewSize,
                      fontWeight: preset.fontWeight || '400',
                      lineHeight: 1.25,
                    }}
                  >
                    {t.presets[preset.id] || preset.label}
                  </span>
                  {isSelected && <Check size={14} className="text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Text Color Picker ("A" without underline) */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpenMenu((prev) => (prev === 'color' ? null : 'color'))}
          className="h-9 lg:h-8 px-2.5 rounded-lg border border-black/10 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer select-none"
          title={t.textColor}
        >
          <span
            className="text-[14px] font-black leading-none"
            style={{ color: activeColor || '#0f172a' }}
          >
            A
          </span>
          <ChevronDown size={13} className="opacity-60 shrink-0" />
        </button>

        {openMenu === 'color' && (
          <div className="absolute left-0 top-full mt-1.5 w-52 rounded-xl bg-white border border-black/10 shadow-xl p-3 z-40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Palette size={11} />
                {t.textColor}
              </span>
              {activeColor && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextColor('')}
                  className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  {t.reset}
                </button>
              )}
            </div>
            <div className="grid grid-cols-6 gap-1.5 mb-2.5">
              {TEXT_COLOR_PALETTE.map((swatch) => {
                const swatchColor = swatch.value || '#0f172a';
                const isSelected =
                  (!swatch.value && !activeColor) ||
                  (swatch.value && activeColor.toLowerCase() === swatch.value.toLowerCase());
                return (
                  <button
                    key={swatch.label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyTextColor(swatch.value)}
                    title={t.colors[swatch.label] || swatch.label}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                      isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 border-white' : 'border-black/15'
                    }`}
                    style={{ backgroundColor: swatchColor }}
                  >
                    {isSelected && <Check size={11} className="text-white" style={{ stroke: '#ffffff' }} />}
                  </button>
                );
              })}
            </div>
            <label className="flex items-center justify-between gap-2 pt-2 border-t border-black/10 cursor-pointer">
              <span className="text-[11px] font-semibold text-slate-700">{t.customColor}</span>
              <input
                type="color"
                value={activeColor.startsWith('#') ? activeColor : '#2563eb'}
                onChange={(e) => applyTextColor(e.target.value)}
                className="w-7 h-6 rounded border border-black/15 cursor-pointer bg-transparent p-0"
              />
            </label>
          </div>
        )}
      </div>

      <div className="w-[1px] h-6 bg-black/10 my-auto mx-0.5" />

      {/* Bold / Italic / Underline */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          editor.isActive('bold') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title={t.bold}
      >
        <Bold size={17} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          editor.isActive('italic') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title={t.italic}
      >
        <Italic size={17} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          editor.isActive('underline') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title={t.underline}
      >
        <UnderlineIcon size={17} />
      </button>

      <div className="w-[1px] h-6 bg-black/10 my-auto mx-0.5" />

      {/* Bullet List & Numbered List */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          editor.isActive('bulletList') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title={t.bulletList}
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          editor.isActive('orderedList') ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title={t.numberedList}
      >
        <ListOrdered size={18} />
      </button>

      <div className="w-[1px] h-6 bg-black/10 my-auto mx-0.5" />

      {/* Text Align: Left / Center / Right */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign('left')}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          activeAlign === 'left' ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title={t.alignLeft}
      >
        <AlignLeft size={17} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign('center')}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          activeAlign === 'center' ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title={t.alignCenter}
      >
        <AlignCenter size={17} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyTextAlign('right')}
        className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
          activeAlign === 'right' ? 'bg-black/10' : 'hover:bg-black/5 opacity-60 hover:opacity-100'
        }`}
        title={t.alignRight}
      >
        <AlignRight size={17} />
      </button>

      <div className="w-[1px] h-6 bg-black/10 my-auto mx-0.5" />

      {/* Add Photo */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpenMenu((prev) => (prev === 'photo' ? null : 'photo'))}
          className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
            openMenu === 'photo' ? 'bg-black/10' : 'hover:bg-black/5 opacity-75 hover:opacity-100'
          }`}
          title={t.addPhoto}
        >
          <ImagePlus size={17} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoFileChange}
          className="hidden"
        />

        {openMenu === 'photo' && (
          <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-52 rounded-xl bg-white border border-black/10 shadow-xl p-3 z-40">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                {t.addPhoto}
              </span>
              <button
                type="button"
                onClick={() => setOpenMenu(null)}
                className="p-0.5 rounded hover:bg-black/5 text-slate-400 cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Upload size={14} />
              <span>{t.uploadPhoto}</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Link */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={openLinkPopover}
          className={`p-2.5 lg:p-1.5 min-w-[38px] min-h-[38px] lg:min-w-0 lg:min-h-0 flex items-center justify-center rounded-lg transition-colors text-slate-800 cursor-pointer ${
            editor.isActive('link') || openMenu === 'link'
              ? 'bg-black/10 text-indigo-600'
              : 'hover:bg-black/5 opacity-75 hover:opacity-100'
          }`}
          title={t.addLink}
        >
          <Link2 size={17} />
        </button>

        {openMenu === 'link' && (
          <form
            onSubmit={handleApplyLink}
            className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-64 rounded-xl bg-white border border-black/10 shadow-xl p-3 z-40 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                {t.addLink}
              </span>
              <button
                type="button"
                onClick={() => setOpenMenu(null)}
                className="p-0.5 rounded hover:bg-black/5 text-slate-400 cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
            <input
              type="text"
              value={linkTextInput}
              onChange={(e) => setLinkTextInput(e.target.value)}
              placeholder={t.enterLinkText}
              autoFocus
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-black/15 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <input
              type="text"
              value={linkUrlInput}
              onChange={(e) => setLinkUrlInput(e.target.value)}
              placeholder={t.enterLink}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-black/15 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <div className="flex items-center justify-end gap-1.5 pt-1">
              {editor.isActive('link') && (
                <button
                  type="button"
                  onClick={handleRemoveLink}
                  className="mr-auto px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Unlink size={12} />
                  {t.remove}
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpenMenu(null)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={!linkUrlInput.trim()}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold disabled:opacity-45 cursor-pointer"
              >
                {t.apply}
              </button>
            </div>
          </form>
        )}
      </div>
      </div>

      {statusActions && (
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
          {statusActions}
        </div>
      )}
    </div>
  );
};

const Extensions = [
  StarterKit.configure({
    underline: false,
    link: {
      openOnClick: true,
      autolink: true,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'text-indigo-600 underline hover:text-indigo-800 cursor-pointer',
      },
    },
  }),
  Underline,
  TextColorMark,
  FontSizeMark,
  TextAlignExtension,
  ImageNode,
];

export default function TipTapEditor({ content, onChange, statusActions, language = 'English' }: TipTapEditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: Extensions,
    content,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: 'prose-mirror focus:outline-none min-h-[320px] text-[15px] leading-relaxed font-sans text-slate-900',
        style: 'font-family: Arial, Helvetica, sans-serif; color: #0f172a;',
      },
    },
    onUpdate: ({ editor }) => {
      onChangeRef.current(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const isEditorEmpty = editor.isEmpty || editor.getHTML() === '<p></p>' || editor.getHTML() === '<p><br></p>';
    const isContentEmpty = !content || content === '<p></p>' || content === '<p><br></p>';

    if (isEditorEmpty && isContentEmpty) return;

    if (content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="flex flex-col flex-1 font-sans mt-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <MenuBar editor={editor} statusActions={statusActions} language={language} />
      <div className="flex-1 pb-12" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
