import Vue from "vue";
import App from "./App.vue";
import "@/assets/theme/index.css";
import { Message, MessageBox } from "element-ui";
Vue.config.productionTip = false;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
new Vue({
  render: (h) => h(App),
}).$mount("#app");
