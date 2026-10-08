/* GTJ — база автомобилей для подбора.
 * Китайские марки, которые продаются в России официально или завозятся параллельным импортом.
 * Источники: каталог drom.ru (модельные ряды и диапазоны мощности по рынкам), сайты брендов
 * (exeed.ru, haval.ru, tenet), профильные обзоры 2025–2026. Версии — для российского рынка,
 * если не указано иное. Данные справочные, перед заказом деталей сверяйте VIN.
 *
 * Модификация: [двигатель, семейство мотора, л.с., Н·м, КПП, привод, годы, топливо]
 *   топливо: p — бензин, d — дизель, hev — гибрид, phev — подключаемый гибрид,
 *            erev — электромобиль с мотором-генератором, ev — электромобиль
 *   семейство мотора — ключ из ENGINES, по нему подбираются детали и прошивки
 */
window.GTJ_ENGINES = {
  G15T:  { n: 'Geely 1.5T (JLH-3G15TD)', turbo: true, s1: [205, 330], s2: [225, 350] },
  G20T:  { n: 'Geely 2.0T (JLH-4G20TD)', turbo: true, s1: [290, 420], s2: [320, 460] },
  G15:   { n: 'Geely 1.5 MPI (JLγ-4G15)', turbo: false },
  C15:   { n: 'Chery 1.5 MPI (SQRE4G15)', turbo: false },
  C15T:  { n: 'Chery 1.5T (SQRE4T15)', turbo: true, s1: [180, 280], s2: [195, 300] },
  C16T:  { n: 'Chery 1.6T (SQRF4J16)', turbo: true, s1: [225, 360], s2: [245, 390] },
  C20T:  { n: 'Chery 2.0T (SQRF4J20)', turbo: true, s1: [285, 440], s2: [310, 480] },
  H15T:  { n: 'GWM 1.5T (GW4B15)', turbo: true, s1: [185, 290], s2: [200, 310] },
  H20T:  { n: 'GWM 2.0T (GW4N20)', turbo: true, s1: [265, 430], s2: [290, 470] },
  H24D:  { n: 'GWM 2.4 дизель (GW4D24)', turbo: true, s1: [215, 560] },
  T30:   { n: 'GWM 3.0T V6 (E30Z)', turbo: true, s1: [400, 600], s2: [430, 650] },
  CA14T: { n: 'Changan 1.4T Blue Core', turbo: true, s1: [175, 290] },
  CA16:  { n: 'Changan 1.6 MPI', turbo: false },
  CA15T: { n: 'Changan 1.5T Blue Core', turbo: true, s1: [215, 340], s2: [235, 370] },
  CA20T: { n: 'Changan 2.0T Blue Core', turbo: true, s1: [280, 440], s2: [300, 470] },
  HQ15T: { n: 'Hongqi 1.5T (CA4GB15TD)', turbo: true, s1: [195, 310] },
  HQ20T: { n: 'Hongqi 2.0T (CA4GC20TD)', turbo: true, s1: [285, 430], s2: [305, 460] },
  GA15T: { n: 'GAC 1.5T (4A15J1)', turbo: true, s1: [200, 320] },
  GA20T: { n: 'GAC 2.0T (4B20J1)', turbo: true, s1: [280, 440] },
  J15T:  { n: 'JAC 1.5T (HFC4GB1.5)', turbo: true, s1: [180, 280] },
  REX:   { n: 'Мотор-генератор 1.5T (последовательный гибрид)', turbo: false },
  DMI:   { n: 'BYD 1.5 DM-i (гибрид)', turbo: false },
  EV:    { n: 'Электромотор', turbo: false, ev: true },
};

