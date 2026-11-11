import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, Trash2, ListTodo, Pencil, X, Inbox, Calendar, Circle, Flag, Menu, Users, CalendarDays } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmModal from '../ConfirmModal';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  project: string; // "Inbox" | "Today" | "Personal" | "Work" | "Meetings" | "Events"
  priority: 1 | 2 | 3 | 4; // 1 = High, 2 = Medium, 3 = Low, 4 = None
  description?: string;
}

const PROJECTS = [
  { id: 'Inbox', name: 'Inbox', icon: <Inbox size={16} className="text-[#4f46e5] fill-[#4f46e5]/10" /> },
  { id: 'Today', name: 'Today', icon: <Calendar size={16} className="text-[#4f46e5] fill-[#4f46e5]/10" /> },
  { id: 'Personal', name: 'Personal', icon: <Circle size={9} className="text-indigo-400 fill-indigo-400" /> },
  { id: 'Work', name: 'Work', icon: <Circle size={9} className="text-purple-400 fill-purple-400" /> },
  { id: 'Meetings', name: 'Meetings', icon: <Users size={16} className="text-blue-500 fill-blue-500/10" /> },
  { id: 'Events', name: 'Events', icon: <CalendarDays size={16} className="text-emerald-500 fill-emerald-500/10" /> },
];

const PRIORITY_COLORS = {
  1: { border: 'border-red-500', text: 'text-red-500', bg: 'bg-red-500/10', hover: 'hover:bg-red-500/20' },
  2: { border: 'border-[#4f46e5]', text: 'text-[#4f46e5]', bg: 'bg-[#4f46e5]/10', hover: 'hover:bg-[#4f46e5]/20' },
  3: { border: 'border-sky-400', text: 'text-sky-400', bg: 'bg-sky-400/10', hover: 'hover:bg-sky-400/20' },
  4: { border: 'border-neutral-400 dark:border-neutral-600', text: 'text-neutral-500', bg: 'bg-neutral-500/10', hover: 'hover:bg-neutral-500/20' }
};

export interface TodoListProps {
  language?: string;
}

