import { HeaderOnly, AdminOnly } from '@/components/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Shop from '@/pages/Shop';
import Blog from '@/pages/Blog';
import Contact from '@/pages/Contact';
import Wishlist from '@/pages/Wishlist';
import Checkout from '@/pages/Checkout';
import Upload from '@/pages/Upload';
import Search from '@/pages/Search';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import SaleOrder from '@/pages/SaleOrder';
import BannerImage from '@/pages/BannerImage';
import Customers from '@/pages/Customers';
import Statistics from '@/pages/Statistics';
import Settings from '@/pages/Settings';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/shop', component: Shop },
    { path: '/About', component: About },
    { path: '/Blog', component: Blog },
    { path: '/Contact', component: Contact },
    { path: '/Wishlist', component: Wishlist },
    { path: '/Checkout', component: Checkout },
    { path: '/upload', component: Upload, layout: HeaderOnly },
    { path: '/search', component: Search, layout: null },
    {
        path: '/Dashboard',
        component: Dashboard,
        title: 'Dashboard',
        layout: AdminOnly,
    },
    {
        path: '/Products',
        component: Products,
        title: 'Products',
        layout: AdminOnly,
    },
    {
        path: '/SaleOrder',
        component: SaleOrder,
        title: 'SaleOrder',
        layout: AdminOnly,
    },
    {
        path: '/BannerImage',
        component: BannerImage,
        title: 'BannerImage',
        layout: AdminOnly,
    },
    {
        path: '/Customers',
        component: Customers,
        title: 'Customers',
        layout: AdminOnly,
    },
    {
        path: '/Statistics',
        component: Statistics,
        title: 'Statistics',
        layout: AdminOnly,
    },
    {
        path: '/Settings',
        component: Settings,
        title: 'Settings',
        layout: AdminOnly,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