window.GTJ_CARS = [
  { id: 'geely', n: 'Geely', top: 1, models: [
    { id: 'monjaro', n: 'Monjaro', b: 'кроссовер, 5 мест', y: '2022–н.в.', img: 'car-monjaro.jpg', m: [
      ['2.0T', 'G20T', 238, 350, '8AT Aisin', 'полный', '2022–н.в.', 'p'] ] },
    { id: 'atlas', n: 'Atlas (FX11)', b: 'кроссовер', y: '2023–н.в.', img: 'car-atlas.jpg', m: [
      ['2.0T', 'G20T', 200, 325, '7DCT', 'передний', '2023–н.в.', 'p'],
      ['2.0T', 'G20T', 200, 325, '7DCT', 'полный', '2023–н.в.', 'p'] ] },
    { id: 'atlas-pro', n: 'Atlas Pro', b: 'кроссовер', y: '2021–2025', img: 'cars/geely-atlas-pro.jpg', m: [
      ['1.5T MHEV', 'G15T', 177, 255, '7DCT', 'передний', '2021–2025', 'hev'],
      ['1.5T MHEV', 'G15T', 177, 255, '7DCT', 'полный', '2021–2025', 'hev'] ] },
    { id: 'tugella', n: 'Tugella', b: 'кроссовер-купе', y: '2020–2024', img: 'car-tugella.jpg', m: [
      ['2.0T', 'G20T', 238, 350, '8AT Aisin', 'полный', '2020–2024', 'p'] ] },
    { id: 'preface', n: 'Preface', b: 'седан', y: '2023–н.в.', img: 'car-preface.jpg', m: [
      ['2.0T', 'G20T', 200, 325, '7DCT', 'передний', '2023–н.в.', 'p'] ] },
    { id: 'coolray', n: 'Coolray', b: 'кроссовер', y: '2020–н.в.', img: 'cars/geely-coolray.jpg', m: [
      ['1.5T', 'G15T', 150, 255, '7DCT', 'передний', '2020–н.в.', 'p'],
      ['1.5T', 'G15T', 177, 255, '7DCT', 'передний', '2021–2023', 'p'] ] },
    { id: 'cityray', n: 'Cityray', b: 'кроссовер', y: '2024–н.в.', img: 'car-cityray.jpg', m: [
      ['1.5T', 'G15T', 147, 255, '7DCT', 'передний', '2024–н.в.', 'p'] ] },
    { id: 'okavango', n: 'Okavango', b: 'кроссовер, 7 мест', y: '2023–н.в.', img: 'cars/geely-okavango.jpg', m: [
      ['1.5T', 'G15T', 177, 255, '7DCT', 'передний', '2023–н.в.', 'p'] ] },
    { id: 'emgrand', n: 'Emgrand', b: 'седан', y: '2023–н.в.', img: 'cars/geely-emgrand.jpg', m: [
      ['1.5', 'G15', 122, 142, '6AT', 'передний', '2023–н.в.', 'p'],
      ['1.5', 'G15', 122, 142, '5MT', 'передний', '2023–н.в.', 'p'] ] },
    { id: 'ex5', n: 'EX5', b: 'электрокроссовер', y: '2025–н.в.', img: 'cars/geely-ex5.jpg', m: [
      ['EV 60 кВт·ч', 'EV', 218, 320, 'редуктор', 'передний', '2025–н.в.', 'ev'] ] },
  ]},
  { id: 'haval', n: 'Haval', top: 1, models: [
    { id: 'jolion', n: 'Jolion', b: 'кроссовер', y: '2021–н.в.', img: 'cars/haval-jolion.jpg', m: [
      ['1.5T', 'H15T', 143, 210, '7DCT', 'передний', '2021–2024', 'p'],
      ['1.5T', 'H15T', 150, 230, '7DCT', 'передний', '2024–н.в.', 'p'],
      ['1.5T', 'H15T', 150, 230, '7DCT', 'полный', '2024–н.в.', 'p'] ] },
    { id: 'f7', n: 'F7 (II)', b: 'кроссовер', y: '2024–н.в.', img: 'cars/haval-f7.jpg', m: [
      ['1.5T', 'H15T', 150, 235, '7DCT', 'передний', '2024–н.в.', 'p'],
      ['2.0T', 'H20T', 192, 320, '7DCT', 'полный', '2024–н.в.', 'p'] ] },
    { id: 'f7x', n: 'F7x', b: 'кроссовер-купе', y: '2019–н.в.', img: 'cars/haval-f7x.jpg', m: [
      ['1.5T', 'H15T', 150, 280, '7DCT', 'передний', '2019–н.в.', 'p'],
      ['2.0T', 'H20T', 190, 340, '7DCT', 'полный', '2019–н.в.', 'p'] ] },
    { id: 'dargo', n: 'Dargo', b: 'кроссовер', y: '2022–н.в.', img: 'cars/haval-dargo.jpg', m: [
      ['2.0T', 'H20T', 192, 320, '7DCT', 'передний', '2022–н.в.', 'p'],
      ['2.0T', 'H20T', 192, 320, '7DCT', 'полный', '2022–н.в.', 'p'] ] },
    { id: 'h3', n: 'H3', b: 'кроссовер', y: '2024–н.в.', img: 'cars/haval-h3.jpg', m: [
      ['1.5T', 'H15T', 150, 230, '7DCT', 'передний', '2024–н.в.', 'p'],
      ['1.5T', 'H15T', 150, 230, '7DCT', 'полный', '2024–н.в.', 'p'] ] },
    { id: 'm6', n: 'M6', b: 'кроссовер', y: '2023–н.в.', img: 'cars/haval-m6.jpg', m: [
      ['1.5T', 'H15T', 143, 210, '6MT', 'передний', '2023–н.в.', 'p'],
      ['1.5T', 'H15T', 150, 210, '7DCT', 'передний', '2023–н.в.', 'p'] ] },
    { id: 'h5', n: 'H5', b: 'рамный внедорожник', y: '2025–н.в.', img: 'cars/haval-h5.jpg', m: [
      ['2.0T', 'H20T', 224, 385, '8AT', 'полный', '2025–н.в.', 'p'] ] },
    { id: 'h7', n: 'H7', b: 'кроссовер', y: '2025–н.в.', img: 'cars/haval-h7.jpg', m: [
      ['2.0T', 'H20T', 231, 385, '7DCT', 'полный', '2025–н.в.', 'p'] ] },
    { id: 'h9', n: 'H9 (II)', b: 'рамный внедорожник', y: '2024–н.в.', img: 'cars/haval-h9.jpg', m: [
      ['2.0T', 'H20T', 231, 385, '8AT ZF', 'полный', '2024–н.в.', 'p'] ] },
  ]},
  { id: 'chery', n: 'Chery', top: 1, models: [
    { id: 'tiggo4', n: 'Tiggo 4 / 4 Pro', b: 'кроссовер', y: '2022–2026', img: 'cars/chery-tiggo4.jpg', m: [
      ['1.5', 'C15', 113, 138, 'CVT', 'передний', '2022–2026', 'p'],
      ['1.5T', 'C15T', 147, 210, 'CVT', 'передний', '2022–2026', 'p'] ] },
    { id: 'tiggo7pm', n: 'Tiggo 7 Pro Max', b: 'кроссовер', y: '2022–2026', img: 'cars/chery-tiggo7pm.jpg', m: [
      ['1.5T', 'C15T', 147, 210, 'CVT', 'передний', '2022–2026', 'p'],
      ['1.6T', 'C16T', 150, 250, '7DCT', 'передний', '2024–2026', 'p'],
      ['1.6T', 'C16T', 150, 250, '7DCT', 'полный', '2024–2026', 'p'] ] },
    { id: 'tiggo8pm', n: 'Tiggo 8 Pro Max', b: 'кроссовер, 7 мест', y: '2022–2026', img: 'cars/chery-tiggo8pm.jpg', m: [
      ['1.6T', 'C16T', 186, 275, '7DCT', 'передний', '2023–2026', 'p'],
      ['2.0T', 'C20T', 197, 290, '7DCT', 'полный', '2022–2026', 'p'] ] },
    { id: 'tiggo9', n: 'Tiggo 9', b: 'кроссовер, 7 мест', y: '2024–н.в.', img: 'cars/chery-tiggo9.jpg', m: [
      ['2.0T', 'C20T', 254, 390, '8AT', 'полный', '2024–н.в.', 'p'] ] },
    { id: 'arrizo8', n: 'Arrizo 8', b: 'седан', y: '2023–н.в.', img: 'cars/chery-arrizo8.jpg', m: [
      ['1.6T', 'C16T', 186, 275, '7DCT', 'передний', '2023–2024', 'p'],
      ['1.6T', 'C16T', 150, 250, '7DCT', 'передний', '2025–н.в.', 'p'] ] },
    { id: 'tiggo7pro', n: 'Tiggo 7 Pro', b: 'кроссовер', y: '2020–2024', img: 'cars/chery-tiggo7pro.jpg', m: [
      ['1.5T', 'C15T', 147, 210, 'CVT', 'передний', '2020–2024', 'p'] ] },
  ]},
  { id: 'changan', n: 'Changan', top: 1, models: [
    { id: 'cs35plus', n: 'CS35 Plus', b: 'кроссовер', y: '2019–н.в.', img: 'cars/changan-cs35plus.jpg', m: [
      ['1.4T', 'CA14T', 150, 260, '7DCT', 'передний', '2021–н.в.', 'p'],
      ['1.6', 'CA16', 128, 161, '6AT', 'передний', '2019–2022', 'p'] ] },
    { id: 'cs55plus', n: 'CS55 Plus', b: 'кроссовер', y: '2022–н.в.', img: 'cars/changan-cs55plus.jpg', m: [
      ['1.5T', 'CA15T', 181, 300, '7DCT', 'передний', '2022–2024', 'p'],
      ['1.5T', 'CA15T', 150, 300, '7DCT', 'передний', '2024–н.в.', 'p'] ] },
    { id: 'cs75plus', n: 'CS75 Plus', b: 'кроссовер', y: '2022–н.в.', img: 'cars/changan-cs75plus.jpg', m: [
      ['1.5T', 'CA15T', 181, 300, '6AT', 'передний', '2022–н.в.', 'p'],
      ['2.0T', 'CA20T', 233, 390, '8AT', 'полный', '2022–н.в.', 'p'] ] },
    { id: 'unik', n: 'UNI-K', b: 'кроссовер', y: '2022–н.в.', img: 'cars/changan-unik.jpg', m: [
      ['2.0T', 'CA20T', 233, 390, '8AT Aisin', 'полный', '2022–н.в.', 'p'] ] },
    { id: 'unit', n: 'UNI-T', b: 'кроссовер', y: '2021–н.в.', img: 'cars/changan-unit.jpg', m: [
      ['1.5T', 'CA15T', 181, 300, '7DCT', 'передний', '2021–н.в.', 'p'] ] },
    { id: 'univ', n: 'UNI-V', b: 'лифтбек', y: '2023–н.в.', img: 'cars/changan-univ.jpg', m: [
      ['1.5T', 'CA15T', 181, 300, '7DCT', 'передний', '2023–н.в.', 'p'],
      ['2.0T', 'CA20T', 233, 390, '8AT', 'передний', '2024–н.в.', 'p'] ] },
    { id: 'unis', n: 'UNI-S', b: 'кроссовер', y: '2024–н.в.', img: 'cars/changan-unis.jpg', m: [
      ['1.5T', 'CA15T', 147, 300, '7DCT', 'передний', '2024–н.в.', 'p'] ] },
    { id: 'cs35max', n: 'CS35 Max', b: 'кроссовер', y: '2025–н.в.', img: 'cars/changan-cs35max.jpg', m: [
      ['1.5T', 'CA15T', 147, 300, '7DCT', 'передний', '2025–н.в.', 'p'] ] },
  ]},
  { id: 'tank', n: 'Tank', top: 1, models: [
    { id: 't300', n: '300', b: 'рамный внедорожник', y: '2021–н.в.', img: 'cars/tank-t300.jpg', m: [
      ['2.0T', 'H20T', 220, 380, '8AT ZF', 'полный', '2021–н.в.', 'p'],
      ['2.4 дизель', 'H24D', 184, 480, '9AT', 'полный', '2024–н.в.', 'd'] ] },
    { id: 't400', n: '400 Hi4-T', b: 'рамный внедорожник', y: '2024–н.в.', img: 'cars/tank-t400.jpg', m: [
      ['2.0T PHEV', 'H20T', 408, 750, '9HAT', 'полный', '2024–н.в.', 'phev'] ] },
    { id: 't500', n: '500', b: 'рамный внедорожник', y: '2022–н.в.', img: 'cars/tank-t500.jpg', m: [
      ['3.0T V6', 'T30', 354, 500, '9AT', 'полный', '2022–н.в.', 'p'],
      ['2.0T PHEV', 'H20T', 347, 648, '9HAT', 'полный', '2025–н.в.', 'phev'] ] },
    { id: 't700', n: '700 Hi4-T', b: 'рамный внедорожник', y: '2024–н.в.', img: 'cars/tank-t700.jpg', m: [
      ['3.0T V6 PHEV', 'T30', 517, 800, '9HAT', 'полный', '2024–н.в.', 'phev'] ] },
  ]},
  { id: 'exeed', n: 'Exeed', top: 1, models: [
    { id: 'lx', n: 'LX', b: 'кроссовер', y: '2022–н.в.', img: 'cars/exeed-lx.jpg', m: [
      ['1.5T', 'C15T', 147, 210, 'CVT', 'передний', '2022–н.в.', 'p'],
      ['1.6T', 'C16T', 186, 275, '7DCT', 'полный', '2022–н.в.', 'p'] ] },
    { id: 'txl', n: 'TXL', b: 'кроссовер', y: '2021–н.в.', img: 'cars/exeed-txl.jpg', m: [
      ['1.6T', 'C16T', 186, 275, '7DCT', 'передний', '2021–н.в.', 'p'],
      ['2.0T', 'C20T', 197, 300, '7DCT', 'полный', '2022–н.в.', 'p'] ] },
    { id: 'rx', n: 'RX', b: 'кроссовер', y: '2023–н.в.', img: 'cars/exeed-rx.jpg', m: [
      ['2.0T', 'C20T', 249, 385, '7DCT', 'полный', '2023–н.в.', 'p'] ] },
    { id: 'vx', n: 'VX', b: 'кроссовер, 7 мест', y: '2021–н.в.', img: 'cars/exeed-vx.jpg', m: [
      ['2.0T', 'C20T', 249, 385, '8AT', 'полный', '2024–н.в.', 'p'],
      ['2.0T', 'C20T', 249, 385, '7DCT', 'полный', '2021–2024', 'p'] ] },
    { id: 'exlantix-et', n: 'Exlantix ET', b: 'кроссовер', y: '2025–н.в.', img: 'cars/exeed-exlantix-et.jpg', m: [
      ['EREV 1.5T', 'REX', 455, 615, 'редуктор', 'полный', '2025–н.в.', 'erev'] ] },
    { id: 'exlantix-es', n: 'Exlantix ES', b: 'седан', y: '2025–н.в.', img: 'cars/exeed-exlantix-es.jpg', m: [
      ['EV', 'EV', 313, 325, 'редуктор', 'задний', '2025–н.в.', 'ev'] ] },
  ]},
  { id: 'omoda', n: 'Omoda', top: 1, models: [
    { id: 'c5', n: 'C5', b: 'кроссовер', y: '2022–н.в.', img: 'cars/omoda-c5.jpg', m: [
      ['1.5', 'C15', 113, 138, 'CVT', 'передний', '2024–н.в.', 'p'],
      ['1.5T', 'C15T', 147, 210, 'CVT', 'передний', '2022–н.в.', 'p'],
      ['1.6T', 'C16T', 150, 250, '7DCT', 'полный', '2024–н.в.', 'p'] ] },
    { id: 's5', n: 'S5 / S5 GT', b: 'седан', y: '2023–2026', img: 'cars/omoda-s5.jpg', m: [
      ['1.5', 'C15', 113, 138, 'CVT', 'передний', '2023–2026', 'p'],
      ['1.5T', 'C15T', 147, 210, 'CVT', 'передний', '2023–2026', 'p'] ] },
    { id: 'c7', n: 'C7', b: 'кроссовер', y: '2025–н.в.', img: 'cars/omoda-c7.jpg', m: [
      ['1.6T', 'C16T', 150, 250, '7DCT', 'передний', '2025–н.в.', 'p'],
      ['1.6T', 'C16T', 150, 250, '7DCT', 'полный', '2025–н.в.', 'p'] ] },
  ]},
  { id: 'jaecoo', n: 'Jaecoo', top: 1, models: [
    { id: 'j7', n: 'J7', b: 'кроссовер', y: '2023–н.в.', img: 'cars/jaecoo-j7.jpg', m: [
      ['1.5T', 'C15T', 147, 210, 'CVT', 'передний', '2023–н.в.', 'p'],
      ['1.6T', 'C16T', 186, 275, '7DCT', 'полный', '2023–2024', 'p'],
      ['1.6T', 'C16T', 150, 250, '7DCT', 'полный', '2025–н.в.', 'p'] ] },
    { id: 'j8', n: 'J8', b: 'кроссовер, 7 мест', y: '2024–н.в.', img: 'cars/jaecoo-j8.jpg', m: [
      ['2.0T', 'C20T', 249, 385, '7DCT', 'полный', '2024–н.в.', 'p'] ] },
    { id: 'j6', n: 'J6', b: 'кроссовер', y: '2026–н.в.', img: 'cars/jaecoo-j6.jpg', m: [
      ['1.5T', 'C15T', 147, 210, '7DCT', 'передний', '2026–н.в.', 'p'] ] },
  ]},
  { id: 'jetour', n: 'Jetour', models: [
    { id: 'dashing', n: 'Dashing', b: 'кроссовер', y: '2023–н.в.', img: 'cars/jetour-dashing.jpg', m: [
      ['1.5T', 'C15T', 147, 210, '7DCT', 'передний', '2023–н.в.', 'p'],
      ['1.6T', 'C16T', 186, 275, '7DCT', 'передний', '2023–н.в.', 'p'] ] },
    { id: 'x70plus', n: 'X70 Plus', b: 'кроссовер, 7 мест', y: '2023–н.в.', img: 'cars/jetour-x70plus.jpg', m: [
      ['1.5T', 'C15T', 147, 210, '7DCT', 'передний', '2023–н.в.', 'p'],
      ['1.6T', 'C16T', 186, 275, '7DCT', 'передний', '2023–н.в.', 'p'] ] },
    { id: 'x90plus', n: 'X90 Plus', b: 'кроссовер, 7 мест', y: '2023–н.в.', img: 'cars/jetour-x90plus.jpg', m: [
      ['1.6T', 'C16T', 186, 275, '7DCT', 'передний', '2023–н.в.', 'p'],
      ['2.0T', 'C20T', 254, 390, '7DCT', 'передний', '2024–н.в.', 'p'] ] },
    { id: 't2', n: 'T2', b: 'внедорожник', y: '2024–н.в.', img: 'cars/jetour-t2.jpg', m: [
      ['2.0T', 'C20T', 245, 375, '7DCT', 'полный', '2024–н.в.', 'p'] ] },
    { id: 't1', n: 'T1', b: 'внедорожник', y: '2025–н.в.', img: 'cars/jetour-t1.jpg', m: [
      ['2.0T', 'C20T', 245, 375, '7DCT', 'полный', '2025–н.в.', 'p'] ] },
    { id: 'x50', n: 'X50', b: 'кроссовер', y: '2024–н.в.', img: 'cars/jetour-x50.jpg', m: [
      ['1.5', 'C15', 113, 138, '6MT', 'передний', '2024–н.в.', 'p'],
      ['1.5T', 'C15T', 147, 210, '7DCT', 'передний', '2024–н.в.', 'p'] ] },
  ]},
  { id: 'tenet', n: 'Tenet', top: 1, models: [
    { id: 't4', n: 'T4', b: 'кроссовер', y: '2025–н.в.', img: 'cars/tenet-t4.jpg', m: [
      ['1.5', 'C15', 113, 138, 'CVT', 'передний', '2025–н.в.', 'p'],
      ['1.5T', 'C15T', 147, 210, 'CVT', 'передний', '2025–н.в.', 'p'] ] },
    { id: 't7', n: 'T7', b: 'кроссовер', y: '2025–н.в.', img: 'cars/tenet-t7.jpg', m: [
      ['1.6T', 'C16T', 150, 250, '7DCT', 'передний', '2025–н.в.', 'p'],
      ['1.6T', 'C16T', 150, 250, '7DCT', 'полный', '2025–н.в.', 'p'] ] },
    { id: 't8', n: 'T8', b: 'кроссовер, 7 мест', y: '2025–н.в.', img: 'cars/tenet-t8.jpg', m: [
      ['1.6T', 'C16T', 186, 275, '7DCT', 'передний', '2025–н.в.', 'p'],
      ['2.0T', 'C20T', 197, 290, '7DCT', 'полный', '2025–н.в.', 'p'] ] },
    { id: 't9', n: 'T9', b: 'кроссовер, 7 мест', y: '2026–н.в.', img: 'cars/tenet-t9.jpg', m: [
      ['2.0T', 'C20T', 245, 375, '8AT', 'полный', '2026–н.в.', 'p'] ] },
  ]},
  { id: 'belgee', n: 'Belgee', models: [
    { id: 'x50', n: 'X50', b: 'кроссовер', y: '2023–н.в.', img: 'cars/belgee-x50.jpg', m: [
      ['1.5T', 'G15T', 150, 255, '7DCT', 'передний', '2023–н.в.', 'p'] ] },
    { id: 'x70', n: 'X70', b: 'кроссовер', y: '2024–н.в.', img: 'cars/belgee-x70.jpg', m: [
      ['1.5T', 'G15T', 150, 255, '7DCT', 'передний', '2024–н.в.', 'p'],
      ['1.5T', 'G15T', 177, 255, '7DCT', 'полный', '2024–н.в.', 'p'] ] },
    { id: 's50', n: 'S50', b: 'седан', y: '2024–н.в.', img: 'cars/belgee-s50.jpg', m: [
      ['1.5', 'G15', 122, 142, '6AT', 'передний', '2024–н.в.', 'p'] ] },
  ]},
  { id: 'lynk', n: 'Lynk & Co', models: [
    { id: '01', n: '01', b: 'кроссовер', y: '2020–н.в.', img: 'cars/lynk-01.jpg', m: [
      ['2.0T', 'G20T', 254, 350, '8AT', 'полный', '2020–н.в.', 'p'] ] },
    { id: '05', n: '05', b: 'кроссовер-купе', y: '2020–н.в.', img: 'cars/lynk-05.jpg', m: [
      ['2.0T', 'G20T', 254, 350, '8AT', 'полный', '2020–н.в.', 'p'] ] },
    { id: '09', n: '09', b: 'кроссовер, 7 мест', y: '2021–н.в.', img: 'cars/lynk-09.jpg', m: [
      ['2.0T', 'G20T', 254, 350, '8AT', 'полный', '2021–н.в.', 'p'] ] },
    { id: '03', n: '03', b: 'седан', y: '2019–н.в.', img: 'cars/lynk-03.jpg', m: [
      ['2.0T', 'G20T', 254, 350, '8AT', 'передний', '2021–н.в.', 'p'] ] },
  ]},
  { id: 'li', n: 'Li Auto (Lixiang)', models: [
    { id: 'l6', n: 'L6', b: 'кроссовер', y: '2024–н.в.', img: 'cars/li-l6.jpg', m: [
      ['EREV 1.5T', 'REX', 408, 529, 'редуктор', 'полный', '2024–н.в.', 'erev'] ] },
    { id: 'l7', n: 'L7', b: 'кроссовер', y: '2023–н.в.', img: 'cars/li-l7.jpg', m: [
      ['EREV 1.5T', 'REX', 449, 620, 'редуктор', 'полный', '2023–н.в.', 'erev'] ] },
    { id: 'l8', n: 'L8', b: 'кроссовер, 6 мест', y: '2022–н.в.', img: 'cars/li-l8.jpg', m: [
      ['EREV 1.5T', 'REX', 449, 620, 'редуктор', 'полный', '2022–н.в.', 'erev'] ] },
    { id: 'l9', n: 'L9', b: 'кроссовер, 6 мест', y: '2022–н.в.', img: 'cars/li-l9.jpg', m: [
      ['EREV 1.5T', 'REX', 449, 620, 'редуктор', 'полный', '2022–н.в.', 'erev'] ] },
  ]},
  { id: 'zeekr', n: 'Zeekr', models: [
    { id: '001', n: '001', b: 'лифтбек', y: '2021–н.в.', img: 'cars/zeekr-001.jpg', m: [
      ['EV 100 кВт·ч', 'EV', 544, 686, 'редуктор', 'полный', '2021–н.в.', 'ev'] ] },
    { id: '7x', n: '7X', b: 'кроссовер', y: '2024–н.в.', img: 'cars/zeekr-7x.jpg', m: [
      ['EV 100 кВт·ч', 'EV', 646, 710, 'редуктор', 'полный', '2024–н.в.', 'ev'] ] },
    { id: 'x', n: 'X', b: 'кроссовер', y: '2023–н.в.', img: 'cars/zeekr-x.jpg', m: [
      ['EV 66 кВт·ч', 'EV', 428, 543, 'редуктор', 'полный', '2023–н.в.', 'ev'] ] },
    { id: '009', n: '009', b: 'минивэн', y: '2022–н.в.', img: 'cars/zeekr-009.jpg', m: [
      ['EV 116 кВт·ч', 'EV', 544, 686, 'редуктор', 'полный', '2022–н.в.', 'ev'] ] },
  ]},
  { id: 'hongqi', n: 'Hongqi', models: [
    { id: 'h5', n: 'H5', b: 'седан', y: '2022–н.в.', img: 'cars/hongqi-h5.jpg', m: [
      ['1.5T', 'HQ15T', 169, 258, '7DCT', 'передний', '2022–н.в.', 'p'],
      ['2.0T', 'HQ20T', 224, 340, '8AT', 'передний', '2023–н.в.', 'p'] ] },
    { id: 'hs5', n: 'HS5', b: 'кроссовер', y: '2019–н.в.', img: 'cars/hongqi-hs5.jpg', m: [
      ['2.0T', 'HQ20T', 224, 340, '6AT', 'полный', '2019–н.в.', 'p'] ] },
    { id: 'hq9', n: 'HQ9', b: 'минивэн', y: '2024–н.в.', img: 'cars/hongqi-hq9.jpg', m: [
      ['2.0T', 'HQ20T', 252, 380, '8AT', 'передний', '2024–н.в.', 'p'] ] },
    { id: 'h9', n: 'H9', b: 'седан бизнес-класса', y: '2020–н.в.', img: 'cars/hongqi-h9.jpg', m: [
      ['2.0T', 'HQ20T', 252, 380, '7DCT', 'задний', '2020–н.в.', 'p'] ] },
  ]},
  { id: 'gac', n: 'GAC', models: [
    { id: 'gs8', n: 'GS8', b: 'кроссовер, 7 мест', y: '2022–н.в.', img: 'cars/gac-gs8.jpg', m: [
      ['2.0T', 'GA20T', 231, 400, '8AT', 'полный', '2022–н.в.', 'p'] ] },
    { id: 'gs3', n: 'GS3', b: 'кроссовер', y: '2023–н.в.', img: 'cars/gac-gs3.jpg', m: [
      ['1.5T', 'GA15T', 170, 270, '7DCT', 'передний', '2023–н.в.', 'p'] ] },
    { id: 'empow', n: 'Empow', b: 'седан', y: '2025–н.в.', img: 'cars/gac-empow.jpg', m: [
      ['1.5T', 'GA15T', 170, 270, '7DCT', 'передний', '2025–н.в.', 'p'] ] },
    { id: 'm8', n: 'M8', b: 'минивэн', y: '2023–н.в.', img: 'cars/gac-m8.jpg', m: [
      ['2.0T', 'GA20T', 252, 400, '8AT', 'передний', '2023–н.в.', 'p'] ] },
  ]},
  { id: 'voyah', n: 'Voyah', models: [
    { id: 'free', n: 'Free', b: 'кроссовер', y: '2022–н.в.', img: 'cars/voyah-free.jpg', m: [
      ['EREV 1.5T', 'REX', 490, 1040, 'редуктор', 'полный', '2024–н.в.', 'erev'] ] },
    { id: 'dream', n: 'Dream', b: 'минивэн', y: '2023–н.в.', img: 'cars/voyah-dream.jpg', m: [
      ['EREV 1.5T', 'REX', 435, 620, 'редуктор', 'полный', '2023–н.в.', 'erev'] ] },
    { id: 'passion', n: 'Passion', b: 'седан', y: '2023–н.в.', img: 'cars/voyah-passion.jpg', m: [
      ['EV 108 кВт·ч', 'EV', 510, 710, 'редуктор', 'полный', '2023–2025', 'ev'] ] },
  ]},
  { id: 'byd', n: 'BYD', models: [
    { id: 'songplus', n: 'Song Plus DM-i', b: 'кроссовер', y: '2021–2025', img: 'cars/byd-songplus.jpg', m: [
      ['1.5 DM-i', 'DMI', 218, 316, 'E-CVT', 'передний', '2021–2025', 'phev'] ] },
    { id: 'han', n: 'Han EV', b: 'седан', y: '2020–н.в.', img: 'cars/byd-han.jpg', m: [
      ['EV 85 кВт·ч', 'EV', 517, 700, 'редуктор', 'полный', '2020–н.в.', 'ev'] ] },
    { id: 'seal', n: 'Seal', b: 'седан', y: '2022–н.в.', img: 'cars/byd-seal.jpg', m: [
      ['EV 82 кВт·ч', 'EV', 530, 670, 'редуктор', 'полный', '2022–н.в.', 'ev'] ] },
    { id: 'qinplus', n: 'Qin Plus DM-i', b: 'седан', y: '2021–н.в.', img: 'cars/byd-qinplus.jpg', m: [
      ['1.5 DM-i', 'DMI', 180, 316, 'E-CVT', 'передний', '2021–н.в.', 'phev'] ] },
  ]},
  { id: 'kaiyi', n: 'Kaiyi', models: [
    { id: 'x3pro', n: 'X3 Pro', b: 'кроссовер', y: '2022–н.в.', img: 'cars/kaiyi-x3pro.jpg', m: [
      ['1.5', 'C15', 116, 140, 'CVT', 'передний', '2022–н.в.', 'p'] ] },
    { id: 'e5', n: 'E5', b: 'седан', y: '2023–2026', img: 'cars/kaiyi-e5.jpg', m: [
      ['1.5T', 'C15T', 147, 210, 'CVT', 'передний', '2023–2026', 'p'] ] },
    { id: 'x7', n: 'X7 Kunlun', b: 'кроссовер', y: '2024–н.в.', img: 'cars/kaiyi-x7.jpg', m: [
      ['1.5T', 'C15T', 156, 230, '7DCT', 'передний', '2024–н.в.', 'p'] ] },
  ]},
  { id: 'livan', n: 'Livan', models: [
    { id: 'x3pro', n: 'X3 Pro', b: 'кроссовер', y: '2022–н.в.', img: 'cars/livan-x3pro.jpg', m: [
      ['1.5', 'G15', 103, 140, 'CVT', 'передний', '2022–н.в.', 'p'] ] },
    { id: 'x6pro', n: 'X6 Pro', b: 'кроссовер', y: '2023–н.в.', img: 'cars/livan-x6pro.jpg', m: [
      ['1.5T', 'G15T', 147, 226, '7DCT', 'передний', '2023–н.в.', 'p'] ] },
    { id: 's6pro', n: 'S6 Pro', b: 'седан', y: '2023–н.в.', img: 'cars/livan-s6pro.jpg', m: [
      ['1.5T', 'G15T', 147, 226, '7DCT', 'передний', '2023–н.в.', 'p'] ] },
  ]},
  { id: 'moskvich', n: 'Москвич', models: [
    { id: 'm3', n: '3', b: 'кроссовер', y: '2022–н.в.', img: 'cars/moskvich-m3.jpg', m: [
      ['1.5T', 'J15T', 150, 210, 'CVT', 'передний', '2022–н.в.', 'p'] ] },
    { id: 'm6', n: '6', b: 'лифтбек', y: '2023–н.в.', img: 'cars/moskvich-m6.jpg', m: [
      ['1.5T', 'J15T', 150, 210, 'CVT', 'передний', '2023–н.в.', 'p'] ] },
  ]},
];

