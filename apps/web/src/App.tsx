import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider } from './AppState';
import Shell from './components/Shell';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Search from './screens/Search';
import Detail from './screens/Detail';
import Edit from './screens/Edit';
import AddMosque from './screens/AddMosque';
import ModeratorQueue from './screens/ModeratorQueue';
import You from './screens/You';

export default function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<Shell />}>
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/add" element={<AddMosque />} />
            <Route path="/moderate" element={<ModeratorQueue />} />
            <Route path="/you" element={<You />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppStateProvider>
  );
}
