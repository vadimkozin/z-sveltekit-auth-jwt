# process аутентификации и защиты маршрутов
login:
  +page.server.ts
  выполняется при маршруте /login
  проверка пользователя (email, password) по базе, 
    если есть - то создаём jwt-токен (c полезной нагрузкой userId и email), подписываем его JWT_ACCESS_SECRET
    и через куки 'AuthorizationToken' передаём jwt-токен на клиент

hook.server.ts
  выполняется при каждом запросе клиентом данных с сервера
  выполняется на сервере
  браузер передают куки автоматически
  в куках ищем ключ AuthorizationToken 
  и если есть - то вынимаем сам token и проверяем его используя JWT_ACCESS_SECRET
  если всё хорошо - то вынимем из токена userId 
  по userId находим пользователя в базе
  если всё хорошо - создаём объект сессии: {userId, email} и записываем в event.locals.user
  event.locals.user - становится известен коду на стороне сервера
/guarded
 +page.server.ts
  в функции load получаем ифно по пользователю: const user = event.locals.user;
  если user нет, то выбрасываем ошибку 'You must be logged in to view this page'
  если есть, то возвращаем user

 +page.svelte
 ожидаем user
 	export let data: PageData;
	const { user } = data;

 таким образом +page.server.ts защищает маршрут, 
  если полльзователь не залогинен, то переход на +page.svelte не происходит,
  а выбрасыается ошибка и отображается на /routes/+error.svelte
  если же логирование прошло успешно, то отображается  +page.svelte
  ================================
  расширим эту логику на групповые маршруты:
  пускай в приложении будут групповые маршруты (auth) и (app)
  (auth)
    /login
    /register
    /logout
  (app)
    /about
    /contacts
    /users
    ...
  
  в группе (app) поставим защиту:
  +layout.server.ts - добавим логику из /guarded +page.server.ts
  


