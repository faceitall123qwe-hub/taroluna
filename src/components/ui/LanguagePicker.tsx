import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import i18n from '../../i18n';
import { colors } from '../../theme';
import { useStore } from '../../store/useStore';
import { supabase } from '../../services/supabase';

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface Language {
  code: string;
  label: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export function LanguagePicker({ visible, onClose }: Props): React.JSX.Element {
  const current = i18n.language;
  const setLanguage = useStore((s) => s.setLanguage);
  const user = useStore((s) => s.user);

  function handleSelect(code: string): void {
    i18n.changeLanguage(code);
    setLanguage(code);
    if (user) {
      supabase.from('profiles').update({ language: code } as never).eq('id', user.id).then(() => {});
    }
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.option}
              onPress={() => handleSelect(lang.code)}
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={styles.label}>{lang.label}</Text>
              {current === lang.code && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.background.surface,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    width: 260,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  flag: {
    fontSize: 22,
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  checkmark: {
    fontSize: 18,
    color: colors.accent.gold,
    fontWeight: '700',
  },
});
