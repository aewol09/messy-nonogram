import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LogIn, UserCheck, Mail, Lock, LogOut, ShieldCheck, Trash2, X } from 'lucide-react-native';
import { useGameStore } from '../store/useGameStore';
import { getTheme } from '../styles/theme';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AuthModal({ visible, onClose }: AuthModalProps) {
  const { currentUser, loginWithGoogle, loginWithEmail, loginAsGuest, logout, deleteAccount, settings } = useGameStore();
  const theme = getTheme(settings.darkMode);

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailAuth = () => {
    if (!emailInput || !emailInput.includes('@')) {
      Alert.alert('오류', '올바른 이메일 주소를 입력해주세요.');
      return;
    }
    if (!passwordInput || passwordInput.length < 4) {
      Alert.alert('오류', '비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }

    loginWithEmail(emailInput);
    Alert.alert('로그인 성공', `${emailInput} 계정으로 동기화되었습니다.`);
    onClose();
  };

  const handleGoogleAuth = () => {
    loginWithGoogle();
    Alert.alert('구글 로그인 완료', '구글 계정(user@gmail.com)으로 데이터가 동기화되었습니다.');
    onClose();
  };

  const handleGuestAuth = () => {
    loginAsGuest();
    onClose();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ 계정 탈퇴 및 데이터 영구 삭제',
      '계정을 탈퇴하면 현재 계정의 모든 퍼즐 클리어 기록, 컬렉션, 보유 힌트가 즉시 영구 삭제되며 복구할 수 없습니다.\n\n정말 탈퇴하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '계정 탈퇴',
          style: 'destructive',
          onPress: () => {
            deleteAccount();
            Alert.alert('탈퇴 완료', '계정과 관련 데이터가 모두 삭제되었습니다.');
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={20} color={theme.subText} />
          </TouchableOpacity>

          {currentUser ? (
            <View style={styles.profileBox}>
              <View style={[styles.avatar, { backgroundColor: theme.indigo[100] }]}>
                <UserCheck size={36} color={theme.primary} />
              </View>
              <Text style={[styles.profileName, { color: theme.text }]}>{currentUser.name}</Text>
              <Text style={[styles.profileEmail, { color: theme.subText }]}>{currentUser.email}</Text>
              <View style={[styles.badge, { backgroundColor: theme.indigo[50] }]}>
                <ShieldCheck size={14} color={theme.primary} />
                <Text style={[styles.badgeText, { color: theme.primary }]}>
                  {currentUser.provider === 'google' ? 'Google 연동 계정' : currentUser.provider === 'email' ? '이메일 계정' : '게스트 계정'}
                </Text>
              </View>

              <View style={styles.actionBtnGroup}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1 }]}
                  onPress={() => {
                    logout();
                    Alert.alert('로그아웃', '로그아웃 되었습니다.');
                  }}
                >
                  <LogOut size={16} color={theme.text} />
                  <Text style={[styles.actionBtnText, { color: theme.text }]}>로그아웃</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: theme.rose[50], borderColor: theme.rose[200], borderWidth: 1 }]}
                  onPress={handleDeleteAccount}
                >
                  <Trash2 size={16} color={theme.rose[600]} />
                  <Text style={[styles.actionBtnText, { color: theme.rose[600] }]}>계정 탈퇴</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.authBox}>
              <View style={[styles.headerIcon, { backgroundColor: theme.indigo[100] }]}>
                <LogIn size={32} color={theme.primary} />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>계정 로그인 & 데이터 클라우드 동기화</Text>
              <Text style={[styles.desc, { color: theme.subText }]}>
                로그인하면 앱을 재설치하거나 기기를 변경해도 클리어 기록과 진행 상황이 보존됩니다.
              </Text>

              {/* Google Login Button */}
              <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleAuth} activeOpacity={0.8}>
                <Text style={styles.googleBtnText}>Google 계정으로 계속하기</Text>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                <Text style={[styles.dividerText, { color: theme.subText }]}>또는 이메일 로그인</Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              </View>

              {/* Email Form */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputRow, { backgroundColor: theme.background, borderColor: theme.border }]}>
                  <Mail size={18} color={theme.subText} />
                  <TextInput
                    style={[styles.textInput, { color: theme.text }]}
                    placeholder="이메일 주소"
                    placeholderTextColor={theme.subText}
                    value={emailInput}
                    onChangeText={setEmailInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={[styles.inputRow, { backgroundColor: theme.background, borderColor: theme.border }]}>
                  <Lock size={18} color={theme.subText} />
                  <TextInput
                    style={[styles.textInput, { color: theme.text }]}
                    placeholder="비밀번호"
                    placeholderTextColor={theme.subText}
                    value={passwordInput}
                    onChangeText={setPasswordInput}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primarySubmitBtn, { backgroundColor: theme.primary }]}
                onPress={handleEmailAuth}
              >
                <Text style={styles.primarySubmitText}>
                  {isSignUp ? '이메일 회원가입' : '로그인 / 회원가입'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.guestLink} onPress={handleGuestAuth}>
                <Text style={[styles.guestLinkText, { color: theme.subText }]}>게스트 모드로 플레이하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 10,
  },
  profileBox: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 24,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  authBox: {
    alignItems: 'center',
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  desc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  googleBtn: {
    width: '100%',
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 2,
  },
  googleBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    marginHorizontal: 10,
  },
  inputContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  primarySubmitBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primarySubmitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  guestLink: {
    paddingVertical: 6,
  },
  guestLinkText: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  actionBtnGroup: {
    width: '100%',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionBtnText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