/* Car photos: Wikimedia Commons. key → [author, license, file] */
window.GTJ_CAR_CREDITS = {
"geely/atlas-pro": [
"ROCostiTheBunnyCZ",
"CC BY-SA 4.0",
"Geely Atlas Pro AWD (2016-present) - Front View.jpg"
],
"geely/coolray": [
"User3204",
"CC BY-SA 4.0",
"2018_Geely_Binyue.jpg"
],
"geely/okavango": [
"User3204",
"CC BY-SA 4.0",
"2022 Geely Haoyue.jpg"
],
"geely/emgrand": [
"Retired electrician",
"CC0",
"Moscow,_Geely_Emgrand_(2nd_gen)_Aug_2025_01_(cropped).jpg"
],
"geely/ex5": [
"JustAnotherCarDesigner",
"CC0",
"Geely_Galaxy_E5_003_(cropped).jpg"
],
"haval/jolion": [
"User3204",
"CC BY-SA 4.0",
"2020_Great_Wall_Haval_Jolion_(front).jpg"
],
"haval/f7": [
"Throwawayacc222",
"CC0",
"2024 Haval F7 red.jpg"
],
"haval/f7x": [
"Zotyefan",
"CC BY-SA 4.0",
"Haval F7x IMG001.jpg"
],
"haval/dargo": [
"User3204",
"CC BY-SA 4.0",
"2020_Great_Wall_Haval_Big_Dog_front.jpg"
],
"haval/h3": [
"iMoD Official",
"CC BY 3.0",
"2024 Haval H3 PHEV front view.png"
],
"haval/m6": [
"SAIC GM sucks",
"CC BY-SA 4.0",
"Haval_M6_Plus_006.jpg"
],
"haval/h5": [
"JustAnotherCarDesigner",
"CC0",
"Haval_H5_II_007.jpg"
],
"haval/h7": [
"iMoD Official",
"CC BY 3.0",
"2024 Haval H7 front view 02.png"
],
"haval/h9": [
"JustAnotherCarDesigner",
"CC0",
"Haval_Menglong_004_(cropped).jpg"
],
"chery/tiggo7pm": [
"SAIC GM sucks",
"CC BY-SA 4.0",
"Chery Tiggo 7 II 008.jpg"
],
"chery/tiggo8pm": [
"Throwawayacc222",
"CC0",
"2023 Chery Tiggo8 Pro Max (LVТ) silver front.jpg"
],
"chery/tiggo9": [
"Make Chiffon great again",
"CC BY-SA 4.0",
"Chery_Tiggo_9_01.jpg"
],
"chery/arrizo8": [
"JustAnotherCarDesigner",
"CC BY-SA 4.0",
"Chery_Arrizo_8_004_(cropped).jpg"
],
"chery/tiggo7pro": [
"JustAnotherCarDesigner",
"CC BY-SA 4.0",
"Chery_Tiggo_7_II_014_(cropped).jpg"
],
"changan/cs35plus": [
"JustAnotherCarDesigner",
"CC BY-SA 4.0",
"Changan_CS35_Plus_facelift_003.jpg"
],
"changan/cs55plus": [
"SAIC GM sucks",
"CC BY-SA 4.0",
"Changan_CS55_Plus_II_009.jpg"
],
"changan/cs75plus": [
"JustAnotherCarDesigner",
"CC0",
"Changan_CS75_Plus_IV_005.jpg"
],
"changan/unik": [
"Jengtingchen",
"CC BY-SA 4.0",
"Changan_UNI-K_001.jpg"
],
"changan/unit": [
"Kevauto",
"CC BY-SA 4.0",
"2023_Chang'an_UNI-T,_front_8.17.23.jpg"
],
"changan/univ": [
"Hangzhou car freak",
"CC BY-SA 4.0",
"Changan_UNI-V_IMG01.jpg"
],
"changan/cs35max": [
"Retired electrician",
"CC0",
"Moscow, Oshan (Changan) X5 Sport SUV, Nov 2025 02.jpg"
],
"tank/t300": [
"Anonymousfox36",
"CC BY-SA 4.0",
"TANK_300_IMG006.jpg"
],
"tank/t400": [
"JustAnotherCarDesigner",
"CC0",
"Tank_400_001.jpg"
],
"tank/t500": [
"Anonymousfox36",
"CC BY-SA 4.0",
"Tank_500_IMG001.jpg"
],
"tank/t700": [
"JustAnotherCarDesigner",
"CC0",
"Tank_700_011.jpg"
],
"exeed/lx": [
"Zotyefan",
"CC BY-SA 4.0",
"Exeed_LX_IMG001.jpg"
],
"exeed/txl": [
"User3204",
"CC BY 4.0",
"2019_Exeed_TXL_(front).jpg"
],
"exeed/rx": [
"JustAnotherCarDesigner",
"CC0",
"Exeed_Yaoguang_C-DM_003_(cropped).jpg"
],
"exeed/vx": [
"Anonymousfox36",
"CC BY-SA 4.0",
"Exeed_VX_IMG002.jpg"
],
"exeed/exlantix-et": [
"Retired electrician",
"CC0",
"Moscow, Exlantix ET, May 2026 12.jpg"
],
"exeed/exlantix-es": [
"Quzhouliulian",
"CC0",
"Exeed Sterra ES 009.jpg"
],
"omoda/c5": [
"Autosdeprimera",
"CC BY 3.0",
"2023_Omoda_C5_front_view.png"
],
"omoda/s5": [
"Jengtingchen",
"CC BY-SA 4.0",
"Chery Arrizo 5 Plus 005.jpg"
],
"omoda/c7": [
"gleb",
"CC BY 4.0",
"2025 Omoda C7 light blue front.jpg"
],
"jaecoo/j7": [
"© M 93",
"CC BY-SA 3.0 de",
"Jaecoo_J7_1.6T_4WD_–_f_21032025.jpg"
],
"jaecoo/j8": [
"Retired electrician",
"CC0",
"Moscow,_Jaecoo_J8_July_2025_01_(cropped).jpg"
],
"jaecoo/j6": [
"vipnumber",
"CC BY 4.0",
"2026_Jaecoo_J6_grey_front.jpg"
],
"jetour/dashing": [
"Retired electrician",
"CC0",
"Moscow,_black_Jetour_Dashing,_April_2025_02.jpg"
],
"jetour/x70plus": [
"Jengtingchen",
"CC0",
"Jetour_X70_Plus_facelift_001_(cropped).jpg"
],
"jetour/x90plus": [
"Throwawayacc222",
"CC0",
"2024_Jetour_X90_Plus_2.0_DCT_white_front.jpg"
],
"jetour/t2": [
"Ethan Llamas",
"CC BY-SA 4.0",
"Jetour_T2_Lightning_i-DM_Panda_White.jpg"
],
"jetour/t1": [
"JustAnotherCarDesigner",
"CC0",
"Jetour_Freedom_001.jpg"
],
"jetour/x50": [
"Nikolai Bulykin",
"CC BY-SA 4.0",
"Торетам, Jetour X50 на Вокзальной площади.jpg"
],
"tenet/t4": [
"Retired electrician",
"CC0",
"Moscow, Tenet T4 (Cherry Tiggo 4), Jan 2026 01.jpg"
],
"tenet/t7": [
"Throwawayacc222",
"CC0",
"2025_Tenet_T7_silver_front.jpg"
],
"tenet/t8": [
"Throwawayacc222",
"CC0",
"2025 Tenet T8 grey front.jpg"
],
"tenet/t9": [
"Autosdeprimera",
"CC BY 3.0",
"2024_Chery_Tiggo_9_(global)_front_view.png"
],
"belgee/x50": [
"Throwawayacc222",
"CC0",
"2024 Belgee X50 (Y4K) silver front.jpg"
],
"belgee/x70": [
"Danjer",
"CC BY 4.0",
"2025 BelGee X70 red front.jpg"
],
"belgee/s50": [
"astfv",
"CC BY 4.0",
"BelGee S50 white front.jpg"
],
"lynk/01": [
"Kevauto",
"CC BY-SA 4.0",
"2018_Lynk_&_Co_01,_front_8.4.18.jpg"
],
"lynk/05": [
"User3204",
"CC BY-SA 4.0",
"2020_Lynk_&_Co_05_(front).jpg"
],
"lynk/09": [
"User3204",
"CC BY-SA 4.0",
"2021_Lynk_&_Co_09.jpg"
],
"lynk/03": [
"Jengtingchen",
"CC BY-SA 4.0",
"Lynk_&_Co_03_003.jpg"
],
"li/l6": [
"S5A-0043",
"CC BY 4.0",
"(CHN-Shanghai)_Showcar_Li_L6_No-plate_2024-11-24.jpg"
],
"li/l7": [
"Quzhouliulian",
"CC0",
"Li_Auto_L7_008.jpg"
],
"li/l8": [
"JustAnotherCarDesigner",
"CC0",
"Li_Auto_L8_010.jpg"
],
"li/l9": [
"Zotyefan",
"CC BY-SA 4.0",
"Li_Auto_L9_IMG001.jpg"
],
"zeekr/001": [
"User3204",
"CC BY-SA 4.0",
"2022_Zeekr_001_(front).jpg"
],
"zeekr/7x": [
"JustAnotherCarDesigner",
"CC0",
"Zeekr_7X_005_(cropped).jpg"
],
"zeekr/x": [
"User3204",
"CC BY-SA 4.0",
"2023_Zeekr_X_(front).jpg"
],
"zeekr/009": [
"JustAnotherCarDesigner",
"CC BY-SA 4.0",
"Zeekr_009_003.jpg"
],
"hongqi/h5": [
"Milhouse35",
"CC BY-SA 4.0",
"Hongqi_H5_2023.jpg"
],
"hongqi/hs5": [
"JustAnotherCarDesigner",
"CC0",
"Hongqi_HS5_facelift_009.jpg"
],
"hongqi/hq9": [
"User3204",
"CC BY-SA 4.0",
"2022_Hongqi_HQ9_(front).jpg"
],
"hongqi/h9": [
"Jengtingchen",
"CC BY-SA 4.0",
"Hongqi_H9_010.jpg"
],
"gac/gs8": [
"User3204",
"CC BY-SA 4.0",
"2022_GAC_Trumpchi_GS8.jpg"
],
"gac/gs3": [
"Quzhouliulian",
"CC BY-SA 4.0",
"Trumpchi_GS3_II_IMG03.jpg"
],
"gac/empow": [
"User3204",
"CC BY-SA 4.0",
"2021_GAC_Trumpchi_Empow_(front).jpg"
],
"gac/m8": [
"User3204",
"CC BY-SA 4.0",
"2022_GAC_Trumpchi_M8_hybrid_(front).jpg"
],
"voyah/free": [
"S5A-0043",
"CC BY 4.0",
"(CHN-Shanghai)_Showcar_Voyah_Free+_No-plate_2025-12-21.jpg"
],
"voyah/dream": [
"User3204",
"CC BY-SA 4.0",
"2021_Voyah_Dreamer_(front).jpg"
],
"voyah/passion": [
"Zoerides",
"CC BY-SA 4.0",
"Voyah Zhuiguang 001.jpg"
],
"byd/songplus": [
"User3204",
"CC BY-SA 4.0",
"2023_BYD_Song_Plus_DM-i_(front).jpg"
],
"byd/han": [
"Kevauto",
"CC BY-SA 4.0",
"2023_BYD_Han_DM-i_(facelift),_front_8.17.23.jpg"
],
"byd/seal": [
"User3204",
"CC BY-SA 4.0",
"2022_BYD_Seal.jpg"
],
"byd/qinplus": [
"JustAnotherCarDesigner",
"CC0",
"BYD_Qin_Plus_DM-i_facelift_008.jpg"
],
"kaiyi/x3pro": [
"Throwawayacc222",
"CC0",
"2022 Kaiyi X3 PRO white front.jpg"
],
"kaiyi/e5": [
"Retired electrician",
"CC0",
"Moscow,_Kaiyi_E5,_April_2025_03.jpg"
],
"kaiyi/x7": [
"KitsuneDP",
"CC0",
"Kaiyi_Kunlun_003.jpg"
],
"livan/x6pro": [
"Throwawayacc222",
"CC0",
"2024 Livan X6 Pro Premium white front.jpg"
],
"livan/s6pro": [
"gleb",
"CC BY 4.0",
"2023 Livan S6 Pro grey front.jpg"
],
"moskvich/m3": [
"Throwawayacc222",
"CC0",
"2024 Moskvich 3 white rear.jpg"
],
"moskvich/m6": [
"Throwawayacc222",
"CC0",
"2024 Moskvich 6 Buisiness blue rear.jpg"
],
"chery/tiggo4": [
"JustAnotherCarDesigner",
"CC0",
"Chery Tiggo 5x Pro 001.jpg"
],
"changan/unis": [
"SAIC GM sucks",
"CC BY-SA 4.0",
"Changan CS55 Plus II 008.jpg"
],
"livan/x3pro": [
"Retired electrician",
"CC0",
"Moscow, Livan X3 Pro, Aug 2025 02.jpg"
]
};
