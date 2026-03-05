import { ObjectId } from "mongodb";

const validate = {
    misc: {
        object_id: (id) => {
            if (!ObjectId.isValid(id))
                throw {
                    http_code: 400,
                    reason: "invalid object_id",
                    trace: new Error().stack,
                };
        },
    },

    routes: {
        users: {
            register: (body) => {
                if (typeof body !== "object" || body === null)
                    throw {
                        http_code: 400,
                        reason: "request body must be a JSON object",
                        trace: new Error().stack,
                    };
                if (
                    body.username === undefined ||
                    body.password === undefined ||
                    body.first_name === undefined ||
                    body.last_name === undefined
                )
                    throw {
                        http_code: 400,
                        reason: "missing required fields",
                        trace: new Error().stack,
                    };
                if (Object.keys(body).length !== 4)
                    throw {
                        http_code: 400,
                        reason: "unexpected fields in request body",
                        trace: new Error().stack,
                    };
                validate.users.username(body.username);
                validate.users.password(body.password);
                validate.users.first_name(body.first_name);
                validate.users.last_name(body.last_name);
            },

            login: (body) => {
                if (typeof body !== "object" || body === null)
                    throw {
                        http_code: 400,
                        reason: "request body must be a JSON object",
                        trace: new Error().stack,
                    };
                if (body.username === undefined || body.password === undefined)
                    throw {
                        http_code: 400,
                        reason: "missing required fields",
                        trace: new Error().stack,
                    };
                if (Object.keys(body).length !== 2)
                    throw {
                        http_code: 400,
                        reason: "unexpected fields in request body",
                        trace: new Error().stack,
                    };
                validate.users.username(body.username);
                validate.users.password(body.password);
            },
        },

        categories: {
            create_category: (body) => {
                if (typeof body !== "object" || body === null)
                    throw {
                        http_code: 400,
                        reason: "request body must be a JSON object",
                        trace: new Error().stack,
                    };
                if (body.name === undefined)
                    throw {
                        http_code: 400,
                        reason: "missing required fields",
                        trace: new Error().stack,
                    };
                if (Object.keys(body).length !== 1)
                    throw {
                        http_code: 400,
                        reason: "unexpected fields in request body",
                        trace: new Error().stack,
                    };
                validate.categories.name(body.name);
            },
            create_expense: (body) => {
                if (typeof body !== "object" || body === null)
                    throw {
                        http_code: 400,
                        reason: "request body must be a JSON object",
                        trace: new Error().stack,
                    };
                if (
                    body.category_id === undefined ||
                    body.amount === undefined ||
                    body.description === undefined ||
                    body.transaction_date === undefined ||
                    body.payment_method === undefined ||
                    body.frequency === undefined
                )
                    throw {
                        http_code: 400,
                        reason: "missing required fields",
                        trace: new Error().stack,
                    };
                if (Object.keys(body).length !== 6)
                    throw {
                        http_code: 400,
                        reason: "unexpected fields in request body",
                        trace: new Error().stack,
                    };
                validate.misc.object_id(body.category_id);
                validate.categories.expense.amount(body.amount);
                validate.categories.expense.description(body.description);
                validate.categories.expense.transaction_date(
                    body.transaction_date,
                );
                validate.categories.expense.payment_method(body.payment_method);
                validate.categories.expense.frequency(body.frequency);
            },
        },

        saving_goals: {
            create_saving_goal: (body) => {
                if (typeof body !== "object" || body === null)
                    throw {
                        http_code: 400,
                        reason: "request body must be a JSON object",
                        trace: new Error().stack,
                    };
                if (
                    body.name === undefined ||
                    body.goal_amount === undefined ||
                    body.current_amount === undefined ||
                    body.deadline === undefined
                )
                    throw {
                        http_code: 400,
                        reason: "missing required fields",
                        trace: new Error().stack,
                    };
                if (Object.keys(body).length !== 4)
                    throw {
                        http_code: 400,
                        reason: "unexpected fields in request body",
                        trace: new Error().stack,
                    };
                validate.saving_goals.name(body.name);
                validate.saving_goals.goal_amount(body.goal_amount);
                validate.saving_goals.current_amount(body.current_amount);
                validate.saving_goals.deadline(body.deadline);
            },
        },
    },

    users: {
        username: (username) => {
            if (typeof username !== "string")
                throw {
                    http_code: 400,
                    reason: "username must be a string",
                    trace: new Error().stack,
                };
            if (!(username.length >= 6 && username.length <= 20))
                throw {
                    http_code: 400,
                    reason: "username must be between 6 and 20 characters",
                    trace: new Error().stack,
                };
            if (/[^a-zA-Z0-9_]/.test(username))
                throw {
                    http_code: 400,
                    reason: "username must only contain alphanumeric characters and underscores",
                    trace: new Error().stack,
                };
        },
        password: (password) => {
            if (typeof password !== "string")
                throw {
                    http_code: 400,
                    reason: "password must be a string",
                    trace: new Error().stack,
                };
            if (!(password.length >= 8 && password.length <= 30))
                throw {
                    http_code: 400,
                    reason: "password must be between 8 and 30 characters",
                    trace: new Error().stack,
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
                    trace: new Error().stack,
                };
        },
        first_name: (first_name) => {
            if (typeof first_name !== "string")
                throw {
                    http_code: 400,
                    reason: "first_name must be a string",
                    trace: new Error().stack,
                };
            if (!(first_name.length >= 2 && first_name.length <= 30))
                throw {
                    http_code: 400,
                    reason: "first_name must be between 2 and 30 characters",
                    trace: new Error().stack,
                };
            if (/[^a-zA-Z]/.test(first_name))
                throw {
                    http_code: 400,
                    reason: "first_name must only contain alphabetic characters",
                    trace: new Error().stack,
                };
        },
        last_name: (last_name) => {
            if (typeof last_name !== "string")
                throw {
                    http_code: 400,
                    reason: "last_name must be a string",
                    trace: new Error().stack,
                };
            if (!(last_name.length >= 2 && last_name.length <= 30))
                throw {
                    http_code: 400,
                    reason: "last_name must be between 2 and 30 characters",
                    trace: new Error().stack,
                };
            if (/[^a-zA-Z]/.test(last_name))
                throw {
                    http_code: 400,
                    reason: "last_name must only contain alphabetic characters",
                    trace: new Error().stack,
                };
        },
    },

    categories: {
        name: (name) => {
            if (typeof name !== "string")
                throw {
                    http_code: 400,
                    reason: "name must be a string",
                    trace: new Error().stack,
                };
            if (!(name.length >= 5 && name.length <= 50))
                throw {
                    http_code: 400,
                    reason: "name must be between 5 and 50 characters",
                    trace: new Error().stack,
                };
            if (/[^a-zA-Z0-9 ]/.test(name))
                throw {
                    http_code: 400,
                    reason: "name must only contain alphanumeric characters and spaces",
                    trace: new Error().stack,
                };
        },
        expense: {
            amount: (amount) => {
                if (typeof amount !== "number")
                    throw {
                        http_code: 400,
                        reason: "amount must be a number",
                        trace: new Error().stack,
                    };
                if (amount <= 0)
                    throw {
                        http_code: 400,
                        reason: "amount must be greater than 0",
                        trace: new Error().stack,
                    };
                const amount_str = amount.toFixed(2);
                if (!/^[0-9]+\.[0-9]{2}$/.test(amount_str))
                    throw {
                        http_code: 400,
                        reason: "amount must be a decimal number with exactly two decimal places",
                        trace: new Error().stack,
                    };
            },
            description: (description) => {
                if (typeof description !== "string")
                    throw {
                        http_code: 400,
                        reason: "description must be a string",
                        trace: new Error().stack,
                    };
                if (!(description.length >= 5 && description.length <= 200))
                    throw {
                        http_code: 400,
                        reason: "description must be between 5 and 200 characters",
                        trace: new Error().stack,
                    };
            },
            transaction_date: (transaction_date) => {
                if (typeof transaction_date !== "string")
                    throw {
                        http_code: 400,
                        reason: "transaction_date must be a string",
                        trace: new Error().stack,
                    };
                const date = new Date(transaction_date);
                if (
                    isNaN(date.getTime()) ||
                    date.toISOString() !== transaction_date
                )
                    throw {
                        http_code: 400,
                        reason: "transaction_date must be a valid date string in ISO 8601 format",
                        trace: new Error().stack,
                    };
            },
            payment_method: (payment_method) => {
                if (typeof payment_method !== "string")
                    throw {
                        http_code: 400,
                        reason: "payment_method must be a string",
                        trace: new Error().stack,
                    };
                if (
                    !["cash", "credit_card", "debit_card"].includes(
                        payment_method,
                    )
                )
                    throw {
                        http_code: 400,
                        reason: "payment_method must be one of 'cash', 'credit_card', or 'debit_card'",
                        trace: new Error().stack,
                    };
            },
            frequency: (frequency) => {
                if (typeof frequency !== "string")
                    throw {
                        http_code: 400,
                        reason: "frequency must be a string",
                        trace: new Error().stack,
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
                        trace: new Error().stack,
                    };
            },
        },
    },

    saving_goals: {
        name: (name) => {
            if (typeof name !== "string")
                throw {
                    http_code: 400,
                    reason: "name must be a string",
                    trace: new Error().stack,
                };
            if (!(name.length >= 5 && name.length <= 50))
                throw {
                    http_code: 400,
                    reason: "name must be between 5 and 50 characters",
                    trace: new Error().stack,
                };
            if (/[^a-zA-Z0-9 ]/.test(name))
                throw {
                    http_code: 400,
                    reason: "name must only contain alphanumeric characters and spaces",
                    trace: new Error().stack,
                };
        },
        goal_amount: (goal_amount) => {
            if (typeof goal_amount !== "number")
                throw {
                    http_code: 400,
                    reason: "goal_amount must be a number",
                    trace: new Error().stack,
                };
            if (goal_amount <= 0)
                throw {
                    http_code: 400,
                    reason: "goal_amount must be greater than 0",
                    trace: new Error().stack,
                };
            const goal_amount_str = goal_amount.toFixed(2);
            if (!/^[0-9]+\.[0-9]{2}$/.test(goal_amount_str))
                throw {
                    http_code: 400,
                    reason: "goal_amount must be a decimal number with exactly two decimal places",
                    trace: new Error().stack,
                };
        },
        current_amount: (current_amount) => {
            if (typeof current_amount !== "number")
                throw {
                    http_code: 400,
                    reason: "current_amount must be a number",
                    trace: new Error().stack,
                };
            if (current_amount <= 0)
                throw {
                    http_code: 400,
                    reason: "current_amount must be greater than 0",
                    trace: new Error().stack,
                };
            const current_amount_str = current_amount.toFixed(2);
            if (!/^[0-9]+\.[0-9]{2}$/.test(current_amount_str))
                throw {
                    http_code: 400,
                    reason: "current_amount must be a decimal number with exactly two decimal places",
                    trace: new Error().stack,
                };
        },
        deadline: (deadline) => {
            if (typeof deadline !== "string")
                throw {
                    http_code: 400,
                    reason: "deadline must be a string",
                    trace: new Error().stack,
                };
            const date = new Date(deadline);
            if (isNaN(date.getTime()) || date.toISOString() !== deadline)
                throw {
                    http_code: 400,
                    reason: "deadline must be a valid date string in ISO 8601 format",
                    trace: new Error().stack,
                };
        },
    },
};

export default validate;
