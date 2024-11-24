export function hasProperties(obj, propertiesString) {
    if (typeof obj !== 'object' || obj === null) {
        throw new Error('The first argument must be a valid object.');
    }
    
    if (typeof propertiesString !== 'string') {
        throw new Error('The second argument must be a string.');
    }
    
    const properties = propertiesString.split(' ').map(prop => prop.trim());
    
    for (const property of properties) {
        if (!obj.hasOwnProperty(property)) {
            return false;
        }
    }
    
    return true;
}