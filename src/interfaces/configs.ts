export default interface IConfig {
    app: {
        env: 'local' | 'homolog' | 'production';
        host: string;
        port: number;
        timezone: string;
        mongo_uri: string;
    };
}
