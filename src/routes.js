import React from 'react'

const CalendarView = React.lazy(() => import('./Calendar/CalendarView'))
// const UserManage = React.lazy(() => import('./views/UserManage/UserManage'))
// const VehicleManage = React.lazy(() => import('./views/VehicleManage/VehicleManage'))
// const ProductManage = React.lazy(() => import('./views/ProductManage/ProductManage'))
// const TransacManage = React.lazy(() => import('./views/TransacManage/TransacManage'))
// const BookManage = React.lazy(() => import('./views/BookManage/BookManage'))
// const StaticContentManage = React.lazy(() => import('./views/StaticContentManage/StaticContentManage'))
const AuthList = React.lazy(() => import('./AuthList'))
const UserManageList = React.lazy(() => import('./UserManageList'))
const VehicleManageList = React.lazy(() => import('./VehicleManageList'))
const BookManageList = React.lazy(() => import('./BookManageList'))
const TransacManageList = React.lazy(() => import('./TransacManageList'))
const ProductManageList = React.lazy(() => import('./ProductManageList'))
const StaticContentManageList = React.lazy(() => import('./StaticContentManageList'))
const BookOrder = React.lazy(() => import('./Order/BookOrder'))
const ProductOrder = React.lazy(() => import('./Order/ProductOrder'))
const DamageManage = React.lazy(() => import('./DamageManage'))
const OrderStatusTrack = React.lazy(() => import('./OrderStatusTrack'))
const DriverManageList = React.lazy(() => import('./DriverManageList'))
const TaskManageList = React.lazy(() => import('./TaskManageList'))
const Billing = React.lazy(() => import('./Billing'))
const Sign = React.lazy(() => import('./Sign'))
const Feedback = React.lazy(() => import('./Feedback'))


// const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// // Base
// const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
// const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
// const Cards = React.lazy(() => import('./views/base/cards/Cards'))
// const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
// const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
// const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
// const Navs = React.lazy(() => import('./views/base/navs/Navs'))
// const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
// const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
// const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
// const Progress = React.lazy(() => import('./views/base/progress/Progress'))
// const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
// const Tables = React.lazy(() => import('./views/base/tables/Tables'))
// const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// // Buttons
// const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
// const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
// const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

// //Forms
// const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
// const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
// const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
// const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
// const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
// const Range = React.lazy(() => import('./views/forms/range/Range'))
// const Select = React.lazy(() => import('./views/forms/select/Select'))
// const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

// const Charts = React.lazy(() => import('./views/charts/Charts'))

// // Icons
// const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
// const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
// const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// // Notifications
// const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
// const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
// const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
// const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

// const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Calendar', element: CalendarView },
  // { path: '/UserManage', name: 'UserManage', element: UserManage },
  // { path: '/VehicleManage', name: 'VehicleManage', element: VehicleManage },
  // { path: '/ProductManage', name: 'ProductManage', element: ProductManage },
  // { path: '/TransacManage', name: 'TransacManage', element: TransacManage },
  // { path: '/BookManage', name: 'BookManage', element: BookManage },
  // { path: '/StaticContentManage', name: 'StaticContentManage', element: StaticContentManage },
  { path: '/AuthList', name: 'AuthList', element: AuthList },
  { path: '/UserManageList', name: 'User Management', element: UserManageList },
  { path: '/VehicleManageList', name: 'Vehicle Management', element: VehicleManageList },
  { path: '/BookManageList', name: 'Booking Management', element: BookManageList },
  { path: '/TransacManageList', name: 'Transaction Management', element: TransacManageList },
  { path: '/ProductManageList', name: 'Product Management', element: ProductManageList },
  { path: '/StaticContentManageList', name: 'Static Content Management', element: StaticContentManageList },
  { path: '/Order/BookOrder', name: 'Book Orders', element: BookOrder },
  { path: '/Order/ProductOrder', name: 'Product Orders', element: ProductOrder },
  { path: '/DamageManage', name: 'Damage Management', element: DamageManage },
  { path: '/OrderStatusTrack', name: 'Order Status Track', element: OrderStatusTrack },
  { path: '/DriverManageList', name: 'Driver Management', element: DriverManageList },
  { path: '/TaskManageList', name: 'Task Management', element: TaskManageList },
  { path: '/Billing', name: 'Billing Management', element: Billing },
  { path: '/Sign', name: 'Sign Management', element: Sign },
  { path: '/Feedback', name: 'Feedback Management', element: Feedback }
  // { path: '/theme', name: 'Theme', element: Colors, exact: true },
  // { path: '/theme/colors', name: 'Colors', element: Colors },
  // { path: '/theme/typography', name: 'Typography', element: Typography },
  // { path: '/base', name: 'Base', element: Cards, exact: true },
  // { path: '/base/accordion', name: 'Accordion', element: Accordion },
  // { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  // { path: '/base/cards', name: 'Cards', element: Cards },
  // { path: '/base/carousels', name: 'Carousel', element: Carousels },
  // { path: '/base/collapses', name: 'Collapse', element: Collapses },
  // { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  // { path: '/base/navs', name: 'Navs', element: Navs },
  // { path: '/base/paginations', name: 'Paginations', element: Paginations },
  // { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  // { path: '/base/popovers', name: 'Popovers', element: Popovers },
  // { path: '/base/progress', name: 'Progress', element: Progress },
  // { path: '/base/spinners', name: 'Spinners', element: Spinners },
  // { path: '/base/tables', name: 'Tables', element: Tables },
  // { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  // { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  // { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  // { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  // { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  // { path: '/charts', name: 'Charts', element: Charts },
  // { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  // { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  // { path: '/forms/select', name: 'Select', element: Select },
  // { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  // { path: '/forms/range', name: 'Range', element: Range },
  // { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  // { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  // { path: '/forms/layout', name: 'Layout', element: Layout },
  // { path: '/forms/validation', name: 'Validation', element: Validation },
  // { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  // { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  // { path: '/icons/flags', name: 'Flags', element: Flags },
  // { path: '/icons/brands', name: 'Brands', element: Brands },
  // { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  // { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  // { path: '/notifications/badges', name: 'Badges', element: Badges },
  // { path: '/notifications/modals', name: 'Modals', element: Modals },
  // { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  // { path: '/widgets', name: 'Widgets', element: Widgets },

 
]



export default routes
