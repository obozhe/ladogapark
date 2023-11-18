import FriendsBlackIcon from 'icons/friends-black-icon.svg';
import FriendsIcon from 'icons/friends-white-icon.svg';
import OtherBlackIcon from 'icons/other-black-icon.svg';
import OtherIcon from 'icons/other-white-icon.svg';
import SearchBlackIcon from 'icons/search-black-icon.svg';
import SearchIcon from 'icons/search-white-icon.svg';
import SocialBlackIcon from 'icons/social-black-icon.svg';
import SocialIcon from 'icons/social-white-icon.svg';

export const sourcePollItems = [
  { icon: SocialIcon, activeIcon: SocialBlackIcon, type: 'SocialNetwork', title: 'Соцсети' },
  { icon: SearchIcon, activeIcon: SearchBlackIcon, type: 'SearchEngines', title: 'Поисковик' },
  { icon: FriendsIcon, activeIcon: FriendsBlackIcon, type: 'Friends', title: 'Друзья' },
  { icon: OtherIcon, activeIcon: OtherBlackIcon, type: 'Other', title: 'Другое' },
] as const;
