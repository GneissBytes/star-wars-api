const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env;

// export mongodb connection config
export const dbConnection = {
  url: `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
};
