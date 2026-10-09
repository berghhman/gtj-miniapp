/* Проверка бота без интернета: Telegram подменён записью вызовов. Запуск: node server/test/bot.test.js */
const assert = require('assert');
const crypto = require('crypto');
const { route } = require('../bot');

const env = { BOT_TOKEN: '123:TEST', MANAGER_CHAT_ID: '777', WEBHOOK_SECRET: 's3cret', PUBLIC_URL: 'https://fn.example/gtj', ALLOW_ORIGIN: 'https://berghhman.github.io' };
let calls = [], reply = () => ({ ok: true, result: {} });
const fetch = async (url, opt) => {
  const method = url.split('/').pop();
  const payload = opt.body instanceof FormData ? Object.fromEntries([...opt.body.entries()].map(([k, v]) => [k, typeof v === 'string' ? v : { type: v.type, size: v.size }])) : JSON.parse(opt.body);
  calls.push({ method, payload }); return { json: async () => reply(method, payload) };
};
const deps = { fetch };
const req = (body, headers = {}) => route({ method: 'POST', headers, query: {}, body: JSON.stringify(body) }, env, deps);
const tgHdr = { 'X-Telegram-Bot-Api-Secret-Token': 's3cret' };

function initData(user, token = env.BOT_TOKEN, authDate = Math.floor(Date.now() / 1000)) {
  const p = new URLSearchParams({ auth_date: String(authDate), query_id: 'AAE', user: JSON.stringify(user) });
  const check = [...p.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, v]) => `${k}=${v}`).join('\n');
  const secret = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
  p.set('hash', crypto.createHmac('sha256', secret).update(check).digest('hex'));
  return p.toString();
}
const client = { id: 5551, first_name: 'Алексей', username: 'alex_monjaro' };
const t = async (name, fn) => { calls = []; reply = () => ({ ok: true, result: {} }); await fn(); console.log('ok  ', name); };

