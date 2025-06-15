
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Settings, ArrowLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from "./Logo"; // Import logo

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return null;
  }

  const isSettingsPage = location.pathname === '/settings';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center h-10"
            >
              <Logo className="h-8 w-auto" />
            </button>
            {!isSettingsPage && !isMobile && (
              <div className="flex space-x-4">
                {/* Navigation items for non-settings pages can be added here if needed */}
              </div>
            )}
          </div>
          
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          ) : (
            isSettingsPage ? (
              <Button 
                onClick={() => navigate('/')}
                variant="ghost" 
                className="text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Homepage
              </Button>
            ) : (
              <Link to="/settings">
                <Button 
                  variant="ghost" 
                  className="text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-4 pb-4 border-t border-gray-800">
            <div className="flex flex-col space-y-3 pt-4">
              {isSettingsPage ? (
                <Button 
                  onClick={() => {
                    navigate('/');
                    setMobileMenuOpen(false);
                  }}
                  variant="ghost" 
                  className="text-white justify-start"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Homepage
                </Button>
              ) : (
                <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant="ghost" 
                    className="text-white justify-start w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

