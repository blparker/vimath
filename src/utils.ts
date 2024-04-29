function deepCopy(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
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


export default { deepCopy, extractType };
