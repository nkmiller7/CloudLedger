const config = {
    express: {
        port: 3000,
        session_secret: "36846238746782364823",
    },
    mongo: {
        uri: process.env.MONGO_URI || "mongodb://localhost:27017/",
        database_name: "cloudledger",
    },
    bcrypt: {
        salt_rounds: 10,
    }
};

export default config;
