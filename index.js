import { Plugin } from '@vizality/entities';
import { patch, unpatchAll } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';
import React from 'react';

import getState from './modules/getState';
import { defaultSettings } from './constants';

const { headerTagNoNickname, headerTagWithNickname } = getModule('headerTag');
const { nameTag: nameTagUM } = getModule('nameTag', 'additionalActionsIcon');
const { discordTag } = getModule('discordTag', 'friend');
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
    patch(getModule(m => m?.displayName === 'MemberListItem').prototype, 'renderDecorators', (args, res) => {
      if (!this.settings.get('MLShow', false)) return res;

      const { id: userId } = res._owner.pendingProps.user;

      const Div = getState(userId, 'MemberList', 12, 20);
      if (Div) res.props.children.splice(0, 0, Div);

      return res;
    });

    // Name Tag (User Popout & User Modal & Friends List & Active Now)
    patch(getModule(m => m?.default?.displayName === 'DiscordTag'), 'default', (args, res) => {
      res.props.userId = args[0].user.id;

      return res;
    });
    patch(getModule(m => m?.default?.displayName === 'NameTag'), 'default', (args, res) => {
      const { userId, className } = args[0];

      if (userId) {
        const Div = (className === headerTagNoNickname && this.settings.get('UPShow', true))
          ? getState(userId, 'UserPopout', 20, 24)
          : (className === headerTagWithNickname && this.settings.get('UPShow', true))
            ? getState(userId, 'UserPopoutNick', 18, 18)
            : (className === nameTagUM && this.settings.get('UMShow', true))
              ? getState(userId, 'UserModal', 20, 20)
              : (className === discordTag && this.settings.get('FLShow', true))
                ? getState(userId, 'FriendsList', 12, 17)
                : (args[0].discriminator === null && res.props.className === nameTagAN && this.settings.get('ANShow', true))
                  ? getState(userId, 'ActiveNowClick', 12, 15)
                  : null;

        if (Div) res.props.children.splice(2, 0, Div);
      }

      return res;
    });

    // Private Channels
    patch(getModule(m => m?.displayName === 'PrivateChannel').prototype, 'render', (args, res) => {
      const userId = res.props['vz-user-id'];
      const _name = res.props.name;

      if (userId) res.props.name = <>{[ _name, getState(userId, 'PrivateChannel', 12, 20) ]}</>;

      return res;
    });
  }

  stop () {
    unpatchAll();
  }
}
