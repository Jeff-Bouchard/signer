import { Body } from '@mycrypto/ui';
import type { FormEvent, ReactNode } from 'react';
import type { DefaultState } from 'typed-react-form';
import { useForm, yupValidator } from 'typed-react-form';
import { object, string } from 'yup';

import { Box, FormError, FormInput, FormTextArea, Image } from '@app/components';
import warning from '@assets/icons/circle-warning.svg';
import { translateRaw } from '@common/translate';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config';
import { translate } from '@translations';

const SCHEMA = object({
  mnemonic: string().required(translateRaw('MNEMONIC_EMPTY'))
});

export const useMnemonicForm = <T extends DefaultState>(defaultState?: T) =>
  useForm(
    {
      mnemonic: '',
      password: ''
    },
    yupValidator(SCHEMA),
    true,
    false,
    defaultState
  );

export const MnemonicForm = ({
  onSubmit,
  form,
  children
}: {
  onSubmit(): void;
  form: ReturnType<typeof useMnemonicForm>;
  children?: ReactNode;
}) => {
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await form.validate();
    if (form.error) {
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} id="mnemonic-phrase-form">
      <Box>
        <FormTextArea
          data-testid="mnemonic-input"
          name="mnemonic"
          id="mnemonic"
          form={form}
          placeholder={translateRaw('MNEMONIC_PHRASE_PLACEHOLDER')}
          sx={{ resize: 'none', height: '140px' }}
          my="2"
        />
        <FormError name="mnemonic" form={form} />
        <Box mt="1">
          <label>
            {translateRaw('MNEMONIC_PASSWORD')}
            <FormInput
              type="text"
              id="password"
              name="password"
              form={form}
              placeholder={translateRaw('MNEMONIC_PASSWORD_PLACEHOLDER')}
              mt="2"
            />
          </label>
        </Box>
        <Box mt="2" variant="horizontal-start">
          <Image src={warning} width="20px" height="20px" minWidth="20px" alt="Warning" mr="2" />
          <Body>
            {translate('SECRET_WARNING', {
              $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP)
            })}
          </Body>
        </Box>
      </Box>
      {children}
    </form>
  );
};
