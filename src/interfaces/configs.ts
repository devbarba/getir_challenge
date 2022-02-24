export default interface IConfig {
    app: {
        env: 'local' | 'homolog' | 'production';
        host: string;
        port: number;
        timezone: string;
        mongo: {
            host: string;
            name: string;
            user: string;
            pass: string;
        };
    };
}
