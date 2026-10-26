import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, Trash2, ListTodo, Pencil, Save, X, Inbox, Calendar, Circle, ArrowUpRight, ArrowLeft, Tag, Flag } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmModal from '../ConfirmModal';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  project: string; // "Inbox" | "Today" | "Personal" | "Work"
  priority: 1 | 2 | 3 | 4; // 1 = High, 2 = Medium, 3 = Low, 4 = None
  description?: string;
}

const PROJECTS = [
  { id: 'Inbox', name: 'Inbox', icon: <Inbox size={16} className="text-sky-500 fill-sky-500/10" /> },
  { id: 'Today', name: 'Today', icon: <Calendar size={16} className="text-indigo-500 fill-indigo-500/10" /> },
  { id: 'Personal', name: 'Personal', icon: <Circle size={8} className="text-indigo-400 fill-indigo-400" /> },
  { id: 'Work', name: 'Work', icon: <Circle size={8} className="text-sky-400 fill-sky-400" /> },
];

const PRIORITY_COLORS = {
  1: { border: 'border-red-500', text: 'text-red-500', bg: 'bg-red-500/10', hover: 'hover:bg-red-500/20' },
  2: { border: 'border-indigo-500', text: 'text-indigo-500', bg: 'bg-indigo-500/10', hover: 'hover:bg-indigo-500/20' },
  3: { border: 'border-sky-400', text: 'text-sky-400', bg: 'bg-sky-400/10', hover: 'hover:bg-sky-400/20' },
  4: { border: 'border-neutral-400 dark:border-neutral-600', text: 'text-neutral-500', bg: 'bg-neutral-500/10', hover: 'hover:bg-neutral-500/20' }
};

export interface TodoListProps {
  language?: string;
}

