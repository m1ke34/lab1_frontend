class ApiError extends Error {
    constructor(status, code, message, details = null) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            error: { code: err.code, message: err.message, details: err.details }
        });
    }
    console.error("Unhandled error:", err);
    return res.status(500).json({
        error: { code: "INTERNAL_SERVER_ERROR", message: "Внутрішня помилка сервера" }
    });
};

module.exports = { ApiError, errorHandler };
