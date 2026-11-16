import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicPortfolio from './pages/PublicPortfolio';

// Public sub-pages and the entire admin panel are split into separate chunks,
// so visitors to the home page never download admin code.
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const AdminRoutes = lazy(() => import('./AdminRoutes'));

const RouteFallback = () => <div className="route-fallback" role="status" aria-label="Loading" />;

function App() {
    return (
        <Suspense fallback={<RouteFallback />}>
            <Routes>
                <Route path="/" element={<PublicPortfolio />} />
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="*" element={<PublicPortfolio />} />
            </Routes>
        </Suspense>
    );
}

export default App;
