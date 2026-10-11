# Собирает site/index.html для GitHub Pages из site/page.html (page.html без <html>/<head>/<body> — так его публикует и превью).
import pathlib
d = pathlib.Path(__file__).parent
src = (d / 'page.html').read_text(encoding='utf8')
head, body = src.split('<header class="top">', 1)
out = ('<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
       '<meta name="theme-color" content="#050506">\n' + head + '</head>\n<body>\n<header class="top">' + body + '</body>\n</html>\n')
(d / 'index.html').write_text(out, encoding='utf8')
print('site/index.html', len(out))
