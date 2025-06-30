// Ваша ссылка на вебхук
const webhookUrl = 'https://hook.eu2.make.com/ajdfn066bhobcgx81g2tssl7rwkq9duw';

document.addEventListener('DOMContentLoaded', () => {
    Telegram.WebApp.ready();
    
    // Показываем пользователю, что работа началась
    const statusElement = document.getElementById('ai-recommendation');
    statusElement.innerText = '✅ Запрос отправлен! Готовлю свежий отчет... Он придет в этот чат через несколько секунд. Это окно можно закрыть.';
    
    // Прячем старые блоки, чтобы не смущать
    document.querySelector('.metrics').style.display = 'none';
    document.querySelector('.chart-container').style.display = 'none';
    document.querySelector('.subtitle').style.display = 'none';

    // Просто отправляем запрос, не ожидая и не обрабатывая ответ
    fetch(webhookUrl).catch(console.error);
});