# test-task-itdecision
Чтобы локально запустить проект следуйте следующей инструкции:
1. Установите файлы репозитория
2. Откройте терминал и выполните подряд следущие команды:
  - npm install;
  - cd front;
  - npm install;
  - cd ..;
3. Програма готова к запуску.
4. Запустите командой "npm run dev". Одновременно запуститься сервер и реакт приложение (module concurrently)
5. В приложении есть две роли: админ и юзер. Создано по одному пользователю каждой роли.
  - Админ: ник-admin, пароль-root
  - Юзер: ник-user, пароль-root
6. Также Вы можете найти файл add.txt. Этот файл - пример файла с помощью которого админ вносит задания (задания в файле уже внесены в базу, поэтому поменяйте их).