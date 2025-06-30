// ШАГ 1: Вставьте сюда вашу ссылку на опубликованную Google-таблицу в формате CSV
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRmT61yV7Eeiy6avn7CXmgVJ1LWUQT5UlW1MEzzRv2mnkBALbU04y_GigrTjo-b0iEQ1g7QSjzPob01/pub?gid=0&single=true&output=csv';

// Ждем, пока вся HTML-страница полностью загрузится
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем приложение Telegram
    Telegram.WebApp.ready();

    // Загружаем данные из таблицы
    fetch(sheetUrl)
        .then(response => response.text())
        .then(text => {
            const data = parseCSV(text);
            updateDashboard(data);
            renderChart(data);
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных:', error);
            document.getElementById('ai-recommendation').innerText = 'Не удалось загрузить данные.';
        });
});

// Функция для превращения текста CSV в массив объектов
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
                row[headers[j].trim()] = values[j].trim();
            }
            rows.push(row);
        }
    }
    return rows;
}

// Функция для обновления данных на дашборде
function updateDashboard(data) {
    // Берем самую последнюю запись (самую свежую)
    const latestEntry = data[data.length - 1];

    if (latestEntry) {
        // Обновляем дату отчета
        const reportDate = new Date(latestEntry['Дата отчета']);
        document.getElementById('report-date').innerText = reportDate.toLocaleDateString('ru-RU');

        // Обновляем карточки с метриками
        document.getElementById('spend-value').innerText = parseFloat(latestEntry['Потрачено']).toFixed(2);
        document.getElementById('clicks-value').innerText = latestEntry['Клики'];
        document.getElementById('ctr-value').innerText = parseFloat(latestEntry['CTR']).toFixed(2);
        document.getElementById('cpc-value').innerText = parseFloat(latestEntry['CPC']).toFixed(2);

        // TODO: В будущем, сюда мы будем подгружать рекомендацию от AI
        document.getElementById('ai-recommendation').innerText = 'Здесь будет отображаться последняя рекомендация от AI. Пока это заглушка.';
    }
}

// Функция для отрисовки графика
function renderChart(data) {
    // Берем последние 7 записей для графика
    const chartData = data.slice(-7);

    const labels = chartData.map(row => new Date(row['Дата отчета']).toLocaleDateString('ru-RU'));
    const spendData = chartData.map(row => parseFloat(row['Потрачено']));

    const ctx = document.getElementById('spend-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line', // Тип графика - линейный
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
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}