const TODO_T: Record<string, Record<string, string>> = {
  English: {
    title: 'Tasks Workspace',
    subtitle: 'Cloud Planner',
    inbox: 'Inbox',
    today: 'Today',
    personal: 'Personal',
    work: 'Work',
    meetings: 'Meetings',
    events: 'Events',
    addTask: 'CREATE TASK',
    pending: 'tasks pending',
    noTasks: 'No tasks in this list.',
    addPlaceholder: 'What needs to be done?',
    descriptionPlaceholder: 'Description (optional)',
    cancel: 'CANCEL',
    save: 'SAVE',
    priority: 'Priority',
    sidebarHeader: 'Categories',
    remaining: 'remaining',
    taskSingular: 'task',
    taskPlural: 'tasks',
    noGoals: 'No Tasks in',
    clickToCreate: 'Click "CREATE TASK" to create one!',
    deleteTitle: 'Delete Task',
    deleteMessage: 'Are you sure you want to permanently delete this task?',
    taskName: 'Task name',
    description: 'Description',
    addNotes: 'Add notes or detailed description...',
    allLists: 'All Lists',
  },
  Korean: {
    title: '할 일 관리',
    subtitle: '클라우드 플래너',
    inbox: '수신함',
    today: '오늘 할 일',
    personal: '개인',
    work: '업무',
    addTask: '할 일 만들기',
    pending: '개 남음',
    noTasks: '할 일이 없습니다.',
    addPlaceholder: '어떤 일을 해야 하나요?',
    descriptionPlaceholder: '설명 (선택사항)',
    cancel: '취소',
    save: '저장',
    priority: '우선순위',
    sidebarHeader: '카테고리',
    remaining: '남음',
    taskSingular: '개',
    taskPlural: '개',
    noGoals: '할 일이 없습니다: ',
    clickToCreate: '할 일 만들기 버튼을 눌러 등록해 보세요!',
    deleteTitle: '할 일 삭제',
    deleteMessage: '이 할 일을 영구적으로 삭제하시겠습니까?',
    taskName: '할 일 이름',
    description: '설명',
    addNotes: '설명 또는 메모 추가...',
    allLists: '전체 목록',
  },
  Spanish: {
    title: 'Área de Tareas',
    subtitle: 'Planificador en la nube',
    inbox: 'Bandeja de entrada',
    today: 'Hoy',
    personal: 'Personal',
    work: 'Trabajo',
    addTask: 'CREAR TAREA',
    pending: 'tareas pendientes',
    noTasks: 'No hay tareas en esta lista.',
    addPlaceholder: '¿Qué se debe hacer?',
    descriptionPlaceholder: 'Descripción (opcional)',
    cancel: 'CANCELAR',
    save: 'GUARDAR',
    priority: 'Prioridad',
    sidebarHeader: 'Categorías',
    remaining: 'restantes',
    taskSingular: 'tarea',
    taskPlural: 'tareas',
    noGoals: 'Sin tareas en',
    clickToCreate: '¡Haz clic en CREAR TAREA para crear una!',
    deleteTitle: 'Eliminar tarea',
    deleteMessage: '¿Estás seguro de que deseas eliminar permanentemente esta tarea?',
    taskName: 'Nombre de la tarea',
    description: 'Descripción',
    addNotes: 'Agregar notas o descripción...',
    allLists: 'Todas las listas',
  },
  French: {
    title: 'Espace Tâches',
    subtitle: 'Planificateur Cloud',
    inbox: 'Boîte de réception',
    today: 'Aujourd\'hui',
    personal: 'Personnel',
    work: 'Travail',
    addTask: 'CRÉER TÂCHE',
    pending: 'tâches en attente',
    noTasks: 'Aucune tâche dans cette liste.',
    addPlaceholder: 'Que faut-il faire ?',
    descriptionPlaceholder: 'Description (optionnel)',
    cancel: 'ANNULER',
    save: 'ENREGISTRER',
    priority: 'Priorité',
    sidebarHeader: 'Catégories',
    remaining: 'restantes',
    taskSingular: 'tâche',
    taskPlural: 'tâches',
    noGoals: 'Aucune tâche dans',
    clickToCreate: 'Cliquez sur CRÉER TÂCHE pour commencer !',
    deleteTitle: 'Supprimer la tâche',
    deleteMessage: 'Voulez-vous vraiment supprimer définitivement cette tâche ?',
    taskName: 'Nom de la tâche',
    description: 'Description',
    addNotes: 'Ajouter des notes ou une description...',
    allLists: 'Toutes les listes',
  },
  German: {
    title: 'Aufgaben-Workspace',
    subtitle: 'Cloud-Planer',
    inbox: 'Posteingang',
    today: 'Heute',
    personal: 'Privat',
    work: 'Arbeit',
    addTask: 'AUFGABE ERSTELLEN',
    pending: 'Aufgaben offen',
    noTasks: 'Keine Aufgaben in dieser Liste.',
    addPlaceholder: 'Was gibt es zu tun?',
    descriptionPlaceholder: 'Beschreibung (optional)',
    cancel: 'ABBRECHEN',
    save: 'SPEICHERN',
    priority: 'Priorität',
    sidebarHeader: 'Kategorien',
    remaining: 'verbleibend',
    taskSingular: 'Aufgabe',
    taskPlural: 'Aufgaben',
    noGoals: 'Keine Aufgaben in',
    clickToCreate: 'Klicke auf AUFGABE ERSTELLEN, um eine zu erstellen!',
    deleteTitle: 'Aufgabe löschen',
    deleteMessage: 'Sind Sie sicher, dass Sie diese Aufgabe dauerhaft löschen möchten?',
    taskName: 'Aufgabenname',
    description: 'Beschreibung',
    addNotes: 'Notizen oder Beschreibung hinzufügen...',
    allLists: 'Alle Listen',
  },
  Chinese: {
    title: '任务空间',
    subtitle: '待办计划管理',
    inbox: '收件箱',
    today: '今天',
    personal: '个人',
    work: '工作',
    meetings: '会议',
    events: '事件',
    addTask: '新建任务',
    pending: '项待办',
    noTasks: '当前列表无待办任务。',
    addPlaceholder: '有什么需要做的？',
    descriptionPlaceholder: '备注描述 (选填)',
    cancel: '取消',
    save: '保存',
    priority: '优先级',
    sidebarHeader: '分类列表',
    remaining: '待完成',
    taskSingular: '个任务',
    taskPlural: '个任务',
    noGoals: '无待办任务在',
    clickToCreate: '点击新建任务来创建吧！',
    deleteTitle: '删除任务',
    deleteMessage: '您确定要永久删除该任务吗？',
    taskName: '任务名称',
    description: '备注',
    addNotes: '添加备注或详细描述...',
    allLists: '所有清单',
  },
  Japanese: {
    title: 'タスク機能',
    subtitle: 'クラウドプランナー',
    inbox: 'インボックス',
    today: '今日',
    personal: 'プライベート',
    work: 'ワーク',
    addTask: 'タスクを作成',
    pending: '件の未完了タスク',
    noTasks: 'このカテゴリーのタスクはありません。',
    addPlaceholder: '何を行いますか？',
    descriptionPlaceholder: '説明 (任意)',
    cancel: 'キャンセル',
    save: '保存',
    priority: '優先度',
    sidebarHeader: 'カテゴリー',
    remaining: '残り',
    taskSingular: '件のタスク',
    taskPlural: '件のタスク',
    noGoals: 'タスクはありません：',
    clickToCreate: '「タスクを作成」から登録できます！',
    deleteTitle: 'タスクを削除',
    deleteMessage: 'このタスクを完全に削除してもよろしいですか？',
    taskName: 'タスク名',
    description: '説明',
    addNotes: 'メモまたは説明を追加...',
    allLists: 'すべてのリスト',
  },
  Italian: {
    title: 'Spazio delle Attività',
    subtitle: 'Pianificatore Cloud',
    inbox: 'In arrivo',
    today: 'Oggi',
    personal: 'Personale',
    work: 'Lavoro',
    addTask: 'CREA ATTIVITÀ',
    pending: 'attività in sospeso',
    noTasks: 'Nessuna attività in questo elenco.',
    addPlaceholder: 'Cosa c\'è da fare?',
    descriptionPlaceholder: 'Descrizione (opzionale)',
    cancel: 'ANNULLA',
    save: 'SALVA',
    priority: 'Priorità',
    sidebarHeader: 'Categorie',
    remaining: 'rimanenti',
    taskSingular: 'attività',
    taskPlural: 'attività',
    noGoals: 'Nessun obiettivo in',
    clickToCreate: 'Fai clic su CREA ATTIVITÀ per crearne una!',
    deleteTitle: 'Elimina attività',
    deleteMessage: 'Sei sicuro di voler eliminare definitivamente questa attività?',
    taskName: 'Nome attività',
    description: 'Descrizione',
    addNotes: 'Aggiungi note o descrizione...',
    allLists: 'Tutti gli elenchi',
  },
  Russian: {
    title: 'Рабочее пространство',
    subtitle: 'Облачный планировщик',
    inbox: 'Входящие',
    today: 'Сегодня',
    personal: 'Личное',
    work: 'Работа',
    addTask: 'СОЗДАТЬ ЗАДАЧУ',
    pending: 'задач в списке',
    noTasks: 'В этом списке нет задач.',
    addPlaceholder: 'Что нужно сделать?',
    descriptionPlaceholder: 'Описание (необязательно)',
    cancel: 'ОТМЕНА',
    save: 'СОХРАНИТЬ',
    priority: 'Приоритет',
    sidebarHeader: 'Категории',
    remaining: 'осталось',
    taskSingular: 'задача',
    taskPlural: 'задач',
    noGoals: 'Нет целей в категории',
    clickToCreate: 'Нажмите «СОЗДАТЬ ЗАДАЧУ», чтобы создать ее!',
    deleteTitle: 'Удалить задачу',
    deleteMessage: 'Вы уверены, что хотите навсегда удалить эту задачу?',
    taskName: 'Название задачи',
    description: 'Описание',
    addNotes: 'Добавить примечания или описание...',
    allLists: 'Все списки',
  },
  Luxembourgish: {
    title: 'Aufgaben-Aarbechtsberäich',
    subtitle: 'Cloud Planner',
    inbox: 'Inbox',
    today: 'Haut',
    personal: 'Perséinlech',
    work: 'Aarbecht',
    addTask: 'AUFGAB ERSTELLEN',
    pending: 'Aufgaben am Waardestand',
    noTasks: 'Keng Aufgaben an dëser Lëscht.',
    addPlaceholder: 'Wat muss gemaach ginn?',
    descriptionPlaceholder: 'Beschreiwung (optional)',
    cancel: 'OFBRIECHEN',
    save: 'SPÄICHEREN',
    priority: 'Prioritéit',
    sidebarHeader: 'Kategorien',
    remaining: 'iwwereg',
    taskSingular: 'Aufgab',
    taskPlural: 'Aufgaben',
    noGoals: 'Keng Ziler an',
    clickToCreate: 'Klickt op AUFGAB ERSTELLEN fir een ze erstellen!',
    deleteTitle: 'Aufgab läschen',
    deleteMessage: 'Sidd Dir sécher, datt Dir dës Aufgab permanent läsche wëllt?',
    taskName: 'Aufgabennumm',
    description: 'Beschreiwung',
    addNotes: 'Notizen oder Beschreiwung derbäisetzen...',
    allLists: 'All Lëschten',
  }
};

