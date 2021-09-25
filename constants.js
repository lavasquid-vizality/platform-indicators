import { Constants } from '@vizality/discord/constants';
import { getModule } from '@vizality/webpack';

export const Icons = Object.freeze({
  desktop: getModule(m => m.displayName === 'Monitor'),
  web: getModule(m => m.displayName === 'Public'),
  mobile: getModule(m => m.displayName === 'MobileDevice')
});

export const Colors = Object.freeze({
  online: Constants.HEXColors.STATUS_GREEN_600,
  idle: Constants.HEXColors.STATUS_YELLOW,
  dnd: Constants.HEXColors.STATUS_RED
});

export const defaultSettings = Object.freeze({
  MLShow: true,
  UPShow: true,
  UMShow: true,
  FLShow: true,
  ANShow: true
});
