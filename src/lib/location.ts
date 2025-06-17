import { createResource } from 'solid-js';

export function useUserCurrentLocation(options = {}) {
    const [location] = createResource(true, async () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => resolve(position.coords),
                    (error) => reject(error),
                    options
                );
            }
        });
    });

    return location;
}