import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../store/useGameStore';
import { getTheme } from '../styles/theme';

export default function PrivacyPolicy() {
  const navigation = useNavigation();
  const { settings } = useGameStore();
  const theme = getTheme(settings.darkMode);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>개인정보 처리방침</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.text }]}>Pixel Puzzle Quest 개인정보 처리방침</Text>
        
        <Text style={[styles.sectionTitle, { color: theme.text }]}>1. 수집하는 개인정보 항목</Text>
        <Text style={[styles.text, { color: theme.subText }]}>
          본 앱은 사용자의 어떠한 개인정보도 수집, 저장, 전송하지 않습니다. 회원가입이 없으며, 모든 게임 데이터는 사용자의 기기에만 로컬로 저장됩니다.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>2. 정보의 저장 및 파기</Text>
        <Text style={[styles.text, { color: theme.subText }]}>
          퍼즐 진행 상황, 클리어 기록, 설정 값 등은 기기의 로컬 저장소(AsyncStorage)에 저장됩니다. 앱을 삭제하거나 설정에서 '진행 상황 초기화'를 선택할 경우 모든 데이터는 즉시 삭제됩니다.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>3. 외부 서비스 이용</Text>
        <Text style={[styles.text, { color: theme.subText }]}>
          본 앱은 광고, 인앱 결제, 분석 도구 등 사용자의 정보를 추적하는 어떠한 외부 SDK도 포함하고 있지 않습니다.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>4. 아동의 개인정보 보호</Text>
        <Text style={[styles.text, { color: theme.subText }]}>
          본 앱은 모든 연령대가 이용 가능하며, 아동으로부터 어떠한 정보도 의도적으로 수집하지 않습니다.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>5. 연락처</Text>
        <Text style={[styles.text, { color: theme.subText }]}>
          본 방침과 관련하여 문의사항이 있으시면 개발자에게 문의해 주시기 바랍니다.
        </Text>

        <Text style={[styles.footer, { color: theme.subText }]}>
          최종 업데이트: 2026년 6월 13일
        </Text>
      </ScrollView>
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
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    marginTop: 48,
    fontSize: 14,
    textAlign: 'center',
  },
});
