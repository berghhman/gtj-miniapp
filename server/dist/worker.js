/* GTJ: бот-менеджер для Cloudflare Workers. Собрано из server/bot.js — правьте там и пересоберите. */
/* GTJ: бот-менеджер.
   Одна функция без базы данных. Каждое сообщение, которое бот присылает менеджеру,
   заканчивается строкой «#id<номер клиента>». Менеджер отвечает на него (свайп → «Ответить»),
   бот берёт номер из исходного сообщения и пересылает ответ клиенту от имени GTJ.

   Переменные окружения:
     BOT_TOKEN        токен бота (секрет)
     MANAGER_CHAT_ID  куда приходят заявки: id менеджера или рабочей группы (узнать — команда /id)
     WEBHOOK_SECRET   любая длинная строка: защищает вход от чужих запросов
     PUBLIC_URL       адрес этой функции (нужен для одноразовой настройки)
     MINIAPP_URL      адрес мини-аппа, по умолчанию https://berghhman.github.io/gtj-miniapp/
     ALLOW_ORIGIN     с какого сайта принимать заявки, по умолчанию https://berghhman.github.io */

/* Web Crypto: одинаково работает в Node 18+ и в Cloudflare Workers */
const subtle = globalThis.crypto.subtle;
const enc = new TextEncoder();
async function hmac(key, data) {
  const k = await subtle.importKey('raw', typeof key === 'string' ? enc.encode(key) : key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await subtle.sign('HMAC', k, enc.encode(data)));
}
const hex = b => Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
function sameString(a, b) {
  if (a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

const ID_TAG = /#id(\d+)\s*$/m;
const tagOf = id => `#id${id}`;
const clip = (s, n) => String(s || '').slice(0, n);
const hhmm = () => new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' });

function api(env, fetchImpl = (u, o) => fetch(u, o)) {
  return async (method, payload) => {
    const r = await fetchImpl(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    let j = {};
    try { j = await r.json(); } catch (e) {}
    return j;
  };
}

/* подпись initData: заявка точно пришла из Telegram от этого пользователя */
async function checkInitData(initData, token, maxAgeSec = 86400) {
  if (!initData || !token) return null;
  const p = new URLSearchParams(initData);
  const hash = p.get('hash'); if (!hash) return null;
  p.delete('hash');
  const check = [...p.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([k, v]) => `${k}=${v}`).join('\n');
  const secret = await hmac('WebAppData', token);
  const sig = hex(await hmac(secret, check));
  if (!sameString(sig, hash)) return null;
  if (Date.now() / 1000 - Number(p.get('auth_date')) > maxAgeSec) return null;
  try { return JSON.parse(p.get('user')); } catch (e) { return null; }
}

const personLine = u => [u.first_name, u.last_name].filter(Boolean).join(' ') + (u.username ? ` (@${u.username})` : '');
const contactButton = u => (u.username ? [[{ text: 'Открыть чат с клиентом', url: `https://t.me/${u.username}` }]] : []);
const leadKeyboard = u => ({ inline_keyboard: [[{ text: 'Принять', callback_data: `a:${u.id}` }, { text: 'Закрыть', callback_data: `c:${u.id}` }], ...contactButton(u)] });

const TEXT = {
  start: 'GTJ — тюнинг и детейлинг китайских автомобилей.\n\nОткройте магазин кнопкой ниже: подберём детали под вашу машину и посчитаем прирост мощности. Или просто напишите вопрос сюда — ответит менеджер.',
  received: 'Заявка принята. Менеджер GTJ ответит здесь, в этом чате.',
  accepted: 'Менеджер принял вашу заявку и скоро напишет здесь.',
  managerHelp: 'Чтобы ответить клиенту, ответьте на его сообщение (свайп влево → «Ответить»). Бот перешлёт ответ от имени GTJ: текст, фото, файлы, голосовые.\n\nКнопки под заявкой: «Принять» — клиенту придёт уведомление, «Закрыть» — заявка отмечается как обработанная.',
};

/* ---------- заявка из мини-аппа ---------- */
async function handleLead(body, env, deps = {}) {
  const call = api(env, deps.fetch);
  const user = await checkInitData(body && body.initData, env.BOT_TOKEN);
  if (!user) return { status: 403, body: 'not from telegram' };
  const text = clip(body.text, 3000);
  const head = `Новая заявка, ${hhmm()}\nКлиент: ${personLine(user)}`;
  const sent = await call('sendMessage', { chat_id: env.MANAGER_CHAT_ID, text: `${head}\n\n${text}\n\n${tagOf(user.id)}`, reply_markup: leadKeyboard(user) });
  if (!sent.ok) return { status: 502, body: 'telegram error' };
  await call('sendMessage', { chat_id: user.id, text: `${TEXT.received}\n\n${text}` });
  return { status: 200, body: 'ok' };
}

/* ---------- всё, что Telegram присылает боту ---------- */
async function handleUpdate(u, env, deps = {}) {
  const call = api(env, deps.fetch);
  const manager = String(env.MANAGER_CHAT_ID || '');

  if (u.callback_query) {
    const q = u.callback_query; const [act, cid] = String(q.data || '').split(':');
    const msg = q.message;
    if (!msg || String(msg.chat.id) !== manager) return call('answerCallbackQuery', { callback_query_id: q.id });
    const who = q.from.first_name || 'менеджер';
    const status = act === 'a' ? `Принята: ${who}, ${hhmm()}` : `Закрыта: ${who}, ${hhmm()}`;
    const base = (msg.text || '').replace(ID_TAG, '').replace(/\n\nСтатус: .*$/s, '').trimEnd();
    const rest = (msg.reply_markup && msg.reply_markup.inline_keyboard || []).filter(row => row.some(b => b.url));
    const keep = act === 'a' ? [[{ text: 'Закрыть', callback_data: `c:${cid}` }], ...rest] : rest;
    await call('editMessageText', { chat_id: msg.chat.id, message_id: msg.message_id, text: `${base}\n\nСтатус: ${status}\n\n${tagOf(cid)}`, reply_markup: { inline_keyboard: keep } });
    if (act === 'a') await call('sendMessage', { chat_id: cid, text: TEXT.accepted });
    return call('answerCallbackQuery', { callback_query_id: q.id, text: act === 'a' ? 'Клиент получил уведомление' : 'Заявка закрыта' });
  }

  const m = u.message || u.edited_message;
  if (!m || !m.chat) return;
  const text = m.text || '';

  if (/^\/id\b/.test(text)) return call('sendMessage', { chat_id: m.chat.id, text: `id этого чата: ${m.chat.id}` });

  /* сообщения из чата менеджера */
  if (String(m.chat.id) === manager) {
    const orig = m.reply_to_message;
    const tag = orig && ((orig.text || orig.caption || '').match(ID_TAG));
    if (!tag) {
      if (m.chat.type === 'private' || /^\/(help|start)/.test(text)) return call('sendMessage', { chat_id: m.chat.id, text: TEXT.managerHelp });
      return; // обычная переписка менеджеров в группе
    }
    const r = await call('copyMessage', { chat_id: tag[1], from_chat_id: m.chat.id, message_id: m.message_id });
    if (!r.ok) {
      const blocked = /blocked|deactivated|chat not found/i.test(r.description || '');
      return call('sendMessage', { chat_id: m.chat.id, reply_to_message_id: m.message_id, text: blocked ? 'Не доставлено: клиент остановил бота. Напишите ему напрямую.' : `Не доставлено: ${r.description || 'ошибка Telegram'}` });
    }
    return;
  }

  /* клиент пишет боту */
  if (m.chat.type !== 'private') return;
  if (/^\/start/.test(text)) {
    return call('sendMessage', { chat_id: m.chat.id, text: TEXT.start, reply_markup: { inline_keyboard: [[{ text: 'Открыть магазин', web_app: { url: env.MINIAPP_URL || 'https://berghhman.github.io/gtj-miniapp/' } }]] } });
  }
  const head = `Сообщение от клиента\n${personLine(m.from)}`;
  const tag = tagOf(m.from.id);
  if (m.text) {
    return call('sendMessage', { chat_id: manager, text: `${head}\n\n${clip(m.text, 3500)}\n\n${tag}`, reply_markup: { inline_keyboard: contactButton(m.from) } });
  }
  /* фото, голосовые, файлы: копия с подписью, в которой есть номер клиента */
  const canCaption = m.photo || m.video || m.document || m.audio || m.voice || m.animation;
  if (canCaption) {
    return call('copyMessage', { chat_id: manager, from_chat_id: m.chat.id, message_id: m.message_id, caption: `${head}\n\n${clip(m.caption, 800)}\n\n${tag}`.replace(/\n\n\n/g, '\n\n') });
  }
  /* стикер, геопозиция, контакт: сначала заголовок с номером, потом сама копия */
  await call('sendMessage', { chat_id: manager, text: `${head}\nприслал${m.location ? ' геопозицию' : m.contact ? ' контакт' : ''}:\n\n${tag}` });
  return call('copyMessage', { chat_id: manager, from_chat_id: m.chat.id, message_id: m.message_id });
}

/* ---------- одноразовая настройка: вебхук, кнопка меню, команды ---------- */
async function setup(env, deps = {}) {
  const call = api(env, deps.fetch);
  const url = env.MINIAPP_URL || 'https://berghhman.github.io/gtj-miniapp/';
  const out = {};
  out.webhook = await call('setWebhook', { url: env.PUBLIC_URL, secret_token: env.WEBHOOK_SECRET, allowed_updates: ['message', 'edited_message', 'callback_query'], drop_pending_updates: true });
  out.menu = await call('setChatMenuButton', { menu_button: { type: 'web_app', text: 'Магазин', web_app: { url } } });
  out.commands = await call('setMyCommands', { commands: [{ command: 'start', description: 'Открыть магазин GTJ' }] });
  return out;
}

/* ---------- общий вход для любого хостинга ---------- */
async function route(req, env, deps = {}) {
  const cors = { 'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || 'https://berghhman.github.io', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
  const h = Object.fromEntries(Object.entries(req.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
  if (req.method === 'OPTIONS') return { status: 204, headers: cors, body: '' };
  if (req.method === 'GET' && req.query && req.query.setup) {
    if (!env.WEBHOOK_SECRET || req.query.setup !== env.WEBHOOK_SECRET) return { status: 403, body: 'wrong key' };
    return { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(await setup(env, deps), null, 2) };
  }
  if (req.method !== 'POST') return { status: 200, body: 'GTJ bot is running' };
  let body = {};
  try { body = JSON.parse(req.body || '{}'); } catch (e) { return { status: 400, headers: cors, body: 'bad json' }; }

  if (body.update_id != null) {
    if (env.WEBHOOK_SECRET && h['x-telegram-bot-api-secret-token'] !== env.WEBHOOK_SECRET) return { status: 403, body: 'bad secret' };
    try { await handleUpdate(body, env, deps); } catch (e) { console.error(e); }
    return { status: 200, body: 'ok' }; // Telegram не должен повторять апдейт
  }
  const r = await handleLead(body, env, deps);
  return { status: r.status, headers: cors, body: r.body };
}


/* ---------- вход Cloudflare Workers ---------- */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const body = request.method === 'POST' ? await request.text() : '';
    const r = await route({
      method: request.method,
      headers: Object.fromEntries(request.headers),
      query: Object.fromEntries(url.searchParams),
      body,
    }, env);
    return new Response(r.status === 204 ? null : r.body, { status: r.status, headers: r.headers || {} });
  },
};
