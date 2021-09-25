import React from 'react';
import { Plugin } from '@vizality/entities';
import { patch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

import getState from './modules/getState';
import { defaultSettings } from './constants';

const { headerTagNoNickname, headerTagWithNickname } = getModule('headerTag');
const { nameTagWithCustomStatus, nameTagNoCustomStatus } = getModule('nameTag', 'additionalActionsIcon');
const { discordTag } = getModule('discordTag', 'discriminator');
const { nameTag: nameTagAN } = getModule('nameTag', 'bot');

function DefaultSettings (settingsSet) {
  for (const [ key, value ] of Object.entries(defaultSettings)) {
    settingsSet(key, value);
  }
}

export default class extends Plugin {
  start () {
    if (!this.settings.getKeys().length) DefaultSettings(this.settings.set);

    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    // Member List
    patch(getModule(m => m.displayName === 'MemberListItem').prototype, 'renderDecorators', (args, res, _this) => {
      if (!this.settings.get('MLShow', defaultSettings.MLShow)) return res;

      const { id: userId } = _this.props.user;

      const Div = getState(userId, 'MemberList', 12, 20);
      if (Div) res.props.children.splice(0, 0, Div);

      return res;
    });

    // Name Tag (User Popout & User Modal & Friends List & Active Now)
    patch(getModule(m => m.default?.displayName === 'DiscordTag'), 'default', (args, res) => {
      args[0].userId = args[0].user.id;
    }, 'before');
    patch(getModule(m => m.default?.displayName === 'NameTag'), 'default', (args, res) => {
      const { userId, className } = args[0];

      if (userId) {
        const Div = (className === headerTagNoNickname && this.settings.get('UPShow', defaultSettings.UPShow))
          ? getState(userId, 'UserPopout', 20, 24)
          : (className === headerTagWithNickname && this.settings.get('UPShow', defaultSettings.UPShow))
            ? getState(userId, 'UserPopoutNick', 18, 18)
            : ((className === nameTagWithCustomStatus || className === nameTagNoCustomStatus) && this.settings.get('UMShow', defaultSettings.UMShow))
              ? (!res.props.className.endsWith(' userModalName') ? res.props.className += ' userModalName' : null, getState(userId, 'UserModal', 20, 20))
              : (className === discordTag && this.settings.get('FLShow', defaultSettings.FLShow))
                ? getState(userId, 'FriendsList', 12, 17)
                : (args[0].discriminator === null && res.props.className === nameTagAN && this.settings.get('ANShow', defaultSettings.ANShow))
                  ? getState(userId, 'ActiveNowClick', 12, 15)
                  : null;

        if (Div) res.props.children.splice(2, 0, Div);
      }

      return res;
    });

    // Private Channels
    patch(getModule(m => m.displayName === 'PrivateChannel').prototype, 'render', (args, res) => {
      const userId = res.props['vz-user-id'];
      const _name = res.props.name;

      if (userId) res.props.name = <>{[ _name, getState(userId, 'PrivateChannel', 12, 20) ]}</>;

      return res;
    });
  }
}
