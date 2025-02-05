const mqtt = require('mqtt');
const sql = require('./db');

const mqttBroker = 'mqtt://broker.hivemq.com';
const topic = 'iot/noiseSensor';

const mqttClient = mqtt.connect(mqttBroker);

mqttClient.on('connect', () => {
    console.log('✅ Подключено к MQTT-брокеру');
    mqttClient.subscribe(topic, (err) => {
        if (!err) {
            console.log(`📡 Подписан на топик: ${topic}`);
        } else {
            console.error('❌ Ошибка подписки:', err.message);
        }
    });
});

mqttClient.on('message', async (topic, message) => {
    try {
        const payload = JSON.parse(message.toString());
        const { sensor_id, measured_value } = payload;

        if (!sensor_id || measured_value === undefined) {
            console.error("❌ Неправильный формат данных:", payload);
            return;
        }

        console.log(`📡 Получены данные от датчика ${sensor_id}: ${measured_value} дБ`);

        // 📌 Оптимизированный SQL-запрос
        const query = `
            INSERT INTO Measurements (sensor_id, measured_value, measurement_time)
            VALUES (@sensor_id, @measured_value, GETDATE())`;

        const request = new sql.Request();
        request.input('sensor_id', sql.Int, sensor_id);
        request.input('measured_value', sql.Decimal(5, 2), measured_value);

        await request.query(query);

        console.log("✅ Данные успешно записаны в базу");

        // 📢 Проверяем уровень шума и выдаем предупреждение
        if (measured_value > 60) {
            console.warn(`⚠️ Внимание! Уровень шума превышен: ${measured_value} дБ`);
        }

    } catch (err) {
        console.error("❌ Ошибка обработки сообщения:", err.message);
    }
});

// Очищаем соединения при завершении работы
process.on('exit', () => {
    sql.close();
    mqttClient.end();
});

module.exports = mqttClient;
