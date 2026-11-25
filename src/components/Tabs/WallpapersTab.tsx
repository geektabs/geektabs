import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, Trash2, Image as ImageIcon, Video, Plus, Link, Check, HardDrive, Sparkles } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import defaultWallpapersData from '../../data/wallpapers.json';
import {
  CustomWallpaper,
  detectWallpaperMediaType,
  isGifWallpaperUrl,
  upscaleImageTo8K,
  getAllUserWallpapers,
  saveUserWallpaper,
  deleteUserWallpaper,
  migrateFromLocalStorage,
  getWallpaperCardThumbnailUrl,
  getMixkitVideoPosterUrl,
  getWallpaperCardVideoPreviewUrl,
  preloadWallpaperThumbnails,
} from '../../services/wallpaperStorage';

export type { CustomWallpaper };

interface WallpapersTabProps {
  customWallpapers?: any[];
  setCustomWallpapers?: (wallpapers: any[]) => void;
  currentTheme: string;
  setTheme: (theme: string) => void;
  isDarkMode: boolean;
  language?: string;
  cardBgMode?: 'white' | 'dark' | 'dark-glass';
  initialCategory?: string;
}

const WALLPAPER_T: Record<string, Record<string, string>> = {
  English: {
    title: "Custom Library",
    subtitle: "Your personal wallpaper gallery",
    uploadImage: "Upload File",
    addUrl: "Add via URL",
    enterUrl: "Enter Photo or Video URL",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "GIF files are not supported as background. Please use a static photo or 4K video.",
    categoryEmpty: "Category is empty",
    saveWallpaper: "Save Wallpaper",
    chooseCategory: "Choose a category",
    categoryName: "Category Name",
    cancel: "Cancel",
    save: "Save",
    deleteTitle: "Delete Wallpaper",
    deleteMsg: "Are you sure you want to delete this wallpaper? This action cannot be undone.",
    catAll: "All",
    catMyUploads: "My Uploads",
    catFavorites: "Favorites",
    catTravel: "Travel",
    catVideo: "Video",
    catNature: "Nature",
    catAbstract: "Abstract",
    catScience: "Science",
    catArchitecture: "Architecture",
    catCreation: "Creation",
    catHoliday: "Holiday",
    catAnimal: "Animal"
  },
  Chinese: {
    title: "自选壁纸库",
    subtitle: "您的专属个性壁纸画廊",
    uploadImage: "上传文件",
    addUrl: "添加在线链接",
    enterUrl: "输入照片或视频链接",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "不支持将 GIF 设为背景，请使用静态照片或视频。",
    categoryEmpty: "当前分类为空",
    saveWallpaper: "保存壁纸",
    chooseCategory: "选择一个分类",
    categoryName: "分类名称",
    cancel: "取消",
    save: "保存",
    deleteTitle: "删除壁纸",
    deleteMsg: "您确定要删除此壁纸吗？此操作无法撤销。",
    catAll: "全部",
    catMyUploads: "我的上传",
    catFavorites: "最爱",
    catTravel: "旅行",
    catVideo: "视频",
    catNature: "自然",
    catAbstract: "抽象",
    catScience: "科学",
    catArchitecture: "建筑",
    catCreation: "创意",
    catHoliday: "节日",
    catAnimal: "动物"
  },
  'Chinese Traditional': {
    title: "自選桌布庫",
    subtitle: "您的專屬個性桌布畫廊",
    uploadImage: "上傳檔案",
    addUrl: "新增線上連結",
    enterUrl: "輸入照片或影片連結",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "不支援將 GIF 設為背景，請使用靜態照片或影片。",
    categoryEmpty: "目前分類為空",
    saveWallpaper: "儲存桌布",
    chooseCategory: "選擇一個分類",
    categoryName: "分類名稱",
    cancel: "取消",
    save: "儲存",
    deleteTitle: "刪除桌布",
    deleteMsg: "您確定要刪除此桌布嗎？此操作無法復原。",
    catAll: "全部",
    catMyUploads: "我的上傳",
    catFavorites: "最愛",
    catTravel: "旅行",
    catVideo: "影片",
    catNature: "自然",
    catAbstract: "抽象",
    catScience: "科學",
    catArchitecture: "建築",
    catCreation: "創意",
    catHoliday: "節日",
    catAnimal: "動物"
  },
  Spanish: {
    title: "Biblioteca Personalizada",
    subtitle: "Tu galería de fondos de pantalla personal",
    uploadImage: "Subir Archivo",
    addUrl: "Añadir URL",
    enterUrl: "Pegar URL de Foto o Video",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "No se admiten archivos GIF como fondo. Usa una foto o video.",
    categoryEmpty: "La categoría está vacía",
    saveWallpaper: "Guardar Fondo",
    chooseCategory: "Elige una categoría",
    categoryName: "Nombre de Categoría",
    cancel: "Cancelar",
    save: "Guardar",
    deleteTitle: "Eliminar Fondo de Pantalla",
    deleteMsg: "¿Estás seguro de que deseas eliminar este fondo de pantalla? Esta acción no se puede deshacer.",
    catAll: "Todo",
    catMyUploads: "Mis Subidas",
    catFavorites: "Favoritos",
    catTravel: "Viajes",
    catVideo: "Video",
    catNature: "Naturaleza",
    catAbstract: "Abstracto",
    catScience: "Ciencia",
    catArchitecture: "Arquitectura",
    catCreation: "Creación",
    catHoliday: "Vacaciones",
    catAnimal: "Animal"
  },
  French: {
    title: "Bibliothèque Personnalisée",
    subtitle: "Votre galerie de fonds d'écran personnelle",
    uploadImage: "Téléverser Fichier",
    addUrl: "Ajouter URL",
    enterUrl: "Entrer l'URL (Photo ou Vidéo)",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "Les fichiers GIF ne sont pas pris en charge. Utilisez une photo ou vidéo.",
    categoryEmpty: "La catégorie est vide",
    saveWallpaper: "Enregistrer Fond",
    chooseCategory: "Choisir une catégorie",
    categoryName: "Nom de la Catégorie",
    cancel: "Annuler",
    save: "Enregistrer",
    deleteTitle: "Supprimer Fond d'Écran",
    deleteMsg: "Êtes-vous sûr de vouloir supprimer ce fond d'écran ? Cette action est irréversible.",
    catAll: "Tout",
    catMyUploads: "Mes Téléversements",
    catFavorites: "Favoris",
    catTravel: "Voyage",
    catVideo: "Vidéo",
    catNature: "Nature",
    catAbstract: "Abstrait",
    catScience: "Science",
    catArchitecture: "Architecture",
    catCreation: "Création",
    catHoliday: "Vacances",
    catAnimal: "Animal"
  },
  German: {
    title: "Eigene Galerie",
    subtitle: "Ihre persönliche Hintergrundgalerie",
    uploadImage: "Datei hochladen",
    addUrl: "URL hinzufügen",
    enterUrl: "Foto- oder Video-URL eingeben",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "GIF-Dateien werden nicht als Hintergrund unterstützt.",
    categoryEmpty: "Kategorie ist leer",
    saveWallpaper: "Hintergrund speichern",
    chooseCategory: "Kategorie auswählen",
    categoryName: "Kategorie-Name",
    cancel: "Abbrechen",
    save: "Speichern",
    deleteTitle: "Hintergrund löschen",
    deleteMsg: "Sind Sie sicher, dass Sie diesen Hintergrund löschen möchten? Dies kann nicht rückgängig gemacht werden.",
    catAll: "Alle",
    catMyUploads: "Meine Uploads",
    catFavorites: "Favoriten",
    catTravel: "Reisen",
    catVideo: "Video",
    catNature: "Natur",
    catAbstract: "Abstrakt",
    catScience: "Wissenschaft",
    catArchitecture: "Architektur",
    catCreation: "Kreatives",
    catHoliday: "Feiertage",
    catAnimal: "Tierwelt"
  },
  Japanese: {
    title: "カスタムライブラリ",
    subtitle: "あなただけの壁紙ギャラリー",
    uploadImage: "ファイルをアップロード",
    addUrl: "URLから追加",
    enterUrl: "写真・動画URLを入力",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "GIFファイルは背景としてサポートされていません。写真または動画を使用してください。",
    categoryEmpty: "カテゴリーは空です",
    saveWallpaper: "壁紙を保存",
    chooseCategory: "カテゴリーを選択",
    categoryName: "カテゴリー名",
    cancel: "キャンセル",
    save: "保存",
    deleteTitle: "壁紙を削除",
    deleteMsg: "この壁紙を削除してもよろしいですか？この操作は取り消せません。",
    catAll: "すべて",
    catMyUploads: "マイアップロード",
    catFavorites: "お気に入り",
    catTravel: "旅行",
    catVideo: "動画",
    catNature: "自然",
    catAbstract: "抽象",
    catScience: "科学",
    catArchitecture: "建築",
    catCreation: "クリエーション",
    catHoliday: "休日",
    catAnimal: "動物"
  },
  Korean: {
    title: "사용자 정의 라이브러리",
    subtitle: "나만의 맞춤 배경화면 갤러리",
    uploadImage: "파일 업로드",
    addUrl: "URL로 추가",
    enterUrl: "사진 또는 동영상 URL 입력",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "GIF 파일은 배경으로 지원되지 않습니다. 사진이나 동영상을 사용하세요.",
    categoryEmpty: "카테고리가 비어 있습니다",
    saveWallpaper: "배경화면 저장",
    chooseCategory: "카테고리 선택",
    categoryName: "카테고리 이름",
    cancel: "취소",
    save: "저장",
    deleteTitle: "배경화면 삭제",
    deleteMsg: "이 배경화면을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
    catAll: "전체",
    catMyUploads: "내 업로드",
    catFavorites: "즐겨찾기",
    catTravel: "여행",
    catVideo: "동영상",
    catNature: "자연",
    catAbstract: "추상",
    catScience: "과학",
    catArchitecture: "건축",
    catCreation: "창작",
    catHoliday: "휴일",
    catAnimal: "동물"
  },
  Italian: {
    title: "Libreria Personalizzata",
    subtitle: "La tua galleria personale di sfondi",
    uploadImage: "Carica File",
    addUrl: "Aggiungi URL",
    enterUrl: "Inserisci URL (Foto o Video)",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "I file GIF non sono supportati come sfondo. Usa una foto o un video.",
    categoryEmpty: "La categoria è vuota",
    saveWallpaper: "Salva Sfondo",
    chooseCategory: "Scegli una categoria",
    categoryName: "Nome Categoria",
    cancel: "Annulla",
    save: "Salva",
    deleteTitle: "Elimina Sfondo",
    deleteMsg: "Sei sicuro di voler eliminare questo sfondo? Questa azione non può essere annullata.",
    catAll: "Tutto",
    catMyUploads: "I Miei Caricamenti",
    catFavorites: "Preferiti",
    catTravel: "Viaggi",
    catVideo: "Video",
    catNature: "Natura",
    catAbstract: "Astratto",
    catScience: "Scienza",
    catArchitecture: "Architettura",
    catCreation: "Creazione",
    catHoliday: "Vacanze",
    catAnimal: "Animale"
  },
  Russian: {
    title: "Пользовательская библиотека",
    subtitle: "Ваша личная галерея обоев",
    uploadImage: "Загрузить файл",
    addUrl: "Добавить по URL",
    enterUrl: "Вставьте URL (фото или видео)",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "Файлы GIF не поддерживаются в качестве фона. Используйте фото или видео.",
    categoryEmpty: "Категория пуста",
    saveWallpaper: "Сохранить обои",
    chooseCategory: "Выберите категорию",
    categoryName: "Имя категории",
    cancel: "Отмена",
    save: "Сохранить",
    deleteTitle: "Удалить обои",
    deleteMsg: "Вы действительно хотите удалить эти обои? Это действие нельзя отменить.",
    catAll: "Все",
    catMyUploads: "Мои загрузки",
    catFavorites: "Избранное",
    catTravel: "Путешествия",
    catVideo: "Видео",
    catNature: "Природа",
    catAbstract: "Абстракция",
    catScience: "Наука",
    catArchitecture: "Архитектура",
    catCreation: "Творчество",
    catHoliday: "Праздник",
    catAnimal: "Животные"
  },
  Luxembourgish: {
    title: "Eegen Galerie",
    subtitle: "Är perséinlech Hannergrondgalerie",
    uploadImage: "Datei eroplueden",
    addUrl: "URL derbäisetzen",
    enterUrl: "Foto- oder Video-URL aginn",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "GIF-Dateien ginn net als Hannergrond ënnerstëtzt.",
    categoryEmpty: "Kategorie ass eidel",
    saveWallpaper: "Hannergrond späicheren",
    chooseCategory: "Kategorie auswielen",
    categoryName: "Kategorie-Numm",
    cancel: "Ofbriechen",
    save: "Späicheren",
    deleteTitle: "Hannergrondbild läschen",
    deleteMsg: "Sidd Dir sécher datt Dir dëst Hannergrondbild läschen wëllt? Dëst kann net réckgängeg gemaach ginn.",
    catAll: "All",
    catMyUploads: "Meng Eropluedungen",
    catFavorites: "Favoriten",
    catTravel: "Reesen",
    catVideo: "Video",
    catNature: "Natur",
    catAbstract: "Abstrakt",
    catScience: "Wëssenschaft",
    catArchitecture: "Architektur",
    catCreation: "Kreatives",
    catHoliday: "Feiertage",
    catAnimal: "Déieren"
  },
  Dutch: {
    title: "Aangepaste Bibliotheek",
    subtitle: "Je persoonlijke achtergrondengalerij",
    uploadImage: "Bestand uploaden",
    addUrl: "Via URL toevoegen",
    enterUrl: "Foto- of video-URL invoeren",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "GIF-bestanden worden niet ondersteund als achtergrond.",
    categoryEmpty: "Categorie is leeg",
    saveWallpaper: "Achtergrond opslaan",
    chooseCategory: "Kies een categorie",
    categoryName: "Categorienaam",
    cancel: "Annuleren",
    save: "Opslaan",
    deleteTitle: "Achtergrond verwijderen",
    deleteMsg: "Weet je zeker dat je deze achtergrond wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
    catAll: "Alles",
    catMyUploads: "Mijn uploads",
    catFavorites: "Favorieten",
    catTravel: "Reizen",
    catVideo: "Video",
    catNature: "Natuur",
    catAbstract: "Abstract",
    catScience: "Wetenschap",
    catArchitecture: "Architectuur",
    catCreation: "Creatie",
    catHoliday: "Vakantie",
    catAnimal: "Dieren"
  },
  Swedish: {
    title: "Anpassat Bibliotek",
    subtitle: "Ditt personliga bakgrundsgalleri",
    uploadImage: "Ladda upp fil",
    addUrl: "Lägg till via URL",
    enterUrl: "Ange foto- eller video-URL",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "GIF-filer stöds inte som bakgrund. Använd ett foto eller en video.",
    categoryEmpty: "Kategorin är tom",
    saveWallpaper: "Spara bakgrund",
    chooseCategory: "Välj en kategori",
    categoryName: "Kategorinamn",
    cancel: "Avbryt",
    save: "Spara",
    deleteTitle: "Ta bort bakgrund",
    deleteMsg: "Är du säker på att du vill ta bort denna bakgrund? Detta kan inte ångras.",
    catAll: "Alla",
    catMyUploads: "Mina uppladdningar",
    catFavorites: "Favoriter",
    catTravel: "Resor",
    catVideo: "Video",
    catNature: "Natur",
    catAbstract: "Abstrakt",
    catScience: "Vetenskap",
    catArchitecture: "Arkitektur",
    catCreation: "Skapande",
    catHoliday: "Högtider",
    catAnimal: "Djur"
  },
  Finnish: {
    title: "Oma Kirjasto",
    subtitle: "Henkilökohtainen taustakuvagalleria",
    uploadImage: "Lataa tiedosto",
    addUrl: "Lisää URL-osoitteella",
    enterUrl: "Syötä kuvan tai videon URL",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "GIF-tiedostoja ei tueta taustana. Käytä valokuvaa tai videota.",
    categoryEmpty: "Kategoria on tyhjä",
    saveWallpaper: "Tallenna taustakuva",
    chooseCategory: "Valitse kategoria",
    categoryName: "Kategorian nimi",
    cancel: "Peruuta",
    save: "Tallenna",
    deleteTitle: "Poista taustakuva",
    deleteMsg: "Haluatko varmasti poistaa tämän taustakuvan? Tätä toimintoa ei voi perua.",
    catAll: "Kaikki",
    catMyUploads: "Omat lataukset",
    catFavorites: "Suosikit",
    catTravel: "Matkailu",
    catVideo: "Video",
    catNature: "Luonto",
    catAbstract: "Abstrakti",
    catScience: "Tiede",
    catArchitecture: "Arkkitehtuuri",
    catCreation: "Luovuus",
    catHoliday: "Juhlapyhät",
    catAnimal: "Eläimet"
  },
  Hindi: {
    title: "कस्टम लाइब्रेरी",
    subtitle: "आपकी व्यक्तिगत वॉलपेपर गैलरी",
    uploadImage: "फ़ाइल अपलोड करें",
    addUrl: "URL से जोड़ें",
    enterUrl: "फ़ोटो या वीडियो URL दर्ज करें",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "GIF फ़ाइलें पृष्ठभूमि के रूप में समर्थित नहीं हैं। कृपया फ़ोटो या वीडियो का उपयोग करें।",
    categoryEmpty: "श्रेणी खाली है",
    saveWallpaper: "वॉलपेपर सहेजें",
    chooseCategory: "एक श्रेणी चुनें",
    categoryName: "श्रेणी का नाम",
    cancel: "रद्द करें",
    save: "सहेजें",
    deleteTitle: "वॉलपेपर हटाएं",
    deleteMsg: "क्या आप वाकई इस वॉलपेपर को हटाना चाहते हैं? इसे पूर्ववत नहीं किया जा सकता।",
    catAll: "सभी",
    catMyUploads: "मेरे अपलोड",
    catFavorites: "पसंदीदा",
    catTravel: "यात्रा",
    catVideo: "वीडियो",
    catNature: "प्रकृति",
    catAbstract: "अमूर्त",
    catScience: "विज्ञान",
    catArchitecture: "वास्तुकला",
    catCreation: "रचना",
    catHoliday: "अवकाश",
    catAnimal: "पशु"
  },
  Norwegian: {
    title: "Egendefinert Bibliotek",
    subtitle: "Ditt personlige bakgrunnsgalleri",
    uploadImage: "Last opp fil",
    addUrl: "Legg til via URL",
    enterUrl: "Skriv inn bilde- eller video-URL",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "GIF-filer støttes ikke som bakgrunn. Bruk et bilde eller en video.",
    categoryEmpty: "Kategorien er tom",
    saveWallpaper: "Lagre bakgrunn",
    chooseCategory: "Velg en kategori",
    categoryName: "Kategorinavn",
    cancel: "Avbryt",
    save: "Lagre",
    deleteTitle: "Slett bakgrunn",
    deleteMsg: "Er du sikker på at du vil slette denne bakgrunnen? Dette kan ikke angres.",
    catAll: "Alle",
    catMyUploads: "Mine opplastinger",
    catFavorites: "Favoritter",
    catTravel: "Reise",
    catVideo: "Video",
    catNature: "Natur",
    catAbstract: "Abstrakt",
    catScience: "Vitenskap",
    catArchitecture: "Arkitektur",
    catCreation: "Kreativt",
    catHoliday: "Høytider",
    catAnimal: "Dyr"
  },
  Thai: {
    title: "คลังวอลเปเปอร์",
    subtitle: "แกลเลอรีวอลเปเปอร์ส่วนตัวของคุณ",
    uploadImage: "อัปโหลดไฟล์",
    addUrl: "เพิ่มผ่าน URL",
    enterUrl: "ป้อน URL รูปภาพหรือวิดีโอ",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "ไม่รองรับไฟล์ GIF เป็นพื้นหลัง กรุณาใช้รูปภาพหรือวิดีโอ",
    categoryEmpty: "หมวดหมู่นี้ว่างเปล่า",
    saveWallpaper: "บันทึกวอลเปเปอร์",
    chooseCategory: "เลือกหมวดหมู่",
    categoryName: "ชื่อหมวดหมู่",
    cancel: "ยกเลิก",
    save: "บันทึก",
    deleteTitle: "ลบวอลเปเปอร์",
    deleteMsg: "คุณแน่ใจหรือไม่ว่าต้องการลบวอลเปเปอร์นี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้",
    catAll: "ทั้งหมด",
    catMyUploads: "อัปโหลดของฉัน",
    catFavorites: "รายการโปรด",
    catTravel: "ท่องเที่ยว",
    catVideo: "วิดีโอ",
    catNature: "ธรรมชาติ",
    catAbstract: "นามธรรม",
    catScience: "วิทยาศาสตร์",
    catArchitecture: "สถาปัตยกรรม",
    catCreation: "สร้างสรรค์",
    catHoliday: "วันหยุด",
    catAnimal: "สัตว์"
  },
  Portuguese: {
    title: "Biblioteca de Fundos",
    subtitle: "A SUA GALERIA PESSOAL DE IMAGENS",
    uploadImage: "Carregar Ficheiro",
    addUrl: "Adicionar via URL",
    enterUrl: "Introduzir URL de Foto ou Vídeo",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "Ficheiros GIF não são suportados como fundo. Utilize uma foto ou vídeo.",
    categoryEmpty: "Esta categoria está vazia",
    saveWallpaper: "Guardar Imagem",
    chooseCategory: "Escolher Categoria",
    categoryName: "Nome da Categoria",
    cancel: "Cancelar",
    save: "Guardar",
    deleteTitle: "Eliminar Fundo",
    deleteMsg: "Tem a certeza de que deseja eliminar este fundo? Esta ação não pode ser desfeita.",
    catAll: "Todos",
    catMyUploads: "Os Meus Envios",
    catFavorites: "Favoritos",
    catTravel: "Viagem",
    catVideo: "Vídeo",
    catNature: "Natureza",
    catAbstract: "Abstrato",
    catScience: "Ciência",
    catArchitecture: "Arquitetura",
    catCreation: "Criativo",
    catHoliday: "Feriados",
    catAnimal: "Animais"
  },
  Vietnamese: {
    title: "Thư viện hình nền",
    subtitle: "BỘ SƯU TẬP HÌNH NỀN CÁ NHÂN CỦA BẠN",
    uploadImage: "Tải tệp lên",
    addUrl: "Thêm qua URL",
    enterUrl: "Nhập URL ảnh hoặc video",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "Không hỗ trợ tệp GIF làm hình nền. Vui lòng dùng ảnh hoặc video.",
    categoryEmpty: "Danh mục này trống",
    saveWallpaper: "Lưu hình nền",
    chooseCategory: "Chọn danh mục",
    categoryName: "Tên danh mục",
    cancel: "Hủy",
    save: "Lưu",
    deleteTitle: "Xóa hình nền",
    deleteMsg: "Bạn có chắc chắn muốn xóa hình nền này không? Hành động này không thể hoàn tác.",
    catAll: "Tất cả",
    catMyUploads: "Tệp đã tải lên",
    catFavorites: "Yêu thích",
    catTravel: "Du lịch",
    catVideo: "Video",
    catNature: "Thiên nhiên",
    catAbstract: "Trừu tượng",
    catScience: "Khoa học",
    catArchitecture: "Kiến trúc",
    catCreation: "Sáng tạo",
    catHoliday: "Kỳ nghỉ",
    catAnimal: "Động vật"
  },
  Polish: {
    title: "Biblioteka Tapet",
    subtitle: "TWOJA OSOBISTA GALERIA OBRAZÓW",
    uploadImage: "Prześlij plik",
    addUrl: "Dodaj przez URL",
    enterUrl: "Wpisz URL zdjęcia lub wideo",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "Pliki GIF nie są obsługiwane jako tapeta. Użyj zdjęcia lub wideo.",
    categoryEmpty: "Ta kategoria jest pusta",
    saveWallpaper: "Zapisz obraz",
    chooseCategory: "Wybierz kategorię",
    categoryName: "Nazwa kategorii",
    cancel: "Anuluj",
    save: "Zapisz",
    deleteTitle: "Usuń tapetę",
    deleteMsg: "Czy na pewno chcesz usunąć tę tapetę? Tej operacji nie można cofnąć.",
    catAll: "Wszystkie",
    catMyUploads: "Moje przesłane",
    catFavorites: "Ulubione",
    catTravel: "Podróże",
    catVideo: "Wideo",
    catNature: "Natura",
    catAbstract: "Abstrakcja",
    catScience: "Nauka",
    catArchitecture: "Architektura",
    catCreation: "Twórczość",
    catHoliday: "Wakacje",
    catAnimal: "Zwierzęta"
  },
  Danish: {
    title: "Tapetbibliotek",
    subtitle: "DIT PERSONLIGE BILLEDGALLERI",
    uploadImage: "Upload fil",
    addUrl: "Tilføj via URL",
    enterUrl: "Indtast foto- eller video-URL",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "GIF-filer understøttes ikke som baggrund. Brug venligst et foto eller en video.",
    categoryEmpty: "Denne kategori er tom",
    saveWallpaper: "Gem billede",
    chooseCategory: "Vælg kategori",
    categoryName: "Kategorinavn",
    cancel: "Annuller",
    save: "Gem",
    deleteTitle: "Slet tapet",
    deleteMsg: "Er du sikker på, at du vil slette dette tapet? Denne handling kan ikke fortrydes.",
    catAll: "Alle",
    catMyUploads: "Mine uploads",
    catFavorites: "Favoritter",
    catTravel: "Rejser",
    catVideo: "Video",
    catNature: "Natur",
    catAbstract: "Abstrakt",
    catScience: "Videnskab",
    catArchitecture: "Arkitektur",
    catCreation: "Kreativ",
    catHoliday: "Ferie",
    catAnimal: "Dyr"
  },
  Turkish: {
    title: "Duvar Kağıdı Kitaplığı",
    subtitle: "KİŞİSEL GÖRSEL GALERİNİZ",
    uploadImage: "Dosya Yükle",
    addUrl: "URL ile Ekle",
    enterUrl: "Fotoğraf veya Video URL'si Girin",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "GIF dosyaları duvar kağıdı olarak desteklenmez. Lütfen fotoğraf veya video kullanın.",
    categoryEmpty: "Bu kategori boş",
    saveWallpaper: "Görseli Kaydet",
    chooseCategory: "Kategori Seç",
    categoryName: "Kategori Adı",
    cancel: "İptal",
    save: "Kaydet",
    deleteTitle: "Duvar Kağıdını Sil",
    deleteMsg: "Bu duvar kağıdını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
    catAll: "Tümü",
    catMyUploads: "Yüklediklerim",
    catFavorites: "Favoriler",
    catTravel: "Seyahat",
    catVideo: "Video",
    catNature: "Doğa",
    catAbstract: "Soyut",
    catScience: "Bilim",
    catArchitecture: "Mimari",
    catCreation: "Yaratıcılık",
    catHoliday: "Tatil",
    catAnimal: "Hayvanlar"
  },
  Greek: {
    title: "Βιβλιοθήκη Ταπετσαριών",
    subtitle: "Η ΠΡΟΣΩΠΙΚΗ ΣΑΣ ΣΥΛΛΟΓΗ ΕΙΚΟΝΩΝ",
    uploadImage: "Μεταφόρτωση Αρχείου",
    addUrl: "Προσθήκη μέσω URL",
    enterUrl: "Εισαγάγετε URL Φωτογραφίας ή Βίντεο",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "Τα αρχεία GIF δεν υποστηρίζονται ως ταπετσαρία. Χρησιμοποιήστε φωτογραφία ή βίντεο.",
    categoryEmpty: "Αυτή η κατηγορία είναι κενή",
    saveWallpaper: "Αποθήκευση Εικόνας",
    chooseCategory: "Επιλογή Κατηγορίας",
    categoryName: "Όνομα Κατηγορίας",
    cancel: "Ακύρωση",
    save: "Αποθήκευση",
    deleteTitle: "Διαγραφή Ταπετσαρίας",
    deleteMsg: "Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτήν την ταπετσαρία; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.",
    catAll: "Όλα",
    catMyUploads: "Οι Μεταφορτώσεις μου",
    catFavorites: "Αγαπημένα",
    catTravel: "Ταξίδια",
    catVideo: "Βίντεο",
    catNature: "Φύση",
    catAbstract: "Αφηρημένο",
    catScience: "Επιστήμη",
    catArchitecture: "Αρχιτεκτονική",
    catCreation: "Δημιουργικό",
    catHoliday: "Διακοπές",
    catAnimal: "Ζώα"
  },
  Belgum: {
    title: "Achtergrondenbibliotheek",
    subtitle: "UW PERSOONLIJKE BEELDGALERIJ",
    uploadImage: "Bestand opladen",
    addUrl: "Toevoegen via URL",
    enterUrl: "Voer foto- of video-URL in",
    urlPlaceholder: "https://... (.jpg, .png, .webp, .mp4, .webm)",
    gifNotAllowed: "GIF-bestanden worden niet ondersteund als achtergrond. Gebruik een foto of video.",
    categoryEmpty: "Deze categorie is nog leeg",
    saveWallpaper: "Afbeelding opslaan",
    chooseCategory: "Kies een categorie",
    categoryName: "Categorienaam",
    cancel: "Annuleren",
    save: "Opslaan",
    deleteTitle: "Achtergrond verwijderen",
    deleteMsg: "Weet u zeker dat u deze achtergrond wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
    catAll: "Alles",
    catMyUploads: "Mijn uploads",
    catFavorites: "Favorieten",
    catTravel: "Reizen",
    catVideo: "Video",
    catNature: "Natuur",
    catAbstract: "Abstract",
    catScience: "Wetenschap",
    catArchitecture: "Architectuur",
    catCreation: "Creatief",
    catHoliday: "Feestdagen",
    catAnimal: "Dieren"
  }
};

