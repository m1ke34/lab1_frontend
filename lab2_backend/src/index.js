const express = require("express");
const { initDb } = require("./db/initDb");
const { errorHandler } = require("./middlewares/errorHandler");
const reportsRoutes = require("./routes/reports.routes");

const app = express();
app.use(express.json());
app.use((req, res, next) => { console.log(`[${req.method}] ${req.url}`); next(); });

app.use("/api/reports", reportsRoutes);

app.use(errorHandler);

const PORT = 3000;
async function bootstrap() {
    await initDb(); 
    app.listen(PORT, () => console.log(`Сервер працює: http://localhost:${PORT}`));
}
bootstrap().catch(err => {
    console.error("Помилка запуску:", err);
    process.exit(1);
});