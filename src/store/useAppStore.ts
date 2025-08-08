import { create } from "zustand";

interface AppState {
  currentSection: number;
  explore: boolean;
  startMusic: boolean;
  autoPlayback: boolean;
  windowWidth: number;
  landingData: any;
  setSection: (index: number) => void;
  setExplore: (show: boolean) => void;
  setStartMusic: (play: boolean) => void;
  setAutoPlayback: (play: boolean) => void;
  setWindowWidth: (width: number) => void;
  setLandingData: (landingData: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentSection: 0,
  explore: false,
  startMusic: false,
  autoPlayback: false,
  windowWidth: 0,
  landingData: null,
  // landingData: {
  //   slug: "/demo",
  //   audio: "/audio/awakening.mp3",
  //   introBtn: "Начать исследование",
  //   playMusic: false,
  //   components: [
  //     {
  //       id: "demoIntro",
  //       color: "#111",
  //       canvas: "sober",
  //       btn: "light",
  //       navPosition: "right",
  //       type: "intro",
  //       title: "Добро пожаловать в Sober Man",
  //       text1: "Многие срываются, потому что после клиники их встречает пустота — ",
  //       text2: "и мы хотим это изменить.",
  //       showCircles: false,
  //       circle1: {
  //         left: 0,
  //         top: 0,
  //         width: 700,
  //         height: 700,
  //         rotate: 0
  //       },
  //       circle2: {
  //         left: 0,
  //         top: 0,
  //         width: 700,
  //         height: 700,
  //         rotate: 0
  //       },
  //       positionConfig: {
  //         s: .3,
  //         dist: 3,
  //         pos: { left: "half-750", top: "half-750", rotate: 0 },
  //         breakpoints: [
  //           { minWidth: 440, s: 0.4, pos: { left: "half-750", top: "half-750", rotate: 0 }},
  //           { minWidth: 768, s: 0.5, pos: { left: "half-750", top: "half-750", rotate: 0 }},
  //           { minWidth: 1024, s: 0.7, pos: { left: "half-750", top: "half-750", rotate: 0 }},
  //         ]
  //       }
  //     },
  //     {
  //       id: "demo0",
  //       color: "#98BFF6",
  //       canvas: "laptop",
  //       btn: "light",
  //       navPosition: "right",
  //       type: "multitext",
  //       title: "Кто мы?",
  //       text1: "Привет! Меня зовут Давид, я основатель и фронтенд-разработчик проекта Sober Man. У меня за плечами опыт в стартапах, разработке продуктов и управлении. Сейчас я собрался создать что-то по-настоящему важное — приложение, которое может изменить чью-то жизнь.",
  //       text2: "Над мобильной частью проекта будет работать отдельный разработчик. Других участников команды мы планируем нанять в ближайшее время.",
  //       text3: "Sober Man — это не просто идея. Это история, через которую я прошёл сам. Я знаю, каково это — бороться, срываться, собирать себя заново. Именно поэтому я хочу создать инструмент, который реально помогает. Без морализаторства, без шаблонов — с поддержкой, пониманием и настоящей ценностью для человека.",
  //       showCircles: true,
  //       circle1: {
  //         left: -300 / 3,
  //         top: -300 / 3,
  //         width: 300,
  //         height: 300,
  //         rotate: 0,
  //         breakpoints: [
  //           { minWidth: 768, w: 500, h: 500, r: 0, left: -500 / 3, top: -500 / 3 },
  //           { minWidth: 1150, w: 700, h: 700, r: 0, left: -700 / 3, top: -500 / 3 },
  //         ]
  //       },
  //       circle2: {
  //         left: -270 / 3,
  //         top: -270 / 3,
  //         width: 300,
  //         height: 300,
  //         rotate: 0,
  //         breakpoints: [
  //           { minWidth: 768, w: 500, h: 500, r: 0, left: -500 / 3, top: -500 / 3 },
  //           { minWidth: 1150, w: 700, h: 700, r: 0, left: -700 / 3, top: -500 / 3 },
  //         ]
  //       },
  //       positionConfig: {
  //         s: 0.4,
  //         dist: 1,
  //         pos: { left: "half-750", top: -626, rotate: 0 },
  //         breakpoints: [
  //           { minWidth: 768, s: .7, pos: { left: -570, top: -600, rotate: 0 } },
  //           { minWidth: 1150, s: 1.2, pos: { left: -445, top: -490, rotate: 0 } },
  //           { minWidth: 1440, s: 1.5, pos: { left: -415, top: -460, rotate: 0 } }
  //         ]
  //       }
  //     },
  //     {
  //       id: "demo1",
  //       color: "#EDB948",
  //       canvas: "panic",
  //       btn: "light",
  //       navPosition: "bottom",
  //       type: "text",
  //       title: "История проекта",
  //       text1: "Идея Sober Man родилась из наблюдения за близкими, которые проходили через сложный путь отказа от алкоголя. После лечения им часто не хватало поддержки, мотивации и ощущение, что они не одни.",
  //       text2: "Многие срываются, потому что после клиники их встречает пустота — и мы хотим это изменить.",
  //       showCircles: true,
  //       circle1: {
  //         left: "full-80",
  //         top: "full-175",
  //         width: 80,
  //         height: 15,
  //         rotate: -12,
  //         breakpoints: [
  //           { minWidth: 1150, w: 200, h: 30, r: -12, left: "full-200", top: "full-230" },
  //         ]
  //       },
  //       circle2: {
  //         left: "full-235",
  //         top: "full-160",
  //         width: 235,
  //         height: 20,
  //         rotate: -12,
  //         breakpoints: [
  //           { minWidth: 1150, w: 550, h: 50, r: -12, left: "full-550", top: "full-200" },
  //         ]
  //       },
  //       positionConfig: {
  //         s: 0.6,
  //         dist: 2,
  //         pos: { left: "full-835", top: "full-1000", rotate: 0 },
  //         breakpoints: [
  //           { minWidth: 1150, s: 1.5, pos: { left: "full-955", top: "full-1170", rotate: 0 } }
  //         ]
  //       }
  //     },
  //     {
  //       id: "demo2",
  //       color: "#63C5AB",
  //       canvas: "super",
  //       btn: "light",
  //       navPosition: "right",
  //       type: "iconic",
  //       title: "Что такое Sober Man?",
  //       text1: "Sober Man — это не просто трекер трезвости. Это мобильное приложение, которое превращает путь отказа от алкоголя в геймифицированное приключение, где каждый день — это миссия, а каждая неделя — новый уровень.",
  //       labels: [
  //         { type: "text", content: "AI", classId: "", text: "ИИ-наставник помогает советом и поддержкой" },
  //         { type: "text", content: "%", classId: "", text: "Прогресс в фотографиях — видно, как меняется лицо, тело и взгляд" },
  //         { type: "icon", content: "puzl", classId: "icon1", text: "Ежедневные задания: от медитации до 'трезвых' рецептов" },
  //         { type: "icon", content: "gift", classId: "icon2", text: "Семья может следить за успехами и дарить подарки" },
  //         { type: "text", content: "$", classId: "", text: "Фонд вознаграждения — мотивация в виде реальных бонусов" },
  //         { type: "icon", content: "medicine", classId: "icon3", text: "В будущем планируется интегрировать приложение в профильные клиники" },
  //         { type: "icon", content: "rocket", classId: "icon4", text: "Улучшение ментального и физического здоровья" },
  //         { type: "icon", content: "24", classId: "icon3", text: "Помощь осуществляется 24/7" }
  //       ],
  //       showCircles: true,
  //       circle1: {
  //         left: "half-170",
  //         top: "half-150",
  //         width: 300,
  //         height: 300,
  //         rotate: 0,
  //         breakpoints: [
  //           { minWidth: 768, w: 300, h: 300, r: 0, left: "half-190", top: "half-170" },
  //           { minWidth: 1150, w: 400, h: 400, r: 0, left: "half-120", top: "half-100" },
  //         ]
  //       },
  //       circle2: {
  //         left: "half-190",
  //         top: "half-170",
  //         width: 300,
  //         height: 300,
  //         rotate: 0,
  //         breakpoints: [
  //           { minWidth: 768, w: 300, h: 300, r: 0, left: "half-190", top: "half-170" },
  //           { minWidth: 1150, w: 400, h: 400, r: 0, left: "half-140", top: "half-120" },
  //         ]
  //       },
  //       positionConfig: {
  //         s: 0.4,
  //         dist: 5,
  //         pos: { left: "half-750", top: "half-750", rotate: 0 },
  //         breakpoints: [
  //           { minWidth: 1150, s: 0.6 }
  //         ]
  //       }
  //     },
  //     {
  //       id: "demo3",
  //       color: "#EF9F64",
  //       canvas: "chain",
  //       btn: "light",
  //       navPosition: "right",
  //       type: "multitext2",
  //       title: "Зачем это нужно?",
  //       text1: "Через геймификацию, наставничество, прогресс в фото, подарки от близких и реальные бонусы — мы превращаем трезвость не в страдание, а в приключение с наградой.",
  //       text2: "Алкоголизм — это не просто вредная привычка. Это системная, разрушительная зависимость, которая ежегодно уносит миллионы жизней и разрушает семьи по всему миру. По оценкам Всемирной организации здравоохранения, каждый третий взрослый сталкивался с проблемами, связанными с алкоголем — лично или через близких.",
  //       text3: "Многие государства и медицинские учреждения предлагают первичный курс лечения. Это детоксикация, реабилитационные центры, краткосрочные программы. Но вот что происходит потом?",
  //       showCircles: true,
  //       circle1: {
  //         left: 50,
  //         top: 150,
  //         width: 200,
  //         height: 15,
  //         rotate: 0,
  //         breakpoints: [
  //           { minWidth: 440, w: 500, h: 15, r: 0, left: 50, top: 270 },
  //           { minWidth: 1150, w: 250, h: 30, r: 0, left: 0, top: 470 },
  //         ]
  //       },
  //       circle2: {
  //         left: 0,
  //         top: 150,
  //         width: 250,
  //         height: 20,
  //         rotate: 0,
  //         breakpoints: [
  //           { minWidth: 440, w: 600, h: 20, r: 0, left: 0, top: 270 },
  //           { minWidth: 1150, w: 850, h: 50, r: 0, left: 0, top: 460 },
  //         ]
  //       },
  //       positionConfig: {
  //         s: 0.5,
  //         dist: 1,
  //         pos: { left: "half-750", top: -670, rotate: 25 },
  //         breakpoints: [
  //           { minWidth: 440, s: 0.8, pos: { left: "half-750", top: -600, rotate: 25 } },
  //           { minWidth: 768, s: 1 },
  //           { minWidth: 1150, s: 1, pos: { left: -340, top: -470, rotate: 0 } }
  //         ]
  //       }
  //     },
  //     {
  //       id: "demo4",
  //       color: "#F4696B",
  //       canvas: "umbrella",
  //       btn: "light",
  //       navPosition: "bottom",
  //       title: "Уникальность",
  //       type: "list",
  //       texts: [
  //         "Комбинация геймификации, ИИ и поддержки семьи",
  //         "Настройка под конкретного человека, его интересы и цели",
  //         "Эмоциональная вовлеченность через визуал, миссии и уровни",
  //         "Возможность влиять на жизнь близкого, не давя на него"
  //       ],
  //       showCircles: true,
  //       circle1: {
  //         left: "full-280",
  //         top: -70,
  //         width: 350,
  //         height: 350,
  //         rotate: 0,
  //         breakpoints: [
  //           { minWidth: 440, w: 500, h: 500, r: 0, left: "full-400", top: -100 },
  //           { minWidth: 768, w: 650, h: 650, r: 0, left: "full-520", top: -130 },
  //           { minWidth: 1150, w: 700, h: 700, r: 0, left: "full-560", top: -140 },
  //         ]
  //       },
  //       circle2: {
  //         left: "full-240",
  //         top: -60,
  //         width: 300,
  //         height: 300,
  //         rotate: 0,
  //         breakpoints: [
  //           { minWidth: 440, w: 450, h: 450, r: 0, left: "full-360", top: -90 },
  //           { minWidth: 768, w: 550, h: 550, r: 0, left: "full-440", top: -110 },
  //           { minWidth: 1150, w: 600, h: 600, r: 0, left: "full-480", top: -120 },
  //         ]
  //       },
  //       positionConfig: {
  //         s: 0.4,
  //         dist: 1,
  //         pos: { left: "full-865", top: -615, rotate: -90 },
  //         breakpoints: [
  //           { minWidth: 440, s: 0.6, pos: { left: "full-920", top: -550, rotate: -90 } },
  //           { minWidth: 768, s: 0.8, pos: { left: "full-975", top: -485, rotate: -90 } },
  //           { minWidth: 1150, s: 1, pos: { left: "full-1025", top: -425, rotate: -90 } }
  //         ]
  //       }
  //     },
  //     {
  //       id: "demo5",
  //       color: "#64d6e2",
  //       canvas: "ai",
  //       btn: "light",
  //       navPosition: "right",
  //       type: "iconiclist",
  //       title: "Куда пойдут средства?",
  //       list: [
  //         { icon: "laptop", classId: "icon", text: "Зарплату мобильному разработчику" },
  //         { icon: "brain", classId: "icon", text: "Интеграцию ИИ (OpenAI / Claude API)" },
  //         { icon: "ux", classId: "icon", text: "UX и тестирование" },
  //         { icon: "cloud", classId: "icon", text: "Серверы, фото-хранилище и безопасность данных" },
  //         { icon: "msg", classId: "icon", text: "Подготовку к запуску: сайт, соцсети, видео " }
  //       ],
  //       showCircles: true,
  //       circle1: {
  //         left: "full-280",
  //         top: "full-280",
  //         width: 350,
  //         height: 350,
  //         rotate: 0,
  //         breakpoints: [
  //           { minWidth: 440, w: 500, h: 500, r: 0, left: "full-400", top: "full-400" },
  //           { minWidth: 768, w: 650, h: 650, r: 0, left: "full-520", top: "full-520" },
  //           { minWidth: 1150, w: 700, h: 700, r: 0, left: "full-560", top: "full-560" },
  //         ]
  //       },
  //       circle2: {
  //         left: "full-240",
  //         top: -60,
  //         width: 300,
  //         height: 300,
  //         rotate: 0,
  //         breakpoints: [
  //           { minWidth: 440, w: 450, h: 450, r: 0, left: "full-360", top: "full-360" },
  //           { minWidth: 768, w: 550, h: 550, r: 0, left: "full-440", top: "full-440" },
  //           { minWidth: 1150, w: 600, h: 600, r: 0, left: "full-480", top: "full-480" },
  //         ]
  //       },
  //       positionConfig: {
  //         s: 0.4,
  //         dist: 2,
  //         pos: { left: "full-850", top: "full-850", rotate: 0 },
  //         breakpoints: [
  //           { minWidth: 440, s: 0.6, pos: { left: "full-900", top: "full-900", rotate: 0 } },
  //           { minWidth: 768, s: 0.8, pos: { left: "full-950", top: "full-950", rotate: 0 } },
  //           { minWidth: 1150, s: 1, pos: { left: "full-1000", top: "full-1000", rotate: 0 } }
  //         ]
  //       }
  //     },
  //     {
  //       id: "demo6",
  //       color: "#FFFFF0",
  //       canvas: "sober",
  //       btn: "dark",
  //       navPosition: "right",
  //       type: "links",
  //       title: "Как поддержать",
  //       text1: "Поддержать можно здесь: ",
  //       links: [
  //         { icon: "pig", classId: "icon1", link: "https://planeta.ru/account/my-campaigns/231068" }
  //       ],
  //       showCircles: true,
  //       circle1: {
  //         left: "half-175",
  //         top: -45,
  //         width: 350,
  //         height: 350,
  //         rotate: 0,
  //         breakpoints: [
  //           { minWidth: 440, w: 400, h: 400, r: 0, left: "half-200", top: 10 },
  //           { minWidth: 980, w: 400, h: 400, r: 0, left: "full-390", top: -100 },
  //         ]
  //       },
  //       circle2: {
  //         left: "half-150",
  //         top: -20,
  //         width: 300,
  //         height: 300,
  //         rotate: 0,
  //         breakpoints: [
  //           { minWidth: 440, w: 500, h: 500, r: 0, left: "half-250", top: -35 },
  //           { minWidth: 980, w: 500, h: 500, r: 0, left: "full-535", top: -150 },
  //         ]
  //       },
  //       positionConfig: {
  //         s: 0.2,
  //         dist: 3,
  //         pos: { left: "half-750", top: -640, rotate: 0 },
  //         breakpoints: [
  //           {
  //             s: 0.2,
  //             minWidth: 440,
  //             pos: { left: "half-750", top: -570, rotate: 0 }
  //           },
  //           {
  //             s: 0.3,
  //             minWidth: 980,
  //             pos: { left: "full-950", top: -650, rotate: 0 }
  //           }
  //         ]
  //       }
  //     }
  //   ]
  // },
  setSection: (index) => set({ currentSection: index }),
  setExplore: (show) => set({ explore: show }),
  setStartMusic: (play) => set({ startMusic: play }),
  setAutoPlayback: (play) => set({ autoPlayback: play }),
  setWindowWidth: (width) => set({ windowWidth: width }),
  setLandingData: (landingData) => set({ landingData: landingData }),
}));
