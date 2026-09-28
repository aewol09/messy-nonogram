export const sendWelcomeEmail = async (email: string, username: string) => {
  try {
    // EmailJS API 엔드포인트 (백엔드 없이 프론트엔드에서 무료로 이메일을 보낼 수 있는 서비스)
    const url = 'https://api.emailjs.com/api/v1.0/email/send';

    // 🚨 중요: 실제 메일을 보내려면 EmailJS (https://www.emailjs.com/) 에 가입 후 
    // 아래 3개의 키를 발급받아 교체해야 합니다.
    const serviceId = 'service_xg7p1s5';
    const templateId = 'template_ydbtzch';
    const publicKey = 'S3lMg-C5Cym-7xziI';

    // 발송할 이메일 내용
    const templateParams = {
      to_email: email,
      to_name: username,
      subject: '🎉 Messy Nonogram 가입을 환영합니다!',
      message: `${username}님, 환영합니다!\n\nMessy Nonogram에 성공적으로 가입되었습니다.\n다양한 퍼즐을 풀고 기록을 세워보세요.\n\n즐거운 시간 되시길 바랍니다!`,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      console.warn('이메일 발송 실패 (API 키 설정을 확인해주세요):', await response.text());
    } else {
      console.log(`${email}로 가입 환영 이메일 발송 성공!`);
    }
  } catch (error) {
    console.error('이메일 발송 중 오류 발생:', error);
  }
};
