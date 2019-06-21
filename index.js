/**
 * @flow
 */

import KV from "./keyboardAvoidingView";
import SV from "./scrollView";
import * as helpers from "./helpers";

const init = (
  EVENT_TYPES: string[],
) => {
  return {
    KeyboardAvoidingView: (props) => (
      <KV
        {...props}
        customEvents={EVENT_TYPES}
      />
    ),
    ScrollView: (props) => (
      <SV
        {...props}
        customEvents={EVENT_TYPES}
      />
    ),
  };
}

export {
  ...helpers
};

export default init;