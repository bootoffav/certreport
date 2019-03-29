import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

let config = {
  apiKey: "AIzaSyD8UlVpnynHlJ1lVtpXjOg0o1VsNXL7Yiw",
  authDomain: "xmt-certreport.firebaseapp.com",
  databaseURL: "https://xmt-certreport.firebaseio.com",
  projectId: "xmt-certreport",
  storageBucket: "xmt-certreport.appspot.com",
  messagingSenderId: "549397386482"
};

export default firebase.initializeApp(config);