import AuthLayout from '@/layouts/AuthLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import RegisterView from '@/views/RegisterView.vue';
import RolesView from '@/views/RolesView.vue';
import TeamsView from '@/views/TeamsView.vue';
import UsersView from '@/views/UsersView.vue';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import ProfileView from '@/views/ProfileView.vue';
// import LandView from '@/views/LandView.vue';
import store from '@/store/index.ts';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        meta: { requiresAuth: true },
        component: HomeView,
      },
      {
        path: 'profile',
        name: 'profile',
        meta: { requiresAuth: true },
        component: ProfileView,
      },
      {
        path: 'users',
        name: 'users',
        meta: { requiresAuth: true },
        component: UsersView,
      },
      {
        path: 'teams',
        name: 'teams',
        meta: { requiresAuth: true },
        component: TeamsView,
      },
      // {
      //   path: 'land',
      //   name: 'land',
      //   meta: { requiresAuth: true },
      //   component: LandView,
      // },
      {
        path: 'roles',
        name: 'roles',
        meta: { requiresAuth: true },
        component: RolesView,
      },
    ],
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        meta: { guest: true },
        component: LoginView,
      },
      {
        path: 'register',
        name: 'register',
        meta: { guest: true },
        component: RegisterView,
      },
    ],
  },
  {
    name: '404',
    path: '/:notFound(.*)*',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  mode: 'history',
  routes,
});

router.beforeEach(async (to) => {
  const isAuthenticated = await store.dispatch('checkAuth');
  const matched = to.matched;
  const permission = await store.dispatch('checkPermissions', to.name);
  for (let i = 0; i < matched.length; i++) {
    const meta = matched[i].meta;
    switch (true) {
      case meta.requiresAuth && !isAuthenticated:
        return { name: 'login' };
      case !permission:
        return { name: '404' };
      case meta.guest && isAuthenticated:
        return { name: 'home' };
    }
  }
  return;
});

export default router;

