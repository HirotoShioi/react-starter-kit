"use client";
import {
  Authenticator,
  ThemeProvider,
  Theme,
  useTheme,
  useAuthenticator,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { translations } from "@aws-amplify/ui-react";
import { I18n } from "aws-amplify/utils";
import { pageWrapperStyles } from "@/styles/common";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  const { user } = useAuthenticator((c) => [c.user]);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/todos");
    }
  }, [navigate, user]);

  const { tokens } = useTheme();
  I18n.putVocabularies(translations);
  I18n.setLanguage("ja");
  const theme: Theme = {
    name: "Auth Example Theme",
    tokens: {
      components: {
        authenticator: {
          router: {
            boxShadow: `0 0 16px ${tokens.colors.overlay["10"]}`,
            borderWidth: "0",
          },
          form: {
            padding: `${tokens.space.medium} ${tokens.space.xl} ${tokens.space.medium}`,
          },
        },
        button: {
          primary: {
            backgroundColor: tokens.colors.blue["60"],
          },
          link: {
            color: tokens.colors.blue["80"],
          },
        },
        fieldcontrol: {
          _focus: {
            boxShadow: `0 0 0 2px ${tokens.colors.blue["60"]}`,
          },
        },
        tabs: {
          item: {
            color: tokens.colors.blue["60"],
            _active: {
              borderColor: tokens.colors.blue["100"],
              color: tokens.colors.blue["100"],
            },
          },
        },
      },
    },
  };
  return (
    <div className={pageWrapperStyles}>
      <ThemeProvider theme={theme}>
        <Authenticator />
      </ThemeProvider>
    </div>
  );
}
