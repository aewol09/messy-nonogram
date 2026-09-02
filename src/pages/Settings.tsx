import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Bell, Moon, RotateCcw, Info, ChevronRight, ShieldCheck, User, Cloud } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../store/useGameStore';
import { getTheme } from '../styles/theme';
import AuthModal from '../components/AuthModal';
import { RootStackParamList } from '../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function Settings() {
  const navigation = useNavigation<NavigationProp>();
  const { currentUser, settings, updateSettings, resetAllProgress } = useGameStore();
  const theme = getTheme(settings.darkMode);

  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleReset = () => {
    Alert.alert(
      '진행 상황 초기화',
      '모든 퍼즐 기록과 컬렉션이 삭제됩니다. 정말 초기화하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '초기화', 
          style: 'destructive', 
          onPress: () => {
            resetAllProgress();
            Alert.alert('완료', '모든 기록이 초기화되었습니다.');
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>설정</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Account & Sync Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>계정 & 클라우드 데이터</Text>
          
          <TouchableOpacity 
            style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]} 
            onPress={() => setShowAuthModal(true)}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.indigo[100] }]}>
                <User size={20} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.rowLabel, { color: theme.text }]}>
                  {currentUser ? currentUser.name : '로그인하기'}
                </Text>
                <Text style={[styles.subLabel, { color: theme.subText }]}>
                  {currentUser ? currentUser.email : '구글 또는 이메일 계정 연동'}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.border} />
          </TouchableOpacity>
        </View>

        {/* Game Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>게임 설정</Text>
          
          <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.indigo[50] }]}>
                <Bell size={20} color={theme.primary} />
              </View>
              <Text style={[styles.rowLabel, { color: theme.text }]}>진동 피드백</Text>
            </View>
            <Switch 
              value={settings.hapticEnabled} 
              onValueChange={(val) => updateSettings({ hapticEnabled: val })}
              trackColor={{ false: theme.slate[200], true: theme.indigo[200] }}
              thumbColor={settings.hapticEnabled ? theme.primary : theme.slate[400]}
            />
          </View>

          <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.slate[100] }]}>
                <Moon size={20} color={theme.slate[600]} />
              </View>
              <Text style={[styles.rowLabel, { color: theme.text }]}>다크 모드</Text>
            </View>
            <Switch 
              value={settings.darkMode} 
              onValueChange={(val) => updateSettings({ darkMode: val })}
              trackColor={{ false: theme.slate[200], true: theme.indigo[200] }}
              thumbColor={settings.darkMode ? theme.primary : theme.slate[400]}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>데이터 관리</Text>
          
          <TouchableOpacity 
            style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]} 
            onPress={handleReset}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.rose[50] }]}>
                <RotateCcw size={20} color={theme.rose[600]} />
              </View>
              <Text style={[styles.rowLabel, { color: theme.rose[600] }]}>진행 상황 초기화</Text>
            </View>
            <ChevronRight size={20} color={theme.border} />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>정보</Text>
          
          <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.blue[100] }]}>
                <Info size={20} color={theme.blue[600]} />
              </View>
              <Text style={[styles.rowLabel, { color: theme.text }]}>버전</Text>
            </View>
            <Text style={[styles.versionText, { color: theme.subText }]}>1.0.0</Text>
          </View>

          <TouchableOpacity 
            style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.emerald[100] }]}>
                <ShieldCheck size={20} color={theme.emerald[600]} />
              </View>
              <Text style={[styles.rowLabel, { color: theme.text }]}>개인정보 처리방침</Text>
            </View>
            <ChevronRight size={20} color={theme.border} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Auth Modal */}
      <AuthModal visible={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  subLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
