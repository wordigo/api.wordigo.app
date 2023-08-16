import { Resend } from 'resend'

export default new Resend('re_Sw6rdktq_5bD7wzeJFVobQM5n2tfeL5SZ')

import WelcomeEmail from './emails/welcome'

export const renderEmail = ({ type, props }: { type: string; props: any }) => {
  switch (type) {
    case 'welcome':
      return WelcomeEmail(props)
  }
}
