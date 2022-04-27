import React from 'react';
import { Plugin } from '@vizality/entities';
import { patch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

import getState from './modules/getState';
import { DefaultSettings } from './constants';

const { getChannel } = getModule(m => m.getChannel && m.hasChannel);

const { headerTagNoNickname, headerTagWithNickname } = getModule('headerTag');
const { discordTag } = getModule('discordTag', 'discriminator');
const { nameTag: nameTagAN } = getModule('nameTag', 'bot');
let { nameTagNoCustomStatus, nameTagWithCustomStatus } = getModule('nameTag', 'additionalActionsIcon') ?? {};

export default class PlatformIndicators extends Plugin {
  start () {
    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    // Member List Item
    const MemberListItem = patch(getModule(m => m.AVATAR_DECORATION_PADDING).default, 'type', (args, res) => {
      // Decorators
      patch(res.type.prototype, 'renderDecorators', (args, res, _this) => {
        if (!this.settings.get('MLShow', DefaultSettings.MLShow)) return res;

        const { id: userId } = _this.props.user;

        const Div = getState(userId, 'MemberList', 12, 20);
        if (Div) res.props.children.splice(0, 0, Div);

        return res;
      });

      MemberListItem();
    });

    // Name Tag (User Popout & User Modal & Friends List & Active Now)
    patch(getModule(m => m.default?.displayName === 'DiscordTag'), 'default', args => {
      args[0].userId = args[0].user.id;
    }, 'before');
    patch(getModule(m => m.default?.displayName === 'NameTag'), 'default', (args, res) => {
      if (!nameTagNoCustomStatus) ({ nameTagNoCustomStatus, nameTagWithCustomStatus } = getModule('nameTag', 'additionalActionsIcon') ?? {});

      const { userId, className } = args[0];

      if (userId) {
        const Div = className === headerTagNoNickname && this.settings.get('UPShow', DefaultSettings.UPShow)
          ? getState(userId, 'UserPopout', 18, 18)
          : className === headerTagWithNickname && this.settings.get('UPShow', DefaultSettings.UPShow)
            ? getState(userId, 'UserPopoutNick', 14, 14)
            : (className === nameTagNoCustomStatus || className === nameTagWithCustomStatus) && this.settings.get('UMShow', DefaultSettings.UMShow)
              ? (!res.props.className.endsWith(' userModalName') ? res.props.className += ' userModalName' : null, getState(userId, 'UserModal', 18, 18))
              : className === discordTag && this.settings.get('FLShow', DefaultSettings.FLShow)
                ? getState(userId, 'FriendsList', 12, 17)
                : args[0].discriminator === null && res.props.className === nameTagAN && this.settings.get('ANShow', DefaultSettings.ANShow)
                  ? getState(userId, 'ActiveNowClick', 12, 15)
                  : null;

        if (Div) res.props.children.splice(2, 0, Div);
      }

      return res;
    });

    // Private Channels
    patch(getModule(m => m.displayName === 'PrivateChannel').prototype, 'render', (args, res) => {
      const channel = getChannel(res.props.id);

      if (channel.isDM()) {
        const _children = res.props.children;
        res.props.children = (...args) => {
          const children = _children(args);
          children.props.name = <>{[ children.props.name, getState(channel.recipients[0], 'PrivateChannel', 12, 20) ]}</>;
          return children;
        };
      }

      return res;
    });
  }
}
