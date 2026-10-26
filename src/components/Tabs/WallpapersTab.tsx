import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Trash2, Image as ImageIcon, Plus, Link, Check, HardDrive } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import defaultWallpapersData from '../../data/wallpapers.json';
import {
  CustomWallpaper,
  getAllUserWallpapers,
  saveUserWallpaper,
  deleteUserWallpaper,
  migrateFromLocalStorage,
} from '../../services/wallpaperStorage';

export type { CustomWallpaper };

interface WallpapersTabProps {
  customWallpapers?: any[];
  setCustomWallpapers?: (wallpapers: any[]) => void;
  currentTheme: string;
  setTheme: (theme: string) => void;
  isDarkMode: boolean;
  language?: string;
  cardBgMode?: 'white' | 'dark-glass';
}

const WALLPAPER_T: Record<string, Record<string, string>> = {
  English: {
    title: "Custom Library",
    subtitle: "Your personal wallpaper gallery",
    uploadImage: "Upload File",
    addUrl: "Add via URL",
    enterUrl: "Enter Image URL",
    urlPlaceholder: "https://images.unsplash.com/...",
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
    enterUrl: "输入图片网络链接",
    urlPlaceholder: "https://images.unsplash.com/...",
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
    catNature: "自然",
    catAbstract: "抽象",
    catScience: "科学",
    catArchitecture: "建筑",
    catCreation: "创意",
    catHoliday: "节日",
    catAnimal: "动物"
  },
  Spanish: {
    title: "Biblioteca Personalizada",
    subtitle: "Tu galería de fondos de pantalla personal",
    uploadImage: "Subir Archivo",
    addUrl: "Añadir URL",
    enterUrl: "Pegar URL de Imagen",
    urlPlaceholder: "https://images.unsplash.com/...",
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
    enterUrl: "Entrer l'URL de l'image",
    urlPlaceholder: "https://images.unsplash.com/...",
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
    enterUrl: "Bild-URL eingeben",
    urlPlaceholder: "https://images.unsplash.com/...",
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
    enterUrl: "画像URLを入力",
    urlPlaceholder: "https://images.unsplash.com/...",
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
    enterUrl: "이미지 웹 URL 입력",
    urlPlaceholder: "https://images.unsplash.com/...",
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
    enterUrl: "Inserisci URL immagine",
    urlPlaceholder: "https://images.unsplash.com/...",
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
    enterUrl: "Вставьте URL изображения",
    urlPlaceholder: "https://images.unsplash.com/...",
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
    enterUrl: "Bild-URL aginn",
    urlPlaceholder: "https://images.unsplash.com/...",
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
    catNature: "Natur",
    catAbstract: "Abstrakt",
    catScience: "Wëssenschaft",
    catArchitecture: "Architektur",
    catCreation: "Kreatives",
    catHoliday: "Feiertage",
    catAnimal: "Déieren"
  }
};

const compressImage = (base64Str: string, maxWidth = 1920, maxHeight = 1080, quality = 0.85): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
    img.src = base64Str;
  });
};

