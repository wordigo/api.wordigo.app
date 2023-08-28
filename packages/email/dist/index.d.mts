import * as react from 'react';
import { Resend } from 'resend';
export { render } from '@react-email/render';

declare const _default: Resend;

declare const GetEmailTemplate: ({ type, language, props }: {
    type: "welcome";
    language: string;
    props: object;
}) => react.JSX.Element;

export { GetEmailTemplate, _default as default };
