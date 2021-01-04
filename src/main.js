import Vue from 'vue'
import Vuelidate from "vuelidate"
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import dateFilter from '@/filters/date.filter'
import currencyFilter from "@/filters/currency.filter"
import messagePlugin from '@/utils/message.plugin'
import Loader from '@/components/app/Loader'
import 'materialize-css/dist/js/materialize.min'

import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'

Vue.config.productionTip = false;

Vue.use(Vuelidate)
Vue.use(messagePlugin)
Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.component('Loader', Loader)

const firebaseConfig = {
    apiKey: "AIzaSyAVu6MKyoVr14s3aWEiQhPF8AhaWLr2WbU",
    authDomain: "vue-crm-b0add.firebaseapp.com",
    projectId: "vue-crm-b0add",
    storageBucket: "vue-crm-b0add.appspot.com",
    messagingSenderId: "438579761829",
    appId: "1:438579761829:web:f741d53c7875818da6f34c",
    measurementId: "G-TN5W5SJ32G"
};

firebase.initializeApp(firebaseConfig)

let app

firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app');
    }
})


