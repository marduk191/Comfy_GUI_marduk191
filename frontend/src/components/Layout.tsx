import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Workflow, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">ComfyUI GUI</h1>
            <div className="flex space-x-2 ml-8">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <LayoutGrid size={20} />
                <span>Main GUI</span>
              </Link>
              <Link
                to="/workflow"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/workflow')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Workflow size={20} />
                <span>Workflow Editor</span>
              </Link>
            </div>
          </div>
          <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </nav>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