const TODO_T: Record<string, Record<string, string>> = {
  English: {
    title: 'Task Workspace',
    subtitle: 'Cloud Todoist Planner',
    inbox: 'Inbox',
    today: 'Today',
    personal: 'Personal',
    work: 'Work',
    addTask: 'Add Task',
    pending: 'tasks pending',
    noTasks: 'No tasks in this list.',
    addPlaceholder: 'What needs to be done?',
    descriptionPlaceholder: 'Description (optional)',
    cancel: 'Cancel',
    save: 'Save',
    priority: 'Priority',
    sidebarHeader: 'To-Do List',
    remaining: 'remaining',
    taskSingular: 'task',
    taskPlural: 'tasks',
    noGoals: 'No Goals in',
    clickToCreate: 'Click Add Task in the sidebar to create one!',
    deleteTitle: 'Delete Task',
    deleteMessage: 'Are you sure you want to permanently delete this task?',
    taskName: 'Task name',
    description: 'Description',
    addNotes: 'Add notes or description...',
    allLists: 'All Lists',
  },
  Korean: {
    title: '할 일 관리',
    subtitle: '클라우드 플래너',
    inbox: '수신함',
    today: '오늘 할 일',
    personal: '개인',
    work: '업무',
    addTask: '할 일 추가',
    pending: '개 남음',
    noTasks: '할 일이 없습니다.',
    addPlaceholder: '어떤 일을 해야 하나요?',
    descriptionPlaceholder: '설명 (선택사항)',
    cancel: '취소',
    save: '저장',
    priority: '우선순위',
    sidebarHeader: '할 일 목록',
    remaining: '남음',
    taskSingular: '개',
    taskPlural: '개',
    noGoals: '할 일이 없습니다: ',
    clickToCreate: '사이드바의 할 일 추가를 클릭해 등록해 보세요!',
    deleteTitle: '할 일 삭제',
    deleteMessage: '이 할 일을 영구적으로 삭제하시겠습니까?',
    taskName: '할 일 이름',
    description: '설명',
    addNotes: '설명 또는 메모 추가...',
    allLists: '전체 목록',
  },
  Spanish: {
    title: 'Área de tareas',
    subtitle: 'Planificador en la nube',
    inbox: 'Bandeja de entrada',
    today: 'Hoy',
    personal: 'Personal',
    work: 'Trabajo',
    addTask: 'Agregar tarea',
    pending: 'tareas pendientes',
    noTasks: 'No hay de estas tareas.',
    addPlaceholder: '¿Qué se debe hacer?',
    descriptionPlaceholder: 'Descripción (opcional)',
    cancel: 'Cancelar',
    save: 'Guardar',
    priority: 'Prioridad',
    sidebarHeader: 'Lista de tareas',
    remaining: 'restantes',
    taskSingular: 'tarea',
    taskPlural: 'tareas',
    noGoals: 'Sin tareas en',
    clickToCreate: '¡Haz clic en Agregar tarea para crear una!',
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
    addTask: 'Créer une tâche',
    pending: 'tâches en attente',
    noTasks: 'Aucune tâche dans cette liste.',
    addPlaceholder: 'Que faut-il faire ?',
    descriptionPlaceholder: 'Description (optionnel)',
    cancel: 'Annuler',
    save: 'Sauvegarder',
    priority: 'Priorité',
    sidebarHeader: 'Liste des tâches',
    remaining: 'restantes',
    taskSingular: 'tâche',
    taskPlural: 'tâches',
    noGoals: 'Aucune tâche dans',
    clickToCreate: 'Cliquez sur Créer une tâche pour commencer !',
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
    addTask: 'Aufgabe hinzufügen',
    pending: 'Aufgaben offen',
    noTasks: 'Keine Aufgaben in dieser Liste.',
    addPlaceholder: 'Was gibt es zu tun?',
    descriptionPlaceholder: 'Beschreibung (optional)',
    cancel: 'Abbrechen',
    save: 'Speichern',
    priority: 'Priorität',
    sidebarHeader: 'Aufgabenliste',
    remaining: 'verbleibend',
    taskSingular: 'Aufgabe',
    taskPlural: 'Aufgaben',
    noGoals: 'Keine Aufgaben in',
    clickToCreate: 'Klicke auf Aufgabe hinzufügen, um eine zu erstellen!',
    deleteTitle: 'Aufgabe löschen',
    deleteMessage: 'Sind Sie sicher, dass Sie diese Aufgabe dauerhaft löschen möchten?',
    taskName: 'Aufgabenname',
    description: 'Beschreibung',
    addNotes: 'Notizen oder Beschreibung hinzufügen...',
    allLists: 'Alle Listen',
  },
  Chinese: {
    title: '任务空间',
    subtitle: '云端待办计划工具',
    inbox: '收件箱',
    today: '今天',
    personal: '个人',
    work: '工作',
    addTask: '添加任务',
    pending: '项待办',
    noTasks: '当前列表无待办任务。',
    addPlaceholder: '有什么需要做的？',
    descriptionPlaceholder: '备注描述 (选填)',
    cancel: '取消',
    save: '保存',
    priority: '优先级',
    sidebarHeader: '待办清单',
    remaining: '待完成',
    taskSingular: '个任务',
    taskPlural: '个任务',
    noGoals: '无待办任务在',
    clickToCreate: '点击侧边栏中的添加任务来创建吧！',
    deleteTitle: '删除任务',
    deleteMessage: '您确定要永久删除该任务吗？',
    taskName: '任务名称',
    description: '备注',
    addNotes: '添加备注或详细描述...',
    allLists: '所有清单',
  },
  Japanese: {
    title: 'タスク機能',
    subtitle: 'Todoist風クラウドプランナー',
    inbox: 'インボックス',
    today: '今日',
    personal: 'プライベート',
    work: 'ワーク',
    addTask: 'タスクを追加',
    pending: '件の未完了タスク',
    noTasks: 'このカテゴリーのタスクはありません。',
    addPlaceholder: '何を行いますか？',
    descriptionPlaceholder: '説明 (任意)',
    cancel: 'キャンセル',
    save: '保存',
    priority: '優先度',
    sidebarHeader: 'TODOリスト',
    remaining: '残り',
    taskSingular: '件のタスク',
    taskPlural: '件のタスク',
    noGoals: 'タスクはありません：',
    clickToCreate: 'サイドバーの「タスクを追加」から作成できます！',
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
    addTask: 'Aggiungi attività',
    pending: 'attività in sospeso',
    noTasks: 'Nessuna attività in questo elenco.',
    addPlaceholder: 'Cosa c\'è da fare?',
    descriptionPlaceholder: 'Descrizione (opzionale)',
    cancel: 'Annulla',
    save: 'Salva',
    priority: 'Priorità',
    sidebarHeader: 'Lista di cose da fare',
    remaining: 'rimanenti',
    taskSingular: 'attività',
    taskPlural: 'attività',
    noGoals: 'Nessun obiettivo in',
    clickToCreate: 'Fai clic su Aggiungi attività nella barra laterale per crearne una!',
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
    addTask: 'Добавить задачу',
    pending: 'задач в списке',
    noTasks: 'В этом списке нет задач.',
    addPlaceholder: 'Что нужно сделать?',
    descriptionPlaceholder: 'Описание (необязательно)',
    cancel: 'Отмена',
    save: 'Сохранить',
    priority: 'Приоритет',
    sidebarHeader: 'Список дел',
    remaining: 'осталось',
    taskSingular: 'задача',
    taskPlural: 'задач',
    noGoals: 'Нет целей в категории',
    clickToCreate: 'Нажмите «Добавить задачу» на боковой панели, чтобы создать ее!',
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
    addTask: 'Aufgab derbäisetzen',
    pending: 'Aufgaben am Waardestand',
    noTasks: 'Keng Aufgaben an dëser Lëscht.',
    addPlaceholder: 'Wat muss gemaach ginn?',
    descriptionPlaceholder: 'Beschreiwung (optional)',
    cancel: 'Ofbriechen',
    save: 'Späicheren',
    priority: 'Prioritéit',
    sidebarHeader: 'Aufgabelëscht',
    remaining: 'iwwereg',
    taskSingular: 'Aufgab',
    taskPlural: 'Aufgaben',
    noGoals: 'Keng Ziler an',
    clickToCreate: 'Klickt op Aufgab derbäisetzen an der Säitelooss fir een ze erstellen!',
    deleteTitle: 'Aufgab läschen',
    deleteMessage: 'Sidd Dir sécher, datt Dir dës Aufgab permanent läsche wëllt?',
    taskName: 'Aufgabennumm',
    description: 'Beschreiwung',
    addNotes: 'Notizen oder Beschreiwung derbäisetzen...',
    allLists: 'All Lëschten',
  }
};

