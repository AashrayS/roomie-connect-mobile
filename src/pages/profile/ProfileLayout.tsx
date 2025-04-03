import { Outlet, Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { User, Bookmark, Settings } from 'lucide-react';

export function ProfileLayout() {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'personal';

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <Tabs value={currentPath} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <Link to="/profile/personal">
            <TabsTrigger value="personal" className="w-full">
              <User className="h-4 w-4 mr-2" />
              Personal
            </TabsTrigger>
          </Link>
          <Link to="/profile/saved">
            <TabsTrigger value="saved" className="w-full">
              <Bookmark className="h-4 w-4 mr-2" />
              Saved
            </TabsTrigger>
          </Link>
          <Link to="/profile/account">
            <TabsTrigger value="account" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
          </Link>
        </TabsList>

        <div className="mt-6">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
} 