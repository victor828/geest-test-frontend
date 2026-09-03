import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/users' },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      meta: { title: 'Usuarios' },
    },
    {
      path: '/users/:id/tasks',
      name: 'user-tasks',
      component: () => import('../views/UserTasksView.vue'),
      meta: { title: 'Tareas del usuario' },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/TasksView.vue'),
      meta: { title: 'Tareas' },
    },
    {
      path: '/tasks/:id',
      name: 'task-detail',
      component: () => import('../views/TaskDetailView.vue'),
      meta: { title: 'Detalle de tarea' },
    },
  ],
})

export default router
