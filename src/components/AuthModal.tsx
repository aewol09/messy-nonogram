import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { LogIn, UserCheck, Mail, Lock, LogOut, ShieldCheck, Trash2, X, UserPlus, User as UserIcon } from 'lucide-react-native';
import { useGameStore } from '../store/useGameStore';
import { getTheme } from '../styles/theme';
import { confirmAction } from '../utils/confirm';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AuthModal({ visible, onClose }: AuthModalProps) {
  const { currentUser, loginWithGoogle, loginUser, registerUser, loginAsGuest, logout, deleteAccount, settings } = useGameStore();
  const theme = getTheme(settings.darkMode);

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Login Form State
  const [loginIdInput, setLoginIdInput] = useState('');
  const [loginPasswordInput, setLoginPasswordInput] = useState('');

  // Sign Up Form State
  const [signUpIdInput, setSignUpIdInput] = useState('');
  const [signUpEmailInput, setSignUpEmailInput] = useState('');
  const [signUpPasswordInput, setSignUpPasswordInput] = useState('');

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleLoginSubmit = () => {
    const trimmedId = loginIdInput.trim();

    if (!trimmedId) {
      showAlert('오류', '아이디 또는 이메일 주소를 입력해주세요.');
      return;
    }
    if (!loginPasswordInput) {
      showAlert('오류', '비밀번호를 입력해주세요.');
      return;
    }

    const res = loginUser(trimmedId, loginPasswordInput);
    if (res.success) {
      if (res.message === 'admin') {
        showAlert(
          '👑 관리자 로그인 성공',
          '관리자 계정(admin)으로 로그인되었습니다.\n\n[정답 공개] 및 [전체 해금] 기능이 활성화됩니다.'
        );
      } else {
        showAlert('로그인 성공', '로그인이 완료되었습니다.');
      }
      setLoginIdInput('');
      setLoginPasswordInput('');
      onClose();
    } else {
      showAlert('로그인 실패', res.message || '로그인에 실패했습니다.');
    }
  };

  const handleSignUpSubmit = () => {
    const trimmedId = signUpIdInput.trim();
    const trimmedEmail = signUpEmailInput.trim().toLowerCase();

    if (!trimmedId || trimmedId.length < 2) {
      showAlert('오류', '아이디를 2자 이상 입력해주세요.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      showAlert('오류', '올바른 이메일 주소를 입력해주세요.');
      return;
    }
    if (!signUpPasswordInput || signUpPasswordInput.length < 4) {
      showAlert('오류', '비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }

    const res = registerUser(trimmedId, trimmedEmail, signUpPasswordInput);
    if (res.success) {
      showAlert(
        '🎉 회원가입 완료!',
        `'${trimmedId}'님, 회원가입 및 로그인이 성공적으로 완료되었습니다.`
      );
      setSignUpIdInput('');
      setSignUpEmailInput('');
      setSignUpPasswordInput('');
      onClose();
    } else {
      showAlert('회원가입 실패', res.message || '회원가입 처리 중 오류가 발생했습니다.');
    }
  };

  const handleGoogleAuth = () => {
    loginWithGoogle();
    showAlert('구글 로그인 완료', '구글 계정(user@gmail.com)으로 데이터가 동기화되었습니다.');
    onClose();
  };

  const handleGuestAuth = () => {
    loginAsGuest();
    onClose();
  };

  const handleDeleteAccount = () => {
    confirmAction(
      '⚠️ 계정 탈퇴 및 데이터 영구 삭제',
      '계정을 탈퇴하면 현재 계정의 모든 퍼즐 클리어 기록, 컬렉션, 보유 힌트가 즉시 영구 삭제되며 복구할 수 없습니다.\n\n정말 탈퇴하시겠습니까?',
      () => {
        deleteAccount();
        showAlert('탈퇴 완료', '계정과 관련 데이터가 모두 삭제되었습니다.');
        onClose();
      },
      '계정 탈퇴'
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={20} color={theme.subText} />
          </TouchableOpacity>

          {currentUser && currentUser.provider !== 'guest' ? (
            <View style={styles.profileBox}>
              <View style={[styles.avatar, { backgroundColor: theme.indigo[100] }]}>
                <UserCheck size={36} color={theme.primary} />
              </View>
              <Text style={[styles.profileName, { color: theme.text }]}>아이디: {currentUser.name}</Text>
              <Text style={[styles.profileEmail, { color: theme.subText }]}>이메일: {currentUser.email}</Text>
              <View style={[styles.badge, { backgroundColor: theme.indigo[50] }]}>
                <ShieldCheck size={14} color={theme.primary} />
                <Text style={[styles.badgeText, { color: theme.primary }]}>
                  {currentUser.isAdmin
                    ? '👑 어드민 계정'
                    : currentUser.provider === 'google'
                    ? 'Google 연동 계정'
                    : '이메일 계정'}
                </Text>
              </View>

              <View style={styles.actionBtnGroup}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1 }]}
                  onPress={() => {
                    logout();
                    showAlert('로그아웃', '로그아웃 되었습니다.');
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
                {authMode === 'login' ? (
                  <LogIn size={32} color={theme.primary} />
                ) : (
                  <UserPlus size={32} color={theme.primary} />
                )}
              </View>

              <Text style={[styles.title, { color: theme.text }]}>Messy Nonogram</Text>
              <Text style={[styles.desc, { color: theme.subText }]}>
                로그인 및 회원가입하여 클리어 기록과 커스텀 프로필을 보존해보세요!
              </Text>

              {/* Segmented Tab Switcher */}
              <View style={[styles.tabSegmentContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <TouchableOpacity
                  style={[
                    styles.tabSegment,
                    authMode === 'login' && [styles.tabSegmentActive, { backgroundColor: theme.primary }],
                  ]}
                  onPress={() => setAuthMode('login')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabSegmentText,
                      { color: authMode === 'login' ? '#FFFFFF' : theme.subText },
                    ]}
                  >
                    로그인
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabSegment,
                    authMode === 'signup' && [styles.tabSegmentActive, { backgroundColor: theme.primary }],
                  ]}
                  onPress={() => setAuthMode('signup')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabSegmentText,
                      { color: authMode === 'signup' ? '#FFFFFF' : theme.subText },
                    ]}
                  >
                    회원가입
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Form Content */}
              {authMode === 'login' ? (
                /* LOGIN FORM */
                <View style={styles.formSection}>
                  <View style={styles.inputContainer}>
                    <View style={[styles.inputRow, { backgroundColor: theme.background, borderColor: theme.border }]}>
                      <Mail size={18} color={theme.subText} />
                      <TextInput
                        style={[styles.textInput, { color: theme.text }]}
                        placeholder="아이디 또는 이메일"
                        placeholderTextColor={theme.subText}
                        value={loginIdInput}
                        onChangeText={setLoginIdInput}
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
                        value={loginPasswordInput}
                        onChangeText={setLoginPasswordInput}
                        secureTextEntry
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.primarySubmitBtn, { backgroundColor: theme.primary }]}
                    onPress={handleLoginSubmit}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primarySubmitText}>로그인</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* SIGN UP FORM */
                <View style={styles.formSection}>
                  <View style={styles.inputContainer}>
                    <View style={[styles.inputRow, { backgroundColor: theme.background, borderColor: theme.border }]}>
                      <UserIcon size={18} color={theme.subText} />
                      <TextInput
                        style={[styles.textInput, { color: theme.text }]}
                        placeholder="아이디 (닉네임)"
                        placeholderTextColor={theme.subText}
                        value={signUpIdInput}
                        onChangeText={setSignUpIdInput}
                        autoCapitalize="none"
                      />
                    </View>
                    <View style={[styles.inputRow, { backgroundColor: theme.background, borderColor: theme.border }]}>
                      <Mail size={18} color={theme.subText} />
                      <TextInput
                        style={[styles.textInput, { color: theme.text }]}
                        placeholder="이메일 주소"
                        placeholderTextColor={theme.subText}
                        value={signUpEmailInput}
                        onChangeText={setSignUpEmailInput}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                    <View style={[styles.inputRow, { backgroundColor: theme.background, borderColor: theme.border }]}>
                      <Lock size={18} color={theme.subText} />
                      <TextInput
                        style={[styles.textInput, { color: theme.text }]}
                        placeholder="비밀번호 (4자 이상)"
                        placeholderTextColor={theme.subText}
                        value={signUpPasswordInput}
                        onChangeText={setSignUpPasswordInput}
                        secureTextEntry
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.primarySubmitBtn, { backgroundColor: theme.primary }]}
                    onPress={handleSignUpSubmit}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primarySubmitText}>회원가입 완료</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Google Auth Button */}
              <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleAuth} activeOpacity={0.8}>
                <Text style={styles.googleBtnText}>Google 계정으로 계속하기</Text>
              </TouchableOpacity>

              {/* Guest Link */}
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
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 350,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  tabSegmentContainer: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 3,
    marginBottom: 16,
  },
  tabSegment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSegmentActive: {
    elevation: 2,
  },
  tabSegmentText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  formSection: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 14,
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
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  primarySubmitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  googleBtn: {
    width: '100%',
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  googleBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  guestLink: {
    paddingVertical: 4,
  },
  guestLinkText: {
    fontSize: 12,
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
