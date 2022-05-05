import React, { memo, createRef } from 'react';
import { Divider } from '@vizality/components';
import { Category, SwitchItem } from '@vizality/components/settings';
import { getModule } from '@vizality/webpack';

import { DefaultSettings } from '../constants';

const MemberListItem = getModule(m => m.AVATAR_DECORATION_PADDING).default;
const UserMention = getModule(m => m.default?.toString().includes('e.inlinePreview') && m.default.displayName !== 'RoleMention').default;
const PreviewMLItem = createRef();

const { getCurrentUser } = getModule(m => m.getCurrentUser);

export default memo(({ getSetting, updateSetting, toggleSetting }) => {
  const user = getCurrentUser();

  return <>
    <Category
      title={'Toggle Show'}
      opened
    >
      <SwitchItem
        value={getSetting('MLShow', DefaultSettings.MLShow)}
        onChange={() => { toggleSetting('MLShow'); PreviewMLItem.current.forceUpdate(); }}
      >
        {'Member List'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UPShow', DefaultSettings.UPShow)}
        onChange={() => toggleSetting('UPShow')}
      >
        {'User Popout'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UMShow', DefaultSettings.UMShow)}
        onChange={() => toggleSetting('UMShow')}
      >
        {'User Modal'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('FLShow', DefaultSettings.FLShow)}
        onChange={() => toggleSetting('FLShow')}
      >
        {'Friends List'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('ANShow', DefaultSettings.ANShow)}
        onChange={() => toggleSetting('ANShow')}
      >
        {'Active Now Clicked'}
      </SwitchItem>
    </Category>
    <Category
      title={'Preview'}
      opened
    >
      <div style={{ textAlign: 'center' }}><span style={{ fontWeight: 'bold', fontSize: '20px' }}>{'Previews'}</span></div>
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '5px' }}>{
        [ <span>{'Member List:'}</span>,
          <MemberListItem status={getModule(m => m.getStatus).getStatus(user.id)} user={user} itemProps={getModule('ListNavigatorProvider').useListItem(user.id)} ref={PreviewMLItem} /> ]
      }</div>
      <div>{
        [ <span>{'\nUser Popout & User Modal (Click Mention): '}</span>,
          <UserMention className={'mention'} userId={user.id} /> ]
      }</div>
      <Divider style={{ marginTop: '10px', marginBottom: '15px' }} />
    </Category>
  </>;
});
