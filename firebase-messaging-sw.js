importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyCo4UzMbTyrdDChkcKRvmEgObpivDBWgSo',
  authDomain: 'dev-api-server.firebaseapp.com',
  projectId: 'dev-api-server',
  storageBucket: 'dev-api-server.firebasestorage.app',
  messagingSenderId: '488227432379',
  appId: '1:488227432379:web:cfbf89e29f8c6284d2469e',
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Optional:
messaging.onBackgroundMessage((message) => {
  console.log('onBackgroundMessage', message);
});
