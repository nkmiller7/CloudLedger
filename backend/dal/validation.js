import { ObjectId } from "mongodb";

const validate = {
    misc: {
        object_id(id) {
            if (!ObjectId.isValid(id))
                throw {
                    http_code: 400,
                    reason: "invalid object_id",
                    trace: console.trace(),
                };
        },
    },

    user: {
        username: (username) => {
            if (typeof username !== "string")
                throw {
                    http_code: 400,
                    reason: "username must be a string",
                    trace: console.trace(),
                };
            if (!(username.length >= 6 && username.length <= 20))
                throw {
                    http_code: 400,
                    reason: "username must be between 6 and 20 characters",
                    trace: console.trace(),
                };
            if (/[^a-zA-Z0-9_]/.test(username))
                throw {
                    http_code: 400,
                    reason: "username must only contain alphanumeric characters and underscores",
                    trace: console.trace(),
                };
        },
        password: (password) => {
            if (typeof password !== "string")
                throw {
                    http_code: 400,
                    reason: "password must be a string",
                    trace: console.trace(),
                };
            if (!(password.length >= 8 && password.length <= 30))
                throw {
                    http_code: 400,
                    reason: "password must be between 8 and 30 characters",
                    trace: console.trace(),
                };
            if (
                /[^a-zA-Z0-9!@#$%^&*()-+]/.test(password) ||
                !/[a-z]/.test(password) ||
                !/[A-Z]/.test(password) ||
                !/[0-9]/.test(password) ||
                !/[!@#$%^&*()-+]/.test(password)
            )
                throw {
                    http_code: 400,
                    reason: "password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
                    trace: console.trace(),
                };
        },
        first_name: (first_name) => {
            if (typeof first_name !== "string")
                throw {
                    http_code: 400,
                    reason: "first_name must be a string",
                    trace: console.trace(),
                };
            if (!(first_name.length >= 2 && first_name.length <= 30))
                throw {
                    http_code: 400,
                    reason: "first_name must be between 2 and 30 characters",
                    trace: console.trace(),
                };
            if (/[^a-zA-Z]/.test(first_name))
                throw {
                    http_code: 400,
                    reason: "first_name must only contain alphabetic characters",
                    trace: console.trace(),
                };
        },
        last_name: (last_name) => {
            if (typeof last_name !== "string")
                throw {
                    http_code: 400,
                    reason: "last_name must be a string",
                    trace: console.trace(),
                };
            if (!(last_name.length >= 2 && last_name.length <= 30))
                throw {
                    http_code: 400,
                    reason: "last_name must be between 2 and 30 characters",
                    trace: console.trace(),
                };
            if (/[^a-zA-Z]/.test(last_name))
                throw {
                    http_code: 400,
                    reason: "last_name must only contain alphabetic characters",
                    trace: console.trace(),
                };
        },
    },

    category: {
        name: (name) => {
            if (typeof name !== "string")
                throw {
                    http_code: 400,
                    reason: "name must be a string",
                    trace: console.trace(),
                };
            if (!(name.length >= 5 && name.length <= 50))
                throw {
                    http_code: 400,
                    reason: "name must be between 5 and 50 characters",
                    trace: console.trace(),
                };
            if (/[^a-zA-Z0-9 ]/.test(name))
                throw {
                    http_code: 400,
                    reason: "name must only contain alphanumeric characters and spaces",
                    trace: console.trace(),
                };
        },
        expense: {
            amount: (amount) => {
                if (typeof amount !== "number")
                    throw {
                        http_code: 400,
                        reason: "amount must be a number",
                        trace: console.trace(),
                    };
                if (amount <= 0)
                    throw {
                        http_code: 400,
                        reason: "amount must be greater than 0",
                        trace: console.trace(),
                    };
                if (!/^[0-9]+\.?[0-9]{2}$/.test(amount.toString()))
                    throw {
                        http_code: 400,
                        reason: "amount must be a decimal number with exactly two decimal places",
                        trace: console.trace(),
                    };
            },
            description: (description) => {
                if (typeof description !== "string")
                    throw {
                        http_code: 400,
                        reason: "description must be a string",
                        trace: console.trace(),
                    };
                if (!(description.length >= 5 && description.length <= 200))
                    throw {
                        http_code: 400,
                        reason: "description must be between 5 and 200 characters",
                        trace: console.trace(),
                    };
            },
            transaction_date: (transaction_date) => {
                if (typeof transaction_date !== "string")
                    throw {
                        http_code: 400,
                        reason: "transaction_date must be a string",
                        trace: console.trace(),
                    };
                const date = new Date(transaction_date);
                if (
                    isNaN(date.getTime()) ||
                    date.toISOString() !== transaction_date
                )
                    throw {
                        http_code: 400,
                        reason: "transaction_date must be a valid date string in ISO 8601 format",
                        trace: console.trace(),
                    };
            },
            payment_method: (payment_method) => {
                if (typeof payment_method !== "string")
                    throw {
                        http_code: 400,
                        reason: "payment_method must be a string",
                        trace: console.trace(),
                    };
                if (
                    !["cash", "credit_card", "debit_card"].includes(
                        payment_method,
                    )
                )
                    throw {
                        http_code: 400,
                        reason: "payment_method must be one of 'cash', 'credit_card', or 'debit_card'",
                        trace: console.trace(),
                    };
            },
            frequency: (frequency) => {
                if (typeof frequency !== "string")
                    throw {
                        http_code: 400,
                        reason: "frequency must be a string",
                        trace: console.trace(),
                    };
                if (
                    ![
                        "one_time",
                        "daily",
                        "weekly",
                        "biweekly",
                        "monthly",
                        "yearly",
                    ].includes(frequency)
                )
                    throw {
                        http_code: 400,
                        reason: "frequency must be one of 'one_time', 'daily', 'weekly', 'biweekly', 'monthly', or 'yearly'",
                        trace: console.trace(),
                    };
            },
        },
    },
};

export default validate;
