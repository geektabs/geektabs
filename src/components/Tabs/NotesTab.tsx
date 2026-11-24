import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash2,
  X,
  FileText,
  PanelLeft,
  PanelLeftClose,
  Pencil,
  Check,
  Save,
  Zap,
  User,
  Sparkles,
  Briefcase,
  UtensilsCrossed,
  Plane,
  FolderOpen
} from 'lucide-react';
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
  { id: 'sec-quick', name: 'Quick Notes', color: '#4f46e5' }, // Royal Indigo
  { id: 'sec-personal', name: 'Personal', color: '#3b82f6' }, // Blue
  { id: 'sec-ideas', name: 'Creative', color: '#10b981' },    // Emerald
  { id: 'sec-work', name: 'Work', color: '#8b5cf6' },         // Purple
  { id: 'sec-recipes', name: 'Recipe', color: '#f59e0b' },    // Amber
  { id: 'sec-travel', name: 'Travel', color: '#06b6d4' }      // Cyan
];

const LEGACY_DEFAULT_NAME_TO_ID: Record<string, string> = {
  'quick notes': 'sec-quick',
  'personal': 'sec-personal',
  'personal log': 'sec-personal',
  'creative': 'sec-ideas',
  'creative ideas': 'sec-ideas',
  'work': 'sec-work',
  'work log': 'sec-work',
  'work project': 'sec-work',
  'recipe': 'sec-recipes',
  'recipes': 'sec-recipes',
  'travel': 'sec-travel'
};

const DEFAULT_SECTION_IDS = new Set(DEFAULT_SECTIONS.map((s) => s.id));
const DEFAULT_SECTION_NAMES = new Set(DEFAULT_SECTIONS.map((s) => s.name.trim().toLowerCase()));

const isDefaultSection = (sec: Section) =>
  DEFAULT_SECTION_IDS.has(sec.id) || DEFAULT_SECTION_NAMES.has(sec.name.trim().toLowerCase());

