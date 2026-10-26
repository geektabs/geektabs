import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Search, Edit3, ChevronLeft, Calendar as CalendarIcon, FolderOpen, Layers, FileText, ChevronRight, LayoutGrid } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import TipTapEditor from './TipTapEditor';

interface Section {
  id: string;
  name: string;
  color: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  sectionId: string;
}

const DEFAULT_SECTIONS: Section[] = [
  { id: 'sec-quick', name: 'Quick Notes', color: '#0ea5e9' },    // Light Blue
  { id: 'sec-ideas', name: 'Creative Ideas', color: '#10b981' },  // Emerald
  { id: 'sec-personal', name: 'Personal Log', color: '#3b82f6' }, // Blue
  { id: 'sec-work', name: 'Work Log', color: '#8b5cf6' }         // Purple
];

const SECTION_COLORS = [
  '#0ea5e9', '#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'
];

export interface NotesTabProps {
  language?: string;
}

const NOTES_T: Record<string, Record<string, string>> = {
  English: {
    cancel: 'Cancel',
    create: 'Create',
    activeSpaces: 'active spaces',
    sheetsList: 'Sheets List',
    filterSheets: 'Filter sheets...',
    noPageEntries: 'No Page entries',
    untitledPage: 'Untitled Page',
    noAdditionalText: 'No additional text',
    addNewPage: 'Add New Page',
    oneNoteWorkspace: 'OneNote Workspace',
    enterPageTitle: 'Enter Page Title',
    noNotebook: 'No Notebook',
    createNotesDesc: 'Create notes, organize folder tabs, and build formatted workspace sheets.',
    createPage: 'Create Page'
  },
  Spanish: {
    cancel: 'Cancelar',
    create: 'Crear',
    activeSpaces: 'espacios activos',
    sheetsList: 'Lista de hojas',
    filterSheets: 'Filtrar hojas...',
    noPageEntries: 'Sin entradas de página',
    untitledPage: 'Página sin título',
    noAdditionalText: 'Sin texto adicional',
    addNewPage: 'Agregar nueva página',
    oneNoteWorkspace: 'Espacio de OneNote',
    enterPageTitle: 'Introducir título',
    noNotebook: 'Sin bloc de notas',
    createNotesDesc: 'Crea notas, organiza carpetas y diseña hojas de trabajo con formato.',
    createPage: 'Crear página'
  },
  French: {
    cancel: 'Annuler',
    create: 'Créer',
    activeSpaces: 'espaces actifs',
    sheetsList: 'Liste des pages',
    filterSheets: 'Filtrer les pages...',
    noPageEntries: 'Aucune page',
    untitledPage: 'Page sans titre',
    noAdditionalText: 'Aucun texte supplémentaire',
    addNewPage: 'Ajouter une nouvelle page',
    oneNoteWorkspace: 'Espace OneNote',
    enterPageTitle: 'Saisir le titre de la page',
    noNotebook: 'Aucun bloc-notes',
    createNotesDesc: 'Créez des notes, organisez les onglets et concevez des feuilles de travail.',
    createPage: 'Créer une page'
  },
  German: {
    cancel: 'Abbrechen',
    create: 'Erstellen',
    activeSpaces: 'aktive Bereiche',
    sheetsList: 'Seitenliste',
    filterSheets: 'Seiten filtern...',
    noPageEntries: 'Keine Einträge',
    untitledPage: 'Unbenannte Seite',
    noAdditionalText: 'Kein weiterer Text',
    addNewPage: 'Neue Seite hinzufügen',
    oneNoteWorkspace: 'OneNote-Arbeitsbereich',
    enterPageTitle: 'Seitentitel eingeben',
    noNotebook: 'Kein Notizbuch',
    createNotesDesc: 'Erstellen Sie Notizen, organisieren Sie Ordner-Tabs und strukturieren Sie Arbeitsblätter.',
    createPage: 'Seite erstellen'
  },
  Chinese: {
    cancel: '取消',
    create: '创建',
    activeSpaces: '个活跃分区',
    sheetsList: '页面清单',
    filterSheets: '过滤筛选页面...',
    noPageEntries: '暂无页面条目',
    untitledPage: '无标题页面',
    noAdditionalText: '暂无附加文本',
    addNewPage: '添加新页面',
    oneNoteWorkspace: 'OneNote 笔记本空间',
    enterPageTitle: '输入页面标题',
    noNotebook: '暂无笔记本页面',
    createNotesDesc: '在此记录您的灵感日记、策划方案 or 个人备忘，多分区随心整理。',
    createPage: '创建首个页面'
  },
  Japanese: {
    cancel: 'キャンセル',
    create: '作成',
    activeSpaces: '個のアクティブ領域',
    sheetsList: 'ページ一覧',
    filterSheets: 'ページを絞り込む...',
    noPageEntries: 'ページがありません',
    untitledPage: '無題のページ',
    noAdditionalText: '追加テキストなし',
    addNewPage: '新規ページを追加',
    oneNoteWorkspace: 'OneNote ワークスペース',
    enterPageTitle: 'ページタイトルを入力',
    noNotebook: 'ノートブックがありません',
    createNotesDesc: 'ノートを作成し、フォルダータブを整理し、フォーマットされたシートを構築します。',
    createPage: 'ページを作成'
  },
  Korean: {
    cancel: '취소',
    create: '생성',
    activeSpaces: '개의 활성 공간',
    sheetsList: '시트 목록',
    filterSheets: '시트 필터링...',
    noPageEntries: '페이지가 없습니다',
    untitledPage: '제목 없는 페이지',
    noAdditionalText: '추가 텍스트 없음',
    addNewPage: '새 페이지 추가',
    oneNoteWorkspace: 'OneNote 작업 공간',
    enterPageTitle: '페이지 제목 입력',
    noNotebook: '노트가 없습니다',
    createNotesDesc: '메모를 작성하고 폴더 탭을 구성하며 시트를 편집해보세요.',
    createPage: '페이지 만들기'
  },
  Italian: {
    cancel: 'Annulla',
    create: 'Crea',
    activeSpaces: 'spazi attivi',
    sheetsList: 'Elenco fogli',
    filterSheets: 'Filtra fogli...',
    noPageEntries: 'Nessun foglio',
    untitledPage: 'Pagina senza titolo',
    noAdditionalText: 'Nessun testo aggiuntivo',
    addNewPage: 'Aggiungi nuova pagina',
    oneNoteWorkspace: 'Spazio OneNote',
    enterPageTitle: 'Inserisci titolo pagina',
    noNotebook: 'Nessun taccuino',
    createNotesDesc: 'Crea note, organizza schede e costruisci fogli di lavoro formattati.',
    createPage: 'Crea pagina'
  },
  Russian: {
    cancel: 'Отмена',
    create: 'Создать',
    activeSpaces: 'активных областей',
    sheetsList: 'Список страниц',
    filterSheets: 'Фильтр страниц...',
    noPageEntries: 'Нет страниц',
    untitledPage: 'Страница без названия',
    noAdditionalText: 'Нет дополнительного текста',
    addNewPage: 'Добавить новую страницу',
    oneNoteWorkspace: 'Пространство OneNote',
    enterPageTitle: 'Введите название страницы',
    noNotebook: 'Нет записей',
    createNotesDesc: 'Создавайте заметки, упорядочивайте вкладки папок и форматируйте рабочие листы.',
    createPage: 'Создать страницу'
  },
  Luxembourgish: {
    cancel: 'Ofbriechen',
    create: 'Erstellen',
    activeSpaces: 'aktiv Beräicher',
    sheetsList: 'Säitelëscht',
    filterSheets: 'Säite filteren...',
    noPageEntries: 'Keng Säiten',
    untitledPage: 'Onbenannte Säit',
    noAdditionalText: 'Keen zousätzlechen Text',
    addNewPage: 'Nei Säit derbäisetzen',
    oneNoteWorkspace: 'OneNote Aarbechtsberäich',
    enterPageTitle: 'Säitentitel aginn',
    noNotebook: 'Keen Notizbuch',
    createNotesDesc: 'Erstellt Notizen, organiséiert Ordneren an designt formatéiert Blieder.',
    createPage: 'Säit erstellen'
  }
};

