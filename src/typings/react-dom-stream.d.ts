declare module 'react-dom-stream/server' {
    export function renderToString(element: React.ReactElement): NodeJS.ReadableStream;
    export function renderToStaticMarkup(element: React.ReactElement): NodeJS.ReadableStream;
}
