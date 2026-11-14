import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Search, X, FileText, PanelLeft, PanelLeftClose } from 'lucide-react';
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
  { id: 'sec-quick', name: 'Quick Notes', color: '#4f46e5' },    // Royal Indigo
  { id: 'sec-ideas', name: 'Creative Ideas', color: '#10b981' },  // Emerald
  { id: 'sec-personal', name: 'Personal Log', color: '#3b82f6' }, // Blue
  { id: 'sec-work', name: 'Work Log', color: '#8b5cf6' }         // Purple
];

const SECTION_COLORS = [
  '#4f46e5', '#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'
];

export interface NotesTabProps {
  language?: string;
}

const NOTES_T: Record<string, Record<string, string>> = {
  English: {
    cancel: 'CANCEL',
    create: 'CREATE',
    activeSpaces: 'active spaces',
    sheetsList: 'Notes',
    filterSheets: 'Filter notes...',
    noPageEntries: 'No notes in this section',
    untitledPage: 'Untitled Note',
    noAdditionalText: 'No additional text',
    addNewPage: 'CREATE NOTE',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'Enter Note Title...',
    noNotebook: 'No Note Selected',
    createNotesDesc: 'Create notes, organize folders, and build formatted workspace sheets.',
    createPage: 'CREATE NOTE',
    sections: 'Sections'
  },
  Spanish: {
    cancel: 'CANCELAR',
    create: 'CREAR',
    activeSpaces: 'espacios activos',
    sheetsList: 'Notas',
    filterSheets: 'Filtrar notas...',
    noPageEntries: 'Sin notas en esta sección',
    untitledPage: 'Nota sin título',
    noAdditionalText: 'Sin texto adicional',
    addNewPage: 'CREAR NOTA',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'Introducir título...',
    noNotebook: 'Ninguna nota seleccionada',
    createNotesDesc: 'Crea notas, organiza carpetas y diseña hojas de trabajo con formato.',
    createPage: 'CREAR NOTA',
    sections: 'Secciones'
  },
  French: {
    cancel: 'ANNULER',
    create: 'CRÉER',
    activeSpaces: 'espaces actifs',
    sheetsList: 'Notes',
    filterSheets: 'Filtrer les notes...',
    noPageEntries: 'Aucune note dans cette section',
    untitledPage: 'Note sans titre',
    noAdditionalText: 'Aucun texte supplémentaire',
    addNewPage: 'CRÉER UNE NOTE',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'Saisir le titre...',
    noNotebook: 'Aucune note sélectionnée',
    createNotesDesc: 'Créez des notes, organisez les dossiers et concevez des feuilles de travail.',
    createPage: 'CRÉER UNE NOTE',
    sections: 'Sections'
  },
  German: {
    cancel: 'ABBRECHEN',
    create: 'ERSTELLEN',
    activeSpaces: 'aktive Bereiche',
    sheetsList: 'Notizen',
    filterSheets: 'Notizen filtern...',
    noPageEntries: 'Keine Notizen in diesem Bereich',
    untitledPage: 'Unbenannte Notiz',
    noAdditionalText: 'Kein weiterer Text',
    addNewPage: 'NOTIZ ERSTELLEN',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'Notiztitel eingeben...',
    noNotebook: 'Keine Notiz ausgewählt',
    createNotesDesc: 'Erstellen Sie Notizen, organisiere Sie Ordner und strukturieren Sie Arbeitsblätter.',
    createPage: 'NOTIZ ERSTELLEN',
    sections: 'Bereiche'
  },
  Chinese: {
    cancel: '取消',
    create: '创建',
    activeSpaces: '个活跃分区',
    sheetsList: '笔记',
    filterSheets: '搜索过滤笔记...',
    noPageEntries: '当前分区暂无笔记',
    untitledPage: '无标题笔记',
    noAdditionalText: '暂无附加文本',
    addNewPage: '创建笔记',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: '输入笔记标题...',
    noNotebook: '未选择任何笔记',
    createNotesDesc: '在此记录您的灵感日记、策划方案或个人备忘，分区随心整理。',
    createPage: '创建笔记',
    sections: '分区'
  },
  Japanese: {
    cancel: 'キャンセル',
    create: '作成',
    activeSpaces: '個のアクティブ領域',
    sheetsList: 'ノート',
    filterSheets: 'ノートを絞り込む...',
    noPageEntries: 'このセクションにノートがありません',
    untitledPage: '無題のノート',
    noAdditionalText: '追加テキストなし',
    addNewPage: 'ノートを作成',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'ノートタイトルを入力...',
    noNotebook: 'ノートが選択されていません',
    createNotesDesc: 'ノートを作成し、フォルダーを整理し、フォーマットされたシートを構築します。',
    createPage: 'ノートを作成',
    sections: 'セクション'
  },
  Korean: {
    cancel: '취소',
    create: '생성',
    activeSpaces: '개의 활성 공간',
    sheetsList: '노트',
    filterSheets: '노트 필터링...',
    noPageEntries: '이 섹션에 노트가 없습니다',
    untitledPage: '제목 없는 노트',
    noAdditionalText: '추가 텍스트 없음',
    addNewPage: '노트 만들기',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: '노트 제목 입력...',
    noNotebook: '선택된 노트가 없습니다',
    createNotesDesc: '메모를 작성하고 폴더 탭을 구성하며 시트를 편집해보세요.',
    createPage: '노트 만들기',
    sections: '섹션'
  },
  Italian: {
    cancel: 'ANNULLA',
    create: 'CREA',
    activeSpaces: 'spazi attivi',
    sheetsList: 'Note',
    filterSheets: 'Filtra note...',
    noPageEntries: 'Nessuna nota in questa sezione',
    untitledPage: 'Nota senza titolo',
    noAdditionalText: 'Nessun testo aggiuntivo',
    addNewPage: 'CREA NOTA',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'Inserisci titolo nota...',
    noNotebook: 'Nessuna nota selezionata',
    createNotesDesc: 'Crea note, organizza schede e costruisci fogli di lavoro formattati.',
    createPage: 'CREA NOTA',
    sections: 'Sezioni'
  },
  Russian: {
    cancel: 'ОТМЕНА',
    create: 'СОЗДАТЬ',
    activeSpaces: 'активных областей',
    sheetsList: 'Заметки',
    filterSheets: 'Фильтр заметок...',
    noPageEntries: 'В этом разделе нет заметок',
    untitledPage: 'Заметка без названия',
    noAdditionalText: 'Нет дополнительного текста',
    addNewPage: 'СОЗДАТЬ ЗАМЕТКУ',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'Введите название заметки...',
    noNotebook: 'Заметка не выбрана',
    createNotesDesc: 'Создавайте заметки, упорядочивайте вкладки папок и форматируйте рабочие листы.',
    createPage: 'СОЗДАТЬ ЗАМЕТКУ',
    sections: 'Разделы'
  },
  Luxembourgish: {
    cancel: 'OFBRIECHEN',
    create: 'ERSTELLEN',
    activeSpaces: 'aktiv Beräicher',
    sheetsList: 'Notizen',
    filterSheets: 'Notize filteren...',
    noPageEntries: 'Keng Notizen an dësem Beräich',
    untitledPage: 'Onbenannte Notiz',
    noAdditionalText: 'Keen zousätzlechen Text',
    addNewPage: 'NOTIZ ERSTELLEN',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'Notizentitel aginn...',
    noNotebook: 'Keng Notiz ausgewielt',
    createNotesDesc: 'Erstellt Notizen, organiséiert Ordneren an designt formatéiert Blieder.',
    createPage: 'NOTIZ ERSTELLEN',
    sections: 'Beräicher'
  }
};

