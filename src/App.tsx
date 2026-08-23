/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import { CreateProject } from './pages/CreateProject';
import { ProjectView } from './pages/ProjectView';
import { ProjectsList } from './pages/ProjectsList';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<Settings />} />
          <Route path="create/:category" element={<CreateProject />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="project/:id" element={<ProjectView />} />
          <Route path="tools/:tool" element={<div className="text-white p-8">Specific Tool Feature Coming Soon... (Access via main generation flow instead)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
