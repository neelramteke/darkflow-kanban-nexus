
import React from "react";

const Logo = ({ className = "", style = {} }: { className?: string, style?: React.CSSProperties }) => (
  <img 
    src="/lovable-uploads/dd078a3d-b137-4eb8-a1a5-3c6458937521.png" 
    alt="Agile Anchor Logo" 
    className={`h-10 w-auto ${className}`}
    style={style}
    draggable={false}
  />
);

export default Logo;
