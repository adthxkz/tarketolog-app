// Вставьте вашу ссылку для ЗАПУСКА сценария
const webhookUrl = 'https://hook.eu2.make.com/ajdfn066bhobcgx81g2tssl7rwkq9duw';

// Вставьте вашу ссылку на ОПУБЛИКОВАННЫЙ CSV-файл таблицы
const sheetUrl = 'ВАША_ССЫЛКА_НА_CSV_ИЗ_GOOGLE_SHEETS';

document.addEventListener('DOMContentLoaded', () => {
    Telegram.WebApp.ready();

    const statusElement = document.getElementById('ai-recommendation');
    statusElement.innerText = 'Запускаю обновление данных... Пожалуйста, подождите, это может занять до 20 секунд.';

    // 1. Сначала "дергаем" вебхук, чтобы запустить сценарий в Make
    fetch(webhookUrl).catch(error => console.error('Ошибка при запуске сценария:', error));

    // 2. Через 15 секунд пытаемся забрать готовый результат из таблицы
    setTimeout(() => {
        fetch(sheetUrl)
            .then(response => response.text())
            .then(text => {
                const data = parseCSV(text);
                updateDashboard(data);
                renderChart(data); // Передаем все данные в функцию графика
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных из таблицы:', error);
                statusElement.innerText = 'Не удалось загрузить обновленные данные. Попробуйте позже.';
            });
    }, 15000); // Задержка в 15 секунд (15000 миллисекунд)
});

// Парсер CSV остается без изменений
function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const values = line.split(',');
            const row = {};
            for (let j = 0; j < headers.length; j++) {
                row[headers[j].trim()] = values[j] ? values[j].trim() : "";
            }
            rows.push(row);
        }
    }
    return rows;
}

// Обновляем дашборд
function updateDashboard(data) {
    const latestEntry = data[data.length - 1];
    if (latestEntry) {
        document.getElementById('report-date').innerText = new Date(latestEntry['Дата отчета']).toLocaleDateString('ru-RU');
        document.getElementById('spend-value').innerText = parseFloat(latestEntry['Потрачено']).toFixed(2);
        document.getElementById('clicks-value').innerText = latestEntry['Клики'];
        document.getElementById('ctr-value').innerText = parseFloat(latestEntry['CTR']).toFixed(2);
        document.getElementById('cpc-value').innerText = parseFloat(latestEntry['CPC']).toFixed(2);
        // Теперь мы берем анализ из нового столбца в таблице!
        document.getElementById('ai-recommendation').innerText = latestEntry['AI Анализ'] || "Анализ для этого дня еще не готов.";
    }
}

// Обновляем функцию отрисовки графика
function renderChart(data) {
    if (!data || data.length === 0) return;
    const chartData = data.slice(-7);
    const labels = chartData.map(row => new Date(row['Дата отчета']).toLocaleDateString('ru-RU'));
    const spendData = chartData.map(row => parseFloat(row['Потрачено']));
    const ctx = document.getElementById('spend-chart').getContext('2d');
    new Chart(ctx, { type: 'line', data: { labels: labels, datasets: [{ label: 'Потрачено (₽)', data: spendData, backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 2, tension: 0.1 }] } });
}