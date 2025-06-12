// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { registerSW } from 'virtual:pwa-register';

mount(() => <StartClient />, document.getElementById("app")!);

// Register service worker
if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      console.log('New content available, please refresh.');
      // You could show a toast notification here
    },
    onOfflineReady() {
      console.log('App ready to work offline');
      // You could show a toast notification here
    },
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    }
  });
}
