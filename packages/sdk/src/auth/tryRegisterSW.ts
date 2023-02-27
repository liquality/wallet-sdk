export async function tryRegisterSW(path: string) {
    if ("serviceWorker" in navigator) {
        // Register a service worker hosted at the root of the site using the default scope.
       try {
         const registration = await navigator.serviceWorker.register(path);
         console.log(`Service worker registration succeeded at ${path}:`, registration);
       } catch (error) {
        console.error(`Service worker registration failed: ${error}`);
        throw error;
       }
    } else {
        throw new Error("Service workers are not supported.");
    }
}