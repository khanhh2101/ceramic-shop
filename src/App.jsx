import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '@/routes';
import { DefaultLayout } from '@/components/Layout';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route) => {
                        const Layout =
                            route.layout === null
                                ? Fragment
                                : route.layout || DefaultLayout;
                        const Page = route.component;
                        const title = route?.title || '';
                        return (
                            <Route
                                path={route.path}
                                element={
                                    <Layout title={title}>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
