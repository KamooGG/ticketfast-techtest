import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: () => import("@/layouts/DashboardLayout.vue"),
        children: [
            {
                path: "",
                name: "Dashboard",
                component: () => import("@/pages/Dashboard.vue"),
            },
            {
                path: "tickets",
                name: "Tickets",
                component: () => import("@/pages/Tickets.vue"),
            },
            {
                path: "tickets/:id",
                name: "TicketDetail",
                component: () => import("@/pages/TicketDetail.vue"),
                props: true,
            },
        ],
    },
    {
        path: "/auth",
        component: () => import("@/layouts/AuthLayout.vue"),
        children: [
            {
                path: "login",
                name: "Login",
                component: () => import("@/pages/Login.vue"),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