const NOTES_LOCALES: Record<string, string> = {
  English: 'en-US',
  Chinese: 'zh-CN',
  'Chinese Traditional': 'zh-TW',
  Spanish: 'es-ES',
  French: 'fr-FR',
  German: 'de-DE',
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

interface NotesExtraLocale {
  sections: Record<string, string>;
  descs: Record<string, string>;
  customDesc: (name: string) => string;
  closeSidebar: string;
  hideSidebar: string;
  showSidebar: string;
  toggleSidebar: string;
  addSectionTitle: string;
  newBtn: string;
  sectionNamePlaceholder: string;
  saveSectionTitle: string;
  cancelEditTitle: string;
  deleteNoteTitle: string;
  cancelChangesTitle: string;
  cancelBtn: string;
  saveNoteTitle: string;
  saveBtn: string;
  savedBtn: string;
  chooseNoteHint: string;
  deleteNoteModalTitle: string;
  deleteNoteConfirmPrefix: string;
  deleteNoteConfirmSuffix: string;
  deleteModalCancel: string;
  deleteModalConfirm: string;
}

const NOTES_EXTRA_T: Record<string, NotesExtraLocale> = {
  English: {
    sections: { 'sec-quick': 'Quick Notes', 'sec-personal': 'Personal', 'sec-ideas': 'Creative', 'sec-work': 'Work', 'sec-recipes': 'Recipe', 'sec-travel': 'Travel' },
    descs: {
      'sec-quick': 'Capture quick thoughts, daily reminders, short snippets, and sudden ideas you want to jot down right away.',
      'sec-personal': 'Keep personal reflections, journal entries, private goals, health logs, and everyday life notes organized.',
      'sec-ideas': 'Brainstorm concepts, story drafts, design inspiration, and creative projects whenever sparks strike.',
      'sec-work': 'Organize meeting notes, project plans, action items, documentation, and work-related references.',
      'sec-recipes': 'Save favorite recipes, ingredient lists, cooking steps, meal prep ideas, and kitchen experiments.',
      'sec-travel': 'Plan upcoming trips, itineraries, packing checklists, booking details, and memorable travel notes.',
    },
    customDesc: (name) => `Use ${name} to organize your notes, checklists, photos, and reference links in one place.`,
    closeSidebar: 'Close sidebar', hideSidebar: 'Hide sidebar', showSidebar: 'Show sidebar', toggleSidebar: 'Toggle sidebar',
    addSectionTitle: 'Add Section', newBtn: 'New', sectionNamePlaceholder: 'Section name...', saveSectionTitle: 'Save section', cancelEditTitle: 'Cancel edit',
    deleteNoteTitle: 'Delete note', cancelChangesTitle: 'Cancel changes', cancelBtn: 'Cancel', saveNoteTitle: 'Save note', saveBtn: 'Save', savedBtn: 'Saved',
    chooseNoteHint: 'Select a note from the menu or choose below',
    deleteNoteModalTitle: 'Delete Note?', deleteNoteConfirmPrefix: 'Are you sure you want to delete', deleteNoteConfirmSuffix: '? This action cannot be undone.',
    deleteModalCancel: 'Cancel', deleteModalConfirm: 'Delete',
  },
  Chinese: {
    sections: { 'sec-quick': '快速笔记', 'sec-personal': '个人', 'sec-ideas': '创意', 'sec-work': '工作', 'sec-recipes': '食谱', 'sec-travel': '旅行' },
    descs: {
      'sec-quick': '随时记录灵光乍现的想法、每日提醒、简短片段和突发灵感。',
      'sec-personal': '整理个人随笔、日记记录、私人目标、健康日志和日常生活备忘。',
      'sec-ideas': '灵感涌现时，收集概念构思、故事草稿、设计参考与创意项目。',
      'sec-work': '梳理会议纪要、项目规划、待办事项、文档资料与工作参考。',
      'sec-recipes': '保存喜爱的食谱、食材清单、烹饪步骤、备餐思路与厨房实验。',
      'sec-travel': '规划即将到来的旅行、行程路线、行李清单、预订详情与旅途见闻。',
    },
    customDesc: (name) => `在「${name}」中统一整理您的笔记、清单、图片和参考链接。`,
    closeSidebar: '关闭侧边栏', hideSidebar: '隐藏侧边栏', showSidebar: '显示侧边栏', toggleSidebar: '切换侧边栏',
    addSectionTitle: '添加分区', newBtn: '新建', sectionNamePlaceholder: '分区名称...', saveSectionTitle: '保存分区', cancelEditTitle: '取消编辑',
    deleteNoteTitle: '删除笔记', cancelChangesTitle: '放弃更改', cancelBtn: '取消', saveNoteTitle: '保存笔记', saveBtn: '保存', savedBtn: '已保存',
    chooseNoteHint: '从左侧菜单或下方选择笔记',
    deleteNoteModalTitle: '删除笔记？', deleteNoteConfirmPrefix: '确定要删除', deleteNoteConfirmSuffix: ' 吗？此操作无法撤销。',
    deleteModalCancel: '取消', deleteModalConfirm: '删除',
  },
  'Chinese Traditional': {
    sections: { 'sec-quick': '快速筆記', 'sec-personal': '個人', 'sec-ideas': '創意', 'sec-work': '工作', 'sec-recipes': '食譜', 'sec-travel': '旅行' },
    descs: {
      'sec-quick': '隨時記錄靈光一現的想法、每日提醒、簡短片段與突發靈感。',
      'sec-personal': '整理個人隨筆、日記紀錄、私人目標、健康日誌與日常生活備忘。',
      'sec-ideas': '靈感湧現時，收集概念構思、故事草稿、設計參考與創意專案。',
      'sec-work': '梳理會議紀錄、專案規劃、待辦事項、文件資料與工作參考。',
      'sec-recipes': '儲存喜愛的食譜、食材清單、烹飪步驟、備餐想法與廚房實驗。',
      'sec-travel': '規劃即將到來的旅行、行程路線、行李清單、預訂詳情與旅途筆記。',
    },
    customDesc: (name) => `在「${name}」中統一整理您的筆記、清單、圖片與參考連結。`,
    closeSidebar: '關閉側邊欄', hideSidebar: '隱藏側邊欄', showSidebar: '顯示側邊欄', toggleSidebar: '切換側邊欄',
    addSectionTitle: '新增分區', newBtn: '新增', sectionNamePlaceholder: '分區名稱...', saveSectionTitle: '儲存分區', cancelEditTitle: '取消編輯',
    deleteNoteTitle: '刪除筆記', cancelChangesTitle: '放棄變更', cancelBtn: '取消', saveNoteTitle: '儲存筆記', saveBtn: '儲存', savedBtn: '已儲存',
    chooseNoteHint: '從選單或下方選擇筆記',
    deleteNoteModalTitle: '刪除筆記？', deleteNoteConfirmPrefix: '確定要刪除', deleteNoteConfirmSuffix: ' 嗎？此操作無法復原。',
    deleteModalCancel: '取消', deleteModalConfirm: '刪除',
  },
  Spanish: {
    sections: { 'sec-quick': 'Notas rápidas', 'sec-personal': 'Personal', 'sec-ideas': 'Creativo', 'sec-work': 'Trabajo', 'sec-recipes': 'Recetas', 'sec-travel': 'Viajes' },
    descs: {
      'sec-quick': 'Captura pensamientos rápidos, recordatorios diarios, fragmentos breves e ideas repentinas al instante.',
      'sec-personal': 'Mantén organizadas tus reflexiones personales, entradas de diario, metas privadas y notas cotidianas.',
      'sec-ideas': 'Haz lluvia de ideas, borradores de historias, inspiración de diseño y proyectos creativos.',
      'sec-work': 'Organiza notas de reuniones, planes de proyectos, acciones pendientes y referencias laborales.',
      'sec-recipes': 'Guarda recetas favoritas, listas de ingredientes, pasos de cocina e ideas de menú.',
      'sec-travel': 'Planifica próximos viajes, itinerarios, listas de equipaje, reservas y recuerdos.',
    },
    customDesc: (name) => `Usa ${name} para organizar tus notas, listas, fotos y enlaces en un solo lugar.`,
    closeSidebar: 'Cerrar barra lateral', hideSidebar: 'Ocultar barra lateral', showSidebar: 'Mostrar barra lateral', toggleSidebar: 'Alternar barra lateral',
    addSectionTitle: 'Añadir sección', newBtn: 'Nueva', sectionNamePlaceholder: 'Nombre de sección...', saveSectionTitle: 'Guardar sección', cancelEditTitle: 'Cancelar edición',
    deleteNoteTitle: 'Eliminar nota', cancelChangesTitle: 'Descartar cambios', cancelBtn: 'Cancelar', saveNoteTitle: 'Guardar nota', saveBtn: 'Guardar', savedBtn: 'Guardado',
    chooseNoteHint: 'Selecciona una nota del menú o elige abajo',
    deleteNoteModalTitle: '¿Eliminar nota?', deleteNoteConfirmPrefix: '¿Seguro que quieres eliminar', deleteNoteConfirmSuffix: '? Esta acción no se puede deshacer.',
    deleteModalCancel: 'Cancelar', deleteModalConfirm: 'Eliminar',
  },
  French: {
    sections: { 'sec-quick': 'Notes rapides', 'sec-personal': 'Personnel', 'sec-ideas': 'Créatif', 'sec-work': 'Travail', 'sec-recipes': 'Recettes', 'sec-travel': 'Voyages' },
    descs: {
      'sec-quick': 'Notez vos pensées rapides, rappels quotidiens, courts extraits et idées soudaines sur le vif.',
      'sec-personal': 'Organisez vos réflexions personnelles, journaux, objectifs privés, suivis santé et notes du quotidien.',
      'sec-ideas': 'Explorez des concepts, brouillons, inspirations design et projets créatifs dès que l’étincelle jaillit.',
      'sec-work': 'Structurez comptes rendus, plans de projet, actions, documentation et références professionnelles.',
      'sec-recipes': 'Enregistrez vos recettes préférées, ingrédients, étapes de préparation et idées culinaires.',
      'sec-travel': 'Planifiez vos prochains voyages, itinéraires, bagages, réservations et souvenirs.',
    },
    customDesc: (name) => `Utilisez ${name} pour regrouper vos notes, listes, photos et liens au même endroit.`,
    closeSidebar: 'Fermer le panneau', hideSidebar: 'Masquer le panneau', showSidebar: 'Afficher le panneau', toggleSidebar: 'Basculer le panneau',
    addSectionTitle: 'Ajouter une section', newBtn: 'Nouveau', sectionNamePlaceholder: 'Nom de section...', saveSectionTitle: 'Enregistrer la section', cancelEditTitle: 'Annuler la modification',
    deleteNoteTitle: 'Supprimer la note', cancelChangesTitle: 'Annuler les modifications', cancelBtn: 'Annuler', saveNoteTitle: 'Enregistrer la note', saveBtn: 'Enregistrer', savedBtn: 'Enregistré',
    chooseNoteHint: 'Sélectionnez une note dans le menu ou ci-dessous',
    deleteNoteModalTitle: 'Supprimer la note ?', deleteNoteConfirmPrefix: 'Voulez-vous vraiment supprimer', deleteNoteConfirmSuffix: ' ? Cette action est irréversible.',
    deleteModalCancel: 'Annuler', deleteModalConfirm: 'Supprimer',
  },
  German: {
    sections: { 'sec-quick': 'Schnellnotizen', 'sec-personal': 'Privat', 'sec-ideas': 'Kreativ', 'sec-work': 'Arbeit', 'sec-recipes': 'Rezepte', 'sec-travel': 'Reisen' },
    descs: {
      'sec-quick': 'Halten Sie spontane Gedanken, tägliche Erinnerungen, kurze Schnipsel und plötzliche Ideen sofort fest.',
      'sec-personal': 'Verwalten Sie persönliche Gedanken, Tagebucheinträge, Ziele, Gesundheitsnotizen und Alltägliches.',
      'sec-ideas': 'Sammeln Sie Konzepte, Entwürfe, Design-Inspirationen und kreative Projekte an einem Ort.',
      'sec-work': 'Strukturieren Sie Besprechungsnotizen, Projektpläne, Aufgaben und Arbeitsunterlagen.',
      'sec-recipes': 'Speichern Sie Lieblingsrezepte, Zutatenlisten, Zubereitungsschritte und Küchenideen.',
      'sec-travel': 'Planen Sie kommende Reisen, Routen, Packlisten, Buchungsdetails und Reiseerinnerungen.',
    },
    customDesc: (name) => `Nutzen Sie ${name}, um Notizen, Checklisten, Fotos und Links übersichtlich zu ordnen.`,
    closeSidebar: 'Seitenleiste schließen', hideSidebar: 'Seitenleiste ausblenden', showSidebar: 'Seitenleiste einblenden', toggleSidebar: 'Seitenleiste umschalten',
    addSectionTitle: 'Bereich hinzufügen', newBtn: 'Neu', sectionNamePlaceholder: 'Bereichsname...', saveSectionTitle: 'Bereich speichern', cancelEditTitle: 'Bearbeitung abbrechen',
    deleteNoteTitle: 'Notiz löschen', cancelChangesTitle: 'Änderungen verwerfen', cancelBtn: 'Abbrechen', saveNoteTitle: 'Notiz speichern', saveBtn: 'Speichern', savedBtn: 'Gespeichert',
    chooseNoteHint: 'Notiz aus dem Menü oder unten auswählen',
    deleteNoteModalTitle: 'Notiz löschen?', deleteNoteConfirmPrefix: 'Möchten Sie wirklich löschen:', deleteNoteConfirmSuffix: '? Diese Aktion kann nicht rückgängig gemacht werden.',
    deleteModalCancel: 'Abbrechen', deleteModalConfirm: 'Löschen',
  },
  Japanese: {
    sections: { 'sec-quick': 'クイックメモ', 'sec-personal': '個人', 'sec-ideas': 'クリエイティブ', 'sec-work': '仕事', 'sec-recipes': 'レシピ', 'sec-travel': '旅行' },
    descs: {
      'sec-quick': '思いついた考えや日々のリマインダー、短いメモをその場ですぐに書き留めます。',
      'sec-personal': '日々の記録や日記、プライベートな目標、健康ログなどを整理できます。',
      'sec-ideas': 'ひらめいたコンセプト、ストーリーの下書き、デザインの着想をまとめます。',
      'sec-work': '会議メモ、プロジェクト計画、タスク、ドキュメントや業務資料を整理します。',
      'sec-recipes': 'お気に入りのレシピ、材料リスト、作り方、料理のアイデアを保存します。',
      'sec-travel': '旅行の計画、日程表、持ち物チェックリスト、予約情報や思い出を残します。',
    },
    customDesc: (name) => `「${name}」にメモ、チェックリスト、写真、参考リンクをまとめて整理できます。`,
    closeSidebar: 'サイドバーを閉じる', hideSidebar: 'サイドバーを隠す', showSidebar: 'サイドバーを表示', toggleSidebar: 'サイドバーを切り替え',
    addSectionTitle: 'セクションを追加', newBtn: '新規', sectionNamePlaceholder: 'セクション名...', saveSectionTitle: 'セクションを保存', cancelEditTitle: '編集をキャンセル',
    deleteNoteTitle: 'ノートを削除', cancelChangesTitle: '変更を破棄', cancelBtn: 'キャンセル', saveNoteTitle: 'ノートを保存', saveBtn: '保存', savedBtn: '保存済み',
    chooseNoteHint: 'メニューまたは下からノートを選択してください',
    deleteNoteModalTitle: 'ノートを削除しますか？', deleteNoteConfirmPrefix: '本当に削除してもよろしいですか：', deleteNoteConfirmSuffix: '？この操作は取り消せません。',
    deleteModalCancel: 'キャンセル', deleteModalConfirm: '削除',
  },
  Korean: {
    sections: { 'sec-quick': '빠른 메모', 'sec-personal': '개인', 'sec-ideas': '크리에이티브', 'sec-work': '업무', 'sec-recipes': '레시피', 'sec-travel': '여행' },
    descs: {
      'sec-quick': '문득 떠오른 생각, 일일 알림, 짧은 메모와 아이디어를 바로 기록해 보세요.',
      'sec-personal': '개인적인 회고, 일기, 목표, 건강 기록과 일상 메모를 깔끔하게 정리하세요.',
      'sec-ideas': '영감이 떠오를 때마다 아이디어, 스토리 초안, 디자인 영감을 자유롭게 모아보세요.',
      'sec-work': '회의록, 프로젝트 계획, 할 일 항목, 문서 및 업무 참고 자료를 체계적으로 관리하세요.',
      'sec-recipes': '좋아하는 레시피, 재료 목록, 조리 순서와 식단 아이디어를 저장해 보세요.',
      'sec-travel': '다가오는 여행 일정, 준비물 체크리스트, 예약 정보와 여행 기록을 계획하세요.',
    },
    customDesc: (name) => `${name} 섹션에 메모, 체크리스트, 사진, 참고 링크를 한곳에 정리하세요.`,
    closeSidebar: '사이드바 닫기', hideSidebar: '사이드바 숨기기', showSidebar: '사이드바 표시', toggleSidebar: '사이드바 전환',
    addSectionTitle: '섹션 추가', newBtn: '새로 만들기', sectionNamePlaceholder: '섹션 이름...', saveSectionTitle: '섹션 저장', cancelEditTitle: '편집 취소',
    deleteNoteTitle: '노트 삭제', cancelChangesTitle: '변경 취소', cancelBtn: '취소', saveNoteTitle: '노트 저장', saveBtn: '저장', savedBtn: '저장됨',
    chooseNoteHint: '메뉴나 아래 목록에서 노트를 선택하세요',
    deleteNoteModalTitle: '노트를 삭제할까요?', deleteNoteConfirmPrefix: '정말 삭제하시겠습니까:', deleteNoteConfirmSuffix: '? 이 작업은 되돌릴 수 없습니다.',
    deleteModalCancel: '취소', deleteModalConfirm: '삭제',
  },
  Italian: {
    sections: { 'sec-quick': 'Note rapide', 'sec-personal': 'Personale', 'sec-ideas': 'Creativo', 'sec-work': 'Lavoro', 'sec-recipes': 'Ricette', 'sec-travel': 'Viaggi' },
    descs: {
      'sec-quick': 'Annota al volo pensieri rapidi, promemoria quotidiani, brevi appunti e idee improvvise.',
      'sec-personal': 'Tieni in ordine riflessioni personali, pagine di diario, obiettivi privati e note quotidiane.',
      'sec-ideas': 'Raccogli concetti, bozze, ispirazioni di design e progetti creativi ogni volta che nasce un’idea.',
      'sec-work': 'Organizza appunti di riunioni, piani di progetto, attività e documenti di lavoro.',
      'sec-recipes': 'Salva ricette preferite, liste degli ingredienti, passaggi e idee per i pasti.',
      'sec-travel': 'Pianifica viaggi futuri, itinerari, liste valigia, prenotazioni e ricordi di viaggio.',
    },
    customDesc: (name) => `Usa ${name} per organizzare note, liste, foto e link di riferimento in un unico posto.`,
    closeSidebar: 'Chiudi barra laterale', hideSidebar: 'Nascondi barra laterale', showSidebar: 'Mostra barra laterale', toggleSidebar: 'Attiva/disattiva barra laterale',
    addSectionTitle: 'Aggiungi sezione', newBtn: 'Nuova', sectionNamePlaceholder: 'Nome sezione...', saveSectionTitle: 'Salva sezione', cancelEditTitle: 'Annulla modifica',
    deleteNoteTitle: 'Elimina nota', cancelChangesTitle: 'Annulla modifiche', cancelBtn: 'Annulla', saveNoteTitle: 'Salva nota', saveBtn: 'Salva', savedBtn: 'Salvata',
    chooseNoteHint: 'Seleziona una nota dal menu o scegli qui sotto',
    deleteNoteModalTitle: 'Eliminare la nota?', deleteNoteConfirmPrefix: 'Sei sicuro di voler eliminare', deleteNoteConfirmSuffix: '? Questa azione è irreversibile.',
    deleteModalCancel: 'Annulla', deleteModalConfirm: 'Elimina',
  },
  Russian: {
    sections: { 'sec-quick': 'Быстрые заметки', 'sec-personal': 'Личное', 'sec-ideas': 'Творчество', 'sec-work': 'Работа', 'sec-recipes': 'Рецепты', 'sec-travel': 'Путешествия' },
    descs: {
      'sec-quick': 'Мгновенно записывайте быстрые мысли, ежедневные напоминания, короткие фразы и внезапные идеи.',
      'sec-personal': 'Храните личные размышления, дневниковые записи, цели, дневник здоровья и бытовые заметки.',
      'sec-ideas': 'Собирайте концепции, черновики историй, идеи дизайна и творческие проекты.',
      'sec-work': 'Упорядочивайте итоги встреч, планы проектов, задачи, документацию и рабочие материалы.',
      'sec-recipes': 'Сохраняйте любимые рецепты, списки продуктов, этапы готовки и кулинарные эксперименты.',
      'sec-travel': 'Планируйте поездки, маршруты, списки вещей, бронирования и путевые заметки.',
    },
    customDesc: (name) => `Используйте «${name}», чтобы упорядочить заметки, списки, фото и ссылки в одном месте.`,
    closeSidebar: 'Закрыть панель', hideSidebar: 'Скрыть панель', showSidebar: 'Показать панель', toggleSidebar: 'Переключить панель',
    addSectionTitle: 'Добавить раздел', newBtn: 'Создать', sectionNamePlaceholder: 'Название раздела...', saveSectionTitle: 'Сохранить раздел', cancelEditTitle: 'Отменить правку',
    deleteNoteTitle: 'Удалить заметку', cancelChangesTitle: 'Отменить изменения', cancelBtn: 'Отмена', saveNoteTitle: 'Сохранить заметку', saveBtn: 'Сохранить', savedBtn: 'Сохранено',
    chooseNoteHint: 'Выберите заметку в меню или ниже',
    deleteNoteModalTitle: 'Удалить заметку?', deleteNoteConfirmPrefix: 'Вы уверены, что хотите удалить', deleteNoteConfirmSuffix: '? Это действие нельзя отменить.',
    deleteModalCancel: 'Отмена', deleteModalConfirm: 'Удалить',
  },
  Luxembourgish: {
    sections: { 'sec-quick': 'Séier Notizen', 'sec-personal': 'Perséinlech', 'sec-ideas': 'Kreativ', 'sec-work': 'Aarbecht', 'sec-recipes': 'Rezepter', 'sec-travel': 'Reesen' },
    descs: {
      'sec-quick': 'Halt séier Gedanken, deeglech Erënnerungen, kuerz Texter a spontan Iddien direkt fest.',
      'sec-personal': 'Organiséiert perséinlech Reflexiounen, Dagbichereien, Ziler an Alldagsnotizen.',
      'sec-ideas': 'Sammelt Konzepter, Entwërf, Design-Inspiratiounen a kreativ Projeten.',
      'sec-work': 'Strukturéiert Versammlungsnotizen, Projetpläng, Aufgaben a berufflech Dokumenter.',
      'sec-recipes': 'Späichert Liiblingsrezepter, Zutatenlëschten, Kachschrëtt a Kicheniddien.',
      'sec-travel': 'Plangt Reesrouten, Paklëschten, Reservatiounen a schéi Reeserënnerungen.',
    },
    customDesc: (name) => `Benotzt ${name} fir Är Notizen, Lëschten, Fotoen a Linken op enger Plaz ze organiséieren.`,
    closeSidebar: 'Säiteläischt zoumaachen', hideSidebar: 'Säiteläischt verstoppen', showSidebar: 'Säiteläischt weisen', toggleSidebar: 'Säiteläischt ëmschalten',
    addSectionTitle: 'Beräich derbäisetzen', newBtn: 'Nei', sectionNamePlaceholder: 'Beräichsnumm...', saveSectionTitle: 'Beräich späicheren', cancelEditTitle: 'Ännerung ofbriechen',
    deleteNoteTitle: 'Notiz läschen', cancelChangesTitle: 'Ännerungen ofbriechen', cancelBtn: 'Ofbriechen', saveNoteTitle: 'Notiz späicheren', saveBtn: 'Späicheren', savedBtn: 'Gespäichert',
    chooseNoteHint: 'Wielt eng Notiz aus dem Menü oder hei ënnen',
    deleteNoteModalTitle: 'Notiz läschen?', deleteNoteConfirmPrefix: 'Sidd Dir sécher, datt Dir läsche wëllt:', deleteNoteConfirmSuffix: '? Dës Aktioun kann net réckgängeg gemaach ginn.',
    deleteModalCancel: 'Ofbriechen', deleteModalConfirm: 'Läschen',
  },
  Dutch: {
    sections: { 'sec-quick': 'Snelle notities', 'sec-personal': 'Persoonlijk', 'sec-ideas': 'Creatief', 'sec-work': 'Werk', 'sec-recipes': 'Recepten', 'sec-travel': 'Reizen' },
    descs: {
      'sec-quick': 'Leg snelle gedachten, dagelijkse herinneringen, korte fragmenten en plotselinge ideeën direct vast.',
      'sec-personal': 'Houd persoonlijke reflecties, dagboeknotities, doelen, gezondheidslogs en dagelijkse notities geordend.',
      'sec-ideas': 'Brainstorm concepten, verhaalschetsen, ontwerpinspiratie en creatieve projecten.',
      'sec-work': 'Orden vergadernotities, projectplannen, actiepunten, documentatie en werkreferenties.',
      'sec-recipes': 'Bewaar favoriete recepten, ingrediëntenlijsten, bereidingsstappen en keukenideeën.',
      'sec-travel': 'Plan komende reizen, routes, paklijsten, boekingen en reisverslagen.',
    },
    customDesc: (name) => `Gebruik ${name} om notities, checklists, foto’s en links op één plek te bewaren.`,
    closeSidebar: 'Zijbalk sluiten', hideSidebar: 'Zijbalk verbergen', showSidebar: 'Zijbalk tonen', toggleSidebar: 'Zijbalk wisselen',
    addSectionTitle: 'Sectie toevoegen', newBtn: 'Nieuw', sectionNamePlaceholder: 'Sectienaam...', saveSectionTitle: 'Sectie opslaan', cancelEditTitle: 'Bewerken annuleren',
    deleteNoteTitle: 'Notitie verwijderen', cancelChangesTitle: 'Wijzigingen annuleren', cancelBtn: 'Annuleren', saveNoteTitle: 'Notitie opslaan', saveBtn: 'Opslaan', savedBtn: 'Opgeslagen',
    chooseNoteHint: 'Selecteer een notitie uit het menu of kies hieronder',
    deleteNoteModalTitle: 'Notitie verwijderen?', deleteNoteConfirmPrefix: 'Weet u zeker dat u wilt verwijderen:', deleteNoteConfirmSuffix: '? Dit kan niet ongedaan worden gemaakt.',
    deleteModalCancel: 'Annuleren', deleteModalConfirm: 'Verwijderen',
  },
  Swedish: {
    sections: { 'sec-quick': 'Snabbanteckningar', 'sec-personal': 'Privat', 'sec-ideas': 'Kreativt', 'sec-work': 'Arbete', 'sec-recipes': 'Recept', 'sec-travel': 'Resor' },
    descs: {
      'sec-quick': 'Fånga snabba tankar, dagliga påminnelser, korta utdrag och plötsliga idéer direkt.',
      'sec-personal': 'Håll ordning på personliga reflektioner, dagboksanteckningar, mål och vardagsnoteringar.',
      'sec-ideas': 'Samla koncept, utkast, designinspiration och kreativa projekt när inspirationen slår till.',
      'sec-work': 'Organisera mötesanteckningar, projektplaner, åtgärder och arbetsreferenser.',
      'sec-recipes': 'Spara favoritrecept, ingredienslistor, tillagningssteg och köksidéer.',
      'sec-travel': 'Planera kommande resor, resplaner, packlistor, bokningar och reseminnen.',
    },
    customDesc: (name) => `Använd ${name} för att organisera anteckningar, checklistor, foton och länkar på ett ställe.`,
    closeSidebar: 'Stäng sidopanel', hideSidebar: 'Dölj sidopanel', showSidebar: 'Visa sidopanel', toggleSidebar: 'Växla sidopanel',
    addSectionTitle: 'Lägg till avsnitt', newBtn: 'Nytt', sectionNamePlaceholder: 'Avsnittsnamn...', saveSectionTitle: 'Spara avsnitt', cancelEditTitle: 'Avbryt redigering',
    deleteNoteTitle: 'Ta bort anteckning', cancelChangesTitle: 'Ångra ändringar', cancelBtn: 'Avbryt', saveNoteTitle: 'Spara anteckning', saveBtn: 'Spara', savedBtn: 'Sparad',
    chooseNoteHint: 'Välj en anteckning i menyn eller nedan',
    deleteNoteModalTitle: 'Ta bort anteckning?', deleteNoteConfirmPrefix: 'Är du säker på att du vill ta bort', deleteNoteConfirmSuffix: '? Åtgärden kan inte ångras.',
    deleteModalCancel: 'Avbryt', deleteModalConfirm: 'Ta bort',
  },
  Finnish: {
    sections: { 'sec-quick': 'Pikamuistiot', 'sec-personal': 'Henkilökohtainen', 'sec-ideas': 'Luova', 'sec-work': 'Työ', 'sec-recipes': 'Reseptit', 'sec-travel': 'Matkat' },
    descs: {
      'sec-quick': 'Kirjaa nopeat ajatukset, päivittäiset muistutukset, lyhyet otteet ja äkilliset ideat heti ylös.',
      'sec-personal': 'Pidä henkilökohtaiset pohdinnat, päiväkirjat, tavoitteet ja arjen muistiinpanot järjestyksessä.',
      'sec-ideas': 'Hahmottele konsepteja, tarinaluonnoksia, suunnitteluideoita ja luovia projekteja.',
      'sec-work': 'Järjestele kokousmuistiinpanot, projektisuunnitelmat, tehtävät ja työasiakirjat.',
      'sec-recipes': 'Tallenna suosikkireseptit, ainesosaluettelot, valmistusvaiheet ja keittiökokeilut.',
      'sec-travel': 'Suunnittele tulevat matkat, reitit, pakkauslistat, varaukset ja matkamuistot.',
    },
    customDesc: (name) => `Käytä osiota ${name} muistiinpanojen, listojen, kuvien ja linkkien järjestämiseen.`,
    closeSidebar: 'Sulje sivupalkki', hideSidebar: 'Piilota sivupalkki', showSidebar: 'Näytä sivupalkki', toggleSidebar: 'Vaihda sivupalkki',
    addSectionTitle: 'Lisää osio', newBtn: 'Uusi', sectionNamePlaceholder: 'Osion nimi...', saveSectionTitle: 'Tallenna osio', cancelEditTitle: 'Peruuta muokkaus',
    deleteNoteTitle: 'Poista muistiinpano', cancelChangesTitle: 'Peruuta muutokset', cancelBtn: 'Peruuta', saveNoteTitle: 'Tallenna muistiinpano', saveBtn: 'Tallenna', savedBtn: 'Tallennettu',
    chooseNoteHint: 'Valitse muistiinpano valikosta tai alta',
    deleteNoteModalTitle: 'Poistetaanko muistiinpano?', deleteNoteConfirmPrefix: 'Haluatko varmasti poistaa kohteen', deleteNoteConfirmSuffix: '? Tätä toimintoa ei voi kumota.',
    deleteModalCancel: 'Peruuta', deleteModalConfirm: 'Poista',
  },
  Hindi: {
    sections: { 'sec-quick': 'त्वरित नोट्स', 'sec-personal': 'व्यक्तिगत', 'sec-ideas': 'रचनात्मक', 'sec-work': 'कार्य', 'sec-recipes': 'व्यंजन', 'sec-travel': 'यात्रा' },
    descs: {
      'sec-quick': 'त्वरित विचार, दैनिक अनुस्मारक, छोटे अंश और अचानक आए विचारों को तुरंत लिखें।',
      'sec-personal': 'व्यक्तिगत विचार, डायरी प्रविष्टियाँ, निजी लक्ष्य, स्वास्थ्य लॉग और दैनिक नोट्स सहेजें।',
      'sec-ideas': 'जब भी प्रेरणा मिले, अवधारणाएँ, कहानी के ड्राफ़्ट और रचनात्मक प्रोजेक्ट संजोएँ।',
      'sec-work': 'मीटिंग नोट्स, प्रोजेक्ट योजनाएँ, कार्य सूची, दस्तावेज़ और कार्य संदर्भ व्यवस्थित करें।',
      'sec-recipes': 'पसंदीदा व्यंजन, सामग्री सूची, पकाने की विधि और रसोई के प्रयोग सहेजें।',
      'sec-travel': 'आगामी यात्राओं, कार्यक्रमों, पैकिंग सूचियों, बुकिंग विवरण और यादों की योजना बनाएँ।',
    },
    customDesc: (name) => `एक ही स्थान पर अपने नोट्स, सूचियाँ, फ़ोटो और लिंक व्यवस्थित करने के लिए ${name} का उपयोग करें।`,
    closeSidebar: 'साइडबार बंद करें', hideSidebar: 'साइडबार छिपाएँ', showSidebar: 'साइडबार दिखाएँ', toggleSidebar: 'साइडबार टॉगल करें',
    addSectionTitle: 'अनुभाग जोड़ें', newBtn: 'नया', sectionNamePlaceholder: 'अनुभाग का नाम...', saveSectionTitle: 'अनुभाग सहेजें', cancelEditTitle: 'संपादन रद्द करें',
    deleteNoteTitle: 'नोट हटाएँ', cancelChangesTitle: 'बदलाव रद्द करें', cancelBtn: 'रद्द करें', saveNoteTitle: 'नोट सहेजें', saveBtn: 'सहेजें', savedBtn: 'सहेजा गया',
    chooseNoteHint: 'मेनू से चुनें या नीचे से कोई नोट चुनें',
    deleteNoteModalTitle: 'नोट हटाएँ?', deleteNoteConfirmPrefix: 'क्या आप वाकई हटाना चाहते हैं:', deleteNoteConfirmSuffix: '? यह क्रिया पूर्ववत नहीं की जा सकती।',
    deleteModalCancel: 'रद्द करें', deleteModalConfirm: 'हटाएँ',
  },
  Norwegian: {
    sections: { 'sec-quick': 'Hurtignotater', 'sec-personal': 'Personlig', 'sec-ideas': 'Kreativt', 'sec-work': 'Arbeid', 'sec-recipes': 'Oppskrifter', 'sec-travel': 'Reise' },
    descs: {
      'sec-quick': 'Fang opp raske tanker, daglige påminnelser, korte utdrag og plutselige ideer med en gang.',
      'sec-personal': 'Hold orden på personlige refleksjoner, dagboknotater, mål, helselogg og hverdagsnotater.',
      'sec-ideas': 'Idémyldre konsepter, utkast, designinspirasjon og kreative prosjekter når inspirasjonen kommer.',
      'sec-work': 'Organiser møtenotater, prosjektplaner, gjøremål, dokumentasjon og arbeidsreferanser.',
      'sec-recipes': 'Lagre favorittoppskrifter, ingredienslister, fremgangsmåter og kjøkkeneksperimenter.',
      'sec-travel': 'Planlegg kommende reiser, reiseruter, pakkelister, bestillinger og reiseminner.',
    },
    customDesc: (name) => `Bruk ${name} til å organisere notater, sjekklister, bilder og lenker på ett sted.`,
    closeSidebar: 'Lukk sidefelt', hideSidebar: 'Skjul sidefelt', showSidebar: 'Vis sidefelt', toggleSidebar: 'Veksle sidefelt',
    addSectionTitle: 'Legg til seksjon', newBtn: 'Ny', sectionNamePlaceholder: 'Seksjonsnavn...', saveSectionTitle: 'Lagre seksjon', cancelEditTitle: 'Avbryt redigering',
    deleteNoteTitle: 'Slett notat', cancelChangesTitle: 'Avbryt endringer', cancelBtn: 'Avbryt', saveNoteTitle: 'Lagre notat', saveBtn: 'Lagre', savedBtn: 'Lagret',
    chooseNoteHint: 'Velg et notat fra menyen eller nedenfor',
    deleteNoteModalTitle: 'Slette notat?', deleteNoteConfirmPrefix: 'Er du sikker på at du vil slette', deleteNoteConfirmSuffix: '? Denne handlingen kan ikke angres.',
    deleteModalCancel: 'Avbryt', deleteModalConfirm: 'Slett',
  },
  Thai: {
    sections: { 'sec-quick': 'บันทึกด่วน', 'sec-personal': 'ส่วนตัว', 'sec-ideas': 'สร้างสรรค์', 'sec-work': 'งาน', 'sec-recipes': 'สูตรอาหาร', 'sec-travel': 'ท่องเที่ยว' },
    descs: {
      'sec-quick': 'จดบันทึกความคิดด่วน การแจ้งเตือนรายวัน ข้อความสั้นๆ และไอเดียฉับพลันได้ทันที',
      'sec-personal': 'จัดระเบียบบันทึกส่วนตัว ไดอารี่ เป้าหมาย บันทึกสุขภาพ และเรื่องราวประจำวัน',
      'sec-ideas': 'ระดมความคิด โครงเรื่อง แรงบันดาลใจด้านการออกแบบ และโปรเจกต์สร้างสรรค์ต่างๆ',
      'sec-work': 'จัดระเบียบบันทึกการประชุม แผนโปรเจกต์ รายการสิ่งที่ต้องทำ และเอกสารอ้างอิง',
      'sec-recipes': 'บันทึกสูตรอาหารโปรด รายการวัตถุดิบ ขั้นตอนการทำอาหาร และไอเดียในครัว',
      'sec-travel': 'วางแผนการเดินทาง กำหนดการ รายการสัมภาระ การจอง และความทรงจำระหว่างทริป',
    },
    customDesc: (name) => `ใช้ ${name} เพื่อจัดระเบียบบันทึก รายการตรวจสอบ รูปภาพ และลิงก์อ้างอิงไว้ในที่เดียว`,
    closeSidebar: 'ปิดแถบด้านข้าง', hideSidebar: 'ซ่อนแถบด้านข้าง', showSidebar: 'แสดงแถบด้านข้าง', toggleSidebar: 'สลับแถบด้านข้าง',
    addSectionTitle: 'เพิ่มหมวดหมู่', newBtn: 'ใหม่', sectionNamePlaceholder: 'ชื่อหมวดหมู่...', saveSectionTitle: 'บันทึกหมวดหมู่', cancelEditTitle: 'ยกเลิกการแก้ไข',
    deleteNoteTitle: 'ลบบันทึก', cancelChangesTitle: 'ยกเลิกการเปลี่ยนแปลง', cancelBtn: 'ยกเลิก', saveNoteTitle: 'บันทึกโน้ต', saveBtn: 'บันทึก', savedBtn: 'บันทึกแล้ว',
    chooseNoteHint: 'เลือกบันทึกจากเมนูหรือเลือกด้านล่าง',
    deleteNoteModalTitle: 'ลบบันทึกหรือไม่?', deleteNoteConfirmPrefix: 'คุณแน่ใจหรือไม่ว่าต้องการลบ', deleteNoteConfirmSuffix: '? การดำเนินการนี้ไม่สามารถย้อนกลับได้',
    deleteModalCancel: 'ยกเลิก', deleteModalConfirm: 'ลบ',
  },
  Portuguese: {
    sections: { 'sec-quick': 'Notas rápidas', 'sec-personal': 'Pessoal', 'sec-ideas': 'Criativo', 'sec-work': 'Trabalho', 'sec-recipes': 'Receitas', 'sec-travel': 'Viagens' },
    descs: {
      'sec-quick': 'Registe pensamentos rápidos, lembretes diários, excertos curtos e ideias súbitas de imediato.',
      'sec-personal': 'Mantenha organizadas reflexões pessoais, entradas de diário, objetivos e notas do dia a dia.',
      'sec-ideas': 'Explore conceitos, rascunhos de histórias, inspiração de design e projetos criativos.',
      'sec-work': 'Organize atas de reuniões, planos de projeto, tarefas, documentação e referências.',
      'sec-recipes': 'Guarde receitas favoritas, listas de ingredientes, passos culinários e ideias de refeições.',
      'sec-travel': 'Planeie próximas viagens, itinerários, listas de bagagem, reservas e memórias.',
    },
    customDesc: (name) => `Use ${name} para organizar notas, listas, fotos e ligações de referência num só lugar.`,
    closeSidebar: 'Fechar barra lateral', hideSidebar: 'Ocultar barra lateral', showSidebar: 'Mostrar barra lateral', toggleSidebar: 'Alternar barra lateral',
    addSectionTitle: 'Adicionar secção', newBtn: 'Nova', sectionNamePlaceholder: 'Nome da secção...', saveSectionTitle: 'Guardar secção', cancelEditTitle: 'Cancelar edição',
    deleteNoteTitle: 'Eliminar nota', cancelChangesTitle: 'Cancelar alterações', cancelBtn: 'Cancelar', saveNoteTitle: 'Guardar nota', saveBtn: 'Guardar', savedBtn: 'Guardado',
    chooseNoteHint: 'Selecione uma nota no menu ou escolha abaixo',
    deleteNoteModalTitle: 'Eliminar nota?', deleteNoteConfirmPrefix: 'Tem a certeza de que deseja eliminar', deleteNoteConfirmSuffix: '? Esta ação não pode ser anulada.',
    deleteModalCancel: 'Cancelar', deleteModalConfirm: 'Eliminar',
  },
  Vietnamese: {
    sections: { 'sec-quick': 'Ghi chú nhanh', 'sec-personal': 'Cá nhân', 'sec-ideas': 'Sáng tạo', 'sec-work': 'Công việc', 'sec-recipes': 'Công thức', 'sec-travel': 'Du lịch' },
    descs: {
      'sec-quick': 'Ghi lại ngay các suy nghĩ nhanh, lời nhắc hằng ngày, đoạn ngắn và ý tưởng bất chợt.',
      'sec-personal': 'Lưu giữ suy ngẫm cá nhân, nhật ký, mục tiêu riêng, nhật ký sức khỏe và ghi chú đời sống.',
      'sec-ideas': 'Phác thảo ý tưởng, bản nháp câu chuyện, cảm hứng thiết kế và các dự án sáng tạo.',
      'sec-work': 'Sắp xếp biên bản họp, kế hoạch dự án, việc cần làm, tài liệu và tham khảo công việc.',
      'sec-recipes': 'Lưu công thức nấu ăn yêu thích, danh sách nguyên liệu, các bước chế biến và thử nghiệm bếp núc.',
      'sec-travel': 'Lên kế hoạch chuyến đi, lịch trình, danh sách hành lý, đặt chỗ và kỷ niệm hành trình.',
    },
    customDesc: (name) => `Dùng ${name} để sắp xếp ghi chú, danh sách, ảnh và liên kết tham khảo tại một nơi.`,
    closeSidebar: 'Đóng thanh bên', hideSidebar: 'Ẩn thanh bên', showSidebar: 'Hiện thanh bên', toggleSidebar: 'Bật/tắt thanh bên',
    addSectionTitle: 'Thêm mục', newBtn: 'Mới', sectionNamePlaceholder: 'Tên mục...', saveSectionTitle: 'Lưu mục', cancelEditTitle: 'Hủy chỉnh sửa',
    deleteNoteTitle: 'Xóa ghi chú', cancelChangesTitle: 'Hủy thay đổi', cancelBtn: 'Hủy', saveNoteTitle: 'Lưu ghi chú', saveBtn: 'Lưu', savedBtn: 'Đã lưu',
    chooseNoteHint: 'Chọn một ghi chú từ menu hoặc bên dưới',
    deleteNoteModalTitle: 'Xóa ghi chú?', deleteNoteConfirmPrefix: 'Bạn có chắc chắn muốn xóa', deleteNoteConfirmSuffix: '? Hành động này không thể hoàn tác.',
    deleteModalCancel: 'Hủy', deleteModalConfirm: 'Xóa',
  },
  Polish: {
    sections: { 'sec-quick': 'Szybkie notatki', 'sec-personal': 'Osobiste', 'sec-ideas': 'Kreatywne', 'sec-work': 'Praca', 'sec-recipes': 'Przepisy', 'sec-travel': 'Podróże' },
    descs: {
      'sec-quick': 'Zapisuj od razu szybkie myśli, codzienne przypomnienia, krótkie fragmenty i nagłe pomysły.',
      'sec-personal': 'Porządkuj osobiste przemyślenia, wpisy do dziennika, prywatne cele i codzienne notatki.',
      'sec-ideas': 'Zbieraj koncepcje, szkice opowiadań, inspiracje projektowe i twórcze projekty.',
      'sec-work': 'Organizuj notatki ze spotkań, plany projektów, zadania, dokumentację i materiały robocze.',
      'sec-recipes': 'Zapisuj ulubione przepisy, listy składników, kroki przygotowania i kuchenne pomysły.',
      'sec-travel': 'Planuj nadchodzące wyjazdy, trasy, listy pakowania, rezerwacje i wspomnienia.',
    },
    customDesc: (name) => `Użyj sekcji ${name}, aby uporządkować notatki, listy, zdjęcia i linki w jednym miejscu.`,
    closeSidebar: 'Zamknij panel boczny', hideSidebar: 'Ukryj panel boczny', showSidebar: 'Pokaż panel boczny', toggleSidebar: 'Przełącz panel boczny',
    addSectionTitle: 'Dodaj sekcję', newBtn: 'Nowa', sectionNamePlaceholder: 'Nazwa sekcji...', saveSectionTitle: 'Zapisz sekcję', cancelEditTitle: 'Anuluj edycję',
    deleteNoteTitle: 'Usuń notatkę', cancelChangesTitle: 'Odrzuć zmiany', cancelBtn: 'Anuluj', saveNoteTitle: 'Zapisz notatkę', saveBtn: 'Zapisz', savedBtn: 'Zapisano',
    chooseNoteHint: 'Wybierz notatkę z menu lub poniżej',
    deleteNoteModalTitle: 'Usunąć notatkę?', deleteNoteConfirmPrefix: 'Czy na pewno chcesz usunąć', deleteNoteConfirmSuffix: '? Tej operacji nie można cofnąć.',
    deleteModalCancel: 'Anuluj', deleteModalConfirm: 'Usuń',
  },
  Danish: {
    sections: { 'sec-quick': 'Hurtignoter', 'sec-personal': 'Personlig', 'sec-ideas': 'Kreativ', 'sec-work': 'Arbejde', 'sec-recipes': 'Opskrifter', 'sec-travel': 'Rejser' },
    descs: {
      'sec-quick': 'Fang hurtige tanker, daglige påmindelser, korte uddrag og pludselige idéer med det samme.',
      'sec-personal': 'Hold styr på personlige refleksioner, dagbogsindlæg, mål, sundhedslogs og hverdagsnoter.',
      'sec-ideas': 'Brainstorm koncepter, historieudkast, designinspiration og kreative projekter.',
      'sec-work': 'Organiser mødenoter, projektplaner, handlingspunkter, dokumentation og arbejdsreferencer.',
      'sec-recipes': 'Gem yndlingsopskrifter, ingredienslister, tilberedningstrin og køkkeneksperimenter.',
      'sec-travel': 'Planlæg kommende rejser, rejseplaner, pakkelister, bookinger og rejseminder.',
    },
    customDesc: (name) => `Brug ${name} til at organisere noter, tjeklister, billeder og referencelinks ét sted.`,
    closeSidebar: 'Luk sidebjælke', hideSidebar: 'Skjul sidebjælke', showSidebar: 'Vis sidebjælke', toggleSidebar: 'Skift sidebjælke',
    addSectionTitle: 'Tilføj sektion', newBtn: 'Ny', sectionNamePlaceholder: 'Sektionsnavn...', saveSectionTitle: 'Gem sektion', cancelEditTitle: 'Annuller redigering',
    deleteNoteTitle: 'Slet note', cancelChangesTitle: 'Fortryd ændringer', cancelBtn: 'Annuller', saveNoteTitle: 'Gem note', saveBtn: 'Gem', savedBtn: 'Gemt',
    chooseNoteHint: 'Vælg en note fra menuen eller nedenfor',
    deleteNoteModalTitle: 'Slet note?', deleteNoteConfirmPrefix: 'Er du sikker på, at du vil slette', deleteNoteConfirmSuffix: '? Denne handling kan ikke fortrydes.',
    deleteModalCancel: 'Annuller', deleteModalConfirm: 'Slet',
  },
  Turkish: {
    sections: { 'sec-quick': 'Hızlı Notlar', 'sec-personal': 'Kişisel', 'sec-ideas': 'Yaratıcı', 'sec-work': 'İş', 'sec-recipes': 'Tarifler', 'sec-travel': 'Seyahat' },
    descs: {
      'sec-quick': 'Anlık düşünceleri, günlük hatırlatıcıları, kısa notları ve ani fikirleri hemen kaydedin.',
      'sec-personal': 'Kişisel düşünceleri, günlük yazılarını, hedefleri, sağlık kayıtlarını ve günlük notları düzenleyin.',
      'sec-ideas': 'İlham geldiğinde fikir fırtınası yapın, taslaklar oluşturun ve yaratıcı projeleri toplayın.',
      'sec-work': 'Toplantı notlarını, proje planlarını, yapılacakları, belgeleri ve iş kaynaklarını düzenleyin.',
      'sec-recipes': 'Favori tarifleri, malzeme listelerini, pişirme adımlarını ve mutfak fikirlerini saklayın.',
      'sec-travel': 'Yaklaşan seyahatleri, rotaları, bavul listelerini, rezervasyonları ve anıları planlayın.',
    },
    customDesc: (name) => `Notlarınızı, listelerinizi, fotoğraflarınızı ve bağlantılarınızı tek yerde düzenlemek için ${name} bölümünü kullanın.`,
    closeSidebar: 'Kenar çubuğunu kapat', hideSidebar: 'Kenar çubuğunu gizle', showSidebar: 'Kenar çubuğunu göster', toggleSidebar: 'Kenar çubuğunu aç/kapat',
    addSectionTitle: 'Bölüm Ekle', newBtn: 'Yeni', sectionNamePlaceholder: 'Bölüm adı...', saveSectionTitle: 'Bölümü kaydet', cancelEditTitle: 'Düzenlemeyi iptal et',
    deleteNoteTitle: 'Notu sil', cancelChangesTitle: 'Değişiklikleri iptal et', cancelBtn: 'İptal', saveNoteTitle: 'Notu kaydet', saveBtn: 'Kaydet', savedBtn: 'Kaydedildi',
    chooseNoteHint: 'Menüden veya aşağıdan bir not seçin',
    deleteNoteModalTitle: 'Not Silinsin mi?', deleteNoteConfirmPrefix: 'Şunu silmek istediğinizden emin misiniz:', deleteNoteConfirmSuffix: '? Bu işlem geri alınamaz.',
    deleteModalCancel: 'İptal', deleteModalConfirm: 'Sil',
  },
  Greek: {
    sections: { 'sec-quick': 'Γρήγορες Σημειώσεις', 'sec-personal': 'Προσωπικά', 'sec-ideas': 'Δημιουργικά', 'sec-work': 'Εργασία', 'sec-recipes': 'Συνταγές', 'sec-travel': 'Ταξίδια' },
    descs: {
      'sec-quick': 'Καταγράψτε γρήγορες σκέψεις, καθημερινές υπενθυμίσεις, σύντομα αποσπάσματα και ξαφνικές ιδέες.',
      'sec-personal': 'Οργανώστε προσωπικές σκέψεις, ημερολόγιο, στόχους, καταγραφές υγείας και καθημερινές σημειώσεις.',
      'sec-ideas': 'Συγκεντρώστε ιδέες, προσχέδια ιστοριών, έμπνευση σχεδιασμού και δημιουργικά έργα.',
      'sec-work': 'Οργανώστε πρακτικά συναντήσεων, πλάνα έργων, εκκρεμότητες, έγγραφα και επαγγελματικές αναφορές.',
      'sec-recipes': 'Αποθηκεύστε αγαπημένες συνταγές, λίστες υλικών, βήματα μαγειρικής και ιδέες γευμάτων.',
      'sec-travel': 'Σχεδιάστε επερχόμενα ταξίδια, διαδρομές, λίστες αποσκευών, κρατήσεις και ταξιδιωτικές αναμνήσεις.',
    },
    customDesc: (name) => `Χρησιμοποιήστε την ενότητα ${name} για να οργανώσετε σημειώσεις, λίστες, φωτογραφίες και συνδέσμους.`,
    closeSidebar: 'Κλείσιμο πλευρικής μπάρας', hideSidebar: 'Απόκρυψη πλευρικής μπάρας', showSidebar: 'Εμφάνιση πλευρικής μπάρας', toggleSidebar: 'Εναλλαγή πλευρικής μπάρας',
    addSectionTitle: 'Προσθήκη Ενότητας', newBtn: 'Νέα', sectionNamePlaceholder: 'Όνομα ενότητας...', saveSectionTitle: 'Αποθήκευση ενότητας', cancelEditTitle: 'Ακύρωση επεξεργασίας',
    deleteNoteTitle: 'Διαγραφή σημείωσης', cancelChangesTitle: 'Ακύρωση αλλαγών', cancelBtn: 'Ακύρωση', saveNoteTitle: 'Αποθήκευση σημείωσης', saveBtn: 'Αποθήκευση', savedBtn: 'Αποθηκεύτηκε',
    chooseNoteHint: 'Επιλέξτε μια σημείωση από το μενού ή παρακάτω',
    deleteNoteModalTitle: 'Διαγραφή σημείωσης;', deleteNoteConfirmPrefix: 'Είστε βέβαιοι ότι θέλετε να διαγράψετε', deleteNoteConfirmSuffix: '; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.',
    deleteModalCancel: 'Ακύρωση', deleteModalConfirm: 'Διαγραφή',
  },
};

const getSectionDisplayName = (sec: Section | undefined, extra: NotesExtraLocale) => {
  if (!sec) return extra.sections['sec-quick'] || 'Quick Notes';
  if (isDefaultSection(sec)) {
    const canonicalId = DEFAULT_SECTION_IDS.has(sec.id)
      ? sec.id
      : LEGACY_DEFAULT_NAME_TO_ID[sec.name.trim().toLowerCase()];
    if (canonicalId && extra.sections[canonicalId]) {
      return extra.sections[canonicalId];
    }
  }
  return sec.name;
};

const getSectionLandingMeta = (sec: Section | undefined, extra: NotesExtraLocale) => {
  const displayName = getSectionDisplayName(sec, extra);
  switch (sec?.id) {
    case 'sec-quick':
      return { Icon: Zap, description: extra.descs['sec-quick'] };
    case 'sec-personal':
      return { Icon: User, description: extra.descs['sec-personal'] };
    case 'sec-ideas':
      return { Icon: Sparkles, description: extra.descs['sec-ideas'] };
    case 'sec-work':
      return { Icon: Briefcase, description: extra.descs['sec-work'] };
    case 'sec-recipes':
      return { Icon: UtensilsCrossed, description: extra.descs['sec-recipes'] };
    case 'sec-travel':
      return { Icon: Plane, description: extra.descs['sec-travel'] };
    default:
      return { Icon: FolderOpen, description: extra.customDesc(displayName) };
  }
};

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
    enterPageTitle: 'Enter Note Title',
    noNotebook: 'No Note Selected',
    createNotesDesc: 'Create notes, organize folders, and build formatted workspace sheets.',
    createPage: 'CREATE NOTE',
    sections: 'Sections',
    manageSectionTitle: 'Section Options',
    manageSectionMsg: 'Do you want to edit or delete this section?',
    editSectionBtn: 'Edit',
    deleteSectionBtn: 'Delete'
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
    sections: 'Secciones',
    manageSectionTitle: 'Opciones de sección',
    manageSectionMsg: '¿Deseas editar o eliminar esta sección?',
    editSectionBtn: 'Editar',
    deleteSectionBtn: 'Eliminar'
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
    sections: 'Sections',
    manageSectionTitle: 'Options de section',
    manageSectionMsg: 'Voulez-vous modifier ou supprimer cette section ?',
    editSectionBtn: 'Modifier',
    deleteSectionBtn: 'Supprimer'
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
    sections: 'Bereiche',
    manageSectionTitle: 'Bereichsoptionen',
    manageSectionMsg: 'Möchten Sie diesen Bereich bearbeiten oder löschen?',
    editSectionBtn: 'Bearbeiten',
    deleteSectionBtn: 'Löschen'
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
    sections: '分区',
    manageSectionTitle: '分区操作',
    manageSectionMsg: '您想要编辑还是删除此分区？',
    editSectionBtn: '编辑',
    deleteSectionBtn: '删除'
  },
  'Chinese Traditional': {
    cancel: '取消',
    create: '建立',
    activeSpaces: '個活躍分區',
    sheetsList: '筆記',
    filterSheets: '搜尋篩選筆記...',
    noPageEntries: '目前分區尚無筆記',
    untitledPage: '無標題筆記',
    noAdditionalText: '暫無附加文字',
    addNewPage: '建立筆記',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: '輸入筆記標題...',
    noNotebook: '未選擇任何筆記',
    createNotesDesc: '在此記錄您的靈感日記、企劃方案或個人備忘，分區隨心整理。',
    createPage: '建立筆記',
    sections: '分區',
    manageSectionTitle: '分區操作',
    manageSectionMsg: '您想要編輯還是刪除此分區？',
    editSectionBtn: '編輯',
    deleteSectionBtn: '刪除'
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
    sections: 'セクション',
    manageSectionTitle: 'セクション設定',
    manageSectionMsg: 'このセクションを編集または削除しますか？',
    editSectionBtn: '編集',
    deleteSectionBtn: '削除'
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
    sections: '섹션',
    manageSectionTitle: '섹션 옵션',
    manageSectionMsg: '이 섹션을 수정하거나 삭제하시겠습니까?',
    editSectionBtn: '수정',
    deleteSectionBtn: '삭제'
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
    sections: 'Sezioni',
    manageSectionTitle: 'Opzioni sezione',
    manageSectionMsg: 'Vuoi modificare o eliminare questa sezione?',
    editSectionBtn: 'Modifica',
    deleteSectionBtn: 'Elimina'
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
    sections: 'Разделы',
    manageSectionTitle: 'Действие с разделом',
    manageSectionMsg: 'Вы хотите изменить или удалить этот раздел?',
    editSectionBtn: 'Изменить',
    deleteSectionBtn: 'Удалить'
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
    sections: 'Beräicher',
    manageSectionTitle: 'Beräich-Optiounen',
    manageSectionMsg: 'Wëllt Dir dëse Beräich änneren oder läschen?',
    editSectionBtn: 'Änneren',
    deleteSectionBtn: 'Läschen'
  },
  Dutch: {
    cancel: 'ANNULEREN',
    create: 'MAKEN',
    activeSpaces: 'actieve ruimtes',
    sheetsList: 'Notities',
    filterSheets: 'Notities filteren...',
    noPageEntries: 'Geen notities in deze sectie',
    untitledPage: 'Naamloze notitie',
    noAdditionalText: 'Geen extra tekst',
    addNewPage: 'NOTITIE MAKEN',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'Notitietitel invoeren...',
    noNotebook: 'Geen notitie geselecteerd',
    createNotesDesc: 'Maak notities, organiseer mappen en maak opgemaakte werkbladen.',
    createPage: 'NOTITIE MAKEN',
    sections: 'Secties',
    manageSectionTitle: 'Sectie-opties',
    manageSectionMsg: 'Wil je deze sectie bewerken of verwijderen?',
    editSectionBtn: 'Bewerken',
    deleteSectionBtn: 'Verwijderen'
  },
  Swedish: {
    cancel: 'AVBRYT',
    create: 'SKAPA',
    activeSpaces: 'aktiva ytor',
    sheetsList: 'Anteckningar',
    filterSheets: 'Filtrera anteckningar...',
    noPageEntries: 'Inga anteckningar i detta avsnitt',
    untitledPage: 'Namnlös anteckning',
    noAdditionalText: 'Ingen ytterligare text',
    addNewPage: 'SKAPA ANTECKNING',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'Ange titel...',
    noNotebook: 'Ingen anteckning vald',
    createNotesDesc: 'Skapa anteckningar, organisera mappar och bygg formaterade arbetsblad.',
    createPage: 'SKAPA ANTECKNING',
    sections: 'Avsnitt',
    manageSectionTitle: 'Avsnittsalternativ',
    manageSectionMsg: 'Vill du redigera eller ta bort det här avsnittet?',
    editSectionBtn: 'Redigera',
    deleteSectionBtn: 'Ta bort'
  },
  Finnish: {
    cancel: 'PERUUTA',
    create: 'LUO',
    activeSpaces: 'aktiivista tilaa',
    sheetsList: 'Muistiinpanot',
    filterSheets: 'Suodata muistiinpanoja...',
    noPageEntries: 'Ei muistiinpanoja tässä osiossa',
    untitledPage: 'Nimetön muistiinpano',
    noAdditionalText: 'Ei lisätekstiä',
    addNewPage: 'LUO MUISTIINPANO',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'Kirjoita otsikko...',
    noNotebook: 'Ei valittua muistiinpanoa',
    createNotesDesc: 'Luo muistiinpanoja, järjestele kansioita ja muotoile työlehtiä.',
    createPage: 'LUO MUISTIINPANO',
    sections: 'Osiot',
    manageSectionTitle: 'Osion asetukset',
    manageSectionMsg: 'Haluatko muokata tätä osiota vai poistaa sen?',
    editSectionBtn: 'Muokkaa',
    deleteSectionBtn: 'Poista'
  },
  Hindi: {
    cancel: 'रद्द करें',
    create: 'बनाएँ',
    activeSpaces: 'सक्रिय अनुभाग',
    sheetsList: 'नोट्स',
    filterSheets: 'नोट्स फ़िल्टर करें...',
    noPageEntries: 'इस अनुभाग में कोई नोट नहीं है',
    untitledPage: 'शीर्षकहीन नोट',
    noAdditionalText: 'कोई अतिरिक्त पाठ नहीं',
    addNewPage: 'नोट बनाएँ',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'नोट शीर्षक दर्ज करें...',
    noNotebook: 'कोई नोट चयनित नहीं',
    createNotesDesc: 'नोट्स बनाएँ, फ़ोल्डर व्यवस्थित करें और फ़ॉर्मेट की गई वर्कशीट तैयार करें।',
    createPage: 'नोट बनाएँ',
    sections: 'अनुभाग',
    manageSectionTitle: 'अनुभाग विकल्प',
    manageSectionMsg: 'क्या आप इस अनुभाग को संपादित करना या हटाना चाहते हैं?',
    editSectionBtn: 'संपादित करें',
    deleteSectionBtn: 'हटाएँ'
  },
  Norwegian: {
    cancel: 'AVBRYT',
    create: 'OPPRETT',
    activeSpaces: 'aktive områder',
    sheetsList: 'Notater',
    filterSheets: 'Filtrer notater...',
    noPageEntries: 'Ingen notater i denne seksjonen',
    untitledPage: 'Notat uten tittel',
    noAdditionalText: 'Ingen ekstra tekst',
    addNewPage: 'OPPRETT NOTAT',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'Skriv inn tittel...',
    noNotebook: 'Ingen notat valgt',
    createNotesDesc: 'Opprett notater, organiser mapper og lag formaterte arbeidsark.',
    createPage: 'OPPRETT NOTAT',
    sections: 'Seksjoner',
    manageSectionTitle: 'Seksjonsvalg',
    manageSectionMsg: 'Vil du redigere eller slette denne seksjonen?',
    editSectionBtn: 'Rediger',
    deleteSectionBtn: 'Slett'
  },
  Thai: {
    cancel: 'ยกเลิก',
    create: 'สร้าง',
    activeSpaces: 'พื้นที่ที่ใช้งาน',
    sheetsList: 'บันทึกย่อ',
    filterSheets: 'กรองบันทึกย่อ...',
    noPageEntries: 'ไม่มีบันทึกย่อในหมวดหมู่นี้',
    untitledPage: 'บันทึกไม่มีชื่อ',
    noAdditionalText: 'ไม่มีข้อความเพิ่มเติม',
    addNewPage: 'สร้างบันทึก',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'กรอกชื่อบันทึก...',
    noNotebook: 'ไม่ได้เลือกบันทึก',
    createNotesDesc: 'สร้างบันทึก จัดระเบียบโฟลเดอร์ และจัดรูปแบบเอกสารการทำงานของคุณ',
    createPage: 'สร้างบันทึก',
    sections: 'หมวดหมู่',
    manageSectionTitle: 'จัดการหมวดหมู่',
    manageSectionMsg: 'คุณต้องการแก้ไขหรือลบหมวดหมู่นี้หรือไม่?',
    editSectionBtn: 'แก้ไข',
    deleteSectionBtn: 'ลบ'
  },
  Portuguese: {
    cancel: 'CANCELAR',
    create: 'CRIAR',
    activeSpaces: 'espaços ativos',
    sheetsList: 'Notas',
    filterSheets: 'Filtrar notas...',
    noPageEntries: 'Nenhuma nota nesta secção',
    untitledPage: 'Nota sem título',
    noAdditionalText: 'Sem texto adicional',
    addNewPage: 'CRIAR NOTA',
    oneNoteWorkspace: 'NOTE WORKSPACE',
    enterPageTitle: 'Introduza o título da nota...',
    noNotebook: 'Nenhuma Nota Selecionada',
    createNotesDesc: 'Crie notas, organize pastas e construa folhas de trabalho formatadas.',
    createPage: 'CRIAR NOTA',
    sections: 'Secções',
    manageSectionTitle: 'Opções da Secção',
    manageSectionMsg: 'Deseja editar ou eliminar esta secção?',
    editSectionBtn: 'Editar',
    deleteSectionBtn: 'Eliminar'
  },
  Vietnamese: {
    cancel: 'HỦY',
    create: 'TẠO',
    activeSpaces: 'không gian đang mở',
    sheetsList: 'Ghi chú',
    filterSheets: 'Lọc ghi chú...',
    noPageEntries: 'Không có ghi chú nào trong mục này',
    untitledPage: 'Ghi chú chưa đặt tên',
    noAdditionalText: 'Không có nội dung thêm',
    addNewPage: 'TẠO GHI CHÚ',
    oneNoteWorkspace: 'KHÔNG GIAN GHI CHÚ',
    enterPageTitle: 'Nhập tiêu đề ghi chú...',
    noNotebook: 'Chưa chọn ghi chú nào',
    createNotesDesc: 'Tạo ghi chú, sắp xếp thư mục và xây dựng trang tài liệu gọn gàng.',
    createPage: 'TẠO GHI CHÚ',
    sections: 'Mục',
    manageSectionTitle: 'Tùy chọn mục',
    manageSectionMsg: 'Bạn muốn chỉnh sửa hay xóa mục này?',
    editSectionBtn: 'Chỉnh sửa',
    deleteSectionBtn: 'Xóa'
  },
  Polish: {
    cancel: 'ANULUJ',
    create: 'UTWÓRZ',
    activeSpaces: 'aktywne przestrzenie',
    sheetsList: 'Notatki',
    filterSheets: 'Filtruj notatki...',
    noPageEntries: 'Brak notatek w tej sekcji',
    untitledPage: 'Notatka bez tytułu',
    noAdditionalText: 'Brak dodatkowego tekstu',
    addNewPage: 'UTWÓRZ NOTATKĘ',
    oneNoteWorkspace: 'PRZESTRZEŃ NOTATEK',
    enterPageTitle: 'Wpisz tytuł notatki...',
    noNotebook: 'Nie wybrano notatki',
    createNotesDesc: 'Twórz notatki, porządkuj foldery i buduj sformatowane arkusze robocze.',
    createPage: 'UTWÓRZ NOTATKĘ',
    sections: 'Sekcje',
    manageSectionTitle: 'Opcje sekcji',
    manageSectionMsg: 'Czy chcesz edytować lub usunąć tę sekcję?',
    editSectionBtn: 'Edytuj',
    deleteSectionBtn: 'Usuń'
  },
  Danish: {
    cancel: 'ANNULLER',
    create: 'OPRET',
    activeSpaces: 'aktive rum',
    sheetsList: 'Noter',
    filterSheets: 'Filtrer noter...',
    noPageEntries: 'Ingen noter i denne sektion',
    untitledPage: 'Unavngiven note',
    noAdditionalText: 'Ingen ekstra tekst',
    addNewPage: 'OPRET NOTE',
    oneNoteWorkspace: 'NOTEWORKSPACE',
    enterPageTitle: 'Indtast notetitel...',
    noNotebook: 'Ingen note valgt',
    createNotesDesc: 'Opret noter, organiser mapper, og opbyg formaterede arbejdsark.',
    createPage: 'OPRET NOTE',
    sections: 'Sektioner',
    manageSectionTitle: 'Sektionsindstillinger',
    manageSectionMsg: 'Vil du redigere eller slette denne sektion?',
    editSectionBtn: 'Rediger',
    deleteSectionBtn: 'Slet'
  },
  Turkish: {
    cancel: 'İPTAL',
    create: 'OLUŞTUR',
    activeSpaces: 'etkin alan',
    sheetsList: 'Notlar',
    filterSheets: 'Notları filtrele...',
    noPageEntries: 'Bu bölümde not yok',
    untitledPage: 'Başlıksız Not',
    noAdditionalText: 'Ek metin yok',
    addNewPage: 'NOT OLUŞTUR',
    oneNoteWorkspace: 'NOT ÇALIŞMA ALANI',
    enterPageTitle: 'Not başlığı girin...',
    noNotebook: 'Not Seçilmedi',
    createNotesDesc: 'Notlar oluşturun, klasörleri düzenleyin ve biçimlendirilmiş çalışma sayfaları hazırlayın.',
    createPage: 'NOT OLUŞTUR',
    sections: 'Bölümler',
    manageSectionTitle: 'Bölüm Seçenekleri',
    manageSectionMsg: 'Bu bölümü düzenlemek veya silmek ister misiniz?',
    editSectionBtn: 'Düzenle',
    deleteSectionBtn: 'Sil'
  },
  Greek: {
    cancel: 'ΑΚΥΡΩΣΗ',
    create: 'ΔΗΜΙΟΥΡΓΙΑ',
    activeSpaces: 'ενεργοί χώροι',
    sheetsList: 'Σημειώσεις',
    filterSheets: 'Φιλτράρισμα σημειώσεων...',
    noPageEntries: 'Δεν υπάρχουν σημειώσεις σε αυτή την ενότητα',
    untitledPage: 'Σημείωση χωρίς τίτλο',
    noAdditionalText: 'Χωρίς επιπλέον κείμενο',
    addNewPage: 'ΔΗΜΙΟΥΡΓΙΑ ΣΗΜΕΙΩΣΗΣ',
    oneNoteWorkspace: 'ΧΩΡΟΣ ΣΗΜΕΙΩΣΕΩΝ',
    enterPageTitle: 'Εισαγάγετε τίτλο σημείωσης...',
    noNotebook: 'Δεν επιλέχθηκε σημείωση',
    createNotesDesc: 'Δημιουργήστε σημειώσεις, οργανώστε φακέλους και φτιάξτε μορφοποιημένα φύλλα εργασίας.',
    createPage: 'ΔΗΜΙΟΥΡΓΙΑ ΣΗΜΕΙΩΣΗΣ',
    sections: 'Ενότητες',
    manageSectionTitle: 'Επιλογές Ενότητας',
    manageSectionMsg: 'Θέλετε να επεξεργαστείτε ή να διαγράψετε αυτή την ενότητα;',
    editSectionBtn: 'Επεξεργασία',
    deleteSectionBtn: 'Διαγραφή'
  }
};

