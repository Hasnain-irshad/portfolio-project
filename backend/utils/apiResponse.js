/**
 * Standard success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object} data - Response data
 */
export const successResponse = (res, statusCode, message, data = null) => {
    const response = {
        success: true,
        message
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Standard error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 */
export const errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};

/**
 * Paginated response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Array} data - Array of items
 * @param {Object} pagination - Pagination info
 */
export const paginatedResponse = (res, statusCode, message, data, pagination) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        pagination: {
            total: pagination.total,
            page: pagination.page,
            limit: pagination.limit,
            pages: Math.ceil(pagination.total / pagination.limit)
        }
    });
};
