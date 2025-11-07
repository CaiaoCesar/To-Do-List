import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faGithub } from '@fortawesome/free-brands-svg-icons';

import {
  faThumbtack,
  faFlag,
  faCalendar,
  faAlignLeft,
  faClock,
  faCheckCircle,
  faLaptop,
  faRocket,
  faArrowsUpDownLeftRight,
  faHourglass,
  faHourglassHalf,
  faPenToSquare,
  faPlus,
  faLayerGroup,
  faGear,
  faStar,
  faHeart,
  faLightbulb,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faThumbtack,
  faFlag,
  faCalendar,
  faAlignLeft,
  faClock,
  faCheckCircle,
  faGithub,
  faLaptop,
  faRocket,
  faArrowsUpDownLeftRight,
  faHourglass,
  faHourglassHalf,
  faPenToSquare,
  faPlus,
  faLayerGroup,
  faGear,
  faStar,
  faHeart,
  faLightbulb,
  faTrash
);

const app = createApp(App);

app.component('FontAwesomeIcon', FontAwesomeIcon);

app.use(createPinia());

app.mount('#app');
