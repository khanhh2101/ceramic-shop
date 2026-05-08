import { HeaderOnly } from '@/components/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Shop from '@/pages/Shop';
import Blog from '@/pages/Blog';
import Contact from '@/pages/Contact';
import Checkout from '@/pages/Checkout';
import Upload from '@/pages/Upload';
import Search from '@/pages/Search';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/shop', component: Shop },
    { path: '/About', component: About },
    { path: '/Blog', component: Blog },
    { path: '/Contact', component: Contact },
    { path: '/Checkout', component: Checkout },
    { path: '/upload', component: Upload, layout: HeaderOnly },
    { path: '/search', component: Search, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
