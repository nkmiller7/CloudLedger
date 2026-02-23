const config = {
    express: {
        port: 3000,
        session_secret: "36846238746782364823",
    },
    mongo: {
        uri: "mongodb://localhost:27017/",
        database_name: "CloudLedger",
    },
    bcrypt: {
        salt_rounds: 10,
    }
};

export default config;
