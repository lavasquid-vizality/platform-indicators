/* global _ */
import React, { memo } from 'react';
import { getModule } from '@vizality/webpack';
const Tooltip = getModule(m => m?.displayName === 'Tooltip');
import { toTitleCase } from '@vizality/util/string';

import { Icons, Colors } from '../constants';

export const TooltipSVGComponent = memo(({ platform, status, width, height, place }) => {
  return (
    <Tooltip aria-label={false} text={`${status === 'dnd' ? 'DND' : toTitleCase(status)} ${toTitleCase(platform)}`}>{ props => {
      return (
        <span className={`PI-Div-${place}-${toTitleCase(platform)}-${toTitleCase(status)}`} {...props}>{
          <svg viewBox={'0 0 24 24'} className={`PI-${toTitleCase(platform)}-${toTitleCase(status)}`} width={width} height={height}>
            <path fill={Colors[status]} d={Icons[platform].d}/>
          </svg>
        }</span>
      );
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
      return _.isEqual(prevPropChildren.props, nextProps.children[index].props);
    }
  }
  return false;
});
