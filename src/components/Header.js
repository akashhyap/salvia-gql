import Navigation from "./Nav";

const Header = ({ siteLogoUrl }) => {
  return (
    <div className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 dark:bg-gray-800">
      <Navigation siteLogoUrl={siteLogoUrl} />
    </div>
  );
};

export default Header;
