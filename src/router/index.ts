import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProjectDetailView from '../views/ProjectDetailView.vue';
import ExecutionView from '../views/ExecutionView.vue';
import TroubleshooterView from '../views/TroubleshooterView.vue';
import MyProjectsView from '../views/MyProjectsView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/project/:slug',
    name: 'ProjectDetail',
    component: ProjectDetailView,
  },
  {
    path: '/project/:slug/execute',
    name: 'Execution',
    component: ExecutionView,
  },
  {
    path: '/troubleshoot',
    name: 'Troubleshoot',
    component: TroubleshooterView,
  },
  {
    path: '/my-projects',
    name: 'MyProjects',
    component: MyProjectsView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
