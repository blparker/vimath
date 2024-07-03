function deepCopy(obj: any): any {
    if (obj === undefined || obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepCopy(item));
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags);
    }

    if (obj instanceof Set) {
        return new Set([...obj].map(item => deepCopy(item)));
    }

    if (obj instanceof Map) {
        return new Map([...obj].map(([key, value]) => [key, deepCopy(value)]));
    }

    // Add more special types as needed

    const copyObj = new (obj.constructor)();
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            copyObj[key] = deepCopy(obj[key]);
        }
    }

    return copyObj;
}


function extractType<T extends Object>(obj: any): T {
    const result: Partial<T> = {};

    (Object.keys(obj) as Array<keyof T>).forEach(key => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });

    return result as T;
}


function throttle<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let lastCallTime: number | null = null;

    return function(...args: Parameters<T>): void {
        const now = Date.now();

        if (lastCallTime && now < lastCallTime + wait) {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                lastCallTime = Date.now();
                func(...args);
            }, wait - (now - lastCallTime));
        } else {
            lastCallTime = Date.now();
            func(...args);
        }
    };
}


export default { deepCopy, extractType, throttle, };
