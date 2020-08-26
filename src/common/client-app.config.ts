export class ClientAppConfig {
    private static localPath = 'http://localhost:3000';
    private static hostPath = 'https://cabpool-taxi.herokuapp.com';

    public static getLocalPath(): string {
        return ClientAppConfig.localPath;
    }

    public static getHostPath(): string {
        return ClientAppConfig.hostPath;
    }
}

// ../common/sdk/custom/api
