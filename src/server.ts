import app from './app';

const expressConfig = app.configObject.app;

app.server.listen(expressConfig.port, expressConfig.host, () => {
    console.log(
        `Server running at http://${expressConfig.host}:${expressConfig.port}`
    );
});