const getInitialTasks = (lang: string): Task[] => {
  switch (lang) {
    case 'Chinese':
      return [
        { id: 'init-1', text: '设计新的工作区', completed: false, project: 'Work', priority: 1, description: '在GeekTabs中设计OneNote和Todoist布局。' },
        { id: 'init-2', text: '购买食品杂货', completed: false, project: 'Personal', priority: 3 },
        { id: 'init-3', text: '规划下一次度假', completed: true, project: 'Personal', priority: 2 }
      ];
    case 'Korean':
      return [
        { id: 'init-1', text: '새 작업 공간 디자인', completed: false, project: 'Work', priority: 1, description: 'GeekTabs에서 원노트 및 투두이스트 레이아웃 만들기.' },
        { id: 'init-2', text: '식료품 주문', completed: false, project: 'Personal', priority: 3 },
        { id: 'init-3', text: '다음 휴가 계획', completed: true, project: 'Personal', priority: 2 }
      ];
    case 'Spanish':
      return [
        { id: 'init-1', text: 'Diseñar nuevo espacio de trabajo', completed: false, project: 'Work', priority: 1, description: 'Crear diseños de OneNote y Todoist en GeekTabs.' },
        { id: 'init-2', text: 'Comprar comestibles', completed: false, project: 'Personal', priority: 3 },
        { id: 'init-3', text: 'Planificar las próximas vacaciones', completed: true, project: 'Personal', priority: 2 }
      ];
    case 'French':
      return [
        { id: 'init-1', text: 'Concevoir un nouvel espace de travail', completed: false, project: 'Work', priority: 1, description: 'Créer des mises en page OneNote et Todoist dans GeekTabs.' },
        { id: 'init-2', text: 'Commander des courses', completed: false, project: 'Personal', priority: 3 },
        { id: 'init-3', text: 'Planifier les prochaines vacances', completed: true, project: 'Personal', priority: 2 }
      ];
    case 'German':
      return [
        { id: 'init-1', text: 'Neuen Workspace entwerfen', completed: false, project: 'Work', priority: 1, description: 'OneNote- und Todoist-Layouts in GeekTabs erstellen.' },
        { id: 'init-2', text: 'Lebensmittel bestellen', completed: false, project: 'Personal', priority: 3 },
        { id: 'init-3', text: 'Nächsten Urlaub planen', completed: true, project: 'Personal', priority: 2 }
      ];
    case 'Japanese':
      return [
        { id: 'init-1', text: '新しいワークスペースの設計', completed: false, project: 'Work', priority: 1, description: 'GeekTabsでOneNoteとTodoistのレイアウトを作成する。' },
        { id: 'init-2', text: '食料品の注文', completed: false, project: 'Personal', priority: 3 },
        { id: 'init-3', text: '次の休暇の計画', completed: true, project: 'Personal', priority: 2 }
      ];
    case 'Italian':
      return [
        { id: 'init-1', text: 'Progetta il nuovo spazio di lavoro', completed: false, project: 'Work', priority: 1, description: 'Crea layout OneNote e Todoist in GeekTabs.' },
        { id: 'init-2', text: 'Ordina la spesa', completed: false, project: 'Personal', priority: 3 },
        { id: 'init-3', text: 'Pianifica la prossima vacanza', completed: true, project: 'Personal', priority: 2 }
      ];
    case 'Russian':
      return [
        { id: 'init-1', text: 'Разработать новое рабочее пространство', completed: false, project: 'Work', priority: 1, description: 'Создать макеты OneNote и Todoist в GeekTabs.' },
        { id: 'init-2', text: 'Заказать продукты', completed: false, project: 'Personal', priority: 3 },
        { id: 'init-3', text: 'Спланировать следующий отпуск', completed: true, project: 'Personal', priority: 2 }
      ];
    case 'Luxembourgish':
      return [
        { id: 'init-1', text: 'Neien Workspace entwéckelen', completed: false, project: 'Work', priority: 1, description: 'Layouts fir OneNote an Todoist an GeekTabs erstellen.' },
        { id: 'init-2', text: 'Liewensmëttel bestellen', completed: false, project: 'Personal', priority: 3 },
        { id: 'init-3', text: 'Nächst Vakanz plangen', completed: true, project: 'Personal', priority: 2 }
      ];
    default:
      return [
        { id: 'init-1', text: 'Design new Workspace', completed: false, project: 'Work', priority: 1, description: 'Craft OneNote and Todoist layouts in GeekTabs.' },
        { id: 'init-2', text: 'Order groceries', completed: false, project: 'Personal', priority: 3 },
        { id: 'init-3', text: 'Plan next vacation', completed: true, project: 'Personal', priority: 2 }
      ];
  }
};

