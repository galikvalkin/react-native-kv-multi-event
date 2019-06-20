/*
* @Author: Valentin
* @Date:   2018-09-03 13:51:31
 * @Last Modified by: Olexander T
 * @Last Modified time: 2018-12-12 13:37:53
* @flow
*/

/* REACT */
import * as React from "react";

/* MODULES */
import {
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import Emitter from "tiny-emitter";

/* TYPES */
import type {
  Props as ScrollViewProps
} from "react-native/Libraries/Components/ScrollView/ScrollView";

/* CUSTOM MODULES */

type _t_props = ScrollViewProps & {
  customEvents?: string[],
};

export default class SScrollView extends React.Component<_t_props> {
  _ref = React.createRef();

  _contentOffset = 0;

  _overlayItemPosition = 0;

  _subscriptions = [];

  _eventEmitter: ?Object = null;

  componentDidMount(): void {
    this._initializeSubscriptions();
  }

  componentWillUnmount(): void {
    this._subscriptions.forEach((subscription) => {
      if (subscription.type === "basic") {
        subscription.listeners.forEach((listener) => {
          listener.remove();
        });
      } else if (subscription.type === "custom") {
        if (this._eventEmitter) {
          this._eventEmitter.off(subscription.event);
        }
      }
    });
  }

  emitEvent = (name: string, event: ?KeyboardEvent): void => {
    if (this._eventEmitter) {
      this._eventEmitter.emit(name, event);
    }
  }

  _initializeSubscriptions = () => {
    let basicEvents = [];
    if (Platform.OS === "ios") {
      basicEvents = [
        Keyboard.addListener("keyboardWillChangeFrame", this._onKeyboardChange),
      ];
    } else {
      basicEvents = [
        Keyboard.addListener("keyboardDidHide", this._onKeyboardChange),
        Keyboard.addListener("keyboardDidShow", this._onKeyboardChange),
      ];
    }
    this._subscriptions = [
      {
        type: "basic",
        listeners: basicEvents
      }
    ];
    if (this.props.customEvents) {
      this._eventEmitter = new Emitter();
      this.props.customEvents.forEach((event: string) => {
        const customEvents = [
          this._eventEmitter.on(event, this._onKeyboardChange),
        ];
        this._subscriptions.push({
          type: "custom",
          event,
          listeners: customEvents
        });
      });
    }
  }

  _onKeyboardChange = (event: ?KeyboardEvent) => {
    if (event == null) {
      this._overlayItemPosition = 0;
      return;
    }
    const { endCoordinates } = event;

    this._overlayItemPosition = endCoordinates.screenY;
  };

  parentScrollTo = (args) => {
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
    const { children } = this.props;
    const childProps = {
      parentScrollTo: this.parentScrollTo
    };
    return (
      <ScrollView
        keyboardShouldPersistTaps="never"
        scrollEventThrottle={1000}
        {...this.props}
        ref={this._ref}
        onLayout={this._onLayout}
        onScroll={this._onScroll}
      >
        {
          React.Children.map(children, child => (
            React.cloneElement(child, childProps)
          ))
        }
      </ScrollView>
    );
  }
}
