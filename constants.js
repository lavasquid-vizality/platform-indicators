import { Constants } from '@vizality/discord/constants';
import { getModule } from '@vizality/webpack';

export const Icons = Object.freeze({
  desktop: getModule(m => m.displayName === 'Monitor'),
  web: getModule(m => m.displayName === 'Public'),
  mobile: getModule(m => m.displayName === 'MobileDevice')
});

export const Colors = Object.freeze({
  online: Constants.Colors.STATUS_GREEN_600,
  idle: Constants.Colors.STATUS_YELLOW,
  dnd: Constants.Colors.STATUS_RED
});

export const DefaultSettings = Object.freeze({
  MLShow: true,
  UPShow: true,
  UMShow: true,
  FLShow: true,
  ANShow: true
});
