import LocalBridge from '@discuzq/sdk/src/localstorage';
const localBridgeOptions = { prefix: '' };
const locals = new LocalBridge(localBridgeOptions);

export default locals;