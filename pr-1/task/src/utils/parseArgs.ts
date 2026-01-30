import { ARGS } from '../constants';

export function parseArgs(): Record<string, boolean> {
    const args = process.argv.slice(2);
    const parsed: Record<string, boolean> = {};

    Object.values(ARGS).forEach(arg => {
        const key = arg.replace(/^--/, '');
        parsed[key] = args.includes(arg);
    });

    return parsed;
}
