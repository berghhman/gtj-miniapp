/* GTJ: пересыльщик заявок из мини-аппа менеджеру через бота.
   Работает как Cloudflare Worker (бесплатного тарифа хватает). Можно перенести в Яндекс Cloud Functions.

   Переменные окружения (Settings → Variables, токен — как Secret):
     BOT_TOKEN        токен @GTJdetailing_bot от BotFather (в репозиторий НЕ кладём)
     MANAGER_CHAT_ID  id чата менеджера или рабочей группы, куда падают заявки
     ALLOW_ORIGIN     https://berghhman.github.io (адрес мини-аппа)

   После деплоя впишите адрес воркера в data/shop.js → leadEndpoint. */

export default {
  async fetch(req, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || 'https://berghhman.github.io',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST') return new Response('POST only', { status: 405, headers: cors });

    let body;
    try { body = await req.json(); } catch (e) { return new Response('bad json', { status: 400, headers: cors }); }

    // принимаем только заявки, которые пришли из Telegram: подпись initData проверяется токеном бота
    const user = await checkInitData(body.initData || '', env.BOT_TOKEN);
    if (!user) return new Response('not from telegram', { status: 403, headers: cors });

    const text = String(body.text || '').slice(0, 3500);
    const api = m => `https://api.telegram.org/bot${env.BOT_TOKEN}/${m}`;
    const send = payload => fetch(api('sendMessage'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    const toManager = await send({
      chat_id: env.MANAGER_CHAT_ID,
      text: `${text}\nTelegram id: ${user.id}`,
      reply_markup: { inline_keyboard: [[{ text: 'Написать клиенту', url: user.username ? `https://t.me/${user.username}` : `tg://user?id=${user.id}` }]] },
    });
    if (!toManager.ok) return new Response('telegram error', { status: 502, headers: cors });

    // клиенту — подтверждение от бота (дойдёт, если он нажимал «Старт» в боте)
    await send({ chat_id: user.id, text: `Заявка принята, менеджер GTJ ответит здесь.\n\n${text}` }).catch(() => {});
    return new Response('ok', { headers: cors });
  },
};

async function checkInitData(initData, token) {
  if (!initData || !token) return null;
  const p = new URLSearchParams(initData);
  const hash = p.get('hash'); p.delete('hash');
  const check = [...p.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join('\n');
  const enc = new TextEncoder();
  const k1 = await crypto.subtle.importKey('raw', enc.encode('WebAppData'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const secret = await crypto.subtle.sign('HMAC', k1, enc.encode(token));
  const k2 = await crypto.subtle.importKey('raw', secret, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', k2, enc.encode(check)));
  const hex = [...sig].map(b => b.toString(16).padStart(2, '0')).join('');
  if (hex !== hash) return null;
  if (Date.now() / 1000 - Number(p.get('auth_date')) > 86400) return null; // подпись старше суток
  try { return JSON.parse(p.get('user')); } catch (e) { return null; }
}
