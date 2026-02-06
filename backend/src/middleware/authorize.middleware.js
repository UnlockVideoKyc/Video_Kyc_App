module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // ✅ Check user exists from auth.middleware
            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized: No user data",
                });
            }

            const { roleId } = req.user;

            // ✅ Role check
            if (!allowedRoles.includes(roleId)) {
                return res.status(403).json({
                    message: "Access denied for this role",
                });
            }

            next();
        } catch (err) {
            console.error("Authorize middleware error:", err.message);
            return res.status(500).json({ message: "Authorization error" });
        }
    };
};
