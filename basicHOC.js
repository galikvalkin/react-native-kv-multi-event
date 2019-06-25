/**
 * @flow
 */

/* REACT */
import * as React from "react";

/* MODULES */
import {
  Keyboard,
  Platform,
} from "react-native";
import Emitter from "tiny-emitter";

/* TYPES */
import type { KeyboardEvent } from "react-native/Libraries/Components/Keyboard/Keyboard";

export type BasicProps = Object & {
  customEvents?: string[],
};

const withCommonListeners = (WrappedComponent: React.ElementType) => {
  return class extends React.Component<BasicProps> {
    _childRef: ?Object = React.createRef();

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

    _onKeyboardChange = (event: ?KeyboardEvent): void => {
      if (this._childRef && this._childRef.current && this._childRef.current._onKeyboardChange) {
        this._childRef.current._onKeyboardChange(event);
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
          if (this._eventEmitter) {
            const customEvents = [
              this._eventEmitter.on(event, this._onKeyboardChange),
            ];
            this._subscriptions.push({
              type: "custom",
              event,
              listeners: customEvents
            });
          }
          
        });
      }
    }

    render() {
      const {
        customEvents,
        ...props
      } = this.props;
      return (
        <WrappedComponent
          ref={this._childRef}
          {...props}
        />
      )
    }
  };
};


export default withCommonListeners;