const WALLPAPER_EXTRA_T: Record<string, {
  enhancing8k: string;
  videoBadge: string;
  previewAlt: string;
  uhdAuto: string;
  uhdLabel: string;
  confirmDelete: string;
}> = {
  English: { enhancing8k: '8K UHD...', videoBadge: '4K VIDEO', previewAlt: 'Preview', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Delete' },
  Chinese: { enhancing8k: '正在优化 8K...', videoBadge: '4K 视频', previewAlt: '预览', uhdAuto: '8K 超清自动增强', uhdLabel: '8K 超清', confirmDelete: '删除' },
  'Chinese Traditional': { enhancing8k: '正在最佳化 8K...', videoBadge: '4K 影片', previewAlt: '預覽', uhdAuto: '8K 超清自動增強', uhdLabel: '8K 超清', confirmDelete: '刪除' },
  Spanish: { enhancing8k: '8K UHD...', videoBadge: 'VIDEO 4K', previewAlt: 'Vista previa', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Eliminar' },
  French: { enhancing8k: '8K UHD...', videoBadge: 'VIDÉO 4K', previewAlt: 'Aperçu', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Supprimer' },
  German: { enhancing8k: '8K UHD...', videoBadge: '4K-VIDEO', previewAlt: 'Vorschau', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Löschen' },
  Japanese: { enhancing8k: '8K 処理中...', videoBadge: '4K 動画', previewAlt: 'プレビュー', uhdAuto: '8K UHD 自動補正', uhdLabel: '8K UHD', confirmDelete: '削除' },
  Korean: { enhancing8k: '8K 변환 중...', videoBadge: '4K 동영상', previewAlt: '미리보기', uhdAuto: '8K UHD 자동', uhdLabel: '8K UHD', confirmDelete: '삭제' },
  Italian: { enhancing8k: '8K UHD...', videoBadge: 'VIDEO 4K', previewAlt: 'Anteprima', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Elimina' },
  Russian: { enhancing8k: '8K UHD...', videoBadge: '4K ВИДЕО', previewAlt: 'Предпросмотр', uhdAuto: '8K UHD АВТО', uhdLabel: '8K UHD', confirmDelete: 'Удалить' },
  Luxembourgish: { enhancing8k: '8K UHD...', videoBadge: '4K VIDEO', previewAlt: 'Virschau', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Läschen' },
  Dutch: { enhancing8k: '8K UHD...', videoBadge: '4K VIDEO', previewAlt: 'Voorbeeld', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Verwijderen' },
  Swedish: { enhancing8k: '8K UHD...', videoBadge: '4K VIDEO', previewAlt: 'Förhandsvisning', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Ta bort' },
  Finnish: { enhancing8k: '8K UHD...', videoBadge: '4K VIDEO', previewAlt: 'Esikatselu', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Poista' },
  Hindi: { enhancing8k: '8K UHD...', videoBadge: '4K वीडियो', previewAlt: 'पूर्वावलोकन', uhdAuto: '8K UHD ऑटो', uhdLabel: '8K UHD', confirmDelete: 'हटाएं' },
  Norwegian: { enhancing8k: '8K UHD...', videoBadge: '4K VIDEO', previewAlt: 'Forhåndsvisning', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Slett' },
  Thai: { enhancing8k: 'กำลังปรับ 8K...', videoBadge: 'วิดีโอ 4K', previewAlt: 'ตัวอย่าง', uhdAuto: '8K UHD อัตโนมัติ', uhdLabel: '8K UHD', confirmDelete: 'ลบ' },
  Portuguese: { enhancing8k: '8K UHD...', videoBadge: 'VÍDEO 4K', previewAlt: 'Pré-visualização', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Eliminar' },
  Vietnamese: { enhancing8k: '8K UHD...', videoBadge: 'VIDEO 4K', previewAlt: 'Xem trước', uhdAuto: '8K UHD TỰ ĐỘNG', uhdLabel: '8K UHD', confirmDelete: 'Xóa' },
  Polish: { enhancing8k: '8K UHD...', videoBadge: 'WIDEO 4K', previewAlt: 'Podgląd', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Usuń' },
  Danish: { enhancing8k: '8K UHD...', videoBadge: '4K VIDEO', previewAlt: 'Forhåndsvisning', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Slet' },
  Turkish: { enhancing8k: '8K UHD...', videoBadge: '4K VİDEO', previewAlt: 'Önizleme', uhdAuto: '8K UHD OTOMATİK', uhdLabel: '8K UHD', confirmDelete: 'Sil' },
  Greek: { enhancing8k: '8K UHD...', videoBadge: 'ΒΙΝΤΕΟ 4K', previewAlt: 'Προεπισκόπηση', uhdAuto: '8K UHD ΑΥΤΟΜ.', uhdLabel: '8K UHD', confirmDelete: 'Διαγραφή' },
  Belgum: { enhancing8k: '8K UHD...', videoBadge: '4K VIDEO', previewAlt: 'Voorbeeld', uhdAuto: '8K UHD AUTO', uhdLabel: '8K UHD', confirmDelete: 'Verwijderen' },
};

export default function WallpapersTab({ 
  currentTheme, 
  setTheme, 
  isDarkMode = false,
  language = 'English',
  cardBgMode = 'white',
  initialCategory = 'All'
}: WallpapersTabProps) {
  const isDarkGlass = cardBgMode === 'dark-glass';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deletedDefaultIds, setDeletedDefaultIds] = useLocalStorage<string[]>('GeekTabs-deleted-default-wallpapers', []);
  const [userWallpapers, setUserWallpapers] = useState<CustomWallpaper[]>([]);
  
  // Upload modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [pendingUploadData, setPendingUploadData] = useState<string | null>(null);
  const [pendingMediaType, setPendingMediaType] = useState<'image' | 'video'>('image');
  const [pendingWasUpscaled, setPendingWasUpscaled] = useState(false);
  const [isEnhancing8K, setIsEnhancing8K] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Favorites');
  const [confirmDeleteWallpaper, setConfirmDeleteWallpaper] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const categoryBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [uniformCategoryWidth, setUniformCategoryWidth] = useState<number | null>(null);
  const tData = WALLPAPER_T[language] || WALLPAPER_T['English'];
  const extraT = WALLPAPER_EXTRA_T[language] || WALLPAPER_EXTRA_T['English'];

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  // Load user wallpapers from IndexedDB and auto-migrate any old localStorage items
  useEffect(() => {
    let isMounted = true;

    async function loadWallpapers() {
      try {
        await migrateFromLocalStorage();
        const stored = await getAllUserWallpapers();
        if (isMounted) {
          setUserWallpapers(stored.filter((w) => !isGifWallpaperUrl(w.url)));
        }
      } catch (err) {
        console.error('Failed loading wallpapers from IndexedDB', err);
      }
    }

    loadWallpapers();
    return () => { isMounted = false; };
  }, []);

  // Filter default wallpapers by deleted list
  const activeDefaultWallpapers: CustomWallpaper[] = (defaultWallpapersData as any[]).filter(
    (def) => !deletedDefaultIds.includes(def.id) && !isGifWallpaperUrl(def.url)
  );

  // Combined wallpapers list (user uploads first, then defaults; exclude GIFs)
  const allWallpapers: CustomWallpaper[] = [...userWallpapers, ...activeDefaultWallpapers].filter(
    (w) => !isGifWallpaperUrl(w.url)
  );

  const categories = Array.from(
    new Set([
      'All',
      'My Uploads',
      'Favorites',
      'Video',
      'Travel',
      'Nature',
      'Abstract',
      'Science',
      'Architecture',
      'Creation',
      'Holiday',
      'Animal',
      ...allWallpapers
        .map((w) => w.category)
        .filter((c) => c !== 'GIF & Video' && c !== 'GIF'),
    ])
  );

  const catMap: Record<string, string> = {
    'All': tData.catAll,
    'My Uploads': tData.catMyUploads,
    'Favorites': tData.catFavorites,
    'Video': tData.catVideo,
    'Travel': tData.catTravel,
    'Nature': tData.catNature,
    'Abstract': tData.catAbstract,
    'Science': tData.catScience,
    'Architecture': tData.catArchitecture,
    'Creation': tData.catCreation,
    'Holiday': tData.catHoliday,
    'Animal': tData.catAnimal,
  };

  const getThemeValueForWallpaper = (w: CustomWallpaper) => {
    if (w.url.startsWith('data:video/') || w.url.length > 1_500_000) {
      return `idb-wall://${w.id}`;
    }
    return w.url;
  };

  useEffect(() => {
    preloadWallpaperThumbnails(allWallpapers);
  }, [allWallpapers.length]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isGif = file.type === 'image/gif' || /\.gif$/i.test(file.name);
      if (isGif) {
        setUploadError(tData.gifNotAllowed || 'GIF files are not supported.');
        e.target.value = '';
        return;
      }

      const isVideo =
        file.type.startsWith('video/') ||
        /\.(mp4|webm|mov|m4v|ogv|ogg)$/i.test(file.name);

      setUploadError(null);
      setIsEnhancing8K(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          if (isVideo) {
            // Preserve native full video quality in IndexedDB
            setPendingUploadData(base64String);
            setPendingMediaType('video');
            setPendingWasUpscaled(false);
          } else {
            // Automatically upscale <8K (e.g. 2K/1080p/4K) static photos to 8K Ultra-HD (7680x4320)
            const enhanced = await upscaleImageTo8K(base64String);
            setPendingUploadData(enhanced.dataUrl);
            setPendingMediaType('image');
            setPendingWasUpscaled(enhanced.upscaled);
          }
          setUploadMode('file');
          setUploadCategory(
            isVideo
              ? 'Video'
              : activeCategory === 'All' || activeCategory === 'My Uploads'
              ? 'Favorites'
              : activeCategory
          );
          setShowUploadModal(true);
        } finally {
          setIsEnhancing8K(false);
        }
      };
      reader.onerror = () => {
        setIsEnhancing8K(false);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const openUrlModal = () => {
    setUploadMode('url');
    setUrlInput('');
    setUploadError(null);
    setPendingUploadData(null);
    setPendingMediaType('image');
    setPendingWasUpscaled(false);
    setUploadCategory(
      activeCategory === 'Video'
        ? 'Video'
        : activeCategory === 'All' || activeCategory === 'My Uploads'
        ? 'Favorites'
        : activeCategory
    );
    setShowUploadModal(true);
  };

  const confirmUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = uploadMode === 'file' ? pendingUploadData : urlInput.trim();
    if (!finalUrl || !uploadCategory) return;

    if (isGifWallpaperUrl(finalUrl)) {
      setUploadError(tData.gifNotAllowed || 'GIF files are not supported.');
      return;
    }

    const mediaType =
      uploadMode === 'file'
        ? pendingMediaType
        : detectWallpaperMediaType(finalUrl);

    const newWallpaper: CustomWallpaper = {
      id: `user-wall-${Date.now()}`,
      url: finalUrl,
      category: uploadCategory,
      mediaType,
      createdAt: Date.now(),
    };

    try {
      // Save directly into visitor's browser IndexedDB (zero server storage)
      await saveUserWallpaper(newWallpaper);
      setUserWallpapers((prev) => [newWallpaper, ...prev]);
      setTheme(getThemeValueForWallpaper(newWallpaper));
      setShowUploadModal(false);
      setPendingUploadData(null);
      setPendingWasUpscaled(false);
      setUploadError(null);
      setUrlInput('');
      setActiveCategory(uploadCategory);
    } catch (err) {
      console.error('Failed to save wallpaper', err);
    }
  };

  const handleDeleteWallpaper = async (id: string) => {
    const itemToDelete = allWallpapers.find((w) => w.id === id);
    const isUserUpload = userWallpapers.some((w) => w.id === id);

    if (isUserUpload) {
      await deleteUserWallpaper(id);
      setUserWallpapers((prev) => prev.filter((w) => w.id !== id));
    } else {
      setDeletedDefaultIds([...deletedDefaultIds, id]);
    }

    if (
      itemToDelete &&
      (currentTheme === itemToDelete.url || currentTheme === `idb-wall://${itemToDelete.id}`)
    ) {
      setTheme('white-clean');
    }
    setConfirmDeleteWallpaper(null);
  };

  const filteredWallpapers = allWallpapers.filter((w) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'My Uploads') {
      return userWallpapers.some((uw) => uw.id === w.id);
    }
    if (activeCategory === 'Video') {
      return (
        w.category === 'Video' ||
        detectWallpaperMediaType(w.url, w.mediaType) === 'video'
      );
    }
    return w.category === activeCategory;
  });

  const categoriesKey = categories.join('|');

  useLayoutEffect(() => {
    let cancelled = false;
    const measureMaxCategoryWidth = () => {
      if (cancelled) return;
      const buttons = categoryBtnRefs.current
        .slice(0, categories.length)
        .filter((el): el is HTMLButtonElement => Boolean(el));
      if (buttons.length === 0) return;

      buttons.forEach((btn) => {
        btn.style.width = 'auto';
      });
      const measuredMax = Math.ceil(
        Math.max(...buttons.map((btn) => btn.getBoundingClientRect().width))
      );
      const containerWidth = buttons[0]?.parentElement?.clientWidth || measuredMax;
      const maxWidth = Math.min(measuredMax, containerWidth);
      if (maxWidth > 0) {
        buttons.forEach((btn) => {
          btn.style.width = `${maxWidth}px`;
        });
        setUniformCategoryWidth(maxWidth);
      }
    };

    measureMaxCategoryWidth();
    window.addEventListener('resize', measureMaxCategoryWidth);
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measureMaxCategoryWidth).catch(() => {});
    }

    return () => {
      cancelled = true;
      window.removeEventListener('resize', measureMaxCategoryWidth);
    };
  }, [language, categoriesKey, categories.length]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-10 flex flex-col items-center text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2 sm:mb-3">{tData.title}</h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.25em] text-[10px]">{tData.subtitle}</p>
      </div>

      {/* Category Filter Pills — Equal width based on widest category button */}
      <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-3 mb-6 sm:mb-8 pb-2 justify-center items-center">
        {categories.map((cat, idx) => (
          <button
            key={cat}
            ref={(el) => {
              categoryBtnRefs.current[idx] = el;
            }}
            onClick={() => setActiveCategory(cat)}
            style={uniformCategoryWidth ? { width: `${uniformCategoryWidth}px` } : undefined}
            className={`max-w-full px-3.5 sm:px-4 min-h-[40px] lg:min-h-0 h-[40px] flex items-center justify-center rounded-full text-[11px] sm:text-[10.5px] md:text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none shrink-0 ${
              activeCategory === cat
                ? 'bg-indigo-500 text-white wallpaper-card-badge shadow-lg shadow-indigo-500/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-black/5'
            }`}
            title={catMap[cat] || cat}
          >
            <span className={`whitespace-nowrap px-1 text-center ${activeCategory === cat ? 'wallpaper-card-badge text-white' : ''}`}>
              {catMap[cat] || cat}
            </span>
          </button>
        ))}
      </div>

      {/* Line 1: Upload File & Add via URL */}
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {/* Upload from Computer/Phone Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !isEnhancing8K && fileInputRef.current?.click()}
            disabled={isEnhancing8K}
            className="wallpaper-upload-card wallpaper-upload-file-card aspect-[4/3] sm:aspect-[16/10] lg:aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 sm:gap-2.5 transition-all group cursor-pointer border-indigo-400/70 bg-white hover:border-indigo-600 hover:bg-indigo-50/80 shadow-xs disabled:opacity-70"
          >
            <div className="wallpaper-upload-icon-box w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 duration-300 transition-all bg-indigo-50 text-indigo-600 border border-indigo-200/80 shadow-xs">
              {isEnhancing8K ? (
                <Sparkles className="wallpaper-upload-icon animate-pulse" size={20} />
              ) : (
                <Plus className="wallpaper-upload-icon" size={20} />
              )}
            </div>
            <span className="wallpaper-upload-text font-extrabold text-[11px] uppercase tracking-wider transition-colors text-slate-800 group-hover:text-indigo-600 px-2 text-center">
              {isEnhancing8K ? extraT.enhancing8k : tData.uploadImage}
            </span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/webp,image/avif,image/bmp,video/mp4,video/webm,video/quicktime,.jpg,.jpeg,.png,.webp,.avif,.mp4,.webm,.mov,.m4v,.ogv"
              className="hidden"
            />
          </motion.button>

          {/* Add via Web URL Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openUrlModal}
            className="wallpaper-upload-card wallpaper-upload-url-card aspect-[4/3] sm:aspect-[16/10] lg:aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 sm:gap-2.5 transition-all group cursor-pointer border-purple-400/70 bg-white hover:border-purple-600 hover:bg-purple-50/80 shadow-xs"
          >
            <div className="wallpaper-upload-icon-box w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 duration-300 transition-all bg-purple-50 text-purple-600 border border-purple-200/80 shadow-xs">
              <Link className="wallpaper-upload-icon" size={18} />
            </div>
            <span className="wallpaper-upload-text font-extrabold text-[11px] uppercase tracking-wider transition-colors text-slate-800 group-hover:text-purple-600 px-2 text-center">
              {tData.addUrl}
            </span>
          </motion.button>
        </div>

        {uploadError && !showUploadModal && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 text-center">
            {uploadError}
          </div>
        )}

        {/* Line 2+: Wallpapers List (4 per line on desktop, 2 on tablet, 1 on phone) */}
        {filteredWallpapers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {filteredWallpapers.map((w) => {
                const isActive = currentTheme === w.url || currentTheme === `idb-wall://${w.id}`;
                const mediaType = detectWallpaperMediaType(w.url, w.mediaType);
                return (
                  <div
                    key={w.id}
                    className="relative group"
                  >
                    <button
                      onClick={() => setTheme(getThemeValueForWallpaper(w))}
                      className={`w-full aspect-[16/10] sm:aspect-[16/10] lg:aspect-video relative block rounded-2xl overflow-hidden border-2 transition-shadow duration-200 p-0 focus:outline-none cursor-pointer bg-slate-200/70 dark:bg-slate-800/60 ${
                        isActive 
                          ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-xl' 
                          : 'border-transparent shadow-md hover:shadow-lg'
                      }`}
                      style={{ outline: 'none' }}
                    >
                      <WallpaperCardMedia
                        url={w.url}
                        title={w.title || ''}
                        mediaType={mediaType}
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 rounded-[14px] transition-colors duration-200 pointer-events-none" />

                      {/* Active Checkmark Badge */}
                      {isActive && (
                        <div className="wallpaper-card-badge absolute top-3 left-3 bg-indigo-500 text-white rounded-full p-1.5 shadow-lg flex items-center justify-center" style={{ color: '#ffffff' }}>
                          <Check size={14} className="stroke-[3] text-white stroke-white" />
                        </div>
                      )}

                      {/* Category / Upload Tag */}
                      <div 
                        className="wallpaper-card-badge absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/20 shadow-md pointer-events-none select-none flex items-center justify-center"
                        style={{ color: '#ffffff' }}
                      >
                        <span className="wallpaper-card-badge text-white" style={{ color: '#ffffff' }}>
                          {w.category === 'GIF & Video'
                            ? catMap['Video']
                            : catMap[w.category] || w.category}
                        </span>
                      </div>

                      {/* 8K / 4K Video Badge */}
                      {mediaType === 'video' ? (
                        <div
                          className="wallpaper-card-badge absolute bottom-3 right-3 bg-indigo-600/90 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-lg border border-white/25 shadow-md pointer-events-none select-none flex items-center gap-1"
                          style={{ color: '#ffffff' }}
                        >
                          <Video size={10} className="wallpaper-card-badge text-white stroke-white" />
                          <span className="wallpaper-card-badge text-white" style={{ color: '#ffffff' }}>
                            {extraT.videoBadge}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="wallpaper-card-badge absolute bottom-3 right-3 bg-black/65 backdrop-blur-md text-white text-[8.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg border border-white/20 shadow-md pointer-events-none select-none"
                          style={{ color: '#ffffff' }}
                        >
                          <span className="wallpaper-card-badge text-white" style={{ color: '#ffffff' }}>
                            8K
                          </span>
                        </div>
                      )}
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteWallpaper(w.id);
                      }}
                      className="wallpaper-card-badge absolute top-3 right-3 w-10 h-10 lg:w-9 lg:h-9 bg-red-500/90 hover:bg-red-600 text-white rounded-xl flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all shadow-xl z-10 cursor-pointer"
                      title={tData.deleteTitle}
                      style={{ color: '#ffffff' }}
                    >
                      <Trash2 size={16} className="wallpaper-card-badge text-white stroke-white" />
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {filteredWallpapers.length === 0 && (
        <div className="mt-12 py-24 text-center flex flex-col items-center gap-4 border-2 border-dashed border-black/10 dark:border-white/10 rounded-[2.5rem] opacity-40">
          <ImageIcon size={48} strokeWidth={1.5} className="word-color" />
          <p className="word-color text-xs font-bold uppercase tracking-[0.3em]">{tData.categoryEmpty}</p>
        </div>
      )}

      {/* Upload / Add Wallpaper Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative z-10 GeekTabs-card p-6 sm:p-8 rounded-3xl w-full max-w-md shadow-2xl border border-indigo-200"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{tData.saveWallpaper}</h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-6">
              {uploadMode === 'file' ? tData.chooseCategory : tData.enterUrl}
            </p>

            <form onSubmit={confirmUpload} className="space-y-4 sm:space-y-5">
              {/* URL Input if Add via URL */}
              {uploadMode === 'url' ? (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-indigo-600 mb-2 font-bold">
                    {tData.enterUrl}
                  </label>
                  <input
                    type="url"
                    required
                    value={urlInput}
                    onChange={(e) => {
                      const nextUrl = e.target.value;
                      setUrlInput(nextUrl);
                      if (isGifWallpaperUrl(nextUrl)) {
                        setUploadError(tData.gifNotAllowed || 'GIF files are not supported.');
                      } else {
                        setUploadError(null);
                        const detected = detectWallpaperMediaType(nextUrl);
                        if (detected === 'video') {
                          setUploadCategory('Video');
                        }
                      }
                    }}
                    placeholder={tData.urlPlaceholder}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-xs font-mono shadow-inner"
                  />
                  {uploadError && (
                    <p className="mt-2 text-xs font-semibold text-red-600">{uploadError}</p>
                  )}
                </div>
              ) : (
                pendingUploadData && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
                    {pendingMediaType === 'video' ? (
                      <video
                        src={pendingUploadData}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img src={pendingUploadData} alt={extraT.previewAlt} className="w-full h-full object-cover" />
                    )}
                    <div
                      className="wallpaper-card-badge absolute bottom-2.5 right-2.5 bg-indigo-600/90 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-lg border border-white/25 shadow-md flex items-center gap-1"
                      style={{ color: '#ffffff' }}
                    >
                      <Sparkles size={10} className="wallpaper-card-badge text-white stroke-white" />
                      <span className="wallpaper-card-badge text-white" style={{ color: '#ffffff' }}>
                        {pendingWasUpscaled ? extraT.uhdAuto : extraT.uhdLabel}
                      </span>
                    </div>
                  </div>
                )
              )}

              {/* Category Selector */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-indigo-600 mb-2 font-bold">
                  {tData.categoryName}
                </label>
                <div className="relative">
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer pr-10 text-base sm:text-xs font-semibold shadow-inner"
                  >
                    {categories
                      .filter((c) => c !== 'All' && c !== 'My Uploads')
                      .map((c) => (
                        <option key={c} value={c} className="text-black bg-white font-semibold">
                          {catMap[c] || c}
                        </option>
                      ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2 text-[10px] font-bold tracking-widest uppercase">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-3 min-h-[44px] lg:min-h-0 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all font-bold cursor-pointer"
                >
                  {tData.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 min-h-[44px] lg:min-h-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  {tData.save}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmDeleteWallpaper}
        title={tData.deleteTitle}
        message={tData.deleteMsg}
        confirmText={extraT.confirmDelete}
        cancelText={tData.cancel}
        onConfirm={() => confirmDeleteWallpaper && handleDeleteWallpaper(confirmDeleteWallpaper)}
        onCancel={() => setConfirmDeleteWallpaper(null)}
      />
    </div>
  );
}

function WallpaperCardMedia({
  url,
  title,
  mediaType,
}: {
  url: string;
  title: string;
  mediaType: 'image' | 'video';
}) {
  const thumbUrl = mediaType === 'video' ? getMixkitVideoPosterUrl(url) : getWallpaperCardThumbnailUrl(url);
  const videoPreviewUrl = mediaType === 'video' ? getWallpaperCardVideoPreviewUrl(url) : url;
  const [imgSrc, setImgSrc] = useState(thumbUrl || url);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setImgSrc(thumbUrl || url);
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setImgLoaded(true);
    } else {
      setImgLoaded(false);
    }
  }, [thumbUrl, url]);

  useEffect(() => {
    if (mediaType === 'video' && videoRef.current && videoRef.current.readyState >= 2) {
      setVideoLoaded(true);
      videoRef.current.play().catch(() => {});
    } else {
      setVideoLoaded(false);
    }
  }, [mediaType, videoPreviewUrl]);

  if (mediaType === 'video') {
    return (
      <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-slate-200/70 dark:bg-slate-800/60">
        {thumbUrl && (
          <img
            ref={imgRef}
            src={thumbUrl}
            alt={title}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onLoad={() => setImgLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover rounded-[14px] group-hover:scale-105 transition-[transform,opacity] duration-300 ease-out pointer-events-none ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        <video
          ref={videoRef}
          src={videoPreviewUrl}
          poster={thumbUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => {
            setVideoLoaded(true);
            videoRef.current?.play().catch(() => {});
          }}
          className={`relative z-[1] w-full h-full object-cover rounded-[14px] group-hover:scale-105 transition-[transform,opacity] duration-300 ease-out pointer-events-none ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={imgSrc}
      alt={title}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      onLoad={() => setImgLoaded(true)}
      onError={() => {
        if (imgSrc !== url) {
          setImgSrc(url);
        }
      }}
      className={`w-full h-full object-cover rounded-[14px] group-hover:scale-105 transition-[transform,opacity] duration-300 ease-out ${
        imgLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}