const getProjectName = (id: string, lang: string) => {
  const dictionary = TODO_T[lang] || TODO_T['English'];
  switch (id) {
    case 'Inbox': return dictionary.inbox;
    case 'Today': return dictionary.today;
    case 'Personal': return dictionary.personal;
    case 'Work': return dictionary.work;
    case 'Meetings': return dictionary.meetings || (lang === 'Chinese' ? '会议' : 'Meetings');
    case 'Events': return dictionary.events || (lang === 'Chinese' ? '事件' : 'Events');
    default: return id;
  }
};

export default function TodoListTab({ language = 'English' }: TodoListProps) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('GeekTabs-tasks', []);
  const [currentProject, setCurrentProject] = useState('Inbox');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<1 | 2 | 3 | 4>(4);

  // Automatically purge legacy default sample tasks (e.g., init-1, init-2, init-3) from storage
  useEffect(() => {
    if (tasks.some(t => t.id && t.id.startsWith('init-'))) {
      setTasks(prev => prev.filter(t => !t.id || !t.id.startsWith('init-')));
    }
  }, [tasks, setTasks]);

  const [confirmDeleteTask, setConfirmDeleteTask] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editDescValue, setEditDescValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  // Filter tasks based on current category/project
  const filteredTasks = tasks.map(task => ({
    ...task,
    project: task.project || 'Inbox',
    priority: task.priority || 4
  })).filter(t => t.project === currentProject);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      description: newTaskDesc.trim() || undefined,
      completed: false,
      project: currentProject,
      priority: newTaskPriority,
    };
    setTasks([...tasks, task]);
    setNewTaskText('');
    setNewTaskDesc('');
    setNewTaskPriority(4);
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditValue(task.text);
    setEditDescValue(task.description || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && editValue.trim() !== '') {
      setTasks(tasks.map(t => t.id === editingId ? { ...t, text: editValue.trim(), description: editDescValue.trim() || undefined } : t));
    }
    setEditingId(null);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    setConfirmDeleteTask(null);
  };

  const count = filteredTasks.length;
  const dict = TODO_T[language] || TODO_T['English'];
  let remainingText = '';
  if (language === 'Japanese') {
    remainingText = `${dict.remaining} ${count} ${count === 1 ? dict.taskSingular : dict.taskPlural}`;
  } else if (language === 'Chinese') {
    remainingText = `${count} ${dict.taskPlural}${dict.remaining}`;
  } else if (language === 'Korean') {
    remainingText = `${count}${dict.taskSingular} ${dict.remaining}`;
  } else {
    remainingText = `${count} ${count === 1 ? dict.taskSingular : dict.taskPlural} ${dict.remaining}`;
  }

  return (
    <div className="todolist-tab-container w-full h-full flex flex-row overflow-hidden relative z-10 backdrop-blur-2xl bg-white/70 dark:bg-[#0c1017]/80 text-slate-800 dark:text-slate-100">
      
      {/* Mobile Drawer Backdrop */}
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
        {/* Sidebar Header & Brand */}
        <div className="p-5 border-b border-black/10 dark:border-white/10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white shadow-md shadow-[#4f46e5]/25">
                <ListTodo size={17} strokeWidth={2.4} />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight uppercase text-slate-900 dark:text-white">
                  {dict.title}
                </h1>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Primary Action Button Matching Uploaded Reference Design */}
          <button
            type="button"
            onClick={() => {
              setIsAdding(true);
              setMobileSidebarOpen(false);
            }}
            style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
            className="todolist-action-btn w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#4f46e5] hover:bg-[#4338ca] !text-white text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#4f46e5]/35 transition-all cursor-pointer active:scale-98 select-none"
          >
            <Plus size={15} strokeWidth={3} className="!text-white text-white" style={{ stroke: '#ffffff' }} />
            <span className="!text-white text-white font-black" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dict.addTask}</span>
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
          <div className="px-3 pt-2 pb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/35">
            {dict.sidebarHeader}
          </div>
          {PROJECTS.map((proj) => {
            const countVal = tasks.filter(t => (t.project || 'Inbox') === proj.id && !t.completed).length;
            const active = currentProject === proj.id;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => {
                  setCurrentProject(proj.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer select-none ${
                  active
                    ? 'bg-[#4f46e5]/15 text-[#4f46e5] dark:text-indigo-400 border border-[#4f46e5]/30 shadow-xs'
                    : 'text-slate-700 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#4f46e5] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="shrink-0">{proj.icon}</span>
                  <span className="truncate">{getProjectName(proj.id, language)}</span>
                </div>
                {countVal > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                      active
                        ? 'bg-[#4f46e5] text-white shadow-xs'
                        : 'bg-black/5 dark:bg-white/10 text-slate-600 dark:text-white/60'
                    }`}
                  >
                    {countVal}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-black/10 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-white/45 flex items-center justify-between select-none">
          <span className="text-[11px] uppercase tracking-wider font-bold">
            {language === 'Korean' 
              ? `${tasks.filter(t => !t.completed).length}개 대기 중` 
              : `${tasks.filter(t => !t.completed).length} ${dict.pending}`}
          </span>
        </div>
      </aside>

      {/* RIGHT CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-transparent">
        
        {/* Workspace Top Header Bar */}
        <header className="h-16 px-6 sm:px-8 border-b border-black/10 dark:border-white/10 flex items-center justify-between shrink-0 bg-white/40 dark:bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger to trigger Sidebar */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors cursor-pointer"
              title="Open Navigation"
            >
              <Menu size={20} />
            </button>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <span>{getProjectName(currentProject, language)}</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#4f46e5]/10 text-[#4f46e5] dark:text-indigo-400 border border-[#4f46e5]/20">
                  {remainingText}
                </span>
              </h2>
            </div>
          </div>

          {!isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
              className="todolist-action-btn flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#4f46e5] hover:bg-[#4338ca] !text-white text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#4f46e5]/35 cursor-pointer shrink-0 active:scale-98 select-none"
            >
              <Plus size={14} strokeWidth={3} className="!text-white text-white" style={{ stroke: '#ffffff' }} />
              <span className="hidden sm:inline !text-white text-white font-black" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dict.addTask}</span>
            </button>
          )}
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-6 sm:px-10 lg:px-16 py-6 sm:py-8 space-y-4">
          <div className="max-w-4xl mx-auto space-y-4">

            {/* Inline Add Task Form */}
            <AnimatePresence>
              {isAdding && (
                <motion.form
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={addTask}
                  className="border border-[#4f46e5]/30 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-3.5 shadow-md shadow-[#4f46e5]/10 mb-6"
                >
                  <div className="w-full">
                    <input
                      autoFocus
                      type="text"
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      placeholder={dict.addPlaceholder}
                      className="w-full px-4 py-3 bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/15 rounded-xl font-bold text-slate-900 dark:text-white text-base placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 focus:border-[#4f46e5] dark:focus:border-indigo-400 transition-all"
                    />
                  </div>

                  <div className="w-full">
                    <textarea
                      rows={3}
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      placeholder={dict.addNotes}
                      className="w-full px-4 py-2.5 bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/15 rounded-xl text-sm text-slate-700 dark:text-white/80 placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 focus:border-[#4f46e5] dark:focus:border-indigo-400 transition-all resize-none leading-relaxed"
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                          addTask(e);
                        }
                      }}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-black/5 dark:border-white/5">
                    {/* Priority Selector */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4f46e5] dark:text-indigo-400 mr-1 shrink-0">
                        {dict.priority}
                      </span>
                      {([1, 2, 3, 4] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewTaskPriority(p)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                            newTaskPriority === p
                              ? `${PRIORITY_COLORS[p].bg} ${PRIORITY_COLORS[p].border} ${PRIORITY_COLORS[p].text} shadow-xs`
                              : 'border-black/10 dark:border-white/10 text-slate-600 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          <Flag size={11} className="fill-current text-current" />
                          <span>P{p}</span>
                        </button>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdding(false);
                          setNewTaskText('');
                          setNewTaskDesc('');
                          setNewTaskPriority(4);
                        }}
                        style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                        className="todolist-cancel-btn px-4 py-2 font-black tracking-wider text-xs uppercase bg-black/25 dark:bg-white/10 hover:bg-black/35 dark:hover:bg-white/20 !text-white text-white transition-all rounded-2xl cursor-pointer"
                      >
                        <span className="!text-white text-white font-black" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dict.cancel}</span>
                      </button>
                      <button
                        type="submit"
                        disabled={!newTaskText.trim()}
                        style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                        className="todolist-action-btn px-6 py-2.5 font-black tracking-wider text-xs uppercase bg-[#4f46e5] hover:bg-[#4338ca] !text-white text-white transition-all disabled:opacity-40 rounded-2xl shadow-md shadow-[#4f46e5]/35 cursor-pointer active:scale-98 select-none"
                      >
                        <span className="!text-white text-white font-black" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dict.addTask}</span>
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Task Items List */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => {
                  const priorityDetail = PRIORITY_COLORS[(task.priority || 4) as 1 | 2 | 3 | 4];
                  const isEditingThis = editingId === task.id;

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="group py-3.5 px-4.5 flex flex-col md:flex-row items-start md:items-center gap-3.5 bg-white/60 dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-2xl transition-all shadow-xs hover:border-[#4f46e5]/30 hover:shadow-md"
                    >
                      {isEditingThis ? (
                        <form onSubmit={handleEditSubmit} className="flex-1 w-full flex flex-col gap-2.5 bg-transparent">
                          <input
                            ref={editInputRef}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-3.5 py-2 bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 text-sm"
                            placeholder={dict.taskName}
                          />
                          <input
                            type="text"
                            value={editDescValue}
                            onChange={(e) => setEditDescValue(e.target.value)}
                            className="w-full px-3.5 py-1.5 bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl text-xs text-slate-600 dark:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30"
                            placeholder={dict.description}
                          />
                          <div className="flex gap-2 justify-end mt-1">
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                              className="todolist-cancel-btn px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider font-bold bg-black/25 dark:bg-white/10 hover:bg-black/35 dark:hover:bg-white/20 transition-all !text-white text-white cursor-pointer"
                            >
                              <span className="!text-white text-white font-bold" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dict.cancel}</span>
                            </button>
                            <button
                              type="submit"
                              style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                              className="todolist-action-btn px-4 py-1.5 rounded-2xl text-xs bg-[#4f46e5] hover:bg-[#4338ca] !text-white text-white uppercase tracking-wider font-black transition-all shadow-md shadow-[#4f46e5]/35 cursor-pointer select-none"
                            >
                              <span className="!text-white text-white font-black" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dict.save}</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex-1 flex gap-3.5 items-start min-w-0 pr-2">
                            <button
                              type="button"
                              onClick={() => toggleTask(task.id)}
                              className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-all cursor-pointer ${
                                task.completed
                                  ? 'bg-[#4f46e5] border-[#4f46e5] scale-95 shadow-xs'
                                  : `${priorityDetail.border} hover:scale-105`
                              }`}
                            >
                              {task.completed ? (
                                <Check size={11} className="text-white" strokeWidth={3} />
                              ) : (
                                <span className="w-2 h-2 rounded-full opacity-0 hover:opacity-100 bg-current transition-opacity text-inherit" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0 leading-tight">
                              <span
                                className={`block font-medium text-sm leading-relaxed select-text tracking-wide ${
                                  task.completed
                                    ? 'line-through text-black/40 dark:text-white/35 font-normal'
                                    : 'text-slate-900 dark:text-white/90'
                                }`}
                              >
                                {task.text}
                              </span>
                              {task.description && (
                                <p className="text-xs text-slate-600 dark:text-white/50 mt-1 select-text leading-normal max-w-2xl font-normal">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Inline Controls */}
                          <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shrink-0">
                            <button
                              onClick={() => startEdit(task)}
                              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 hover:dark:text-white rounded-lg transition-all cursor-pointer"
                              title="Edit task"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteTask(task.id)}
                              className="p-1.5 hover:bg-red-500/10 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-all cursor-pointer"
                              title="Delete task"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredTasks.length === 0 && !isAdding && (
                <div className="text-center py-24 flex flex-col items-center justify-center select-none">
                  <div className="w-16 h-16 rounded-2xl bg-[#4f46e5]/10 flex items-center justify-center text-[#4f46e5] mb-4">
                    <ListTodo size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">
                    {dict.noGoals} {getProjectName(currentProject, language)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-white/50 mt-1 max-w-xs mb-4">
                    {dict.clickToCreate}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                    className="todolist-action-btn px-6 py-2.5 rounded-2xl bg-[#4f46e5] hover:bg-[#4338ca] !text-white text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-[#4f46e5]/35 cursor-pointer active:scale-98 select-none"
                  >
                    <span className="!text-white text-white font-black" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dict.addTask}</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={!!confirmDeleteTask}
        title={dict.deleteTitle}
        message={dict.deleteMessage}
        onConfirm={() => confirmDeleteTask && deleteTask(confirmDeleteTask)}
        onCancel={() => setConfirmDeleteTask(null)}
      />
    </div>
  );
}
