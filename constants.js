exports.HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    UN_AUTHERIZED: 401,
    INTERNAL_SERVER: 500,
    CREATED: 200
};

exports.ROLE = {
    MANAGER: "manager",
    ADMIN: "admin",
    USER: "user"
}

exports.USER_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    DELETE: "delete",
    HOLD: "hold",
    BLOCK: "blocked"
}
