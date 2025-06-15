
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

const LandingNavbar = () => (
  <nav className="fixed top-0 left-0 w-full z-30 bg-white/10 backdrop-blur-md border-b border-white/10">
    <div className="container mx-auto flex items-center justify-between h-16 px-4">
      <div className="flex items-center gap-2">
        <Logo className="h-12 w-auto" />
      </div>
      <div>
        <Button
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-pink-400 hover:via-blue-500 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-semibold text-base transition-all duration-200 hover:scale-105 shadow-lg"
          onClick={() => window.location.href = '/auth?mode=signup'}
        >
          Sign Up
        </Button>
      </div>
    </div>
  </nav>
);

export default LandingNavbar;

