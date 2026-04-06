export type Locale = 'bg' | 'en'

export const translations = {
  // ── Shared / Navbar ──────────────────────────────────────────────────────
  nav: {
    services:        { bg: 'Услуги',            en: 'Services' },
    reviews:         { bg: 'Отзиви',            en: 'Reviews' },
    transformations: { bg: 'Трансформации',     en: 'Transformations' },
    faq:             { bg: 'Въпроси',           en: 'FAQ' },
    more:            { bg: 'Още',              en: 'More' },
    pages:           { bg: 'Страници',         en: 'Pages' },
    theTeam:         { bg: 'Екипът',            en: 'The Team' },
    about:           { bg: 'За нас',            en: 'About' },
    careers:         { bg: 'Кариери',           en: 'Careers' },
    contacts:        { bg: 'Контакти',          en: 'Contacts' },
    openMenu:        { bg: 'Отвори менюто',     en: 'Open menu' },
    closeMenu:       { bg: 'Затвори менюто',    en: 'Close menu' },
  },

  // ── CTA Button ───────────────────────────────────────────────────────────
  cta: {
    bookNow:          { bg: 'Запазете своя час',         en: 'Secure Your Transformation' },
    textConcierge:    { bg: 'Свържете се с консиерж',   en: 'Text our Concierge' },
  },

  // ── Hero Section ─────────────────────────────────────────────────────────
  hero: {
    label:     { bg: 'Ексклузивна Красота · София',       en: 'Signature Beauty · Sofia' },
    headingA:  { bg: 'Увереност,',                     en: 'Confidence,' },
    headingB:  { bg: 'подчинена на',                   en: 'Tailored' },
    headingC:  { bg: 'Вашия график.',                  en: 'to Your Calendar.' },
    subtext:   {
      bg: 'За жените, които отказват да правят компромис със себе си. Влезте в 9:00. Владейте деня в 10:00.',
      en: 'For women who refuse to compromise on themselves. Walk in at 9. Conquer at 10.',
    },
    meetTeam:  { bg: 'Запознайте се с нас →', en: 'Meet our team →' },
    stat1:     { bg: 'ТОЧНОСТ',                      en: 'On-Time Sessions' },
    stat1Val:  { bg: '98%',                              en: '98%' },
    stat2:     { bg: 'Жени, които инвестират в себе си',  en: 'Women Who Invest in Themselves' },
    stat2Val:  { bg: '500',                              en: '500' },
    stat3:     { bg: 'Консултация',                      en: 'Consultation' },
    stat3Val:  { bg: '15М',                              en: '15m' },
    imageAlt:  {
      bg: 'Интериор на Maison Élite — топли кремави тонове, луксозен стол, цветя и естествена светлина',
      en: 'Maison Élite salon interior — warm ivory walls, plush styling chair, fresh peonies and soft natural light',
    },
  },

  // ── Services Section ─────────────────────────────────────────────────────
  services: {
    label:     { bg: 'Нашите Услуги',                    en: 'Signature Experiences' },
    heading:   { bg: 'Вашето време е луксът.',            en: 'Your Time is the Luxury.' },
    subtext:   {
      bg: 'Всяка услуга е прецизно планирана за Вас - без чакане, без излишни разговори.',
      en: 'Each experience is engineered for precision and efficiency — no waiting, no compromise.',
    },
    s1name:    { bg: 'Сесия за Увереност',              en: 'The Confidence Session' },
    s1dur:     { bg: '45 мин.',                        en: '45 minutes' },
    s1benefit: {
      bg: 'Безупречна, сияйна, неустоима - защото заслужавате да се чувствате така.',
      en: 'Polished, radiant, unstoppable — because you deserve to feel that way.',
    },
    s1price:   { bg: 'От €120',  en: 'From €120' },
    s2name:    { bg: 'Пълно Възстановяване',            en: 'The Full Reset' },
    s2dur:     { bg: '60 мин.',                        en: '60 minutes' },
    s2benefit: {
      bg: 'Цялостно обновление за жената, която поставя себе си на първо място.',
      en: 'Complete renewal for the woman who prioritizes herself — no apologies.',
    },
    s2price:   { bg: 'От €160',  en: 'From €160' },
    s3name:    { bg: 'Терапия за Блясък',              en: 'The Glow Treatment' },
    s3dur:     { bg: '75 мин.',                        en: '75 minutes' },
    s3benefit: {
      bg: 'Кожа, която излъчва увереност - Вашата видима инвестиция в себе си.',
      en: 'Luminous skin that radiates confidence — your investment in yourself, visible.',
    },
    s3price:   { bg: 'От €195',  en: 'From €195' },
  },

  // ── Testimonials Section ──────────────────────────────────────────────────
  testimonials: {
    label:   { bg: 'От Нашите Клиенти',  en: 'Social Proof' },
    heading: { bg: 'Резултатите говорят сами.', en: 'The Evidence of Excellence.' },
    prev:    { bg: 'Предишен отзив',  en: 'Previous testimonial' },
    next:    { bg: 'Следващ отзив',   en: 'Next testimonial' },
    ariaCarousel:  { bg: 'Отзиви от клиенти',    en: 'Client testimonials' },
    ariaControls:  { bg: 'Управление карусела',   en: 'Carousel controls' },
    slideOf:       { bg: 'Отзив',                 en: 'Testimonial' },
    of:            { bg: 'от',                    en: 'of' },
    t1quote: {
      bg: 'Увереността ми по време на срещи с клиенти се подобри значително. Безупречният външен вид е актив и Maison Elite предоставя точно това.',
      en: 'This is the only hour I protect fiercely. Walking out, I feel like the best version of myself.',
    },
    t1name:  { bg: 'Ирина Д.',             en: 'Irina D.' },
    t1title: { bg: 'Адвокат', en: 'Attorney' },
    t2quote: {
      bg: 'Това е единственият час, който пазя ревностно само за себе си. На тръгване се чувствам като най-добрата версия на себе си.',
      en: 'I invest in myself here like nowhere else. The results make me feel powerful, in control, unstoppable.',
    },
    t2name:  { bg: 'Александра М.',            en: 'Alexandra M.' },
    t2title: { bg: 'Предприемач',         en: 'Entrepreneur' },
    t3quote: {
      bg: 'Инвестирам в себе си тук както никъде другаде. Резултатите ме карат да се чувствам силна, с пълен контрол и неуловима.',
      en: 'Confidence is the best investment a woman can make in herself. The results speak for themselves.',
    },
    t3name:  { bg: 'Д-р София К.',                  en: 'Dr. Sophia K.' },
    t3title: { bg: 'Лекар',         en: 'Physician' },
    t4quote: {
      bg: 'Посещавала съм салони на три континента. Това е първият, който третира ефективността като лукс, а не като подробност.',
      en: "I've been to salons across three continents. This is the first one that treats efficiency as a luxury, not an afterthought.",
    },
    t4name:  { bg: 'Наталия Р.',                en: 'Natalia R.' },
    t4title: { bg: 'VP Стратегия', en: 'VP Strategy, Global Agency' },
    t5quote: {
      bg: 'Винаги си намирам време за това. Резултатите ме карат да се чувствам по-красива, по-уверена и по-готина за света.',
      en: 'I always make time for this. The results make me feel more beautiful, more confident, and ready to take on the world.',
    },
    t5name:  { bg: 'Лили В.',                  en: 'Lily V.' },
    t5title: { bg: 'Дизайнер', en: 'Designer' },
  },

  // ── Gallery Section ───────────────────────────────────────────────────────
  gallery: {
    label:     { bg: 'Трансформации',              en: 'Transformations' },
    heading:   { bg: 'Резултати, които говорят сами.', en: 'Results That Command Attention.' },
    subtext:   {
      bg: 'Един час. Едно посещение. Категорична промяна.',
      en: 'Every session is a controlled transformation. The same person — elevated.',
    },
    before1Label: { bg: '8:00 • НАЧАЛО',          en: 'Before · 8:00am' },
    after1Label:  { bg: '8:50 • ФИНАЛ',           en: 'After · 8:50am' },
    before1Alt:   {
      bg: 'Жена преди визита си в Maison Élite',
      en: 'Woman with natural minimal makeup before her Maison Élite appointment',
    },
    after1Alt:    {
      bg: 'Жена със завършена прическа след визита си в Maison Élite',
      en: 'Woman with polished executive blowout after her Maison Élite appointment',
    },
    before2Label: { bg: 'ЕСТЕСТВЕНА ВИЗИЯ',        en: 'Before · Raw' },
    after2Label:  { bg: 'ПЪЛЕН БЛЯСЪК',           en: 'After · Glowing' },
    before2Alt:   {
      bg: 'Жена преди фациала си в Maison Élite',
      en: 'Woman with bare clean skin before her Maison Élite facial treatment',
    },
    after2Alt:    {
      bg: 'Жена със сияйна кожа след фациала си в Maison Élite',
      en: 'Woman with luminous boardroom-ready skin after her Maison Élite facial',
    },
  },

  // ── FAQ Section ───────────────────────────────────────────────────────────
  faq: {
    label:   { bg: 'Често Задавани Въпроси', en: 'FAQ' },
    heading: { bg: 'Въпроси,',               en: 'Questions,' },
    headingItalic: { bg: 'Отговорени.',     en: 'Answered.' },
    q1: {
      bg: 'Колко време отнема една процедура?',
      en: 'How long does a typical appointment take?',
    },
    a1: {
      bg: 'Сесията за Увереност отнема 45 минути. Пълното Възстановяване е точно един час, а Терапията за Блясък – 75 минути. Никога не пресрочваме времето – Вашият график е защитен, а контролът остава във Ваши ръце.',
      en: "The Confidence Session takes 45 minutes. The Full Reset is exactly one hour. The Glow Treatment takes 75 minutes. We never run over — your schedule stays protected, and you stay in control.",
    },
    q2: {
      bg: 'Трябва ли да запазя час предварително?',
      en: 'Do I need to book in advance?',
    },
    a2: {
      bg: "Силно препоръчваме резервация поне 48 часа по-рано – нашите клиенти знаят какво искат и планират спрямо това. Понякога се освобождават часове в същия ден, но се запълват бързо. Обадете ни се директно, за да проверите наличността в реално време и да подсигурите своя час.",
      en: "We strongly recommend booking at least 48 hours ahead — our clients know what they want and plan accordingly. Same-day appointments occasionally open up, but we fill quickly. Call us directly to check real-time availability and secure your time.",
    },
    q3: {
      bg: 'Какви продукти използвате?',
      en: 'What products do you use?',
    },
    a3: {
      bg: "Работим ексклузивно с луксозни брандове с доказани резултати: La Mer, Charlotte Tilbury, SK-II и Augustinus Bader. Всеки продукт е избран заради своята ефективност и съвместимост с всеки тип кожа. Винаги се консултираме с Вас преди нанасянето на нов продукт – Вашата кожа, Вашият избор.",
      en: "We exclusively use luxury brands proven to deliver real results: La Mer, Charlotte Tilbury, SK-II, and Augustinus Bader. Every product is selected for proven efficacy, compatibility with all skin types, and your personal preferences. We always consult you before applying anything new — your skin, your choice.",
    },
    q4: {
      bg: 'Има ли осигурено паркиране?',
      en: 'Is there parking available?',
    },
    a4: {
      bg: "Да. Разполагаме с резервирано valet паркиране за клиенти в подземния гараж на сградата. Просто уведомете рецепцията при пристигане и паркингът ще бъде безплатен за целия престой на Вашето посещение.",
      en: "Yes. We have reserved valet parking for clients in the building's underground garage. Simply notify reception upon arrival and your parking will be complimentary for the duration of your appointment.",
    },
    q5: {
      bg: 'Мога ли да променя или отменя запазен час?',
      en: 'Can I reschedule or cancel my appointment?',
    },
    a5: {
      bg: "Молим за предизвестие от 24 часа при отмяна или пренасрочване. При анулиране в рамките на тези 24 часа може да бъде начислена такса в размер на 50% от стойността на услугата. Разбираме, че се случват непредвидени обстоятелства – свържете се с нас директно и ще съдействаме при всяка възможност.",
      en: "We ask for 24 hours notice for cancellations or rescheduling. Cancellations within 24 hours may incur a 50% service fee. That said, we understand that life happens — reach out directly and we will work with you whenever possible.",
    },
    q6: {
      bg: 'Предлагате ли корпоративни или групови резервации?',
      en: 'Do you offer corporate or group bookings?',
    },
    a6: {
      bg: 'Абсолютно. Работим с групи, екипи и програми за грижа, създадени за жени, които ценят себе си. Независимо дали става въпрос за подготовка за събитие или за постоянен ритуал за благополучие, ние персонализираме всеки детайл. Свържете се с нас, за да създадем преживяние, изцяло съобразено с Вас.',
      en: "Absolutely. We work with groups, teams, and self-care programs designed around women who value themselves. Whether it is a pre-event group experience or an ongoing wellness ritual, we customize every detail to fit your needs. Contact us directly to create something perfectly tailored for you.",
    },
  },

  // ── CTA Banner Section ────────────────────────────────────────────────────
  ctaBanner: {
    eyebrow: { bg: 'ВАШИЯТ МОМЕНТ',                 en: 'Reserve Your Session' },
    headingA:{ bg: 'Вашата визия',                  en: 'You Deserve' },
    headingB:{ bg: 'заслужава повече.',             en: 'This.' },
    subtext: {
      bg: 'Присъединете се към над 500 жени, които отказват да правят компромис със себе си. Един преобразуващ час. Инвестирайте във Вас.',
      en: 'Join 500+ women who refuse to compromise on themselves. One transformative hour. Invest in you.',
    },
    social:  {
      bg: 'Изборът на жените, които поставят себе си на първо място.',
      en: 'Trusted by women who prioritize themselves.',
    },
  },

  // ── Brand Strip ───────────────────────────────────────────────────────────
  brandStrip: {
    trustedBy: { bg: 'Избирани от Клиенти, които Ползват', en: 'Trusted by clients who use' },
    ariaLabel: { bg: 'Луксозни Марки',                      en: 'Luxury brands' },
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    conciergeHeading: { bg: 'Желаете Директен Контакт?',     en: 'Prefer a personal touch?' },
    conciergeBody:    {
      bg: 'Налице пн-сб, 9-19ч.',
      en: 'Our concierge team is available 9am–7pm, Monday–Saturday.',
    },
    servicesCol:   { bg: 'Услуги',       en: 'Services' },
    companyCol:    { bg: 'Компания',     en: 'Company' },
    visitCol:      { bg: 'Посетете',     en: 'Visit' },
    brandTagline:  {
      bg: 'Красота и увереност за жените, които отказват да правят компромиси със себе си.',
      en: 'Beauty and confidence for women who refuse to compromise. No waiting. No apologies.',
    },
    instagramAria: { bg: 'Maison Élite на Instagram', en: 'Follow Maison Élite on Instagram' },
    addressLine:   { bg: '22 ул. Граф Игнатиев,\nСофия 1000, България', en: '22 Graf Ignatiev St,\nSofia 1000, Bulgaria' },
    hours:         { bg: 'Пн–Сб: 09:00–19:00',              en: 'Mon–Sat: 09:00–19:00' },
    openInMaps:    { bg: 'Отвори в Карти →',                 en: 'Open in Maps →' },
    copyright:     { bg: '© 2026 Maison Élite. Всички права запазени.', en: '© 2026 Maison Élite. All rights reserved.' },
    privacy:       { bg: 'Политика за Поверителност',        en: 'Privacy Policy & GDPR' },
    // service link labels
    svc1: { bg: 'Сесия за Увереност',  en: 'The Confidence Session' },
    svc2: { bg: 'Пълно Възстановяване',     en: 'The Full Reset' },
    svc3: { bg: 'Терапия за Блясък',         en: 'The Glow Treatment' },
    // company link labels
    ourStory: { bg: 'Нашата История',  en: 'Our Story' },
    theTeam:  { bg: 'Екипът',          en: 'The Team' },
    careers:  { bg: 'Кариери',         en: 'Careers' },
    contact:  { bg: 'Контакти',         en: 'Contacts' },
  },

  // ── Sub-page: shared header ────────────────────────────────────────────────
  subpage: {
    home: { bg: 'Начало', en: 'Home' },
  },

  // ── About Page ────────────────────────────────────────────────────────────
  about: {
    eyebrow:    { bg: 'Нашата История',      en: 'Our Story' },
    headingA:   { bg: 'Грижата за себе си',         en: 'Self-Care is' },
    headingB:   { bg: 'е Ваше право',  en: 'Non-Negotiable' },
    intro: {
      bg: "Maison Élite е създаден с една основна убеденост: инвестицията в себе си никога не трябва да бъде лукс, за който нямате време. Всяка жена заслужава да се чувства уверена и силна - не заради титлата си, а защото го заслужава. Отказваме да приемем, че грижата за Вас трябва да бъде прибързана или с компромисно качество.",
      en: "Maison Élite was founded on a single conviction: that investing in yourself should never feel like a luxury you don't have time for. Women deserve to feel confident, radiant, and powerful — not because of their job title, but because they are worthy of it. We refuse to accept that self-care has to be rushed or compromised.",
    },
    valuesHeading: { bg: 'В какво вярваме',  en: 'What We Stand For' },
    v1title: { bg: 'Майсторство',   en: 'Precision' },
    v1body:  {
      bg: "Всяка техника е усъвършенствана с хиляди часове практика. Ние не импровизираме — ние постигаме съвършенство.",
      en: 'Every technique is refined over hundreds of hours of practice. We do not improvise; we execute.',
    },
    v2title: { bg: 'Дискретност',  en: 'Discretion' },
    v2body:  {
      bg: 'Вашето време и лично пространство са свещени. Студиото ни е тихо, подредено място - без случайни посещения, без чакане.',
      en: 'Your time and privacy are sacred. Our studio is a quiet, curated space — no walk-ins, no waiting.',
    },
    v3title: { bg: 'Резултати',    en: 'Results' },
    v3body:  {
      bg: "Измерваме успеха си не чрез броя комплименти, които получавате, а чрез увереността, с която прекрачвате прага ни.",
      en: 'We measure success not by compliments received in the chair, but by the confidence you carry out the door.',
    },
    timelineHeading: { bg: 'Пътят на Maison Élite',  en: 'The Journey' },
    m1year: { bg: '2018', en: '2018' },
    m1event: {
      bg: 'Началото: Всичко започна с един кабинет и дълъг списък с чакащи – жени, търсещи по-висок стандарт на грижа.',
      en: 'Founded in Sofia with a single suite and a two-month waitlist.',
    },
    m2year: { bg: '2020', en: '2020' },
    m2event: {
      bg: 'Еволюцията: Разширихме пространството си и въведохме протокола 60-минутно Възстановяване за жените, които ценят времето си.',
      en: 'Expanded to three suites; introduced the 60-Minute Reset protocol.',
    },
    m3year: { bg: '2022', en: '2022' },
    m3event: {
      bg: 'Признанието: Vogue България ни нарече най-дискретният луксозен адрес в града. Титла, която защитаваме всеки ден.',
      en: "Recognised by Vogue Bulgaria as the city's most discreet luxury address.",
    },
    m4year: { bg: '2024', en: '2024' },
    m4event: {
      bg: 'Иновацията: Стартирахме серията Executive Glow - прецизна грижа за кожата, проектирана за динамично ежедневие.',
      en: 'Launched the Boardroom Glow facial series for senior executives.',
    },
    m5year: { bg: '2025', en: '2025' },
    m5event: {
      bg: 'Днес: Дом за над 500 жени, които не правят компромис със себе си. Само с предварително записване.',
      en: 'Over 500 returning clients. Zero walk-in policy introduced.',
    },
    ctaHeading: { bg: 'Готови ли сте да се запознаем?',  en: 'Experience it for yourself.' },
    ctaBody:    { bg: 'Първата Ви консултация е комплимент от нас и се провежда лично с Изабел.', en: 'Your first consultation is always complimentary.' },
  },

  // ── Team Page ─────────────────────────────────────────────────────────────
  team: {
    eyebrow:   { bg: 'ЕКИПЪТ',           en: 'The People' },
    headingA:  { bg: 'Майсторство във',     en: 'Precision in' },
    headingB:  { bg: 'всяко докосване', en: 'Every Pair of Hands' },
    intro: {
      bg: "Нашият екип не е просто събран — той е селектиран. Всеки професионалист е избран заради своята техника, но и заради способността да осигури спокойствие, дискретност и абсолютен фокус върху Вас.",
      en: 'Our team was not assembled — it was curated. Each specialist was chosen not only for their technical mastery but for their temperament: calm, discreet, and entirely focused on you.',
    },
    specialty: { bg: 'Специалност:',  en: 'Speciality:' },
    ctaHeading:{ bg: 'Готови ли сте да се запознаем?',    en: 'Ready to meet us in person?' },
    ctaBody:   {
      bg: "Първата Ви консултация е комплимент от нас и се провежда лично с Изабел.",
      en: 'Your first consultation is always complimentary and conducted by Isabelle personally.',
    },
    // member bios
    m1name:  { bg: 'Изабел Моро',              en: 'Isabelle Moreau' },
    m1role:  { bg: 'Основател & Творчески директор', en: 'Founder & Creative Director' },
    m1bio:   {
      bg: 'Обучавана във Vidal Sassoon Лондон и усъвършенствана в Париж. Изабел се завръща в София с една визия: студиото, което винаги е липсвало на града.',
      en: 'Trained at the Vidal Sassoon Academy in London and refined at leading ateliers in Paris, Isabelle returned to Sofia with one ambition: to build the studio she always wished existed. She personally oversees every new client consultation.',
    },
    m1specialty: { bg: 'Сесии за увереност • Дизайн и форма', en: 'The Confidence Session · Hair Architecture' },
    m2name:  { bg: 'София Андреева',          en: 'Sophia Andreeva' },
    m2role:  { bg: 'Експерт медицинска козметика',      en: 'Lead Skincare Specialist' },
    m2bio:   {
      bg: "Сертифициран естетик с фокус върху иновативни протоколи. Нейните процедури за лице са еталон за качество — часовете се запълват седмици предварително.",
      en: "A certified aesthetician with an advanced diploma in medical-adjacent skincare protocols. Sophia's Boardroom Glow facial is consistently our most-requested service — booked weeks in advance.",
    },
    m2specialty: { bg: 'Терапии за блясък • Естетика на лицето', en: 'The Glow Treatment · Advanced Facials' },
    m3name:  { bg: 'Нора Димитрова',           en: 'Nora Dimitrova' },
    m3role:  { bg: 'Старши стилист',  en: 'Senior Hair Stylist' },
    m3bio:   {
      bg: "С над 10 години опит с най-взискателните клиенти. Нора се специализира в деликатните текстури и цветове, които изискват перфектен финал пред камера.",
      en: 'With over a decade of experience styling professionals, journalists, and public figures, Nora brings a calm precision to every appointment. She specialises in fine-to-medium hair that has to perform under camera or boardroom light.',
    },
    m3specialty: { bg: 'Трансформации • Колористика', en: 'The Full Reset · Colour Correction' },
    m4name:  { bg: 'Елена Георгиева',          en: 'Elena Georgieva' },
    m4role:  { bg: 'Client Experience Concierge', en: 'Client Experience Lead' },
    m4bio:   {
      bg: 'От момента на резервацията до Вашето тръгване — всеки детайл е обмислен. Елена управлява целия процес зад кулисите, за да бъде престоят Ви безупречен.',
      en: 'Elena ensures that from the moment you book to the moment you leave, every detail is considered. She manages scheduling, preferences, and the silent orchestration that makes Maison Élite feel effortless.',
    },
    m4specialty: { bg: 'Консиерж услуги · Връзки с клиенти', en: 'Concierge · Client Relations' },
  },

  // ── Careers Page ──────────────────────────────────────────────────────────
  careers: {
    eyebrow:   { bg: 'Присъединете се към Maison Élite',         en: 'Join the Studio' },
    headingA:  { bg: 'Работете там,',         en: 'Work Where' },
    headingB:  { bg: 'където съвършенството е стандарт',    en: 'Excellence Is the Standard' },
    intro: {
      bg: 'Ние не просто наемаме; ние селектираме екип от експерти, посветени на изкуството на прецизността и лукса на времето.',
      en: 'We are selective — not because we are difficult, but because every person on our team shapes the experience our clients trust with their most important first impressions. If that standard excites rather than intimidates you, we want to meet you.',
    },
    openPositions: { bg: 'Отворени Позиции',  en: 'Open Positions' },
    whatWeOffer:   { bg: 'Какво Предлагаме',  en: 'What We Offer' },
    apply:         { bg: 'Кандидатствай →',   en: 'Apply →' },
    noRole:        { bg: 'Не виждате подходящата позиция?',  en: "Don't see the right role?" },
    specBody:      {
      bg: 'Приемаме кандидатури от изключителни кандидати през цялата година.',
      en: 'We accept speculative applications from exceptional candidates year-round.',
    },
    specApply:     { bg: 'Изпратете CV',    en: 'Send a Speculative CV' },
    r1title: { bg: 'Старши стилист',       en: 'Senior Hair Stylist' },
    r1type:  { bg: 'Пълно работно време',         en: 'Full-time' },
    r1loc:   { bg: 'София, България',             en: 'Sofia, Bulgaria' },
    r1desc:  {
      bg: 'Търсим майстор на формата с над 5 години опит. Вашата отговорност е да доставяте безупречни резултати с прецизност, отговаряща на най-високите стандарти в индустрията.',
      en: 'You have at least 5 years of client-facing experience, an impeccable blowout technique, and a quiet confidence that puts even the most time-pressured executive at ease.',
    },
    r2title: { bg: 'Специалист грижа за кожата',  en: 'Skincare Specialist' },
    r2type:  { bg: 'Пълно работно време',         en: 'Full-time' },
    r2loc:   { bg: 'София, България',             en: 'Sofia, Bulgaria' },
    r2desc:  {
      bg: 'Експерт в съвременните терапии за лице, посветен на видимите резултати. Изисква се задълбочено познаване на луксозни козметични протоколи и индивидуално отношение към клиента.',
      en: 'Certified in advanced facial protocols. You believe results-led skincare is a form of precision work — and you treat it accordingly.',
    },
    r3title: { bg: 'Клиентски консиерж', en: 'Client Experience Coordinator' },
    r3type:  { bg: 'Пълно работно време',             en: 'Full-time' },
    r3loc:   { bg: 'София, България',                 en: 'Sofia, Bulgaria' },
    r3desc:  {
      bg: 'Лицето на Maison Élite. Отговаряте за безупречното клиентско преживяние, от първия контакт до финалното изпращане. Изисква се дискретност, отлични комуникационни умения и изключителна организираност.',
      en: 'The first and last impression our clients receive. Exceptional written and verbal communication, fluent in English and Bulgarian.',
    },
    p1: { bg: 'Конкурентна заплата + тримесечен бонус за представяне',                      en: 'Competitive compensation + quarterly performance bonus' },
    p2: { bg: 'Достъп до премиум продуктови линии на цени за служители',                       en: 'Access to premium product lines at cost' },
    p3: { bg: 'Обезпечаване на продължаващо обучение — семинари, курсове, майсторски класове',      en: 'Continued education allowance — workshops, courses, masterclasses' },
    p4: { bg: 'Възможност за гъвкав график в рамките на работното време на студиото',                   en: 'Flexible schedule design within studio hours' },
    p5: { bg: 'Малък, подкрепящ екип с нулево вътрешнополитическо напрежение',                          en: 'Small, supportive team with zero internal politics' },
  },

  // ── Contact Page ──────────────────────────────────────────────────────────
  contact: {
    eyebrow:    { bg: 'Свържете се с нас.',     en: 'Get in Touch' },
    headingA:   { bg: 'Очакваме',       en: 'We Would Love' },
    headingB:   { bg: 'Ви.',     en: 'to Hear From You' },
    phoneLabel:   { bg: 'Телефон',       en: 'Phone' },
    emailLabel:   { bg: 'Имейл',         en: 'Email' },
    addressLabel: { bg: 'Адрес',         en: 'Address' },
    openInMaps:   { bg: 'Отвори в Карти →', en: 'Open in Maps →' },
    hoursHeading: { bg: 'Работно време',    en: 'Opening Hours' },
    monFri:       { bg: 'Понеделник–Петък', en: 'Monday – Friday' },
    saturday:     { bg: 'Събота',           en: 'Saturday' },
    sunday:       { bg: 'Неделя',           en: 'Sunday' },
    closed:       { bg: 'Затворено',        en: 'Closed' },
    mapAddress:   { bg: '22 ул. Граф Игнатиев, София', en: '22 Graf Ignatiev St, Sofia' },
    ctaHeading:   { bg: 'Готови ли сте да резервирате своето посещение?',      en: 'Ready to book your visit?' },
    ctaBody:      {
      bg: 'Пропуснете излишната кореспонденция — запазете своя час директно.',
      en: 'Skip the back-and-forth — secure your appointment directly.',
    },
  },

  // ── Booking Page ──────────────────────────────────────────────────────────
  booking: {
    headingA:  { bg: 'Нещо Прекрасно',         en: 'Something Beautiful' },
    headingB:  { bg: 'Се Разработва',          en: 'Is Being Crafted' },
    subtext: {
      bg: 'Нашата онлайн платформа е в разработка. Обадете ни се за резервация.',
      en: 'Our online booking experience is currently under development, designed with the same precision and care we bring to every appointment. In the meantime, please reach us directly to reserve your visit.',
    },
  },
} as const

/** Helper: pick the right locale string */
export function t(
  entry: { bg: string; en: string },
  locale: Locale
): string {
  return entry[locale]
}