export default function NotesTab({ language = 'English' }: NotesTabProps = {}) {
  const dictionary = NOTES_T[language] || NOTES_T['English'];

  const [sections, setSections] = useLocalStorage<Section[]>('GeekTabs-one-sections', DEFAULT_SECTIONS);
  const [notes, setNotes] = useLocalStorage<Note[]>('GeekTabs-one-notes', []);

  // One-time upgrade: if user has old "Work Project" folder, rename to "Work Log" and ensure all 4 default folders exist in order
  useEffect(() => {
    let updated = false;
    const newSecs = sections.map(sec => {
      if (sec.id === 'sec-work' && sec.name === 'Work Project') {
        updated = true;
        return { ...sec, name: 'Work Log', color: '#8b5cf6' };
      }
      return sec;
    });

    // If any of the four default folders are missing, add them
    DEFAULT_SECTIONS.forEach(defSec => {
      if (!newSecs.some(s => s.name.toLowerCase() === defSec.name.toLowerCase() || s.id === defSec.id)) {
        newSecs.push(defSec);
        updated = true;
      }
    });

    if (updated) {
      setSections(newSecs);
    }
  }, []);

  const [activeSectionId, setActiveSectionId] = useLocalStorage<string>('GeekTabs-one-active-sec', 'sec-quick');
  const [activeNoteId, setActiveNoteId] = useLocalStorage<string | null>('GeekTabs-one-active-note', null);
  
  const [newSectionName, setNewSectionName] = useState('');
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [mobileSubView, setMobileSubView] = useState<'sections' | 'pages' | 'editor'>('sections');

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobileView(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ensure activeSectionId fallback exists
  const activeSectionExists = sections.some(s => s.id === activeSectionId);
  const currentSectionId = activeSectionExists ? activeSectionId : (sections[0]?.id || 'sec-quick');

  const notesBySection = notes.filter(n => (n.sectionId || 'sec-quick') === currentSectionId);
  const activeNote = notes.find(n => n.id === activeNoteId && (n.sectionId || 'sec-quick') === currentSectionId) || notesBySection[0];

  // Sync activeNoteId if it gets lost
  useEffect(() => {
    if (activeNote && activeNote.id !== activeNoteId) {
      setActiveNoteId(activeNote.id);
    }
  }, [activeNote, activeNoteId, setActiveNoteId]);

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    const newSec: Section = {
      id: 'sec-' + Date.now().toString(),
      name: newSectionName.trim(),
      color: SECTION_COLORS[sections.length % SECTION_COLORS.length]
    };
    setSections([...sections, newSec]);
    setActiveSectionId(newSec.id);
    setNewSectionName('');
    setIsCreatingSection(false);
    if (isMobileView) setMobileSubView('pages');
  };

  const handleDeleteSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sections.length <= 1) {
      alert('You must have at least one notebook section.');
      return;
    }
    const filtered = sections.filter(s => s.id !== id);
    setSections(filtered);
    
    // Delete orphan notes or move them
    setNotes(notes.filter(n => n.sectionId !== id));
    
    if (activeSectionId === id) {
      setActiveSectionId(filtered[0].id);
    }
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: 'note-' + Date.now().toString(),
      title: '',
      content: '',
      updatedAt: Date.now(),
      sectionId: currentSectionId,
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    if (isMobileView) setMobileSubView('editor');
  };

  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (activeNoteId === id) {
      const nextNote = updated.find(n => (n.sectionId || 'sec-quick') === currentSectionId);
      setActiveNoteId(nextNote ? nextNote.id : null);
    }
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => {
      if (n.id === id) {
        return { ...n, ...updates, updatedAt: Date.now() };
      }
      return n;
    }));
  };

  const filteredNotes = notesBySection.filter(n => {
    const strippedContent = n.content ? n.content.replace(/<[^>]*>?/gm, '') : '';
    return n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           strippedContent.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const currentSectionInfo = sections.find(s => s.id === currentSectionId);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 relative z-10 p-0 sm:p-4">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <Layers size={22} className="text-indigo-500 fill-indigo-500/10" />
          <h1 className="text-xl font-bold tracking-tight uppercase word-color">
            OneNote <span className="text-indigo-500 font-black">Workspace</span>
          </h1>
        </div>
      </div>

      {/* Main Container - Card-less Split pane layout */}
      <div className="notes-tab-container w-full h-[620px] lg:h-[700px] flex gap-1 GeekTabs-card webcard-light-grey-bg rounded-[2rem] overflow-hidden transition-all">
        
        {/* PANEL 1: SECTIONS LIST (OneNote Column #1) */}
        {(!isMobileView || mobileSubView === 'sections') && (
          <div className="notes-sections-panel w-full lg:w-60 h-full flex flex-col bg-black/5 dark:bg-white/5 border-r border-black/5 dark:border-white/5 relative z-10">
            {/* Header */}
            <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Sections Portfolio</span>
              <button 
                onClick={() => setIsCreatingSection(!isCreatingSection)}
                className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors"
                title="Add Section"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Custom Section Creator */}
            <AnimatePresence>
              {isCreatingSection && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleCreateSection}
                  className="p-3 bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5 overflow-hidden flex flex-col gap-2"
                >
                  <input
                    autoFocus
                    type="text"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="New section name..."
                    className="w-full bg-white dark:bg-[#18191e] border border-black/10 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex gap-2 justify-end">
                    <button 
                      type="button" 
                      onClick={() => setIsCreatingSection(false)}
                      className="px-2.5 py-1 text-[10px] font-bold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-100"
                    >
                      {dictionary.cancel}
                    </button>
                    <button 
                      type="submit" 
                      disabled={!newSectionName.trim()}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold transition-shadow disabled:opacity-45"
                    >
                      {dictionary.create}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Notebook Section Navigation List */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-none">
              {sections.map((sec) => {
                const count = notes.filter(n => (n.sectionId || 'sec-quick') === sec.id).length;
                const active = currentSectionId === sec.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => {
                      setActiveSectionId(sec.id);
                      const secNotes = notes.filter(n => (n.sectionId || 'sec-quick') === sec.id);
                      if (secNotes.length > 0) {
                        setActiveNoteId(secNotes[0].id);
                      } else {
                        setActiveNoteId(null);
                      }
                      if (isMobileView) setMobileSubView('pages');
                    }}
                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-semibold text-xs leading-normal relative cursor-pointer select-none ${
                      active 
                        ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold border border-transparent' 
                        : 'text-slate-700 dark:text-white/60 hover:text-indigo-500 hover:bg-indigo-500/5'
                    }`}
                  >
                    {/* Left vertical color indicator tag characteristic of OneNote */}
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-md transition-colors" style={{ backgroundColor: sec.color }} />
                    
                    <div className="flex items-center gap-2 pl-1.5 min-w-0 pr-2">
                       <FolderOpen size={14} className="opacity-70 flex-shrink-0" />
                      <span className="truncate">{sec.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {active && sections.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteSection(sec.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-black/5 dark:hover:bg-white/5 hover:text-red-500 rounded transition-all"
                          title="Delete area"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5 opacity-55 font-black">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer with summary */}
            <div className="p-3.5 border-t border-black/5 dark:border-white/5 text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold text-center select-none">
              {sections.length} {dictionary.activeSpaces}
            </div>
          </div>
        )}

        {/* PANEL 2: PAGES LIST IN SECTION (OneNote Column #2) */}
        {(!isMobileView || mobileSubView === 'pages') && (
          <div className="notes-pages-panel w-full lg:w-64 h-full flex flex-col bg-black/5 dark:bg-[#18191e]/35 border-r border-black/5 dark:border-white/5 relative z-10">
            {/* Header metadata */}
            <div className="p-4 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center justify-between mb-3">
                {isMobileView && (
                  <button 
                    onClick={() => setMobileSubView('sections')} 
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400"
                  >
                    <ChevronLeft size={16} /> Portfolio
                  </button>
                )}
                <span className="text-[10px] font-black uppercase tracking-widest opacity-45">{dictionary.sheetsList}</span>
                <button 
                  onClick={handleCreateNote}
                  className="p-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                  title="Add Page"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Search in Section Bar */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={12} />
                <input
                  type="text"
                  placeholder={dictionary.filterSheets}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-black/5 dark:bg-white/5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Note pages inside Section */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-none space-y-1">
              {filteredNotes.length === 0 ? (
                <div className="p-8 text-center text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-white/60 select-none">
                  {dictionary.noPageEntries}
                </div>
              ) : (
                filteredNotes.map(note => {
                  const active = activeNoteId === note.id;
                  const plainText = note.content ? note.content.replace(/<[^>]*>?/gm, '').trim() : '';
                  return (
                    <button
                      key={note.id}
                      onClick={() => {
                        setActiveNoteId(note.id);
                        if (isMobileView) setMobileSubView('editor');
                      }}
                      className={`w-full flex flex-col p-3 rounded-xl cursor-pointer text-left transition-all ${
                        active 
                          ? 'bg-indigo-500/10 dark:bg-white/10 border-l border-l-indigo-500' 
                          : 'hover:bg-black/5 dark:hover:bg-white/5 border-l border-l-transparent'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-850 dark:text-white/90 line-clamp-1 mb-1 relative pr-4 w-full">
                        {note.title.trim() || dictionary.untitledPage}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-white/40 truncate w-full font-medium">
                        {plainText || dictionary.noAdditionalText}
                      </div>
                      <span className="text-[8px] opacity-35 mt-1 font-mono">{formatDate(note.updatedAt)}</span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with Action */}
            <button
              onClick={handleCreateNote}
              className="p-3 border-t border-black/5 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest text-[#4f46e5] dark:text-indigo-400 hover:bg-indigo-500/5 flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <Plus size={14} /> {dictionary.addNewPage}
            </button>
          </div>
        )}

        {/* PANEL 3: WRITING CANVAS (OneNote Column #3) */}
        {(!isMobileView || mobileSubView === 'editor') && (
          <div className="flex-1 h-full flex flex-col bg-white/[0.02] dark:bg-black/[0.04] relative z-10 min-w-0">
            {activeNote ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Editor Header Navigation Controls */}
                <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-6 shrink-0 bg-transparent">
                  <div>
                    {isMobileView && (
                      <button 
                        onClick={() => setMobileSubView('pages')} 
                        className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                      >
                        <ChevronLeft size={16} /> Pages
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono opacity-50 text-slate-700 dark:text-white hidden sm:inline-block">
                      {formatDate(activeNote.updatedAt)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => handleDeleteNote(activeNote.id, e)} 
                        className="p-2 hover:bg-red-500/10 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors"
                        title="Delete page"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        onClick={handleCreateNote} 
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 rounded-lg transition-colors"
                        title="New page"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Editor Writing Area */}
                <div className="flex-1 flex flex-col px-6 sm:px-10 py-6 overflow-hidden">
                  {/* Notebook path indicator block */}
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400/80 mb-3 select-none">
                    <span>{dictionary.oneNoteWorkspace}</span>
                    <ChevronRight size={10} />
                    <span>{currentSectionInfo?.name}</span>
                  </div>

                  {/* Note Title Input with Classic OneNote Bold Title Line */}
                  <div className="relative mb-6">
                    <input 
                      type="text"
                      className="w-full text-2xl sm:text-3xl font-black bg-transparent outline-none pb-2 text-slate-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 tracking-tight"
                      value={activeNote.title}
                      onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                      placeholder={dictionary.enterPageTitle}
                    />
                    <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-[#2563eb]" />
                  </div>

                  {/* Rich Tiptap Canvas */}
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <TipTapEditor
                      key={activeNote.id}
                      content={activeNote.content}
                      onChange={(content) => updateNote(activeNote.id, { content })}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none webcard-light-grey-bg rounded-2xl transition-colors">
                <FileText strokeWidth={1} size={48} className="text-indigo-500 mb-4" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-white mb-1">{dictionary.noNotebook}</h3>
                <p className="text-xs text-slate-600 dark:text-white/60 max-w-xs">
                  {dictionary.createNotesDesc}
                </p>
                <button
                  onClick={handleCreateNote}
                  style={{ color: '#ffffff' }}
                  className="notes-create-page-btn mt-4 px-5 py-2.5 bg-indigo-600 !text-white hover:bg-indigo-700 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
                >
                  <span className="!text-white" style={{ color: '#ffffff' }}>{dictionary.createPage}</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
