export class Logger {
    static info(message: string) {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
    }

    static error(message: string, error?: any) {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    }
}
