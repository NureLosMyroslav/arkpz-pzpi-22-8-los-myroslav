const mqtt = require('mqtt');
const sql = require('./db');

const mqttBroker = 'mqtt://broker.hivemq.com';
const topic = 'iot/noiseSensor';

const mqttClient = mqtt.connect(mqttBroker);

let noiseHistory = []; // Буфер останніх 3 вимірювань

mqttClient.on('connect', () => {
    console.log('✅ Підключено до MQTT-брокера');
    mqttClient.subscribe(topic, (err) => {
        if (!err) {
            console.log(`📡 Підписано на топік: ${topic}`);
        } else {
            console.error('❌ Помилка підписки:', err.message);
        }
    });
});

mqttClient.on('message', async (topic, message) => {
    try {
        const payload = JSON.parse(message.toString());
        const { sensor_id, measured_value } = payload;

        if (!sensor_id || measured_value === undefined || isNaN(measured_value)) {
            console.error("❌ Неправильний формат даних:", payload);
            return;
        }

        console.log(`📡 Отримані дані від датчика ${sensor_id}: ${measured_value} дБ`);

        // 📌 Збереження даних у базу
        const query = `
            INSERT INTO Measurements (sensor_id, measured_value, measurement_time)
            VALUES (@sensor_id, @measured_value, GETDATE())`;

        const request = new sql.Request();
        request.input('sensor_id', sql.Int, sensor_id);
        request.input('measured_value', sql.Decimal(5, 2), measured_value);

        await request.query(query);
        console.log("✅ Дані успішно записані у базу");

        // 🔄 Додаємо нове значення у буфер
        noiseHistory.push(measured_value);
        if (noiseHistory.length > 3) {
            noiseHistory.shift(); // Видаляємо найстаріше значення, якщо більше 3
        }

        // Математична обробка середнього рівня шуму 
        if (noiseHistory.length === 3) {
            const avgNoise = noiseHistory.reduce((sum, val) => sum + val, 0) / 3;
            console.log(`📊 Середній рівень шуму (3 виміри): ${avgNoise.toFixed(2)} дБ`);

            // 📢 Перевірка перевищення рівня шуму на основі середнього значення
            if (avgNoise > 60) {
                console.warn(`⚠️ Увага! Середній рівень шуму перевищено: ${avgNoise.toFixed(2)} дБ`);
            }
        }

    } catch (err) {
        console.error("❌ Помилка обробки повідомлення:", err.message);
    }
});

// Закриття з'єднань при завершенні роботи
process.on('exit', () => {
    sql.close();
    mqttClient.end();
});

module.exports = mqttClient;
