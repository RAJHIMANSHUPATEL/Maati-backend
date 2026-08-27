const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (err) {
        const message = Array.isArray(err?.errors)
            ? err.errors.map((issue) => issue.message).filter(Boolean).join(". ")
            : err?.message || "Invalid request";
        return res.status(400).json({ success: false, message });
    }
};

module.exports = { validate };
