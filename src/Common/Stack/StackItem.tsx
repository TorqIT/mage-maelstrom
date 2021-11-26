import React from 'react';
import { StackAlignment } from './types';

export interface StackItemProps {
  /**
   * Sets the relative sizing compared to other items in the Stack. A value of 2
   * results in an item that's twice as big as the other items.
   * @default 1
   */
  size?: number | { min?: number; max?: number };
  /**
   * Overrides the alignment for this item vertically for horizontal stacks or
   * horizontally for vertical stacks.
   */
  alignment?: StackAlignment;
  /**
   * Sets the order of this item relative to other items
   */
  order?: number;
  /**
   * **Avoid using this prop.** *Reserved for integration with third-party libraries.*
   * Sets the class name on the root div
   */
  className?: string;
  /**
   * **Avoid using this prop.** *Reserved for integration with third-party libraries.*
   * Sets the style on the root div
   */
  style?: React.CSSProperties;
}

const StackItem: React.FC<StackItemProps> = ({
  size = 1,
  alignment,
  order,
  style,
  className,
  children,
}) => {
  function getFlexStyle() {
    const flexStyle: React.CSSProperties = { order };

    if (typeof size == 'number') {
      flexStyle.flex = size;
    } else {
      flexStyle.flexGrow = size.max;
      flexStyle.flexShrink = size.min;
    }

    switch (alignment) {
      case 'start':
        flexStyle.alignSelf = 'flex-start';
        break;
      case 'text-start':
        flexStyle.alignSelf = 'flex-start';
        break;
      case 'middle':
        flexStyle.alignSelf = 'center';
        break;
      case 'baseline':
        flexStyle.alignSelf = 'baseline';
        break;
      case 'end':
        flexStyle.alignSelf = 'flex-end';
        break;
      case 'text-end':
        flexStyle.alignSelf = 'flex-end';
        break;
    }

    return flexStyle;
  }

  return (
    <div className={className} style={{ ...getFlexStyle(), ...style }}>
      {children}
    </div>
  );
};

export { StackItem };
