let port;
let writer;

// 1. Настройка формата листа
const formatSelect = document.getElementById('paper-format');
const canvas = document.getElementById('plotter-canvas');

function updateCanvasSize() {
    if (formatSelect.value === 'A4') {
        canvas.width = 210 * 3;  // Масштаб для отображения на экране
        canvas.height = 297 * 3;
    } else if (formatSelect.value === 'A3') {
        canvas.width = 297 * 3;
        canvas.height = 420 * 3;
    }
}
formatSelect.addEventListener('change', updateCanvasSize);
updateCanvasSize();

// 2. Подключение к плоттеру по USB через Web Serial API
document.getElementById('btn-connect').addEventListener('click', async () => {
    try {
        // Запрос у пользователя выбора COM-порта плоттера
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 }); // Частота для GRBL/Arduino плоттеров
        
        writer = port.writable.getWriter();
        document.getElementById('btn-print').disabled = false;
        alert('Плоттер успешно подключен!');
    } catch (error) {
        console.error('Ошибка подключения:', error);
        alert('Не удалось подключиться к устройству.');
    }
});

// 3. Функция отправки команды плоттеру
async function sendGCode(command) {
    const encoder = new TextEncoder();
    await writer.write(encoder.encode(command + '\n'));
}

// 4. Логика кнопки "Печать"
document.getElementById('btn-print').addEventListener('click', async () => {
    const text = document.getElementById('text-input').value;
    
    // Начальные настройки плоттера (пример для GRBL)
    await sendGCode("G90"); // Абсолютные координаты
    await sendGCode("G21"); // Работа в миллиметрах
    
    // Алгоритм генерации линий:
    // Здесь должен быть ваш парсер однолинейного шрифта, 
    // который выдает массив точек для каждой буквы.
    
    // Пример тестового движения (нарисовать квадрат 50х50 мм одной линией):
    await sendGCode("M3 S1000"); // Опустить перо (или включить лазер)
    await sendGCode("G1 X50 Y0 F2000");
    await sendGCode("G1 X50 Y50");
    await sendGCode("G1 X0 Y50");
    await sendGCode("G1 X0 Y0");
    await sendGCode("M5"); // Поднять перо
    
    alert('Печать завершена или отправлена в буфер!');
});
