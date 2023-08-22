import * as react from 'react';
import { Resend } from 'resend';

declare const _default: Resend;

declare const renderEmail: ({ type, language, props }: {
    type: "welcome";
    language: string;
    props: object;
}) => react.JSX.Element;

export { _default as default, renderEmail };
