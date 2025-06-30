// Вставляем ВАШУ ссылку на вебхук
const webhookUrl = 'https://hook.eu2.make.com/ajdfn066bhobcgx81g2tssl7rwkq9duw';

// Ждем, пока вся HTML-страница полностью загрузится
document.addEventListener('DOMContentLoaded', () => {
    Telegram.WebApp.ready();

    // Загружаем данные напрямую из нашего сценария в Make
    fetch(webhookUrl)
        .then(response => response.json()) // Ожидаем данные в формате JSON
        .then(data => {
            // 'data' - это готовый объект с данными и анализом от Make
            updateDashboard(data);
            renderChart(data.history);
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных с Make:', error);
            document.getElementById('ai-recommendation').innerText = 'Не удалось загрузить данные с сервера.';
        });
});

// Функция для обновления данных на дашборде
function updateDashboard(data) {
    const latestEntry = data.latest; // Последние данные
    if (latestEntry) {
        document.getElementById('report-date').innerText = new Date().toLocaleDateString('ru-RU');
        document.getElementById('spend-value').innerText = parseFloat(latestEntry.spend).toFixed(2);
        document.getElementById('clicks-value').innerText = latestEntry.clicks;
        document.getElementById('ctr-value').innerText = parseFloat(latestEntry.ctr).toFixed(2);
        document.getElementById('cpc-value').innerText = parseFloat(latestEntry.cpc).toFixed(2);
        
        document.getElementById('ai-recommendation').innerText = 'Подробный анализ отправлен вам в чат.';
    }
}

// Функция для отрисовки графика
function renderChart(historyData) {
    if (!historyData || historyData.length === 0) return;

    // ----- ВОТ ЗДЕСЬ БЫЛА ОШИБКА -----
    const chartData = historyData.slice(-7);

    const labels = chartData.map(row => new Date(row['Дата отчета']).toLocaleDateString('ru-RU'));
    const spendData = chartData.map(row => parseFloat(row['Потрачено']));

    const ctx = document.getElementById('spend-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Потрачено (₽)',
                data: spendData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.1
            }]
        }
    });
}