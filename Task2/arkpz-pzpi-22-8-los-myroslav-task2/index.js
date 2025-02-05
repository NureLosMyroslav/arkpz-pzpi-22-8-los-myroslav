require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('./db');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const sensorRoutes = require('./routes/sensors'); // Добавлено
const zoneRoutes = require('./routes/zones'); // Добавлено
const setupSwagger = require('./swagger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', sensorRoutes); // Добавлено
app.use('/api', zoneRoutes); // Добавлено

setupSwagger(app);

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📄 Swagger UI доступен на http://localhost:${PORT}/api-docs`);
});
