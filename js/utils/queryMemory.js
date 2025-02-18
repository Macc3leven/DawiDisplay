/**
 * Utility functions for managing Shadawi memory in the browser.
 */

/**
 * Sets a value in cookies.
 * @param {string} name - The cookie name.
 * @param {string} value - The value to store.
 * @param {number} [days=7] - The number of days until the cookie expires.
 */
function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
}

/**
 * Gets a value from cookies.
 * @param {string} name - The cookie name.
 * @returns {string|null} - The cookie value or null if not found.
 */
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

/**
 * Removes a cookie.
 * @param {string} name - The cookie name.
 */
function removeCookie(name) {
    setCookie(name, '', -1);
}

/**
 * Sets an item in localStorage.
 * @param {string} key - The key name.
 * @param {any} value - The value to store (will be stringified).
 */
function setMemory(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Gets an item from localStorage.
 * @param {string} key - The key name.
 * @returns {any|null} - The parsed value or null if not found.
 */
function getMemory(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

/**
 * Removes an item from localStorage.
 * @param {string} key - The key name.
 */
function removeMemory(key) {
    localStorage.removeItem(key);
}

// Shadawi-specific memory handlers

/**
 * Sets the Shadawi query in cookies and memory.
 * @param {string} query - The query to store.
 */
function setShadawiQuery(query) {
    setCookie('shadawiQuery', query);
    setMemory('shadawiQuery', query);
}

/**
 * Gets the Shadawi query from cookies or memory.
 * @returns {string|null} - The query if found, otherwise null.
 */
function getShadawiQuery() {
    return getCookie('shadawiQuery') || getMemory('shadawiQuery');
}

/**
 * Sets the Shadawi form object in memory only.
 * @param {Object} formObject - The form object to store.
 */
function setShadawiFormObject(formObject) {
    setMemory('shadawiFormObject', formObject);
}

/**
 * Gets the Shadawi form object from memory.
 * @returns {Object|null} - The form object if found, otherwise null.
 */
function getShadawiFormObject() {
    return getMemory('shadawiFormObject');
}

// Export functions (for module systems, if applicable)
export {
    setShadawiQuery,
    getShadawiQuery,
    setShadawiFormObject,
    getShadawiFormObject,
    setCookie,
    getCookie,
    removeCookie,
    setMemory,
    getMemory,
    removeMemory
};
