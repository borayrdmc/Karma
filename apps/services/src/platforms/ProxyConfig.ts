import { ProxyAgent } from "undici";

let cachedDispatcher: ProxyAgent | undefined;

export function getFetchDispatcher(): ProxyAgent | undefined {

    const proxyUrl = process.env.PROXY_URL;

    if(!proxyUrl){
        return undefined;
    }

    if(!cachedDispatcher){
        cachedDispatcher = new ProxyAgent(proxyUrl);
    }

    return cachedDispatcher;
}

export interface PlaywrightProxyConfig{
    server: string;
    username?: string;
    password?: string;
}

export function getPlaywrightProxyConfig(): PlaywrightProxyConfig | undefined {

    const proxyUrl = process.env.PROXY_URL;

    if (!proxyUrl) {
        return undefined;
    }

    try{

        const parsed = new URL(proxyUrl);

        return{
            server: `${parsed.protocol}//${parsed.host}`,
            username: parsed.username ? decodeURIComponent(parsed.username) : undefined,
            password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
        };
    } 
    catch{
        return { server: proxyUrl };
    }
}