/*
* @flow
*/

/* REACT */
import * as React from "react";

/* MODULES */
import {
  Platform,
  Keyboard,
} from "react-native";
import Emitter from "tiny-emitter";

/* CUSTOM MODULES */

export type BasicProps = {
  customEvents?: string[],
};

export default class Basic extends React.Component<BasicProps> {
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

  render() {
    return null;
  }
}
