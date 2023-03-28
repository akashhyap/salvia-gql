import Navigation from "./Nav";
import { useIsAuthenticated } from "./hook/useIsAuthenticated";

const Header = ({ siteLogoUrl }) => {
  const isAuthenticated = useIsAuthenticated();
  return (
    <div className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 dark:bg-gray-800">
      <Navigation siteLogoUrl={siteLogoUrl}  isAuthenticated={isAuthenticated}/>
    </div>
  );
};

export default Header;
