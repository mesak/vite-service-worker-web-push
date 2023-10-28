import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


import registerSW from './utils/register-sw';

const publishKey = 'BLDPwS_oGwUyAKnHdbyzcYVzZ3Zet65AT4rfqyARhr9me7_TjxaMaU_zy8SVTTYQjkfsu2CeTZqWKVcp9GZ8AzQ';

registerSW(publishKey);

createApp(App).mount('#app')
