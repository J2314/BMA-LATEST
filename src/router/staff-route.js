export const staffRoute = (prop) => [{
    path: '/',
    name: prop + '.dashboard',
    meta: {
      auth: true,
      name: 'Dashboard',
      user: 'staff'
    },
    component: () => import('../views/StaffSide/StaffDashboard.vue')
  },
  {
    path: '/staff/dashboard',
    name: prop + '.dashboard',
    meta: {
      auth: true,
      name: 'Dashboard',
      user: 'staff'
    },
    component: () => import('../views/StaffSide/StaffDashboard.vue')
  },
  {
    path: '/staff/Announcements',
    name: prop + '.announcements',
    meta: {
      auth: true,
      name: 'Announcement',
      user: 'staff'
    },
    component: () => import('../views/StaffSide/StaffDashboard.vue')
  },
  {
    path: '/staff/General-Policy',
    name: prop + '.general-policy',
    meta: {
      auth: true,
      name: 'General Policy',
      user: 'staff'
    },
    component: () => import('../views/StaffSide/Policy/GeneralPolicy.vue')
  },
  {
    path: '/staff/Department-Policy',
    name: prop + '.department-policy',
    meta: {
      auth: true,
      name: 'Department Policy',
      user: 'staff'
    },
    component: () => import('../views/StaffSide/Policy/DepartmentPolicy.vue')
  },
  {
    path: '/staff/General-Form',
    name: prop + '.general-form',
    meta: {
      auth: true,
      name: 'General Form',
      user: 'staff'
    },
    component: () => import('../views/StaffSide/Form/GeneralForms.vue')
  },
  {
    path: '/staff/Department-Form',
    name: prop + '.department-form',
    meta: {
      auth: true,
      name: 'Department Form',
      user: 'staff'
    },
    component: () => import('../views/StaffSide/Form/DepartmentForms.vue')
  },
]