
import Logo from "./Logo";

const LandingNavbar = () => (
  <nav className="fixed top-0 left-0 w-full z-30 bg-white/10 backdrop-blur-md border-b border-white/10">
    <div className="container mx-auto flex items-center h-16 px-4">
      <div className="flex items-center gap-2">
        <Logo className="h-12 w-auto" />
      </div>
    </div>
  </nav>
);

export default LandingNavbar;
