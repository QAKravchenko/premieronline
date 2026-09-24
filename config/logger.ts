export class Logger {
    private static maskAuth(headers?: Record<string, string>): Record<string, string> | undefined {
        if (!headers) return headers;
        const masked = { ...headers };
        if (masked['Authorization']) {
            masked['Authorization'] = masked['Authorization'].substring(0, 10) + '...***';
        }
        return masked;
    }

    static info(message: string) {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
    }

    static warn(message: string) {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    }

    static error(message: string, error?: any) {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    }

    static step(stepName: string) {
        console.log(`\n▶ [STEP] ${stepName}`);
    }

    static testStart(testTitle: string) {
        console.log(`\n============================================================`);
        console.log(`🚀 [TEST START] ${testTitle}`);
        console.log(`============================================================`);
    }

    static testFinish(testTitle: string, status: string = 'PASSED') {
        console.log(`------------------------------------------------------------`);
        console.log(`🏁 [TEST FINISH] ${testTitle} - STATUS: ${status.toUpperCase()}`);
        console.log(`============================================================\n`);
    }

    static apiRequest(
        method: string,
        url: string,
        options?: { headers?: Record<string, string>; data?: any; params?: any }
    ) {
        const time = new Date().toISOString();
        console.log(`\n🌐 [API REQUEST] ${time} -> ${method.toUpperCase()} ${url}`);
        if (options?.params) {
            console.log(`   Query Params: ${JSON.stringify(options.params)}`);
        }
        if (options?.headers) {
            console.log(`   Headers: ${JSON.stringify(this.maskAuth(options.headers))}`);
        }
        if (options?.data !== undefined) {
            console.log(`   Payload:\n${JSON.stringify(options.data, null, 2)}`);
        }
    }

    static apiResponse(
        method: string,
        url: string,
        status: number,
        statusText: string,
        durationMs?: number,
        body?: any
    ) {
        const time = new Date().toISOString();
        const durationStr = durationMs !== undefined ? ` [${durationMs}ms]` : '';
        console.log(`📥 [API RESPONSE] ${time} <- ${method.toUpperCase()} ${url} | Status: ${status} ${statusText}${durationStr}`);
        if (body !== undefined) {
            const bodyStr = typeof body === 'object' ? JSON.stringify(body, null, 2) : String(body);
            if (bodyStr.length > 2000) {
                console.log(`   Body (preview):\n${bodyStr.substring(0, 2000)}\n   ... [truncated, total ${bodyStr.length} chars]`);
            } else {
                console.log(`   Body:\n${bodyStr}`);
            }
        }
    }

    static assertion(description: string, passed: boolean = true, details?: string) {
        const icon = passed ? '✓' : '✗';
        const detailsStr = details ? ` | ${details}` : '';
        console.log(`   [ASSERTION] ${icon} ${description}${detailsStr}`);
    }
}