export default function WallpapersTab({ 
  currentTheme, 
  setTheme, 
  isDarkMode = false,
  language = 'English',
  cardBgMode = 'white'
}: WallpapersTabProps) {
  const isDarkGlass = cardBgMode === 'dark-glass';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deletedDefaultIds, setDeletedDefaultIds] = useLocalStorage<string[]>('GeekTabs-deleted-default-wallpapers', []);
  const [userWallpapers, setUserWallpapers] = useState<CustomWallpaper[]>([]);
  
  // Upload modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [pendingUploadData, setPendingUploadData] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Favorites');
  const [confirmDeleteWallpaper, setConfirmDeleteWallpaper] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState('All');
  const tData = WALLPAPER_T[language] || WALLPAPER_T['English'];

  // Load user wallpapers from IndexedDB and auto-migrate any old localStorage items
  useEffect(() => {
    let isMounted = true;

    async function loadWallpapers() {
      try {
        await migrateFromLocalStorage();
        const stored = await getAllUserWallpapers();
        if (isMounted) {
          setUserWallpapers(stored);
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
    (def) => !deletedDefaultIds.includes(def.id)
  );

  // Combined wallpapers list (user uploads first, then defaults)
  const allWallpapers: CustomWallpaper[] = [...userWallpapers, ...activeDefaultWallpapers];

  const categories = Array.from(
    new Set([
      'All',
      'My Uploads',
      'Favorites',
      'Nature',
      'Abstract',
      'Science',
      'Architecture',
      'Creation',
      'Holiday',
      'Animal',
      ...allWallpapers.map((w) => w.category),
    ])
  );

  const catMap: Record<string, string> = {
    'All': tData.catAll,
    'My Uploads': tData.catMyUploads,
    'Favorites': tData.catFavorites,
    'Nature': tData.catNature,
    'Abstract': tData.catAbstract,
    'Science': tData.catScience,
    'Architecture': tData.catArchitecture,
    'Creation': tData.catCreation,
    'Holiday': tData.catHoliday,
    'Animal': tData.catAnimal,
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          const compressed = await compressImage(base64String);
          setPendingUploadData(compressed);
        } catch {
          setPendingUploadData(base64String);
        }
        setUploadMode('file');
        setUploadCategory(activeCategory === 'All' || activeCategory === 'My Uploads' ? 'Favorites' : activeCategory);
        setShowUploadModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const openUrlModal = () => {
    setUploadMode('url');
    setUrlInput('');
    setPendingUploadData(null);
    setUploadCategory(activeCategory === 'All' || activeCategory === 'My Uploads' ? 'Favorites' : activeCategory);
    setShowUploadModal(true);
  };

  const confirmUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = uploadMode === 'file' ? pendingUploadData : urlInput.trim();
    if (!finalUrl || !uploadCategory) return;

    const newWallpaper: CustomWallpaper = {
      id: `user-wall-${Date.now()}`,
      url: finalUrl,
      category: uploadCategory,
      createdAt: Date.now(),
    };

    try {
      // Save directly into visitor's browser IndexedDB (zero server storage)
      await saveUserWallpaper(newWallpaper);
      setUserWallpapers((prev) => [newWallpaper, ...prev]);
      setTheme(finalUrl);
      setShowUploadModal(false);
      setPendingUploadData(null);
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

    if (itemToDelete && currentTheme === itemToDelete.url) {
      setTheme('white-clean');
    }
    setConfirmDeleteWallpaper(null);
  };

  const filteredWallpapers = allWallpapers.filter((w) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'My Uploads') {
      return userWallpapers.some((uw) => uw.id === w.id);
    }
    return w.category === activeCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-6 sm:mb-10 flex flex-col items-center text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-2 sm:mb-3">{tData.title}</h2>
        <p className="text-black/50 dark:text-white/40 font-bold uppercase tracking-[0.25em] text-[10px]">{tData.subtitle}</p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-3 mb-6 sm:mb-8 pb-2 justify-center items-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 sm:px-4 h-[34px] sm:h-[38px] md:h-[40px] flex items-center justify-center rounded-full text-[10px] sm:text-[10.5px] md:text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none shrink-0 ${
              activeCategory === cat
                ? 'bg-indigo-500 text-white wallpaper-card-badge shadow-lg shadow-indigo-500/20'
                : 'GeekTabs-btn opacity-70 hover:opacity-100'
            }`}
            title={catMap[cat] || cat}
          >
            <span className={`whitespace-nowrap px-1 text-center ${activeCategory === cat ? 'wallpaper-card-badge text-white' : ''}`}>
              {catMap[cat] || cat}
            </span>
          </button>
        ))}
      </div>

      {/* Wallpaper Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Upload from Computer/Phone Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          className={`wallpaper-upload-card wallpaper-upload-file-card aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2.5 transition-all group cursor-pointer ${
            isDarkMode
              ? 'border-indigo-400/60 bg-indigo-950/20 hover:border-indigo-400 hover:bg-indigo-900/30'
              : 'border-indigo-400/70 bg-white/85 hover:border-indigo-600 hover:bg-indigo-50/80 shadow-xs'
          }`}
        >
          <div className={`wallpaper-upload-icon-box w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 duration-300 transition-all ${
            isDarkMode 
              ? 'bg-indigo-500/25 text-indigo-400 border border-indigo-500/30' 
              : 'bg-indigo-50 text-indigo-600 border border-indigo-200/80 shadow-xs'
          }`}>
            <Plus className="wallpaper-upload-icon" size={20} />
          </div>
          <span className={`wallpaper-upload-text font-extrabold text-[11px] uppercase tracking-wider transition-colors ${
            isDarkMode ? 'text-white group-hover:text-indigo-300' : 'text-slate-800 group-hover:text-indigo-600'
          }`}>
            {tData.uploadImage}
          </span>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
        </motion.button>

        {/* Add via Web URL Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openUrlModal}
          className={`wallpaper-upload-card wallpaper-upload-url-card aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2.5 transition-all group cursor-pointer ${
            isDarkMode
              ? 'border-purple-400/60 bg-purple-950/20 hover:border-purple-400 hover:bg-purple-900/30'
              : 'border-purple-400/70 bg-white/85 hover:border-purple-600 hover:bg-purple-50/80 shadow-xs'
          }`}
        >
          <div className={`wallpaper-upload-icon-box w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 duration-300 transition-all ${
            isDarkMode 
              ? 'bg-purple-500/25 text-purple-400 border border-purple-500/30' 
              : 'bg-purple-50 text-purple-600 border border-purple-200/80 shadow-xs'
          }`}>
            <Link className="wallpaper-upload-icon" size={18} />
          </div>
          <span className={`wallpaper-upload-text font-extrabold text-[11px] uppercase tracking-wider transition-colors ${
            isDarkMode ? 'text-white group-hover:text-purple-300' : 'text-slate-800 group-hover:text-purple-600'
          }`}>
            {tData.addUrl}
          </span>
        </motion.button>

        {/* Wallpapers List */}
        <AnimatePresence mode="popLayout">
          {filteredWallpapers.map((w) => {
            const isActive = currentTheme === w.url;
            const isUserUpload = userWallpapers.some((uw) => uw.id === w.id);
            return (
              <motion.div
                layout
                key={w.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group animate-fade-in"
              >
                <button
                  onClick={() => setTheme(w.url)}
                  className={`w-full aspect-video relative block rounded-2xl overflow-hidden border-2 transition-all p-0 focus:outline-none cursor-pointer ${
                    isActive 
                      ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-xl' 
                      : 'border-transparent shadow-md hover:shadow-lg'
                  }`}
                  style={{ backgroundColor: 'transparent', outline: 'none' }}
                >
                  <img
                    src={w.url}
                    className="w-full h-full object-cover rounded-[14px] group-hover:scale-105 duration-700 transition-all"
                    alt=""
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 rounded-[14px] transition-colors" />

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
                      {catMap[w.category] || w.category}
                    </span>
                  </div>
                </button>
                
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteWallpaper(w.id);
                  }}
                  className="wallpaper-card-badge absolute top-3 right-3 w-9 h-9 bg-red-500/90 hover:bg-red-600 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl z-10 cursor-pointer"
                  title={tData.deleteTitle}
                  style={{ color: '#ffffff' }}
                >
                  <Trash2 size={16} className="wallpaper-card-badge text-white stroke-white" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
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
            className="relative z-10 GeekTabs-card p-6 sm:p-8 rounded-3xl w-full max-w-md shadow-2xl border border-indigo-200 dark:border-white/10"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">{tData.saveWallpaper}</h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-white/50 mb-6">
              {uploadMode === 'file' ? tData.chooseCategory : tData.enterUrl}
            </p>

            <form onSubmit={confirmUpload} className="space-y-4 sm:space-y-5">
              {/* URL Input if Add via URL */}
              {uploadMode === 'url' ? (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 font-bold">
                    {tData.enterUrl}
                  </label>
                  <input
                    type="url"
                    required
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder={tData.urlPlaceholder}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 rounded-2xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono shadow-inner"
                  />
                </div>
              ) : (
                pendingUploadData && (
                  <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-300 dark:border-white/10 shadow-inner">
                    <img src={pendingUploadData} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )
              )}

              {/* Category Selector */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 font-bold">
                  {tData.categoryName}
                </label>
                <div className="relative">
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 rounded-2xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer pr-10 text-xs font-semibold shadow-inner"
                  >
                    {categories
                      .filter((c) => c !== 'All' && c !== 'My Uploads')
                      .map((c) => (
                        <option key={c} value={c} className="text-black bg-white font-semibold">
                          {catMap[c] || c}
                        </option>
                      ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-white/40">
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
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-white rounded-2xl transition-all font-bold cursor-pointer"
                >
                  {tData.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
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
        onConfirm={() => confirmDeleteWallpaper && handleDeleteWallpaper(confirmDeleteWallpaper)}
        onCancel={() => setConfirmDeleteWallpaper(null)}
      />
    </motion.div>
  );
}