const getProjectName = (id: string, lang: string) => {
  const dictionary = TODO_T[lang] || TODO_T['English'];
  switch (id) {
    case 'Inbox': return dictionary.inbox;
    case 'Today': return dictionary.today;
    case 'Personal': return dictionary.personal;
    case 'Work': return dictionary.work;
    default: return id;
  }
};

export default function TodoListTab({ language = 'English' }: TodoListProps) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('GeekTabs-tasks', [
    { id: 'init-1', text: 'Design new Workspace', completed: false, project: 'Work', priority: 1, description: 'Craft OneNote and Todoist layouts in GeekTabs.' },
    { id: 'init-2', text: 'Order groceries', completed: false, project: 'Personal', priority: 3 },
    { id: 'init-3', text: 'Plan next vacation', completed: true, project: 'Personal', priority: 2 }
  ]);
  const [currentProject, setCurrentProject] = useState('Inbox');
  const [mobileView, setMobileView] = useState<'sidebar' | 'tasks'>('tasks');
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<1 | 2 | 3 | 4>(4);

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
    <div className="todolist-tab-container w-full max-w-7xl mx-auto flex flex-col gap-6 relative z-10 p-0 sm:p-4">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <ListTodo size={22} className="text-sky-500 fill-sky-500/10" />
          <h1 className="text-xl font-bold tracking-tight uppercase word-color">
            {dict.title}
          </h1>
        </div>
      </div>

      {/* Main Container - Card-less Split pane layout matching OneNote exactly */}
      <div className="w-full h-[620px] lg:h-[700px] flex gap-1 GeekTabs-card webcard-light-grey-bg rounded-[2rem] overflow-hidden transition-all">
        
        {/* PANEL 1: SIDEBAR NAVIGATION */}
        <div
          className={`${
            mobileView === 'sidebar' ? 'flex w-full' : 'hidden'
          } sm:flex sm:w-52 md:w-56 lg:w-60 shrink-0 h-full flex-col todo-sidebar bg-black/5 dark:bg-white/5 border-r border-black/5 dark:border-white/5 relative z-10`}
        >
          {/* Header */}
          <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-500">
              {dict.sidebarHeader}
            </span>
            <button
              type="button"
              onClick={() => setMobileView('tasks')}
              className="sm:hidden px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold text-xs transition-all cursor-pointer"
            >
              {getProjectName(currentProject, language)} →
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-none">
            {PROJECTS.map((proj) => {
              const countVal = tasks.filter(t => (t.project || 'Inbox') === proj.id && !t.completed).length;
              const active = currentProject === proj.id;
              const isInbox = proj.id === 'Inbox';
              return (
                <button
                  key={proj.id}
                  onClick={() => {
                    setCurrentProject(proj.id);
                    setIsAdding(false);
                    setMobileView('tasks');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-semibold text-xs leading-normal relative cursor-pointer ${
                    active
                      ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold'
                      : isInbox
                      ? 'bg-black/[0.03] dark:bg-white/[0.04] text-slate-700 dark:text-white/70 hover:text-sky-500 hover:bg-sky-500/5'
                      : 'text-slate-700 dark:text-white/60 hover:text-sky-500 hover:bg-sky-500/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="opacity-75 flex-shrink-0">
                      {proj.icon}
                    </span>
                    <span className="truncate">{getProjectName(proj.id, language)}</span>
                  </div>
                  {countVal > 0 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5 opacity-55 font-black">
                      {countVal}
                    </span>
                  )}
                </button>
              );
            })}

            {/* "Add Task" moved directly under Work item in the sidebar of To-Do Menu */}
            <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5">
              <button
                onClick={() => {
                  setIsAdding(true);
                  setMobileView('tasks');
                }}
                className="flex items-center gap-2 px-3 py-2 text-sky-500 hover:text-sky-600 dark:hover:text-indigo-400 font-bold text-xs transition-colors tracking-wider uppercase rounded-xl hover:bg-sky-500/5 w-full text-left cursor-pointer"
              >
                <Plus size={16} />
                <span>{dict.addTask}</span>
              </button>
            </div>
          </nav>

          <div className="p-3.5 border-t border-black/5 dark:border-white/5 text-[9px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold text-center select-none">
            {language === 'Korean' 
              ? `${tasks.filter(t => !t.completed).length}개 대기 중` 
              : `${tasks.filter(t => !t.completed).length} ${dict.pending}`}
          </div>
        </div>

        {/* PANEL 2: TASKS MAIN CONTENT (WEBCARD) */}
        <div
          className={`${
            mobileView === 'tasks' ? 'flex w-full' : 'hidden'
          } sm:flex flex-1 h-full flex-col ${
            currentProject === 'Inbox' ? 'webcard-light-grey-bg' : 'bg-white/[0.02] dark:bg-black/[0.04]'
          } relative z-10 min-w-0 p-4 sm:p-6 lg:p-10 overflow-y-auto scrollbar-none transition-colors`}
        >
          {/* Mobile Top Navigation & Quick Project Switcher (hidden on tablet & desktop) */}
          <div className="sm:hidden flex flex-col gap-2.5 pb-3 mb-3 border-b border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMobileView('sidebar')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{dict.allLists}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 font-extrabold ml-1">
                  {tasks.filter(t => !t.completed).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus size={14} />
                <span>{dict.addTask}</span>
              </button>
            </div>

            {/* Quick Project Switcher: 2 items per row in uniform boxes on mobile */}
            <div className="grid grid-cols-2 gap-2 py-1">
              {PROJECTS.map((proj) => {
                const countVal = tasks.filter(t => (t.project || 'Inbox') === proj.id && !t.completed).length;
                const active = currentProject === proj.id;
                const isInbox = proj.id === 'Inbox';
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => {
                      setCurrentProject(proj.id);
                      setIsAdding(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      active
                        ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                        : isInbox
                        ? 'bg-slate-100 dark:bg-white/10 border-black/10 dark:border-white/10 text-slate-800 dark:text-white/80 hover:bg-slate-200 dark:hover:bg-white/15'
                        : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-slate-700 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="shrink-0">{proj.icon}</span>
                      <span className="truncate">{getProjectName(proj.id, language)}</span>
                    </div>
                    {countVal > 0 && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1.5 shrink-0 ${
                          active ? 'bg-white/25 text-white' : 'bg-black/10 dark:bg-white/10 text-slate-600 dark:text-white/60'
                        }`}
                      >
                        {countVal}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6 flex items-baseline justify-between transition-all border-b border-black/5 dark:border-white/5 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                {getProjectName(currentProject, language)}
              </h2>
              <p className="text-slate-600 dark:text-white/40 font-bold uppercase tracking-widest text-[9px] mt-1">
                {remainingText}
              </p>
            </div>
            {!isAdding && (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
              >
                <Plus size={14} />
                <span>{dict.addTask}</span>
              </button>
            )}
          </div>

          {/* Task Composer in work-card space */}
          <div className="space-y-3 mb-6">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => {
                const priorityDetail = PRIORITY_COLORS[(task.priority || 4) as 1 | 2 | 3 | 4];
                const isEditingThis = editingId === task.id;

                return (
                  <motion.div
                     key={task.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.2 }}
                     className="group py-3.5 flex flex-col md:flex-row items-start md:items-center gap-4 bg-white/30 dark:bg-black/5 border border-black/5 dark:border-white/5 px-4 rounded-2xl transition-all shadow-xs"
                  >
                    {isEditingThis ? (
                      <form onSubmit={handleEditSubmit} className="flex-1 w-full flex flex-col gap-2.5 bg-transparent">
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/60 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-sm placeholder-black/30 dark:placeholder-white/30"
                          placeholder={dict.taskName}
                        />
                        <input
                          type="text"
                          value={editDescValue}
                          onChange={(e) => setEditDescValue(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white/60 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl text-xs text-slate-600 dark:text-white/50 focus:outline-none focus:ring-2 focus:ring-sky-500/30 placeholder-black/20 dark:placeholder-white/20"
                          placeholder={dict.description}
                        />
                        <div className="flex gap-2 justify-end mt-1">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-bold dark:hover:bg-white/10 hover:bg-black/15 transition-all text-slate-800 dark:text-white cursor-pointer"
                          >
                            {dict.cancel}
                          </button>
                          <button
                            type="submit"
                            className="px-3.5 py-1.5 rounded-lg text-xs bg-sky-500 text-white hover:bg-sky-600 uppercase tracking-wider font-bold transition-all shadow-xs cursor-pointer"
                          >
                            {dict.save}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        {/* Checkbox Icon Element with custom Priority Colors */}
                        <div className="flex-1 flex gap-3.5 items-start min-w-0 pr-4">
                          <button
                            type="button"
                            onClick={() => toggleTask(task.id)}
                            className={`mt-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${priorityDetail.border} ${
                              task.completed ? 'bg-sky-500 border-sky-500 scale-95 shadow-sm' : 'hover:scale-105'
                            }`}
                          >
                            {task.completed ? (
                              <Check size={10} className="text-white" strokeWidth={3} />
                            ) : (
                              <span className="w-2 h-2 rounded-full opacity-0 hover:opacity-100 bg-current transition-opacity text-inherit" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0 leading-tight">
                            <span className={`block font-medium text-[14px] leading-relaxed select-text tracking-wide ${
                              task.completed ? 'line-through text-black/40 dark:text-white/35 font-normal' : 'text-slate-850 dark:text-white/90'
                            }`}>
                              {task.text}
                            </span>
                            {task.description && (
                              <p className="text-xs text-slate-650 dark:text-white/50 mt-1 select-text leading-normal max-w-2xl font-normal">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Quick inline controls - Visible on row hover */}
                        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shrink-0">
                          <button
                            onClick={() => startEdit(task)}
                            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-white/30 hover:text-slate-800 hover:dark:text-white/80 rounded-lg transition-all cursor-pointer"
                            title="Edit task"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteTask(task.id)}
                            className="p-1.5 hover:bg-red-500/10 dark:hover:bg-red-500/10 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-all cursor-pointer"
                            title="Delete task"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredTasks.length === 0 && !isAdding && (
              <div className="text-center py-20 flex flex-col items-center justify-center select-none">
                <ListTodo size={36} strokeWidth={1.2} className="text-sky-500 mb-2" />
                <p className="text-slate-800 dark:text-white text-[10px] uppercase font-black tracking-widest">
                  {dict.noGoals} {getProjectName(currentProject, language)}
                </p>
                <p className="text-slate-600 dark:text-white/40 text-[9px] mt-1">{dict.clickToCreate}</p>
              </div>
            )}
          </div>

          {/* Inline Add Task Composer Form */}
          <AnimatePresence>
            {isAdding && (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onSubmit={addTask}
                className="border border-black/10 dark:border-white/15 bg-white/50 dark:bg-black/30 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-sm"
              >
                {/* Big Task Title Input Box */}
                <div className="w-full">
                  <input
                    autoFocus
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder={dict.addPlaceholder}
                    className="w-full px-4 py-3 sm:py-3.5 bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/15 rounded-xl font-bold text-slate-900 dark:text-white text-base sm:text-lg placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 dark:focus:border-sky-400 transition-all shadow-2xs"
                  />
                </div>

                {/* Big Description / Notes Filling Box */}
                <div className="w-full">
                  <textarea
                    rows={3}
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder={dict.addNotes}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/15 rounded-xl text-sm sm:text-base text-slate-700 dark:text-white/80 placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 dark:focus:border-sky-400 transition-all resize-none leading-relaxed shadow-2xs"
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                        addTask(e);
                      }
                    }}
                  />
                </div>

                {/* Responsive Controls Bar: Priority on top, Cancel & Add Task cleanly placed underneath */}
                <div className="flex flex-col gap-3 mt-1 pt-3.5 border-t border-black/5 dark:border-white/5">
                  {/* Priority Selection Bar */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-500 dark:text-sky-400 mr-1 shrink-0">
                      {dict.priority}
                    </span>
                    {([1, 2, 3, 4] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewTaskPriority(p)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
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

                  {/* Action Buttons: Cancel and Add Task under Priority (with Cancel's text starting in the exact same column as Priority's P) */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:self-start shrink-0 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdding(false);
                        setNewTaskText('');
                        setNewTaskDesc('');
                        setNewTaskPriority(4);
                      }}
                      className="px-3 sm:px-4 py-2 font-bold tracking-wider text-xs uppercase text-slate-700 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 transition-all rounded-xl cursor-pointer text-left -ml-3 sm:-ml-4"
                    >
                      {dict.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={!newTaskText.trim()}
                      className="px-5 py-2 font-bold tracking-wider text-xs uppercase bg-sky-500 hover:bg-sky-600 text-white transition-all disabled:opacity-40 rounded-xl shadow-md shadow-sky-500/20 cursor-pointer text-center whitespace-nowrap"
                    >
                      {dict.addTask}
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
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
