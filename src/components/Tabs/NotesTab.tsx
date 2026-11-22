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

const getSectionLandingMeta = (sec?: Section) => {
  switch (sec?.id) {
    case 'sec-quick':
      return {
        Icon: Zap,
        description: 'Capture quick thoughts, daily reminders, short snippets, and sudden ideas you want to jot down right away.'
      };
    case 'sec-personal':
      return {
        Icon: User,
        description: 'Keep personal reflections, journal entries, private goals, health logs, and everyday life notes organized.'
      };
    case 'sec-ideas':
      return {
        Icon: Sparkles,
        description: 'Brainstorm concepts, story drafts, design inspiration, and creative projects whenever sparks strike.'
      };
    case 'sec-work':
      return {
        Icon: Briefcase,
        description: 'Organize meeting notes, project plans, action items, documentation, and work-related references.'
      };
    case 'sec-recipes':
      return {
        Icon: UtensilsCrossed,
        description: 'Save favorite recipes, ingredient lists, cooking steps, meal prep ideas, and kitchen experiments.'
      };
    case 'sec-travel':
      return {
        Icon: Plane,
        description: 'Plan upcoming trips, itineraries, packing checklists, booking details, and memorable travel notes.'
      };
    default:
      return {
        Icon: FolderOpen,
        description: `Use ${sec?.name || 'this section'} to organize your notes, checklists, photos, and reference links in one place.`
      };
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
    return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const currentSectionInfo = sections.find(s => s.id === currentSectionId);
  const currentLandingMeta = getSectionLandingMeta(currentSectionInfo);
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
            title="Close sidebar"
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
              title="Add Section"
            >
              <Plus size={10} strokeWidth={2.5} className="md:w-[11px] md:h-[11px]" />
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
                      placeholder="Section name..."
                    />
                    <button
                      type="submit"
                      disabled={!editingSectionName.trim()}
                      className="p-1 rounded-lg bg-[#4f46e5] text-white hover:bg-[#4338ca] disabled:opacity-45 cursor-pointer shrink-0"
                      title="Save section"
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
                      title="Cancel edit"
                    >
                      <X size={12} />
                    </button>
                  </form>
                );
              }

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
                  title={sec.name}
                >
                  <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shrink-0" style={{ backgroundColor: sec.color }} />
                    <span className="truncate leading-tight">{sec.name}</span>
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
                      aria-label={`${dictionary.manageSectionTitle}: ${sec.name}`}
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
            {notesBySection.length} {dictionary.sheetsList}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5">
            {currentSectionInfo?.name}
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
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>
          </div>

          {/* Centered section title */}
          <div className="flex items-center justify-center min-w-0 px-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight truncate">
              {currentSectionInfo?.name || 'Quick Notes'}
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
                  statusActions={
                    <>
                      <span className="hidden lg:inline text-[11px] font-mono opacity-60 text-slate-700 mr-1">
                        {formatDate(activeNote.updatedAt)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCancelNote(activeNote.id)}
                        className="px-3 py-1.5 min-h-[34px] lg:min-h-0 flex items-center gap-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border bg-slate-100 hover:bg-slate-200 border-black/10 text-slate-700"
                        title="Cancel changes"
                      >
                        <X size={14} />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveNoteNow(activeNote.id)}
                        className={`px-3 py-1.5 min-h-[34px] lg:min-h-0 flex items-center gap-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          savedNoticeId === activeNote.id
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white shadow-xs'
                        }`}
                        title="Save note"
                      >
                        {savedNoticeId === activeNote.id ? (
                          <>
                            <Check size={14} />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Save size={14} />
                            <span>Save</span>
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
                        title="Delete note"
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
                {currentSectionInfo?.name || 'Quick Notes'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mb-5 leading-relaxed">
                {currentLandingMeta.description}
              </p>

              {notesBySection.length > 0 ? (
                <div className="w-full max-w-lg mb-6">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Select a note from the menu or choose below ({notesBySection.length})
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
                  {sectionMenuTarget.name}
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
                Delete Note?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 font-medium">
                Are you sure you want to delete{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  &ldquo;{noteToDelete.title.trim() || dictionary.untitledPage}&rdquo;
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setNoteToDelete(null)}
                  className="flex-1 px-4 py-3 min-h-[44px] bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white rounded-2xl hover:bg-slate-200 dark:hover:bg-white/20 transition-all font-bold text-sm cursor-pointer"
                >
                  Cancel
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
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
