import { getSettings } from 'server/settings';
import HeaderContent from './HeaderContent';

export const Header = async () => {
  const settings = await getSettings();

  return <HeaderContent settings={settings} />;
};

export default Header;