(async () => {
  await t('заявка из мини-аппа уходит менеджеру с кнопками и подтверждением клиенту', async () => {
    const r = await req({ text: 'GTJ: Расчёт\nМашина: Geely Monjaro 2.0T', initData: initData(client) });
    assert.equal(r.status, 200);
    assert.equal(r.headers['Access-Control-Allow-Origin'], 'https://berghhman.github.io');
    const [toMgr, toClient] = calls;
    assert.equal(toMgr.payload.chat_id, '777');
    assert.match(toMgr.payload.text, /Алексей \(@alex_monjaro\)/);
    assert.match(toMgr.payload.text, /#id5551$/);
    assert.deepEqual(toMgr.payload.reply_markup.inline_keyboard[0].map(b => b.callback_data), ['a:5551', 'c:5551']);
    assert.equal(toMgr.payload.reply_markup.inline_keyboard[1][0].url, 'https://t.me/alex_monjaro');
    assert.equal(toClient.payload.chat_id, 5551);
  });

  await t('фото из заявки на запчасти уходит менеджеру ответом на заявку', async () => {
    reply = m => (m === 'sendMessage' ? { ok: true, result: { message_id: 42 } } : { ok: true });
    const jpeg = 'data:image/jpeg;base64,' + Buffer.from('fake-jpeg-bytes').toString('base64');
    const r = await req({ text: 'GTJ: Оригинальные запчасти\nVIN: LB37624S7PL000001', initData: initData(client), photo: jpeg });
    assert.equal(r.status, 200);
    assert.deepEqual(calls.map(c => c.method), ['sendMessage', 'sendPhoto', 'sendMessage']);
    const ph = calls[1].payload;
    assert.equal(ph.chat_id, '777');
    assert.match(ph.caption, /#id5551$/);
    assert.equal(JSON.parse(ph.reply_parameters).message_id, 42);
    assert.deepEqual(ph.photo, { type: 'image/jpeg', size: 15 });
  });

  await t('не-картинка вместо фото не отправляется', async () => {
    await req({ text: 'x', initData: initData(client), photo: 'data:text/html;base64,PGgxPg==' });
    assert.deepEqual(calls.map(c => c.method), ['sendMessage', 'sendMessage']);
  });

  await t('поддельная или чужая подпись отклоняется', async () => {
    assert.equal((await req({ text: 'x', initData: initData(client, '999:OTHER') })).status, 403);
    assert.equal((await req({ text: 'x', initData: '' })).status, 403);
    assert.equal((await req({ text: 'x', initData: initData(client, env.BOT_TOKEN, 1000) })).status, 403);
    assert.equal(calls.length, 0);
  });

  await t('клиент без ника: нет кнопки со ссылкой, заявка всё равно уходит', async () => {
    await req({ text: 'GTJ: Вопрос', initData: initData({ id: 42, first_name: 'Ира' }) });
    assert.equal(calls[0].payload.reply_markup.inline_keyboard.length, 1);
  });

  await t('вебхук без секрета отклоняется', async () => {
    const r = await req({ update_id: 1, message: { message_id: 1, chat: { id: 5551, type: 'private' }, from: client, text: 'привет' } });
    assert.equal(r.status, 403); assert.equal(calls.length, 0);
  });

  await t('/start клиенту: приветствие и кнопка магазина', async () => {
    await req({ update_id: 2, message: { message_id: 1, chat: { id: 5551, type: 'private' }, from: client, text: '/start' } }, tgHdr);
    assert.equal(calls[0].payload.reply_markup.inline_keyboard[0][0].web_app.url, 'https://berghhman.github.io/gtj-miniapp/');
  });

  await t('текст клиента приходит менеджеру с номером клиента', async () => {
    await req({ update_id: 3, message: { message_id: 9, chat: { id: 5551, type: 'private' }, from: client, text: 'Сколько стоит Stage 1?' } }, tgHdr);
    assert.equal(calls[0].payload.chat_id, '777');
    assert.match(calls[0].payload.text, /Сколько стоит Stage 1\?\n\n#id5551$/);
  });

  await t('фото клиента: копия с подписью и номером', async () => {
    await req({ update_id: 4, message: { message_id: 10, chat: { id: 5551, type: 'private' }, from: client, photo: [{}], caption: 'вот так стучит' } }, tgHdr);
    assert.equal(calls[0].method, 'copyMessage');
    assert.match(calls[0].payload.caption, /вот так стучит\n\n#id5551$/);
  });

  await t('стикер: заголовок с номером, затем копия', async () => {
    await req({ update_id: 5, message: { message_id: 11, chat: { id: 5551, type: 'private' }, from: client, sticker: {} } }, tgHdr);
    assert.deepEqual(calls.map(c => c.method), ['sendMessage', 'copyMessage']);
    assert.match(calls[0].payload.text, /#id5551$/);
  });

  await t('ответ менеджера на сообщение клиента уходит клиенту', async () => {
    await req({ update_id: 6, message: { message_id: 50, chat: { id: 777, type: 'private' }, from: { id: 777, first_name: 'Дима' }, text: 'Stage 1 — 35 000 ₽', reply_to_message: { message_id: 49, text: 'Сообщение от клиента\nАлексей\n\nСколько?\n\n#id5551' } } }, tgHdr);
    assert.equal(calls[0].method, 'copyMessage');
    assert.deepEqual([calls[0].payload.chat_id, calls[0].payload.from_chat_id, calls[0].payload.message_id], ['5551', 777, 50]);
  });

  await t('ответ на фото клиента (номер в подписи) тоже доходит', async () => {
    await req({ update_id: 7, message: { message_id: 51, chat: { id: 777, type: 'private' }, from: { id: 777 }, voice: {}, reply_to_message: { message_id: 48, caption: 'Сообщение от клиента\n\n#id5551' } } }, tgHdr);
    assert.equal(calls[0].payload.chat_id, '5551');
  });

  await t('клиент заблокировал бота: менеджер узнаёт об этом', async () => {
    reply = m => (m === 'copyMessage' ? { ok: false, description: 'Forbidden: bot was blocked by the user' } : { ok: true });
    await req({ update_id: 8, message: { message_id: 52, chat: { id: 777, type: 'private' }, from: { id: 777 }, text: 'ау', reply_to_message: { message_id: 49, text: 'x\n\n#id5551' } } }, tgHdr);
    assert.match(calls[1].payload.text, /клиент остановил бота/);
  });

  await t('сообщение менеджера не ответом: подсказка, как отвечать', async () => {
    await req({ update_id: 9, message: { message_id: 53, chat: { id: 777, type: 'private' }, from: { id: 777 }, text: 'привет' } }, tgHdr);
    assert.match(calls[0].payload.text, /ответьте на его сообщение/);
  });

  await t('в рабочей группе обычная переписка менеджеров игнорируется', async () => {
    const genv = { ...env, MANAGER_CHAT_ID: '-100500' };
    calls = [];
    await route({ method: 'POST', headers: tgHdr, query: {}, body: JSON.stringify({ update_id: 10, message: { message_id: 1, chat: { id: -100500, type: 'supergroup' }, from: { id: 1 }, text: 'кто возьмёт?' } }) }, genv, deps);
    assert.equal(calls.length, 0);
  });

  await t('«Принять»: статус в заявке и уведомление клиенту', async () => {
    const msg = { message_id: 70, chat: { id: 777 }, text: 'Новая заявка, 13:10\nКлиент: Алексей\n\nGTJ: Расчёт\n\n#id5551', reply_markup: { inline_keyboard: [[{ text: 'Принять', callback_data: 'a:5551' }, { text: 'Закрыть', callback_data: 'c:5551' }], [{ text: 'Открыть чат с клиентом', url: 'https://t.me/alex_monjaro' }]] } };
    await req({ update_id: 11, callback_query: { id: 'q1', from: { id: 777, first_name: 'Дима' }, data: 'a:5551', message: msg } }, tgHdr);
    const edit = calls.find(c => c.method === 'editMessageText');
    assert.match(edit.payload.text, /Статус: Принята: Дима, \d\d:\d\d\n\n#id5551$/);
    assert.deepEqual(edit.payload.reply_markup.inline_keyboard.map(r => r[0].text), ['Закрыть', 'Открыть чат с клиентом']);
    assert.ok(calls.some(c => c.method === 'sendMessage' && c.payload.chat_id === '5551'));
    // потом «Закрыть»: статус заменяется, клиенту ничего не уходит
    calls = [];
    await req({ update_id: 12, callback_query: { id: 'q2', from: { id: 777, first_name: 'Дима' }, data: 'c:5551', message: { ...msg, text: edit.payload.text, reply_markup: edit.payload.reply_markup } } }, tgHdr);
    const e2 = calls.find(c => c.method === 'editMessageText');
    assert.equal((e2.payload.text.match(/Статус:/g) || []).length, 1);
    assert.match(e2.payload.text, /Закрыта: Дима/);
    assert.ok(!calls.some(c => c.method === 'sendMessage'));
  });

  await t('кнопки работают только в чате менеджера', async () => {
    await req({ update_id: 13, callback_query: { id: 'q3', from: { id: 5551 }, data: 'a:5551', message: { message_id: 1, chat: { id: 5551 }, text: '#id5551' } } }, tgHdr);
    assert.deepEqual(calls.map(c => c.method), ['answerCallbackQuery']);
  });

  await t('/id показывает номер чата', async () => {
    await req({ update_id: 14, message: { message_id: 1, chat: { id: 5551, type: 'private' }, from: client, text: '/id' } }, tgHdr);
    assert.match(calls[0].payload.text, /5551/);
  });

  await t('настройка по ссылке только с секретом', async () => {
    const bad = await route({ method: 'GET', headers: {}, query: { setup: 'nope' }, body: '' }, env, deps);
    assert.equal(bad.status, 403);
    const ok = await route({ method: 'GET', headers: {}, query: { setup: 's3cret' }, body: '' }, env, deps);
    assert.equal(ok.status, 200);
    assert.deepEqual(calls.map(c => c.method), ['setWebhook', 'setChatMenuButton', 'setMyCommands']);
    assert.equal(calls[0].payload.secret_token, 's3cret');
  });

  console.log('\nвсе проверки пройдены');
})().catch(e => { console.error(e); process.exit(1); });
