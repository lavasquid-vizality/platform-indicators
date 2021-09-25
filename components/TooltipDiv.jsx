import { isEqual } from 'lodash';
import React, { memo } from 'react';
import { getModule } from '@vizality/webpack';
import { toTitleCase } from '@vizality/util/string';

import { Icons, Colors } from '../constants';

const Tooltip = getModule(m => m.displayName === 'Tooltip');

export const TooltipSVGComponent = memo(({ platform, status, width, height, place }) => {
  return (
    <Tooltip aria-label={false} text={`${status === 'dnd' ? 'DND' : toTitleCase(status)} ${toTitleCase(platform)}`}>{ props => {
      return (React.createElement(Icons[platform], { width, height, color: Colors[status], className:`PI-${place}-${toTitleCase(platform)}-${toTitleCase(status)}`, ...props }));
    }}</Tooltip>
  );
});

export const SpaceSVGComponent = memo(({ height }) => {
  return (
    <svg width={'1'} height={height} className={'PI-Space'}/>
  );
});

export const DivComponent = memo(({ place, children }) => {
  return (
    <div className={`PI-Div PI-Div-${place}`}>
      {children}
    </div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.children.length === nextProps.children.length) {
    for (const [ index, prevPropChildren ] of prevProps.children.entries()) {
      return isEqual(prevPropChildren.props, nextProps.children[index].props);
    }
  }
  return false;
});