export default function NotesTab({ language = 'English' }: NotesTabProps = {}) {
  const dictionary = NOTES_T[language] || NOTES_T['English'];

  const [sections, setSections] = useLocalStorage<Section[]>('GeekTabs-one-sections', DEFAULT_SECTIONS);
  const [notes, setNotes] = useLocalStorage<Note[]>('GeekTabs-one-notes', []);

  // One-time upgrade: ensure all 4 default folders exist in order
  useEffect(() => {
    let updated = false;
    const newSecs = sections.map(sec => {
      if (sec.id === 'sec-work' && sec.name === 'Work Project') {
        updated = true;
        return { ...sec, name: 'Work Log', color: '#8b5cf6' };
      }
      return sec;
    });

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
  };

  const handleDeleteSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sections.length <= 1) {
      alert('You must have at least one notebook section.');
      return;
    }
    const filtered = sections.filter(s => s.id !== id);
    setSections(filtered);
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
    return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const currentSectionInfo = sections.find(s => s.id === currentSectionId);

  return (
    <div className="notes-tab-container w-full h-full flex flex-row overflow-hidden relative z-10 bg-white/85 dark:bg-[#0c1017]/85 text-slate-800 dark:text-slate-100">
      
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (Gemini Chat Style) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:relative transition-[transform,width] duration-300 ease-in-out shrink-0 h-full flex flex-col border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0e131d]/95 md:bg-black/[0.02] md:dark:bg-black/30 backdrop-blur-2xl ${
          mobileSidebarOpen 
            ? 'w-80 translate-x-0 shadow-2xl border-r' 
            : sidebarOpen 
              ? 'w-80 -translate-x-full md:translate-x-0 md:w-80 border-r opacity-100' 
              : 'w-0 -translate-x-full md:translate-x-0 md:w-0 border-r-0 opacity-0 overflow-hidden pointer-events-none'
        }`}
      >
        {/* Top of Sidebar: Action Button */}
        <div className="p-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              handleCreateNote();
              if (typeof window !== 'undefined' && window.innerWidth < 768) setMobileSidebarOpen(false);
            }}
            style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
            className="notes-create-page-btn w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#4f46e5] hover:bg-[#4338ca] !text-white text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#4f46e5]/35 transition-colors cursor-pointer active:scale-98 select-none"
          >
            <Plus size={15} strokeWidth={3} className="!text-white text-white" style={{ stroke: '#ffffff' }} />
            <span className="!text-white text-white font-black tracking-wider" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dictionary.addNewPage}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer shrink-0"
            title="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section / Folder Chips Selector - Exactly 2 options per line */}
        <div className="px-4 pt-3 pb-2 border-b border-black/5 dark:border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white/70">
              {dictionary.sections}
            </span>
            <button
              type="button"
              onClick={() => setIsCreatingSection(!isCreatingSection)}
              className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-[#4f46e5]/10 text-slate-600 dark:text-white/70 hover:text-[#4f46e5] border border-black/5 dark:border-white/10 cursor-pointer text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs"
              title="Add Section"
            >
              <Plus size={11} strokeWidth={2.5} />
              <span>New</span>
            </button>
          </div>

          {/* New Section Inline Creator */}
          <AnimatePresence>
            {isCreatingSection && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleCreateSection}
                className="overflow-hidden flex flex-col gap-2 pt-1 pb-2"
              >
                <input
                  autoFocus
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Section name..."
                  className="w-full bg-white dark:bg-black/30 border border-black/10 dark:border-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 focus:border-[#4f46e5] text-slate-900 dark:text-white"
                />
                <div className="flex gap-1.5 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCreatingSection(false)}
                    style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                    className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-black/20 dark:bg-white/10 hover:bg-black/30 dark:hover:bg-white/20 !text-white text-white cursor-pointer"
                  >
                    <span className="!text-white text-white font-bold" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dictionary.cancel}</span>
                  </button>
                  <button
                    type="submit"
                    disabled={!newSectionName.trim()}
                    style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                    className="notes-create-page-btn px-3 py-1 bg-[#4f46e5] hover:bg-[#4338ca] !text-white text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-shadow disabled:opacity-45 cursor-pointer shadow-sm shadow-[#4f46e5]/25"
                  >
                    <span className="!text-white text-white font-black" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dictionary.create}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Sections Grid - Exactly 2 options per line */}
          <div className="grid grid-cols-2 gap-2 pt-1 pb-1">
            {sections.map((sec) => {
              const active = currentSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    const secNotes = notes.filter(n => (n.sectionId || 'sec-quick') === sec.id);
                    setActiveNoteId(secNotes[0]?.id || null);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border select-none min-w-0 ${
                    active
                      ? 'bg-[#4f46e5]/15 text-[#4f46e5] dark:text-indigo-400 border-[#4f46e5]/30 shadow-2xs'
                      : 'bg-black/5 dark:bg-white/5 border-transparent text-slate-600 dark:text-white/60 hover:text-slate-900 hover:dark:text-white hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                  title={sec.name}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sec.color }} />
                  <span className="truncate">{sec.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-black/5 dark:border-white/5">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" size={13} />
            <input
              type="text"
              placeholder={dictionary.filterSheets}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-black/5 dark:bg-white/5 text-xs text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 focus:border-[#4f46e5] placeholder-slate-400 dark:placeholder-white/40"
            />
          </div>
        </div>

        {/* Note Pages List in Section */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-thin">
          <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white/70">
            {dictionary.sheetsList}
          </div>

          {filteredNotes.length === 0 ? (
            <div className="p-6 text-center text-xs font-semibold text-slate-400 dark:text-white/40 select-none">
              {dictionary.noPageEntries}
            </div>
          ) : (
            filteredNotes.map((note) => {
              const active = activeNoteId === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setActiveNoteId(note.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`group relative w-full flex flex-col p-3 rounded-xl cursor-pointer text-left transition-colors border ${
                    active
                      ? 'bg-[#4f46e5]/15 text-[#4f46e5] dark:text-indigo-400 border-[#4f46e5]/30 shadow-xs'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 border-transparent text-slate-700 dark:text-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs truncate leading-snug text-emerald-600 dark:text-emerald-400">
                      {note.title.trim() || dictionary.untitledPage}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 text-neutral-400 hover:text-red-500 rounded transition-all shrink-0 cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <span className="notes-item-datetime text-[10px] font-mono text-black dark:text-white/85 mt-1.5 flex items-center gap-1">
                    {formatDate(note.updatedAt)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-black/10 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-white/45 flex items-center justify-between select-none">
          <span className="text-[11px] uppercase tracking-wider font-bold">
            {filteredNotes.length} {dictionary.sheetsList}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5">
            {currentSectionInfo?.name}
          </span>
        </div>
      </aside>

      {/* RIGHT CONTENT EDITOR PANE - Always Pure Solid White */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-white text-slate-900">
        
        {/* Workspace Top Header Bar */}
        <header className="h-16 px-6 sm:px-8 border-b border-black/10 flex items-center justify-between shrink-0 bg-white">
          {/* Left: Sidebar Toggle Button (Hide / Show) */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setMobileSidebarOpen(prev => !prev);
                } else {
                  setSidebarOpen(prev => !prev);
                }
              }}
              className="p-2.5 rounded-xl hover:bg-black/5 text-slate-700 transition-colors cursor-pointer flex items-center justify-center border border-transparent hover:border-black/5"
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>
          </div>

          {/* Centered section title */}
          <div className="flex items-center justify-center">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              {currentSectionInfo?.name || 'Quick Notes'}
            </h2>
          </div>

          {/* Right side: Note update date & delete icon */}
          <div className="flex items-center gap-2 shrink-0">
            {activeNote ? (
              <>
                <span className="text-[11px] font-mono opacity-60 text-slate-700">
                  {formatDate(activeNote.updatedAt)}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDeleteNote(activeNote.id, e)}
                  className="p-2 hover:bg-red-500/10 text-neutral-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
                  title="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <div className="w-10 pointer-events-none" />
            )}
          </div>
        </header>

        {/* Main Writing Canvas */}
        <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-white">
          {activeNote ? (
            <div className="flex-1 flex flex-col h-full px-6 sm:px-12 lg:px-16 py-6 sm:py-8 overflow-hidden">
              
              {/* Note Title Input with Modern Underline */}
              <div className="relative mb-5 shrink-0">
                <input
                  type="text"
                  className="w-full text-2xl sm:text-3xl font-black bg-transparent outline-none pb-2 text-emerald-600 placeholder-neutral-300 tracking-tight"
                  value={activeNote.title}
                  onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                  placeholder={dictionary.enterPageTitle}
                />
                <div className="h-[2px] w-full bg-linear-to-r from-[#4f46e5] to-[#7c3aed] rounded-full opacity-60" />
              </div>

              {/* Rich TipTap Editor filling the canvas */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <TipTapEditor
                  key={activeNote.id}
                  content={activeNote.content}
                  onChange={(content) => updateNote(activeNote.id, { content })}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none">
              <div className="w-16 h-16 rounded-2xl bg-[#4f46e5]/10 flex items-center justify-center text-[#4f46e5] mb-4">
                <FileText size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-1">
                {dictionary.noNotebook}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mb-4">
                {dictionary.createNotesDesc}
              </p>
              <button
                type="button"
                onClick={handleCreateNote}
                style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                className="notes-create-page-btn px-6 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] !text-white text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-[#4f46e5]/35 active:scale-98 cursor-pointer select-none"
              >
                <span className="!text-white text-white font-black" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dictionary.createPage}</span>
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
