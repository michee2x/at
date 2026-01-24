declare module 'react-quill-new' {
    import React from 'react';
    export interface ReactQuillProps {
        bounds?: string | HTMLElement;
        children?: React.ReactElement<any>;
        className?: string;
        defaultValue?: string;
        value?: string;
        placeholder?: string;
        id?: string;
        formats?: string[];
        modules?: any;
        onChange?: (content: string, delta: any, source: string, editor: any) => void;
        onFocus?: (range: any, source: string, editor: any) => void;
        onBlur?: (previousRange: any, source: string, editor: any) => void;
        onKeyPress?: React.EventHandler<any>;
        onKeyDown?: React.EventHandler<any>;
        onKeyUp?: React.EventHandler<any>;
        preserveWhitespace?: boolean;
        readOnly?: boolean;
        scrollingContainer?: string | HTMLElement;
        style?: React.CSSProperties;
        tabIndex?: number;
        theme?: string;
        ref?: any;
    }
    const ReactQuill: React.ComponentType<ReactQuillProps>;
    export default ReactQuill;
}
