import React, { useEffect, useMemo } from "react";
import { CSSProperties } from "react";
import { StackItem, StackItemProps } from "./StackItem";
import { StackAlignment } from "./types";

export interface StackProps {
  /** Sets the flow direction for the contained items.
   *  @default "horizontal" */
  direction?: "horizontal" | "vertical";
  /** Sets both the alignment for both directions for all items within the container.
   *  @default "text-start" */
  alignment?: StackAlignment;
  /**
   * Sets the spacing between all items and the container walls. "gutter", "evenly"
   * and "apart" apply different automatic spacing styles, while numeric values set
   * spacing in px between each element.
   */
  gap?: "gutter" | "evenly" | "apart" | number;
  /**
   * Applies stretch alignment to all children, causing them to fill the height
   * the container for horizontal stacks and the width of the container for vertical
   * stacks
   */
  stretch?: boolean;
  /**
   * Fills the entire parent if set to true, and wraps its content if false
   */
  fill?: boolean;
  /**
   * **Only works in Firefox.** If true, causes any content that overflows out of the
   * container to have an alignment of "start". Useful in cases where a textbox is
   * centered on a vertical stack that it's too wide for: If unsafe, only the middle
   * of the textbox would be visible, while safe would realign it so that the start is
   * at least visible
   */
  reverse?: boolean;
  safe?: boolean;
  /**
   * **Avoid using this prop.** *Reserved for integration with third-party libraries.*
   * Sets the class name on the root div
   */
  className?: string;
  /**
   * **Avoid using this prop.** *Reserved for integration with third-party libraries.*
   * Sets the style on the root div
   */
  style?: CSSProperties;
}

function checkChildrenSize(
  childArray: (React.ReactChild | React.ReactFragment | React.ReactPortal)[]
) {
  const totalFlex = childArray.reduce((flexCount: number, currentChild) => {
    const elementChild = currentChild as React.ReactElement<StackItemProps>;

    if (elementChild.props && elementChild.props.size) {
      const size = elementChild.props.size;

      if (typeof size == "number") {
        flexCount += size;
      } else if (size.max) {
        flexCount += size.max;
      }
    } else {
      flexCount += 1;
    }

    return flexCount;
  }, 0);

  if (totalFlex > childArray.length) {
    console.warn(
      `The cumulative total of the children's sizes (${parseFloat(
        totalFlex.toFixed(3)
      )}) ` + `cannot exceed the amount of children (${childArray.length})`
    );
  }
}

function buildStyle({
  direction,
  alignment,
  gap,
  stretch,
  fill,
  reverse,
  safe,
}: Pick<
  StackProps,
  "direction" | "alignment" | "gap" | "stretch" | "fill" | "safe" | "reverse"
>) {
  const flexStyle: React.CSSProperties = {
    display: "flex",
    flexDirection:
      direction === "horizontal"
        ? reverse
          ? "row-reverse"
          : "row"
        : reverse
        ? "column-reverse"
        : "column",
    flexWrap: "nowrap",
  };

  switch (alignment) {
    case "start":
      flexStyle.alignItems = (safe ? "safe " : "") + "flex-start";
      flexStyle.justifyContent = "start";
      break;
    case "text-start":
      flexStyle.alignItems = (safe ? "safe " : "") + "flex-start";
      flexStyle.justifyContent = "flex-start";
      break;
    case "middle":
      flexStyle.alignItems = (safe ? "safe " : "") + "center";
      flexStyle.justifyContent = "center";
      break;
    case "baseline":
      flexStyle.alignItems = (safe ? "safe " : "") + "baseline";
      break;
    case "end":
      flexStyle.alignItems = (safe ? "safe " : "") + "flex-end";
      flexStyle.justifyContent = "end";
      break;
    case "text-end":
      flexStyle.alignItems = (safe ? "safe " : "") + "flex-end";
      flexStyle.justifyContent = "flex-end";
      break;
  }

  if (gap) {
    switch (gap) {
      case "gutter":
        flexStyle.justifyContent = "space-around";
        break;
      case "evenly":
        flexStyle.justifyContent = "space-evenly";
        break;
      case "apart":
        flexStyle.justifyContent = "space-between";
        break;
      default:
        flexStyle.gap = gap;
        break;
    }
  }

  if (stretch) {
    flexStyle.alignItems = "stretch";
  }

  if (fill) {
    flexStyle.width = "100%";
    flexStyle.height = "100%";
  }

  return flexStyle;
}

export const StackParent: React.FC<StackProps> = ({
  direction = "horizontal",
  alignment = "text-start",
  gap,
  stretch,
  fill,
  safe,
  className,
  reverse,
  style,
  children,
}) => {
  const childArray = useMemo(
    () => React.Children.toArray(children),
    [children]
  );

  useEffect(() => {
    checkChildrenSize(childArray);
  }, [childArray]);

  return (
    <div
      className={className}
      style={{
        ...buildStyle({
          direction,
          alignment,
          gap,
          stretch,
          fill,
          safe,
          reverse,
        }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Stack = StackParent as React.FC<StackProps> & {
  Item: React.FC<StackItemProps>;
};
Stack.Item = StackItem;

export default Stack;
