import React from 'react'

const CalendarView = React.lazy(() => import('./Calendar/CalendarView'))
const AuthList = React.lazy(() => import('./AuthList'))
const UserManageList = React.lazy(() => import('./UserManageList'))
const VehicleManageList = React.lazy(() => import('./VehicleManageList'))
const BookManageList = React.lazy(() => import('./BookManageList'))
const TransacManageList = React.lazy(() => import('./TransacManageList'))
const ProductManageList = React.lazy(() => import('./ProductManageList'))
const StaticContentManageList = React.lazy(() => import('./StaticContentManageList'))
const DamageManage = React.lazy(() => import('./DamageManage'))
const OrderStatusTrack = React.lazy(() => import('./OrderStatusTrack'))
const DriverManageList = React.lazy(() => import('./DriverManageList'))
const TaskManageList = React.lazy(() => import('./TaskManageList'))
const Sign = React.lazy(() => import('./Sign'))
const Feedback = React.lazy(() => import('./Feedback'))

const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Calendar', element: CalendarView },
  { path: '/AuthList', name: 'AuthList', element: AuthList },
  { path: '/UserManageList', name: 'User Management', element: UserManageList },
  { path: '/VehicleManageList', name: 'Vehicle Management', element: VehicleManageList },
  { path: '/BookManageList', name: 'Booking Management', element: BookManageList },
  { path: '/TransacManageList', name: 'Transaction Management', element: TransacManageList },
  { path: '/ProductManageList', name: 'Product Management', element: ProductManageList },
  { path: '/StaticContentManageList', name: 'Static Content Management', element: StaticContentManageList },
  { path: '/DamageManage', name: 'Damage Management', element: DamageManage },
  { path: '/OrderStatusTrack', name: 'Order Status Track', element: OrderStatusTrack },
  { path: '/DriverManageList', name: 'Driver Management', element: DriverManageList },
  { path: '/TaskManageList', name: 'Task Management', element: TaskManageList },
  { path: '/Sign', name: 'Sign Management', element: Sign },
  { path: '/Feedback', name: 'Feedback Management', element: Feedback }
 ]

export default routes
