import { getModule } from '@vizality/webpack';
import React from 'react';
import { DivComponent, TooltipSVGComponent, SpaceSVGComponent } from '../components/TooltipDiv';

const { getState } = getModule(m => m?._dispatchToken && m?.isMobileOnline);

function getSVGs (States, place, [ width, height ]) {
  const svgs = [];
  for (const [ platform, status ] of Object.entries(States)) {
    svgs.push(<TooltipSVGComponent platform={platform} status={status} width={width} height={height} place={place} />);
    svgs.push(<SpaceSVGComponent height={height} />);
  }
  svgs.pop();
  return svgs;
}

export default (userId, place, ...args) => {
  if (location.pathname === '/vizality/plugins/platform-indicators') {
    const svgs = [];
    for (const status of [ 'online', 'idle', 'dnd' ]) {
      for (const platform of [ 'desktop', 'web', 'mobile' ]) {
        svgs.push(getSVGs({ [platform]: status }, place, args));
      }
    }
    return <DivComponent place={place}>{svgs.flat()}</DivComponent>;
  }

  const States = getState().clientStatuses[userId];
  if (!States || !Object.entries(States).length) return;

  return <DivComponent place={place}>{getSVGs(States, place, args)}</DivComponent>;
};
