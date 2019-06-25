/**
 * @flow
 */

/* REACT */
import * as React from "react";

/* MODULES */
import {
  ScrollView as ReactNativeScrollView,
  Platform,
  Keyboard,
} from "react-native";
import Emitter from "tiny-emitter";

/* TYPES */
import type {
  Props as ScrollViewProps
} from "react-native/Libraries/Components/ScrollView/ScrollView";
import type { KeyboardEvent } from "react-native/Libraries/Components/Keyboard/Keyboard";

type _t_props = ScrollViewProps;

export default class ScrollView extends React.Component<_t_props> {
  _ref = React.createRef();

  _contentOffset = 0;

  _overlayItemPosition = 0;

  _onKeyboardChange = (event: ?KeyboardEvent) => {
    if (event == null) {
      this._overlayItemPosition = 0;
      return;
    }
    const { endCoordinates } = event;

    this._overlayItemPosition = endCoordinates.screenY;
  };

  parentScrollTo = (args: { py: number, height: number }) => {
    const elementPosition = args.py + args.height;
    if (this._overlayItemPosition && this._overlayItemPosition < elementPosition) {
      const final = elementPosition + this._contentOffset;
      const difference = Math.abs(this._overlayItemPosition - final);


      if (this._ref && this._ref.current && this._ref.current.scrollTo) {
        this._ref.current.scrollTo({ y: difference, animated: true });
      }
    }
  }

  _onLayout = (event) => {
    if (this.props.onLayout) {
      this.props.onLayout(event);
    }
  }

  _onScroll = (event) => {
    this._contentOffset = event.nativeEvent.contentOffset.y;
    if (this.props.onScroll) {
      this.props.onScroll(event);
    }
  }

  render() {
    const {
      children,
      ...props
    } = this.props;
    const childProps = {
      parentScrollTo: this.parentScrollTo
    };
    return (
      <ReactNativeScrollView
        keyboardShouldPersistTaps="never"
        scrollEventThrottle={1000}
        {...props}
        ref={this._ref}
        onLayout={this._onLayout}
        onScroll={this._onScroll}
      >
        {
          React.Children.map(children, child => (
            React.cloneElement(child, childProps)
          ))
        }
      </ReactNativeScrollView>
    );
  }
}
