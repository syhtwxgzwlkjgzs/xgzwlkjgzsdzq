import isServer from './is-server';

export default function setUserAgent(config) {
    
    if (isServer() && config.__context) {
        const { headers } = config.__context.req;
        config.headers['user-agent'] = headers['user-agent'];
    }
    return config;
  }