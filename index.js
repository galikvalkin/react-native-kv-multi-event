/**
 * @flow
 */

/* REACT */
import * as React from "react";

import KV from "./keyboardAvoidingView";
import SV from "./scrollView";
import BasicHOC from "./basicHOC";

export * from "./helpers";

export default {
  KeyboardAvoidingView: BasicHOC(KV),
  ScrollView: BasicHOC(SV),
};