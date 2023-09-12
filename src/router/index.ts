import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { usePermissStore } from "../store/permiss";
import Home from "../views/home.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          title: "系统首页",
          permiss: "1",
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/dashboard.vue"),
      },
      {
        path: "/table",
        name: "basetable",
        meta: {
          title: "历史记录",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/table.vue"),
      },
      {
        path: "/charts",
        name: "basecharts",
        meta: {
          title: "图表",
          permiss: "11",
        },
        component: () =>
          import(/* webpackChunkName: "charts" */ "../views/charts.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    meta: {
      title: "注册",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/register.vue"),
  },
  {
    path: "/403",
    name: "403",
    meta: {
      title: "没有权限",
    },
    component: () => import(/* webpackChunkName: "403" */ "../views/403.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | `;
  const role = localStorage.getItem("ms_username");
  const permiss = usePermissStore();
  if (!role && to.path !== "/login" && to.path !== "/register") {
    next("/login");
  } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
    // 如果没有权限，则进入403
    next("/403");
  } else {
    next();
  }
});

export default router;
