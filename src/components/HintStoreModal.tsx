import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { Lightbulb, Tv, ShoppingBag, CheckCircle, Sparkles, X } from 'lucide-react-native';
import { useGameStore } from '../store/useGameStore';
import { getTheme } from '../styles/theme';
import { getTranslation } from '../utils/i18n';
import { useIAP } from 'react-native-iap';

interface HintStoreModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function HintStoreModal({ visible, onClose }: HintStoreModalProps) {
  const { hintPool, isUnlimitedHints, addHints, setUnlimitedHints, settings } = useGameStore();
  const theme = getTheme(settings.darkMode);
  const lang = settings.language || 'ko';
  const t = getTranslation(lang);

  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(3);

  const handleWatchAd = () => {
    setIsWatchingAd(true);
    setAdCountdown(3);

    const timer = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsWatchingAd(false);
          addHints(3);
          Alert.alert('🎁 보상 획득!', '광고 시청이 완료되어 힌트 +3개가 충전되었습니다.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const { connected, getProducts, requestPurchase, currentPurchase, finishTransaction } = useIAP();
  
  // 구글 플레이 콘솔에 등록한 실제 '일회성 제품 ID'를 아래에 입력하세요!
  const itemSkus = Platform.select({
    ios: [],
    android: ['hints_10', 'unlimited_pass'] // <-- 이곳을 실제 제품 ID로 변경하세요
  }) || [];

  React.useEffect(() => {
    if (visible && connected) {
      getProducts({ skus: itemSkus }).catch(console.warn);
    }
  }, [visible, connected]);

  React.useEffect(() => {
    const checkCurrentPurchase = async (purchase: any) => {
      if (purchase) {
        try {
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            if (purchase.productId === 'hints_10') {
              addHints(10);
              Alert.alert('결제 성공', '힌트 10개가 지급되었습니다!');
            } else if (purchase.productId === 'unlimited_pass') {
              setUnlimitedHints(true);
              Alert.alert('🎉 무제한 패스 활성화!', '모든 퍼즐 힌트 무제한이 적용되었습니다.');
            }
            await finishTransaction({ purchase, isConsumable: purchase.productId === 'hints_10' });
          }
        } catch (error) {
          console.warn('finishTransaction error', error);
        }
      }
    };
    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction]);

  const handlePurchasePackage = async (count: number, price: string) => {
    try {
      await requestPurchase({ sku: 'hints_10' }); // 실제 ID로 변경
    } catch (err: any) {
      if (err.code !== 'E_USER_CANCELLED') {
        Alert.alert('결제 오류', err.message);
      }
    }
  };

  const handlePurchaseUnlimited = async () => {
    try {
      await requestPurchase({ sku: 'unlimited_pass' }); // 실제 ID로 변경
    } catch (err: any) {
      if (err.code !== 'E_USER_CANCELLED') {
        Alert.alert('결제 오류', err.message);
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} disabled={isWatchingAd}>
            <X size={20} color={theme.subText} />
          </TouchableOpacity>

          {isWatchingAd ? (
            <View style={styles.adPlayerOverlay}>
              <Tv size={48} color={theme.primary} />
              <Text style={[styles.adTitle, { color: theme.text }]}>동영상 광고 시청 중...</Text>
              <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 16 }} />
              <Text style={[styles.adTimerText, { color: theme.subText }]}>
                {adCountdown}초 후 보상을 받습니다!
              </Text>
            </View>
          ) : (
            <View style={styles.contentBox}>
              <View style={[styles.iconBadge, { backgroundColor: theme.amber[100] }]}>
                <Lightbulb size={36} color={theme.amber[600]} />
              </View>

              <Text style={[styles.title, { color: theme.text }]}>{t.hintStoreTitle}</Text>
              <Text style={[styles.subtitle, { color: theme.subText }]}>
                {t.currentHints}: {isUnlimitedHints ? t.unlimited : `${hintPool}`}
              </Text>

              {/* Option 1: Watch Ad */}
              <TouchableOpacity style={styles.adCard} onPress={handleWatchAd} activeOpacity={0.8}>
                <View style={styles.cardLeft}>
                  <View style={styles.adIconBox}>
                    <Tv size={24} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>{t.watchAd}</Text>
                    <Text style={styles.cardSub}>{t.watchAdSub}</Text>
                  </View>
                </View>
                <View style={styles.freeBadge}>
                  <Text style={styles.freeBadgeText}>{t.free}</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                <Text style={[styles.dividerText, { color: theme.subText }]}>{t.iapSection}</Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              </View>

              {/* Option 2: 10 Hint Pack */}
              <TouchableOpacity
                style={[styles.iapCard, { backgroundColor: theme.background, borderColor: theme.border }]}
                onPress={() => handlePurchasePackage(10, '₩1,100')}
              >
                <View style={styles.cardLeft}>
                  <ShoppingBag size={20} color={theme.primary} />
                  <Text style={[styles.iapTitle, { color: theme.text }]}>{t.pack10}</Text>
                </View>
                <Text style={[styles.priceText, { color: theme.primary }]}>₩1,100</Text>
              </TouchableOpacity>

              {/* Option 3: Unlimited Hints Pass */}
              <TouchableOpacity
                style={[
                  styles.iapCard,
                  styles.unlimitedCard,
                  { backgroundColor: theme.indigo[50], borderColor: theme.indigo[200] },
                ]}
                onPress={handlePurchaseUnlimited}
              >
                <View style={styles.cardLeft}>
                  <Sparkles size={20} color={theme.primary} />
                  <View>
                    <Text style={[styles.iapTitle, { color: theme.text }]}>{t.unlimitedPass}</Text>
                    <Text style={[styles.unlimitedSub, { color: theme.subText }]}>{t.unlimitedPassSub}</Text>
                  </View>
                </View>
                {isUnlimitedHints ? (
                  <View style={styles.activeBadge}>
                    <CheckCircle size={16} color={theme.primary} />
                    <Text style={[styles.activeBadgeText, { color: theme.primary }]}>{t.using}</Text>
                  </View>
                ) : (
                  <Text style={[styles.priceText, { color: theme.primary }]}>₩3,300</Text>
                )}
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
  contentBox: {
    alignItems: 'center',
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 20,
  },
  adCard: {
    width: '100%',
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    elevation: 3,
    marginBottom: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardSub: {
    color: '#E1F5FE',
    fontSize: 11,
  },
  freeBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  freeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    marginHorizontal: 8,
  },
  iapCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  unlimitedCard: {
    marginBottom: 0,
  },
  iapTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  unlimitedSub: {
    fontSize: 11,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  adPlayerOverlay: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  adTimerText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