export default function NotesTab({ language = 'English' }: NotesTabProps = {}) {
  const dictionary = NOTES_T[language] || NOTES_T['English'];
  const extraT = NOTES_EXTRA_T[language] || NOTES_EXTRA_T['English'];
  const locale = NOTES_LOCALES[language] || 'en-US';

  const [sections, setSections] = useLocalStorage<Section[]>('GeekTabs-one-sections', DEFAULT_SECTIONS);
  const [notes, setNotes] = useLocalStorage<Note[]>('GeekTabs-one-notes', []);

  // Ensure default sections are normalized to Quick Notes / Personal / Creative / Work / Recipe / Travel
  useEffect(() => {
    const idRemap: Record<string, string> = {};
    setSections((prev) => {
      const customSections: Section[] = [];
      const seenCustomIds = new Set<string>();

      prev.forEach((sec) => {
        const mappedById = DEFAULT_SECTION_IDS.has(sec.id) ? sec.id : undefined;
        const mappedByName = LEGACY_DEFAULT_NAME_TO_ID[sec.name.trim().toLowerCase()];
        const canonicalId = mappedById || mappedByName;

        if (canonicalId) {
          if (sec.id !== canonicalId) {
            idRemap[sec.id] = canonicalId;
          }
        } else if (!seenCustomIds.has(sec.id)) {
          seenCustomIds.add(sec.id);
          customSections.push(sec);
        }
      });

      const normalized = [...DEFAULT_SECTIONS, ...customSections];
      const isSame =
        normalized.length === prev.length &&
        normalized.every(
          (s, idx) =>
            prev[idx].id === s.id &&
            prev[idx].name === s.name &&
            prev[idx].color === s.color
        );

      return isSame ? prev : normalized;
    });

    if (Object.keys(idRemap).length > 0) {
      setNotes((prev) => {
        let changed = false;
        const mapped = prev.map((n) => {
          const targetId = idRemap[n.sectionId];
          if (targetId && targetId !== n.sectionId) {
            changed = true;
            return { ...n, sectionId: targetId };
          }
          return n;
        });
        return changed ? mapped : prev;
      });
    }
  }, [setSections, setNotes]);

  const [activeSectionId, setActiveSectionId] = useState<string>('sec-quick');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const [newSectionName, setNewSectionName] = useState('');
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState('');
  const [sectionMenuTarget, setSectionMenuTarget] = useState<Section | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [savedNoticeId, setSavedNoticeId] = useState<string | null>(null);
  const [editorResetKey, setEditorResetKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const savedSnapshotsRef = useRef<Record<string, { title: string; content: string; isNew: boolean }>>({});

  // Ensure activeSectionId fallback exists
  const activeSectionExists = sections.some(s => s.id === activeSectionId);
  const currentSectionId = activeSectionExists ? activeSectionId : (sections[0]?.id || 'sec-quick');

  const notesBySection = notes.filter(n => (n.sectionId || 'sec-quick') === currentSectionId);
  const activeNote = activeNoteId
    ? notes.find(n => n.id === activeNoteId && (n.sectionId || 'sec-quick') === currentSectionId) || null
    : null;

  // Clear activeNoteId if the selected note no longer exists in the active section
  useEffect(() => {
    if (activeNoteId && !notes.some(n => n.id === activeNoteId && (n.sectionId || 'sec-quick') === currentSectionId)) {
      setActiveNoteId(null);
    }
  }, [activeNoteId, notes, currentSectionId]);

  // Record saved snapshot for existing notes when opened
  useEffect(() => {
    if (activeNote && !savedSnapshotsRef.current[activeNote.id]) {
      savedSnapshotsRef.current[activeNote.id] = {
        title: activeNote.title,
        content: activeNote.content,
        isNew: false,
      };
    }
  }, [activeNote]);

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSectionName.trim();
    if (!trimmed) return;
    const existingDefault = sections.find(
      (s) => s.name.trim().toLowerCase() === trimmed.toLowerCase() && isDefaultSection(s)
    );
    if (existingDefault) {
      setActiveSectionId(existingDefault.id);
      setActiveNoteId(null);
      setNewSectionName('');
      setIsCreatingSection(false);
      return;
    }
    const newSec: Section = {
      id: 'sec-' + Date.now().toString(),
      name: trimmed,
      color: SECTION_COLORS[sections.length % SECTION_COLORS.length]
    };
    setSections([...sections, newSec]);
    setActiveSectionId(newSec.id);
    setActiveNoteId(null);
    setNewSectionName('');
    setIsCreatingSection(false);
  };

  const handleStartEditSection = (sec: Section, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isDefaultSection(sec)) return;
    setEditingSectionId(sec.id);
    setEditingSectionName(sec.name);
  };

  const handleSaveEditSection = (id: string, e?: React.FormEvent) => {
    e?.preventDefault();
    const target = sections.find((s) => s.id === id);
    if (!target || isDefaultSection(target)) {
      setEditingSectionId(null);
      return;
    }
    const trimmed = editingSectionName.trim();
    if (!trimmed || DEFAULT_SECTION_NAMES.has(trimmed.toLowerCase())) return;
    setSections(sections.map(s => (s.id === id ? { ...s, name: trimmed } : s)));
    setEditingSectionId(null);
    setEditingSectionName('');
  };

  const handleDeleteSection = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const target = sections.find((s) => s.id === id);
    if (!target || isDefaultSection(target) || sections.length <= 1) {
      return;
    }
    const filtered = sections.filter(s => s.id !== id);
    const remainingNotes = notes.filter(n => n.sectionId !== id);
    setSections(filtered);
    setNotes(remainingNotes);

    if (editingSectionId === id) {
      setEditingSectionId(null);
      setEditingSectionName('');
    }
    if (activeSectionId === id) {
      const nextSecId = filtered[0]?.id || 'sec-quick';
      setActiveSectionId(nextSecId);
      setActiveNoteId(null);
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
    savedSnapshotsRef.current[newNote.id] = {
      title: '',
      content: '',
      isNew: true,
    };
    setNotes((prev) => {
      const next = [newNote, ...prev];
      try {
        window.localStorage.setItem('GeekTabs-one-notes', JSON.stringify(next));
      } catch {
        // Handled by useLocalStorage
      }
      return next;
    });
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    delete savedSnapshotsRef.current[id];
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
      try {
        window.localStorage.setItem('GeekTabs-one-notes', JSON.stringify(updated));
      } catch {
        // Handled by useLocalStorage
      }
      return updated;
    });
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          return { ...n, ...updates, updatedAt: Date.now() };
        }
        return n;
      })
    );
  };

  const handleSaveNoteNow = (id: string) => {
    setNotes((prev) => {
      const next = prev.map((n) => {
        if (n.id === id) {
          savedSnapshotsRef.current[id] = {
            title: n.title,
            content: n.content,
            isNew: false,
          };
          return { ...n, updatedAt: Date.now() };
        }
        return n;
      });
      try {
        window.localStorage.setItem('GeekTabs-one-notes', JSON.stringify(next));
      } catch {
        // Handled by useLocalStorage
      }
      return next;
    });
    setSavedNoticeId(id);
    window.setTimeout(() => {
      setSavedNoticeId((curr) => (curr === id ? null : curr));
    }, 1800);
  };

  const handleCancelNote = (id: string) => {
    const snap = savedSnapshotsRef.current[id];
    if (snap?.isNew) {
      handleDeleteNote(id);
      return;
    }
    if (snap) {
      setNotes((prev) => {
        const next = prev.map((n) =>
          n.id === id ? { ...n, title: snap.title, content: snap.content } : n
        );
        try {
          window.localStorage.setItem('GeekTabs-one-notes', JSON.stringify(next));
        } catch {
          // Handled by useLocalStorage
        }
        return next;
      });
      setEditorResetKey((k) => k + 1);
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const currentSectionInfo = sections.find(s => s.id === currentSectionId);
  const currentSectionTitle = getSectionDisplayName(currentSectionInfo, extraT);
  const currentLandingMeta = getSectionLandingMeta(currentSectionInfo, extraT);
  const SectionLandingIcon = currentLandingMeta.Icon;

  return (
    <>
    <div className="notes-tab-container w-full min-h-[calc(100vh-3.5rem)] flex-1 flex flex-row relative z-10 bg-white/85 dark:bg-[#0c1017]/85 text-slate-800 dark:text-slate-100">
      
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed top-14 inset-x-0 bottom-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (Sticky alongside page scroll like Settings) */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-50 md:sticky md:top-14 md:bottom-auto md:self-start md:h-[calc(100vh-3.5rem)] transition-[transform,width] duration-300 ease-in-out shrink-0 flex flex-col border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0e131d]/95 md:bg-black/[0.02] md:dark:bg-black/30 backdrop-blur-2xl ${
          mobileSidebarOpen 
            ? 'w-72 sm:w-80 translate-x-0 shadow-2xl border-r' 
            : sidebarOpen 
              ? 'w-72 sm:w-80 -translate-x-full md:translate-x-0 md:w-64 lg:w-80 border-r opacity-100' 
              : 'w-0 -translate-x-full md:translate-x-0 md:w-0 border-r-0 opacity-0 overflow-hidden pointer-events-none'
        }`}
      >
        {/* Top of Sidebar: Action Button */}
        <div className="p-3.5 md:p-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              handleCreateNote();
              if (typeof window !== 'undefined' && window.innerWidth < 768) setMobileSidebarOpen(false);
            }}
            style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
            className="notes-create-page-btn flex-1 min-w-0 min-h-[40px] md:min-h-[44px] lg:min-h-0 flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-3 px-3 md:px-5 rounded-2xl bg-[#4f46e5] hover:bg-[#4338ca] !text-white text-white font-black text-[10px] sm:text-[11px] md:text-xs uppercase tracking-normal md:tracking-wider shadow-md shadow-[#4f46e5]/35 transition-colors cursor-pointer active:scale-98 select-none"
          >
            <Plus size={13} strokeWidth={3} className="shrink-0 md:w-[15px] md:h-[15px] !text-white text-white" style={{ stroke: '#ffffff' }} />
            <span className="!text-white text-white font-black tracking-normal md:tracking-wider truncate" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dictionary.addNewPage}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer shrink-0"
            title={extraT.closeSidebar}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section / Folder Chips Selector - Exactly 2 options per line */}
        <div className="px-3 md:px-4 pt-3 pb-2 border-b border-black/5 dark:border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white/70">
              {dictionary.sections}
            </span>
            <button
              type="button"
              onClick={() => setIsCreatingSection(!isCreatingSection)}
              className="px-2 md:px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-[#4f46e5]/10 text-slate-600 dark:text-white/70 hover:text-[#4f46e5] border border-black/5 dark:border-white/10 cursor-pointer text-[9.5px] md:text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs"
              title={extraT.addSectionTitle}
            >
              <Plus size={10} strokeWidth={2.5} className="md:w-[11px] md:h-[11px]" />
              <span>{extraT.newBtn}</span>
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
                  placeholder={extraT.sectionNamePlaceholder}
                  className="w-full bg-white dark:bg-black/30 border border-black/10 dark:border-white/15 rounded-xl px-3 py-2 lg:py-1.5 text-base sm:text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 focus:border-[#4f46e5] text-slate-900 dark:text-white"
                />
                <div className="flex gap-1.5 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCreatingSection(false)}
                    style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                    className="px-2 md:px-2.5 py-1 text-[9.5px] md:text-[10px] font-bold rounded-lg bg-black/20 dark:bg-white/10 hover:bg-black/30 dark:hover:bg-white/20 !text-white text-white cursor-pointer"
                  >
                    <span className="!text-white text-white font-bold" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dictionary.cancel}</span>
                  </button>
                  <button
                    type="submit"
                    disabled={!newSectionName.trim()}
                    style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                    className="notes-create-page-btn px-2.5 md:px-3 py-1 bg-[#4f46e5] hover:bg-[#4338ca] !text-white text-white rounded-xl text-[9.5px] md:text-[10px] font-black uppercase tracking-wider transition-shadow disabled:opacity-45 cursor-pointer shadow-sm shadow-[#4f46e5]/25"
                  >
                    <span className="!text-white text-white font-black" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{dictionary.create}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Sections Grid - Exactly 2 options per line */}
          <div className="grid grid-cols-2 gap-1.5 md:gap-2 pt-1 pb-1">
            {sections.map((sec) => {
              const active = currentSectionId === sec.id;
              const isCustomSection = !isDefaultSection(sec);
              const isEditing = isCustomSection && editingSectionId === sec.id;

              if (isEditing) {
                return (
                  <form
                    key={sec.id}
                    onSubmit={(e) => handleSaveEditSection(sec.id, e)}
                    className="col-span-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 border border-[#4f46e5]/40"
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sec.color }} />
                    <input
                      autoFocus
                      type="text"
                      value={editingSectionName}
                      onChange={(e) => setEditingSectionName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          e.preventDefault();
                          setEditingSectionId(null);
                          setEditingSectionName('');
                        }
                      }}
                      className="flex-1 min-w-0 bg-white dark:bg-black/30 border border-black/10 dark:border-white/15 rounded-lg px-2 py-1.5 lg:py-1 text-base sm:text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 text-slate-900 dark:text-white"
                      placeholder={extraT.sectionNamePlaceholder}
                    />
                    <button
                      type="submit"
                      disabled={!editingSectionName.trim()}
                      className="p-1 rounded-lg bg-[#4f46e5] text-white hover:bg-[#4338ca] disabled:opacity-45 cursor-pointer shrink-0"
                      title={extraT.saveSectionTitle}
                    >
                      <Check size={12} style={{ stroke: '#ffffff', color: '#ffffff' }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSectionId(null);
                        setEditingSectionName('');
                      }}
                      className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 cursor-pointer shrink-0"
                      title={extraT.cancelEditTitle}
                    >
                      <X size={12} />
                    </button>
                  </form>
                );
              }

              const secLabel = getSectionDisplayName(sec, extraT);

              return (
                <div
                  key={sec.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    setActiveNoteId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveSectionId(sec.id);
                      setActiveNoteId(null);
                    }
                  }}
                  className={`group flex items-center justify-between gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 min-h-[38px] md:min-h-[42px] lg:min-h-0 rounded-xl text-[10px] sm:text-[11px] md:text-xs font-bold transition-colors cursor-pointer border select-none min-w-0 ${
                    active
                      ? 'bg-[#4f46e5]/15 text-[#4f46e5] dark:text-indigo-400 border-[#4f46e5]/30 shadow-2xs'
                      : 'bg-black/5 dark:bg-white/5 border-transparent text-slate-600 dark:text-white/60 hover:text-slate-900 hover:dark:text-white hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                  title={secLabel}
                >
                  <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shrink-0" style={{ backgroundColor: sec.color }} />
                    <span className="truncate leading-tight">{secLabel}</span>
                  </div>
                  {isCustomSection && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSectionMenuTarget(sec);
                      }}
                      className="p-1 md:p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/15 opacity-80 lg:opacity-70 hover:opacity-100 cursor-pointer transition-opacity shrink-0"
                      title={dictionary.manageSectionTitle}
                      aria-label={`${dictionary.manageSectionTitle}: ${secLabel}`}
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Note Pages List in Section */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-thin">
          <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white/70">
            {dictionary.sheetsList}
          </div>

          {notesBySection.length === 0 ? (
            <div className="p-6 text-center text-xs font-semibold text-slate-400 dark:text-white/40 select-none">
              {dictionary.noPageEntries}
            </div>
          ) : (
            notesBySection.map((note) => {
              const active = activeNoteId === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setActiveNoteId(note.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`group relative w-full flex flex-col p-2.5 md:p-3 rounded-xl cursor-pointer text-left transition-colors border ${
                    active
                      ? 'bg-[#4f46e5]/15 text-[#4f46e5] dark:text-indigo-400 border-[#4f46e5]/30 shadow-xs'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 border-transparent text-slate-700 dark:text-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[11px] md:text-xs truncate leading-snug text-emerald-600 dark:text-emerald-400">
                      {note.title.trim() || dictionary.untitledPage}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNoteToDelete(note);
                      }}
                      className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-2 lg:p-1 hover:bg-red-500/10 text-neutral-400 hover:text-red-500 rounded transition-all shrink-0 cursor-pointer"
                      title={extraT.deleteNoteTitle}
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
            {notesBySection.length} {dictionary.sheetsList}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5">
            {currentSectionTitle}
          </span>
        </div>
      </aside>

      {/* RIGHT CONTENT EDITOR PANE - Always Pure Solid White */}
      <div className="flex-1 flex flex-col min-h-[calc(100vh-3.5rem)] min-w-0 bg-white text-slate-900">
        
        {/* Workspace Top Header Bar (Sticky under top navbar like Settings) */}
        <header className="sticky top-14 z-20 h-16 px-4 sm:px-6 lg:px-8 border-b border-black/10 flex items-center justify-between shrink-0 bg-white">
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
              className="p-2.5 min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 rounded-xl hover:bg-black/5 text-slate-700 transition-colors cursor-pointer flex items-center justify-center border border-transparent hover:border-black/5"
              title={sidebarOpen ? extraT.hideSidebar : extraT.showSidebar}
              aria-label={extraT.toggleSidebar}
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>
          </div>

          {/* Centered section title */}
          <div className="flex items-center justify-center min-w-0 px-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight truncate">
              {currentSectionTitle}
            </h2>
          </div>

          {/* Right spacer to keep section title centered */}
          <div className="w-10 pointer-events-none shrink-0" />
        </header>

        {/* Main Writing Canvas */}
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          {activeNote ? (
            <div className="flex-1 flex flex-col px-4 sm:px-8 lg:px-16 py-5 sm:py-8">
              
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

              {/* Rich TipTap Editor with status bar actions on the right */}
              <div className="flex-1 flex flex-col">
                <TipTapEditor
                  key={`${activeNote.id}-${editorResetKey}`}
                  content={activeNote.content}
                  onChange={(content) => updateNote(activeNote.id, { content })}
                  language={language}
                  statusActions={
                    <>
                      <span className="hidden lg:inline text-[11px] font-mono opacity-60 text-slate-700 mr-1">
                        {formatDate(activeNote.updatedAt)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCancelNote(activeNote.id)}
                        className="px-3 py-1.5 min-h-[34px] lg:min-h-0 flex items-center gap-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border bg-slate-100 hover:bg-slate-200 border-black/10 text-slate-700"
                        title={extraT.cancelChangesTitle}
                      >
                        <X size={14} />
                        <span>{extraT.cancelBtn}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveNoteNow(activeNote.id)}
                        className={`px-3 py-1.5 min-h-[34px] lg:min-h-0 flex items-center gap-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          savedNoticeId === activeNote.id
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white shadow-xs'
                        }`}
                        title={extraT.saveNoteTitle}
                      >
                        {savedNoticeId === activeNote.id ? (
                          <>
                            <Check size={14} />
                            <span>{extraT.savedBtn}</span>
                          </>
                        ) : (
                          <>
                            <Save size={14} />
                            <span>{extraT.saveBtn}</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNoteToDelete(activeNote);
                        }}
                        className="p-2 lg:p-1.5 min-w-[36px] min-h-[36px] lg:min-w-0 lg:min-h-0 flex items-center justify-center hover:bg-red-500/10 text-neutral-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
                        title={extraT.deleteNoteTitle}
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  }
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-10 select-none">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  backgroundColor: `${currentSectionInfo?.color || '#4f46e5'}18`,
                  color: currentSectionInfo?.color || '#4f46e5',
                }}
              >
                <SectionLandingIcon size={30} strokeWidth={1.75} />
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 mb-2">
                {currentSectionTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mb-5 leading-relaxed">
                {currentLandingMeta.description}
              </p>

              {notesBySection.length > 0 ? (
                <div className="w-full max-w-lg mb-6">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                    {extraT.chooseNoteHint} ({notesBySection.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                    {notesBySection.map((note) => (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => setActiveNoteId(note.id)}
                        className="group p-3.5 rounded-2xl border border-black/10 bg-slate-50/70 hover:bg-indigo-50/70 hover:border-indigo-300 transition-all cursor-pointer flex flex-col gap-1"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={14} className="text-indigo-500 shrink-0" />
                          <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-700 truncate">
                            {note.title.trim() || dictionary.untitledPage}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          {formatDate(note.updatedAt)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 mb-5">
                  {dictionary.noPageEntries}
                </p>
              )}

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

      {/* Section Edit / Delete Choice Modal */}
      <AnimatePresence>
        {sectionMenuTarget && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSectionMenuTarget(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 GeekTabs-card p-6 sm:p-8 rounded-3xl w-full max-w-sm shadow-2xl text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 mb-3 max-w-full">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: sectionMenuTarget.color }}
                />
                <span className="text-xs font-bold word-color truncate">
                  {getSectionDisplayName(sectionMenuTarget, extraT)}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold word-color mb-2">
                {dictionary.manageSectionTitle}
              </h2>
              <p className="text-xs sm:text-sm word-color opacity-70 mb-6 font-medium">
                {dictionary.manageSectionMsg}
              </p>

              <div className="flex flex-col gap-2.5">
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const target = sectionMenuTarget;
                      setSectionMenuTarget(null);
                      handleStartEditSection(target);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-[#4f46e5] text-white rounded-2xl hover:bg-[#4338ca] transition-all font-bold text-sm shadow-lg shadow-[#4f46e5]/25 cursor-pointer"
                  >
                    <Pencil size={15} />
                    <span>{dictionary.editSectionBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const targetId = sectionMenuTarget.id;
                      setSectionMenuTarget(null);
                      handleDeleteSection(targetId);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all font-bold text-sm shadow-lg shadow-red-500/20 cursor-pointer"
                  >
                    <Trash2 size={15} />
                    <span>{dictionary.deleteSectionBtn}</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setSectionMenuTarget(null)}
                  className="w-full px-4 py-2.5 min-h-[42px] bg-black/5 dark:bg-white/5 word-color rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  {dictionary.cancel}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {noteToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setNoteToDelete(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 bg-white dark:bg-slate-900 border border-black/10 dark:border-white/15 p-6 sm:p-8 rounded-3xl w-full max-w-sm shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                {extraT.deleteNoteModalTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 font-medium">
                {extraT.deleteNoteConfirmPrefix}{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  &ldquo;{noteToDelete.title.trim() || dictionary.untitledPage}&rdquo;
                </span>
                {extraT.deleteNoteConfirmSuffix}
              </p>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setNoteToDelete(null)}
                  className="flex-1 px-4 py-3 min-h-[44px] bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white rounded-2xl hover:bg-slate-200 dark:hover:bg-white/20 transition-all font-bold text-sm cursor-pointer"
                >
                  {extraT.deleteModalCancel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const targetId = noteToDelete.id;
                    setNoteToDelete(null);
                    handleDeleteNote(targetId);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all font-bold text-sm shadow-lg shadow-red-500/20 cursor-pointer"
                >
                  <Trash2 size={15} />
                  <span>{extraT.deleteModalConfirm}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
