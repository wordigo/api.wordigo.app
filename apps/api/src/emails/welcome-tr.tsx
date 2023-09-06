import { Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Tailwind, Text } from "@react-email/components";
import * as React from "react";

interface WelcomeProps {
  name?: string;
}

export const WelcomeEmail = ({ name = "Unknown" }: WelcomeProps) => {
  return (
    <Html>
      <Head />
      <Preview>Wordigo'ya hoş geldiniz</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img src={`${baseUrl}/images/logo-icon.png`} width="50" height="50" alt="Wordigo" className="my-0 mx-auto" />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>Wordigo</strong>'ya hoş geldiniz
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Merhaba <strong>{name}</strong>,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Sizi <strong>Wordigo</strong>'da aramızda görmekten heyecan duyuyoruz. Bizimle yolculuğunuzdan keyif alacağınızı umuyoruz. Herhangi bir sorunuz varsa veya yardıma ihtiyacınız varsa
              bizimle iletişime geçmekten çekinmeyin.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button pX={20} pY={12} className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center" href="https://wordigo.app/dashboard">
                Haydi başlayın
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              veya bu URL'yi kopyalayıp tarayıcınıza yapıştırın:
              <Link href="https://wordigo.app/dashboard" className="text-blue-600 no-underline block">
                https://wordigo.app/dashboard
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 !w-full" />
            <Text className="w-full text-center">
              <Button>
                <Img width={24} height={24} src={`${baseUrl}/images/socials/twitter-blue.png`} />
              </Button>
              <Button className="ml-3">
                <Img width={24} height={24} src={`${baseUrl}/images/socials/linkedin-color.png`} />
              </Button>
              <Button className="ml-3">
                <Img width={24} height={24} src={`${baseUrl}/images/socials/instagram-color.png`} />
              </Button>
            </Text>
            <Text className="text-[#666666] text-[12px] leading-[24px] !p-0 text-center">© 2023 Wordigo, Tüm hakları saklıdır.</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

const baseUrl = "https://wordigo.app";

export default WelcomeEmail;
