## Установка Vue и создание проекта
Cначала нужно скачать Node.js:
https://nodejs.org/en/download/

Потом в командной строке:
    
    npm install -g @vue/cli

Дальше создади проект, например таким образом:

    vue init webpack betterthanmiro

? Имя проекта betterthanmiro <br>
? Описание проекта Vue.js <br>
? Автор Igor Chiesov <br>
? Автономная сборка Vue <br>
? Установить vue-router? — Да <br>
? Использовать ESLint для линтинга кода? — Да <br>
? Выберите пресет ESLint — Airbnb <br>
? Настроить юнит-тесты? — Нет <br>
? Настроить тесты e2e с Nightwatch? — Нет <br>
? Запустить установку npm после создания проекта?  (рекомендуется) — Да, использовать NPM. <br>

Дальше появится подсказка:

    cd betterthanmiro
    npm run dev 

С помощью последней команды можно запускать тестовую версию приложения на локальном сервере

## Как собрать проект

    npm run build

Появится папка dist, содержащее всё фронтенд приложение

Чтобы затестить у себя локально, недостаточно просто открыть index.html как файл, нужно запустить локальный сервер:

    npm install -g serve

*флаг -s означает запуск serve в режиме одностраничного приложения (SPA) который решает проблему маршрутизации*

    serve -s dist

Чтобы закинуть приложение на наш Sandbox, нужно кинуть содержимое папку `dist` в `app/` и настроить `__init__.py` и `routes.py`, чтобы сервер возвращал сгенерированный `index.html`, например так:

В файле `__init.py__`:

    `app = Flask(__name__, static_folder='dist/' static_url_path='/')`

В `routes.py`:

    @app.route("/")
    @app.route("/index")
    def index():
        return app.send_static_file('index.html')