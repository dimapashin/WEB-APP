# Инструкция по загрузке проекта в GitHub

## Шаги для подключения к репозиторию GitHub

### 1. Откройте терминал в папке проекта

```powershell
cd "C:\Users\dima1\OneDrive\Рабочий стол\WEB APP"
```

### 2. Инициализируйте git репозиторий (если еще не инициализирован)

```powershell
git init
```

### 3. Добавьте remote репозиторий

```powershell
git remote add origin https://github.com/dimapashin/WEB-APP.git
```

Если remote уже существует, обновите его:

```powershell
git remote set-url origin https://github.com/dimapashin/WEB-APP.git
```

### 4. Проверьте remote

```powershell
git remote -v
```

Должно показать:
```
origin  https://github.com/dimapashin/WEB-APP.git (fetch)
origin  https://github.com/dimapashin/WEB-APP.git (push)
```

### 5. Добавьте все файлы проекта

```powershell
git add .
```

Или добавьте конкретные файлы:

```powershell
git add app/ components/ lib/ public/ styles/ docs/ *.json *.mjs *.config.* tsconfig.json .gitignore
```

### 6. Создайте первый commit

```powershell
git commit -m "Initial commit: UI/UX improvements and localization"
```

### 7. Проверьте ветку и переключитесь на main (если нужно)

```powershell
git branch -M main
```

### 8. Отправьте код в GitHub

```powershell
git push -u origin main
```

Если получите ошибку о том, что ветка уже существует в remote:

```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## После успешного push

После успешного push изменения автоматически задеплоятся на Vercel, так как репозиторий уже привязан к серверу.

Вы сможете увидеть изменения на: https://web-app-wheat-pi.vercel.app

---

## Дополнительная информация

- Если у вас уже есть код в GitHub репозитории, используйте `git pull` перед push
- Если возникнут конфликты, разрешите их и сделайте merge commit
- Для проверки изменений используйте `git status` и `git diff`
