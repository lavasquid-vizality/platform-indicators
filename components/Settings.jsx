import React, { memo, useState, createRef } from 'react';
import { Category, SwitchItem } from '@vizality/components/settings';
import { Divider } from '@vizality/components';
import { getModule } from '@vizality/webpack';

const PreviewMLItem = createRef();
const MemberListItem = getModule(m => m?.displayName === 'MemberListItem');
const UserMention = getModule(m => m?.displayName === 'UserMention');

export default memo(({ getSetting, updateSetting, toggleSetting }) => {
  const user = getModule(m => m?.getCurrentUser).getCurrentUser();

  const [ getTSOpened, setTSOpened ] = useState(true);
  const [ getPreviewOpened, setPreviewOpened ] = useState(true);

  return (
    <>
      <Category
        name={'Toggle Show'}
        opened={getTSOpened}
        onChange={() => setTSOpened(!getTSOpened)}
      >
        <SwitchItem
          value={getSetting('MLShow')}
          onChange={() => { toggleSetting('MLShow'); PreviewMLItem.current.forceUpdate(); }}
        >
          {'Member List'}
        </SwitchItem>
        <SwitchItem
          value={getSetting('UPShow')}
          onChange={() => toggleSetting('UPShow')}
        >
          {'User Popout'}
        </SwitchItem>
        <SwitchItem
          value={getSetting('UMShow')}
          onChange={() => toggleSetting('UMShow')}
        >
          {'User Modal'}
        </SwitchItem>
        <SwitchItem
          value={getSetting('FLShow')}
          onChange={() => toggleSetting('FLShow')}
        >
          {'Friends List'}
        </SwitchItem>
        <SwitchItem
          value={getSetting('ANShow')}
          onChange={() => toggleSetting('ANShow')}
        >
          {'Active Now Clicked'}
        </SwitchItem>
      </Category>
      <Category
        name={'Preview'}
        opened={getPreviewOpened}
        onChange={() => setPreviewOpened(!getPreviewOpened)}
      >
        <div style={{ textAlign: 'center' }}><span style={{ fontWeight: 'bold', fontSize: '20px' }}>{'Previews'}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '5px' }}>{
          [ <span>{'Member List:'}</span>,
            <MemberListItem status={getModule(m => m?.getStatus).getStatus(user.id)} user={user} itemProps={getModule('ListNavigatorProvider').useListItem(user.id)} ref={PreviewMLItem} /> ]
        }</div>
        <div>{
          [ <span>{'\nUser Popout & User Modal (Click Mention): '}</span>,
            <UserMention userId={user.id} /> ]
        }</div>
        <Divider style={{ marginTop: '10px', marginBottom: '15px' }} />
      </Category>
    </>
  );
});
