import Transactions from "../components/Transactions"
import Vue from 'vue'
import VueRouter from "vue-router";
import Blocks from "../components/Blocks"
Vue.use(VueRouter)

export default new VueRouter({
    routes: [{
            path: "/",
            redirect: "transactions"
        },
        {
            path: "/Transactions",
            name: "transactions",
            component: Transactions
        },
        {
            path: "/Blocks",
            name: "blocks",
            component: Blocks
        }
    ],
    mode: "history"
})