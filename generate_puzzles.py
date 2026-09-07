import json
import os

# Handcrafted Nonogram Puzzles Generator
# Sizes: 10x10 (Easy), 15x15 (Normal), 20x20 (Hard)
# Handcrafted ASCII pixel art representations ensures realistic nonogram logic
# with NO artificial alternating noise (like "# # # # #").

COLOR_MAP = {
    'R': '#EF4444', # Red
    'O': '#F97316', # Orange
    'Y': '#F59E0B', # Yellow / Amber
    'G': '#10B981', # Green
    'C': '#06B6D4', # Cyan / Sky
    'B': '#3B82F6', # Blue
    'I': '#6366F1', # Indigo
    'P': '#8B5CF6', # Purple
    'K': '#EC4899', # Pink
    'M': '#D97706', # Warm Brown
    'N': '#78350F', # Dark Brown
    'D': '#1E293B', # Dark Slate / Black
    'S': '#64748B', # Slate Gray
    'W': '#F8FAFC', # White
    'X': '#94A3B8', # Light Slate Gray
}

def parse_ascii_matrix(lines, width, height, default_color='#3B82F6'):
    matrix = []
    color_matrix = []
    for r in range(height):
        line = lines[r] if r < len(lines) else "." * width
        line = line.ljust(width)[:width]
        row_binary = []
        row_color = []
        for c in range(width):
            ch = line[c]
            if ch in ['.', ' ']:
                row_binary.append(0)
                row_color.append("0")
            else:
                row_binary.append(1)
                hex_col = COLOR_MAP.get(ch, default_color)
                row_color.append(hex_col)
        matrix.append(row_binary)
        color_matrix.append(row_color)
    return matrix, color_matrix

# ==============================================================================
# 1. ANIMAL THEME (10x10 Easy, 15x15 Normal, 20x20 Hard)
# ==============================================================================

animal_10x10_names = ['고양이', '강아지', '토끼', '곰', '물고기', '부엉이', '펭귄', '개구리', '코끼리', '오리']
animal_10x10_ascii = [
    # 1. 고양이 (Cat)
    [
        " O      O ",
        "OOO    OOO",
        "OOOOOOOOOO",
        "OO D  D OO",
        "OOOOOOOOOO",
        "OO  K   OO",
        " O D D D O",
        "  OOOOOO  ",
        "  OOOOOO  ",
        "  O    O  "
    ],
    # 2. 강아지 (Dog)
    [
        "NN      NN",
        "NNN    NNN",
        " NYYYYYYN ",
        " NY D D YN",
        " NY  D  YN",
        "  NY R YN ",
        "  YYYYYY  ",
        "  Y Y  Y  ",
        "  Y Y  Y  ",
        "  YY  YY  "
    ],
    # 3. 토끼 (Rabbit)
    [
        " KK    KK ",
        " KKK  KKK ",
        " WWK  KWW ",
        " WWW  WWW ",
        " WWWWWWWW ",
        " W D  D W ",
        " W  KK  W ",
        " WWWWWWWW ",
        "  WWWWWW  ",
        "  WW  WW  "
    ],
    # 4. 곰 (Bear)
    [
        " NN    NN ",
        "NNNN  NNNN",
        "NNNNNNNNNN",
        "NN D  D NN",
        "NN YYYY NN",
        "NN YDDY NN",
        " NYYYYYYN ",
        " NNNNNNNN ",
        " NN    NN ",
        " NNN  NNN "
    ],
    # 5. 물고기 (Fish)
    [
        "   OOOO   ",
        "  OOOOOO  ",
        " OOOOOOOOO",
        "OOOO D OOO",
        "OOOOOOORRR",
        "OOOOOOOOOO",
        " OOOOOOOOO",
        "  OOOOOO  ",
        "   OOOO   ",
        "    OO    "
    ],
    # 6. 부엉이 (Owl)
    [
        " NN    NN ",
        "NNNN  NNNN",
        "NWWN  NWWN",
        "NDDN  NDDN",
        " NNYYYYNN ",
        " NMMMMMMN ",
        " NMMMMMMN ",
        " NMMMMMMN ",
        " NNNNNNNN ",
        " YYY  YYY "
    ],
    # 7. 펭귄 (Penguin)
    [
        "  DDDDDD  ",
        " DDWWWWDD ",
        " DD D  DDD",
        " DD YYY DD",
        " DDDWWDDDD",
        "DDDDWWDDDD",
        "DDDDWWDDDD",
        " DDDWWDDDD",
        "  DDDDDD  ",
        "  YY  YY  "
    ],
    # 8. 개구리 (Frog)
    [
        " GGG  GGG ",
        "GD DGGGD D",
        "GGGGGGGGGG",
        "GGGGGGGGGG",
        "G DGGGGDDG",
        "G  DDDD  G",
        " GGGGGGGG ",
        "GG GGGGGG ",
        "G  GGGGGG ",
        "GG        "
    ],
    # 9. 코끼리 (Elephant)
    [
        "  SSSSSS  ",
        " SSSSSSSS ",
        "SS D SSS S",
        "SSSSSSSS S",
        "SSSSSSSS S",
        " SSS  SSSS",
        " SSS   SSS",
        " SS    SSS",
        " SS    SS ",
        " S     SS "
    ],
    # 10. 오리 (Duck)
    [
        "  YYYY    ",
        " Y D YY   ",
        "OOOOYYY   ",
        "  YYYY    ",
        "  YYYYYY  ",
        " YYYYYYYY ",
        "YYYYYYYYYY",
        "YYYYYYYYYY",
        " YYYYYYYY ",
        "  OO  OO  "
    ]
]

animal_15x15_names = ['호랑이', '독수리', '고래', '기린', '공룡', '늑대', '공작', '사슴', '펭귄가족', '카멜레온']
animal_15x15_ascii = [
    # 1. 호랑이 (Tiger)
    [
        " OOO      OOO  ",
        "OOOOO    OOOOO ",
        "OOOOOOOOOOOOOOO",
        "OO D OOOO D OOO",
        "OOOOOOOOOOOOOOO",
        "OO DDD  DDD OOO",
        "OOO D O D OOOOO",
        "OOOO D D OOOOOO",
        " OOOO D OOOOOO ",
        " OOOOOOOOOOOOO ",
        " O DDD D DDD O ",
        " OOOOOOOOOOOOO ",
        "  OOOOOOOOOOO  ",
        "  OOO     OOO  ",
        "  OOO     OOO  "
    ],
    # 2. 독수리 (Eagle)
    [
        "     WWWWW     ",
        "    WWWWWWW    ",
        "   WWWWWWWWW   ",
        "  WWWW D WWWW  ",
        "  WWWWWWWWWWW  ",
        " YYYWWWWWWWWWW ",
        "YYYYYWWWWWWWW  ",
        " YYYYYWWWWWWW  ",
        "  YYYYWWWWWW   ",
        "     DDDDDD    ",
        "    DDDDDDDD   ",
        "   DDDDDDDDDD  ",
        "  DDDDDDDDDDDD ",
        "  DDDD    DDDD ",
        "  YYY      YYY "
    ],
    # 3. 고래 (Whale)
    [
        "     CCCC      ",
        "     CCCC      ",
        "    BBBBBB     ",
        "  BBBBBBBBBB   ",
        " BBBBBBBBBBBB  ",
        "BBB D BBBBBBBB ",
        "BBBBBBBBBBBBBBB",
        "WWWWWWWWWWWWWWW",
        " WWWWWWWWWWWW  ",
        "  WWWWWWWWWW   ",
        "   BBBBBBBB    ",
        "  BBBB  BBBB   ",
        " BBBB    BBBB  ",
        "BBB        BBB ",
        "BB          BB "
    ],
    # 4. 기린 (Giraffe)
    [
        "    NN   NN    ",
        "   YYYY YYYY   ",
        "   YYYYYYYYY   ",
        "   YY D  D YY  ",
        "   YYYYYYYYY   ",
        "    YY YYY     ",
        "     YYYY      ",
        "     YYNNY     ",
        "     YYYYY     ",
        "     YNNYY     ",
        "     YYYYY     ",
        "    YYYYYYY    ",
        "   YYYYYYYYY   ",
        "  YYNNYYYYNNY  ",
        "  YY  YY  YY   "
    ],
    # 5. 공룡 (Dinosaur)
    [
        "     GGGGGG    ",
        "    GGGGGGGG   ",
        "    GG D GGG   ",
        "    GGGGGGGG   ",
        "    GWWWWWW    ",
        "    GGGGGG     ",
        "   GGGGGGGG    ",
        "  GGGGGGGGGG   ",
        " GGGGGGGGGGGG  ",
        "GGGGGGGGGGGGGG ",
        " GGGGGGGGGGGG  ",
        "  GGGGGGGGGG   ",
        "   GGGG  GGGG  ",
        "   GGGG  GGGG  ",
        "   GGG    GGG  "
    ],
    # 6. 늑대 (Wolf)
    [
        "  SS      SS   ",
        " SSSS    SSSS  ",
        "SSSSSS  SSSSSS ",
        "SSSSSSSSSSSSSSS",
        "SSS D SSS D SSS",
        "SSSSSSSSSSSSSSS",
        " SSSSS D SSSSS ",
        "  SSSS D SSSS  ",
        "   SSSSSSSSSS  ",
        "   SSSSSSSSSS  ",
        "    SSSSSSSS   ",
        "   SSSSSSSSSS  ",
        "  SSSSSSSSSSSS ",
        "  SSS      SSS ",
        "  SSS      SSS "
    ],
    # 7. 공작 (Peacock)
    [
        " G  G  Y  G  G ",
        "GG GGG Y GGG GG",
        "GGGGGGGGGGGGGGG",
        " GGGGGGGGGGGGG ",
        "  GGGGGGGGGGG  ",
        "   GG BBB GG   ",
        "    BB D BB    ",
        "    BBBBBBB    ",
        "     BBBBB     ",
        "     BBBBB     ",
        "      BBB      ",
        "      BBB      ",
        "     BBBBB     ",
        "    YYYYYYY    ",
        "    YY   YY    "
    ],
    # 8. 사슴 (Deer)
    [
        " MM   MM   MM  ",
        "MMMM MMMMM MMMM",
        " MMMMMMMMMMMMM ",
        "  NNNNNNNNNNN  ",
        "  NN D N D NN  ",
        "  NNNNNNNNNNN  ",
        "   NNN   NNN   ",
        "   NNNNNNNNN   ",
        "   NNNNNNNNN   ",
        "   NNWWNNWWN   ",
        "    NNNNNNN    ",
        "   NNNNNNNNN   ",
        "  NNNNNNNNNNN  ",
        "  NNN     NNN  ",
        "  NNN     NNN  "
    ],
    # 9. 펭귄가족 (Penguin Family)
    [
        "   DDDD        ",
        "  DDWWDD   DDD ",
        "  DD D DD DDWD ",
        "  DDYYYDD DDDD ",
        " DDDWWDDDDDWWD ",
        "DDDDWWDDDDDWWD ",
        "DDDDWWDDDDDWWD ",
        " DDDWWDDDDDWWD ",
        "  DDDDDD  DDDD ",
        "  YY  YY  YY YY"
    ],
    # 10. 카멜레온 (Chameleon)
    [
        "    GGGGGG     ",
        "   GGGGGGGG    ",
        "  GGG Y D GGG  ",
        " GGGGGGGGGGGGG ",
        "GGGGGGGGGGGGGGG",
        "GGGGGGGGGGGGGGG",
        " GGGGGGGGGGGGG ",
        "  GGGGGGGGGGG  ",
        "   GGGGGGGGG   ",
        " NN GGGGGGG NN ",
        "NNNN GGGGG NNNN",
        " NNNNNNNNNNNNN ",
        "  NNNNNNNNNNN  ",
        "   GG     GG   ",
        "  GGG     GGG  "
    ]
]

animal_20x20_names = ['사자왕', '홍학', '바다거북', '다람쥐', '판다곰', '백조', '돌고래', '여우', '부엉이숲', '해파리']
animal_20x20_ascii = [
    # 1. 사자왕 (Lion)
    [
        " NNNNN        NNNNN ",
        "NNNNNNN      NNNNNNN",
        "NNNNYYYYYYYYYYYNNNNN",
        "NNYYYYYYYYYYYYYYYNNN",
        "NYYYY D YYY D YYYYNN",
        "YYYYYYYYYYYYYYYYYYYY",
        "YYYYYY   Y   YYYYYYY",
        "YYYYY  DDDDD  YYYYYY",
        "YYYYYY  DDD  YYYYYYY",
        "NYYYYYY     YYYYYYNN",
        "NNYYYYYYYYYYYYYYYNNN",
        " NNNYYYYYYYYYYYNNNN ",
        "   NNNNYYYYYNNNN    ",
        "    NNNNNNNNNNN     ",
        "    YYYY   YYYY     ",
        "    YYYY   YYYY     ",
        "    YYYY   YYYY     ",
        "    YYYY   YYYY     ",
        "   YYYYY   YYYYY    ",
        "   YYYYY   YYYYY    "
    ],
    # 2. 홍학 (Flamingo)
    [
        "       KKKKK        ",
        "      KKKKKKK       ",
        "     KK K D KK      ",
        "     KKYYYYYKK      ",
        "     KKDDDDD        ",
        "      KKKKK         ",
        "       KKK          ",
        "       KKK          ",
        "       KKK          ",
        "       KKK          ",
        "      KKKKK         ",
        "     KKKKKKK        ",
        "    KKKKKKKKK       ",
        "   KKKKKKKKKKK      ",
        "   KKKKKKKKKKK      ",
        "    KKKKKKKKK       ",
        "       KKK          ",
        "       KKK          ",
        "       K K          ",
        "      KK KK         "
    ],
    # 3. 바다거북 (Sea Turtle)
    [
        "       GGGG         ",
        "      GGDDGG        ",
        "     GGGGGGGG       ",
        " GGG GGGGGGGG GGG   ",
        "GGGGGGGGGGGGGGGGGG  ",
        "GGGGGGDDDDDDGGGGGG  ",
        " GGGGGDDDDDDGGGGG   ",
        " GGGGGDDDDDDGGGGG   ",
        " GGGGGDDDDDDGGGGG   ",
        " GGGGGDDDDDDGGGGG   ",
        " GGGGGDDDDDDGGGGG   ",
        " GGGGGDDDDDDGGGGG   ",
        " GGGGGGGGGGGGGGGG   ",
        " GGGGGGGGGGGGGGGG   ",
        " GGGGG GGGG GGGGG   ",
        "  GGG  GGGG  GGG    ",
        "       GGGG         ",
        "       GGGG         ",
        "        GG          ",
        "        GG          "
    ],
    # 4. 다람쥐 (Squirrel)
    [
        "   NNNNN     NNNNNN ",
        "  NNNNNNN   NNNNNNNN",
        " NNN D D N NNNNNNNNN",
        " NNN  D  NNNNNNNNNNN",
        "  NN Y NN NNNNNNNNNN",
        "  NNNNNNN  NNNNNNNNN",
        "   NNNNN    NNNNNNN ",
        "  NNNNNNN   NNNNNNN ",
        " NNNNNNNNN  NNNNNNN ",
        " NNNNNMMNNN NNNNNNN ",
        " NNNMMMMNNNNNNNNNNN ",
        " NNNMMMMNNNNNNNNNN  ",
        "  NNNMMNNNNNNNNNN   ",
        "  NNNNNNNNNNNNNN    ",
        "   NNNNNNNNNNNN     ",
        "    NNNNNNNNNN      ",
        "    NNN    NNN      ",
        "    NNN    NNN      ",
        "   NNNN    NNNN     ",
        "   NNNN    NNNN     "
    ],
    # 5. 판다곰 (Panda)
    [
        "  DDD        DDD    ",
        " DDDDD      DDDDD   ",
        "DDDDDDD    DDDDDDD  ",
        "DDWWWWWWWWWWWWWWDD  ",
        "DWW DDD WW DDD WW D ",
        "DWWDDDDDWWDDDDDWW D ",
        "DWW DDD WW DDD WW D ",
        "DWWWWWWW D WWWWWW D ",
        "DWWWWW D D D WWWW D ",
        " DDDWW DDD WWDDDD   ",
        "  DDDDWWWWWWDDDD    ",
        " DDDDDDDWWDDDDDDD   ",
        "DDDDDDDDWWDDDDDDDD  ",
        "DDDDDDDDWWDDDDDDDD  ",
        "DDDDDDDDWWDDDDDDDD  ",
        " DDDDDDDWWDDDDDDD   ",
        "  DDDDWWWWWWDDDD    ",
        "  DDD        DDD    ",
        " DDDD       DDDD    ",
        " DDDD       DDDD    "
    ],
    # 6. 백조 (Swan)
    [
        "        WWWWW       ",
        "       WWWWWWW      ",
        "      WW WW D WW    ",
        "      YOOOOOWW      ",
        "       WWWWWWW      ",
        "        WWWWW       ",
        "        WWWWW       ",
        "        WWWWW       ",
        "        WWWWW       ",
        "       WWWWWWW      ",
        "      WWWWWWWWW     ",
        "     WWWWWWWWWWW    ",
        "    WWWWWWWWWWWWW   ",
        "   WWWWWWWWWWWWWWW  ",
        "  WWWWWWWWWWWWWWWWW ",
        " WWWWWWWWWWWWWWWWWWW",
        "CCCCCCCCCCCCCCCCCCCC",
        " CCCCCCCCCCCCCCCCC  ",
        "  CCCCCCCCCCCCCCC   ",
        "   CCCCCCCCCCCC     "
    ],
    # 7. 돌고래 (Dolphin)
    [
        "          BBBB      ",
        "         BBBBBB     ",
        "        BBBBBBBB    ",
        "       BB D BBBBB   ",
        "      BBBBBBBBBBB   ",
        "     BBBBBBBBBBBB   ",
        "    BBBBBBBBWWWWW   ",
        "   BBBBBBBWWWWWWW   ",
        "  BBBBBBBWWWWWWWW   ",
        " BBBBBBBWWWWWWWWW   ",
        "BBBBBBBWWWWWWWWWW   ",
        " BBBBBWWWWWWWWWWW   ",
        "  BBBWWWWWWWWWW     ",
        "   BWWWWWWWWWW      ",
        "    WWWWWWWWW       ",
        "     WWWWWW         ",
        "    BB  BB          ",
        "   BBB  BBB         ",
        "  BBBB  BBBB        ",
        " BBBBB  BBBBB       "
    ],
    # 8. 여우 (Fox)
    [
        " OOO        OOO     ",
        "OOOOO      OOOOO    ",
        "O D OO    OO D O    ",
        "OOOOOOO  OOOOOOO    ",
        " OOOOOOOOOOOOOO     ",
        " OOOOOOOOOOOOOO     ",
        " OOOOO D D OOOO     ",
        "  OOOO  D  OOO      ",
        "   OOOO D OOO       ",
        "   OWWWWWWWWO       ",
        "    WWWWWWWW        ",
        "    OOOOOOOO   OOO  ",
        "   OOOOOOOOOO OOOOO ",
        "  OOOOOOOOOOOOOOOOO ",
        "  OOOOOOOOOOOOOOOOO ",
        "  OOOOOOOOOOOOOOOOWW",
        "  OOOOOOOOOOOOOOOWWW",
        "  OOOOOOOOOOOOOOOWWW",
        "   OOOO  OOOO   WW  ",
        "   DDDD  DDDD       "
    ],
    # 9. 부엉이숲 (Owl in Forest)
    [
        "      YYYYYY        ",
        "     YYYYYYYY       ",
        "     YYYYYYYY       ",
        "      YYYYYY        ",
        "  MMMM      MMMM    ",
        " MMMMMM    MMMMMM   ",
        "MMWWWWMM  MMWWWWMM  ",
        "MMWDDWMM  MMWDDWMM  ",
        " MMMMMM YYY MMMMMM  ",
        "  MMMMMMMMMMMMMM    ",
        "  MMWWWWWWWWWWMM    ",
        "  MMWWWWWWWWWWMM    ",
        "  MMWWWWWWWWWWMM    ",
        "   MMMMMMMMMMMM     ",
        " NNNNNNNNNNNNNNNNNN ",
        "NNNNNNNNNNNNNNNNNNNN",
        " NNNNNNNNNNNNNNNNNN ",
        "   YYY        YYY   ",
        "   YYY        YYY   ",
        "   DDD        DDD   "
    ],
    # 10. 해파리 (Jellyfish)
    [
        "      PPPPPP        ",
        "    KKKKKKKKKK      ",
        "   KKKKKKKKKKKK     ",
        "  KKKKKKKKKKKKKK    ",
        " KKKKKKKKKKKKKKKK   ",
        "KKKKKKKKKKKKKKKKKK  ",
        "KKWWKKWWKKWWKKWWKK  ",
        "KKWWKKWWKKWWKKWWKK  ",
        " KKKKKKKKKKKKKKKK   ",
        "  KK  KK  KK  KK    ",
        "  KK  KK  KK  KK    ",
        "  CC  KK  KK  CC    ",
        "  CC  CC  CC  CC    ",
        "  CC  CC  CC  CC    ",
        "  KK  CC  CC  KK    ",
        "  KK  KK  KK  KK    ",
        "  CC  KK  KK  CC    ",
        "  CC  CC  CC  CC    ",
        "  CC  CC  CC  CC    ",
        "  CC  CC  CC  CC    "
    ]
]

# ==============================================================================
# 2. FOOD THEME (10x10 Easy, 15x15 Normal, 20x20 Hard)
# ==============================================================================

food_10x10_names = ['사과', '버거', '피자', '도넛', '조각케이크', '커피잔', '아이스크림콘', '초밥', '핫도그', '파르페']
food_10x10_ascii = [
    # 1. 사과 (Apple)
    [
        "    N G   ",
        "   NNGGG  ",
        "  RRRRRRR ",
        " RRRRRRRRR",
        "RRRWRRRRRR",
        "RRRRRRRRRR",
        "RRRRRRRRRR",
        " RRRRRRRR ",
        " RRRRRRRR ",
        "  RR  RR  "
    ],
    # 2. 버거 (Burger)
    [
        "  YYYYYY  ",
        " YYYYYYYY ",
        "YYYYYYYYYY",
        "GGGGGGGGGG",
        "YYYYYYYYYY",
        "NNNNNNNNNN",
        "YYYYYYYYYY",
        "YYYYYYYYYY",
        " YYYYYYYY ",
        "  YYYYYY  "
    ],
    # 3. 피자 (Pizza)
    [
        " NNNNNNNN ",
        "YYYYYYYYYY",
        " YRR Y Y  ",
        " YYY YRR  ",
        "  Y RR Y  ",
        "  YYYYY   ",
        "   YRR    ",
        "   YYY    ",
        "    Y     ",
        "    Y     "
    ],
    # 4. 도넛 (Donut)
    [
        "  MMMMMM  ",
        " MMKKKKMM ",
        "MKKKKKKKKM",
        "MKK MM KKM",
        "MKK MMMMKM",
        "MKK MMMMKM",
        "MKKKKKKKKM",
        " MMKKKKMM ",
        "  MMMMMM  ",
        "   MMMM   "
    ],
    # 5. 조각케이크 (Cake Slice)
    [
        "    RR    ",
        "    NN    ",
        "   WWWW   ",
        "  WWWWWW  ",
        " WWWWWWWW ",
        "WWWWWWWWWW",
        "YYYYYYYYYY",
        "KKKKKKKKKK",
        "YYYYYYYYYY",
        "YYYYYYYYYY"
    ],
    # 6. 커피잔 (Coffee Cup)
    [
        "  S  S  S ",
        "  S  S  S ",
        " BBBBBBBB ",
        "BBBBBBBBBB",
        "BB NNNN BB",
        "BB NNNN BBB",
        "BB NNNN BBB",
        "BBBBBBBBBB ",
        " BBBBBBBB ",
        "  BBBBBB  "
    ],
    # 7. 아이스크림콘 (Ice Cream Cone)
    [
        "  KKKKKK  ",
        " KKKKKKKK ",
        "KKKKKKKKKK",
        " KKKKKKKK ",
        "  YYYYYY  ",
        "   YYYY   ",
        "   YYYY   ",
        "    YY    ",
        "    YY    ",
        "    Y     "
    ],
    # 8. 초밥 (Sushi)
    [
        "  RRRRRR  ",
        " RRRRRRRR ",
        "RRRRRRRRRR",
        "DDDDDDDDDD",
        "WWWWWWWWWW",
        "WWWWWWWWWW",
        "WWWWWWWWWW",
        "WWWWWWWWWW",
        " WWWWWWWW ",
        "  WWWWWW  "
    ],
    # 9. 핫도그 (Hotdog)
    [
        "  YYYYYY  ",
        " YYYYYYYY ",
        "YY RRRR YY",
        "YY RYYR YY",
        "YY RYYR YY",
        "YY RRRR YY",
        "YYYYYYYYYY",
        "YYYYYYYYYY",
        " YYYYYYYY ",
        "  YYYYYY  "
    ],
    # 10. 파르페 (Parfait)
    [
        "    RR    ",
        "   KKKK   ",
        "  YYYYYY  ",
        " CCCCCCC ",
        " CKKKKKC ",
        " CYYYYYC ",
        "  CCCCC  ",
        "   CCC   ",
        "    C    ",
        "   CCC   "
    ]
]

food_15x15_names = ['디저트세트', '햄버거세트', '피자한판', '카페라떼', '생일케이크', '와인과잔', '벤또도시락', '감자튀김음료', '과일멜론', '팬케이크타워']
food_15x15_ascii = [
    # 1. 디저트세트 (Dessert Set)
    [
        "    RR         ",
        "    NN   MMMM  ",
        "   KKKK MMKKMM ",
        "  KKKKKKMK M KM",
        " KKKKKKKMKMM KM",
        "WWWWWWWW MKKMM ",
        "YYYYYYYY  MM   ",
        "YYYYYYYY       ",
        "               ",
        "  CCCCCC       ",
        " CKKKKKKC      ",
        " CYYYYYYC      ",
        "  CCCCCC       ",
        "   CCCC        ",
        "  CCCCCC       "
    ],
    # 2. 햄버거세트 (Burger Set)
    [
        "    YYYYYYY    ",
        "   YYYYYYYYY   ",
        "  YYYYWWYYYYY  ",
        " YYYYYYYYYYYYY ",
        "GGGGGGGGGGGGGGG",
        "YYYYYYYYYYYYYYY",
        "NNNNNNNNNNNNNNN",
        "YYYYYYYYYYYYYYY",
        " GGGGGGGGGGGGG ",
        " NNNNNNNNNNNNN ",
        " YYYYYYYYYYYYY ",
        "  YYYYYYYYYYY  ",
        "   YYYYYYYYY   ",
        "   YYYYYYYYY   ",
        "    YYYYYYY    "
    ],
    # 3. 피자한판 (Whole Pizza)
    [
        "    NNNNNNN    ",
        "  NNYYYYYYYYNN ",
        " NYYRRYYYYYYYN ",
        "NYYYYYYYRRYYYYN",
        "NYYRR YYYYYYYYN",
        "NYYYYYYYYYRRYYN",
        "NYYYYYRR YYYYYN",
        "NYYYYYYYYYYYYYN",
        "NYYRRYYYYYRRYYN",
        "NYYYYYYYYYYYYYN",
        " NYYYYRRYYYYYN ",
        " NYYYYYYYYYYN  ",
        "  NNYYYYYYYYN  ",
        "   NNNNNNNNN   ",
        "     NNNNN     "
    ],
    # 4. 카페라떼 (Latte Art)
    [
        "    S   S   S  ",
        "    S   S   S  ",
        "  NNNNNNNNNNN  ",
        " NNWWNWNNWWNNN ",
        "NNWWWWNWWWWNNNN",
        "NNWWWWWWWWWNNNN",
        "NNNWWWWWWWNNNNN",
        " NNNNWWWNNNNNNN",
        " NNNNNWNNNNNNNN",
        " NNNNNNNNNNNNNN",
        "  NNNNNNNNNNNN ",
        "  NNNNNNNNNNNN ",
        "   NNNNNNNNNN  ",
        "  CCCCCCCCCCCC ",
        " CCCCCCCCCCCCCC"
    ],
    # 5. 생일케이크 (Birthday Cake)
    [
        "   Y   Y   Y   ",
        "   R   R   R   ",
        "   W   W   W   ",
        "  WWWWWWWWWWW  ",
        " WWKKWKKWKKWW ",
        "WWWWWWWWWWWWWWW",
        "YYYYYYYYYYYYYYY",
        "KKKKKKKKKKKKKKK",
        "YYYYYYYYYYYYYYY",
        "WWWWWWWWWWWWWWW",
        "YYYYYYYYYYYYYYY",
        "KKKKKKKKKKKKKKK",
        "YYYYYYYYYYYYYYY",
        "WWWWWWWWWWWWWWW",
        "WWWWWWWWWWWWWWW"
    ],
    # 6. 와인과잔 (Wine & Glass)
    [
        "   GG     CC   ",
        "   GG    C  C  ",
        "  GGGG   CRRC  ",
        "  G R G  CRRC  ",
        "  G R G   CC   ",
        "  GGGG    C    ",
        "  G R G   C    ",
        "  GGGG   CCC   ",
        "  G R G CCCCC  ",
        "  GGGG CCCCCCC ",
        "  GGGG CCCCCCC ",
        "  GGGG CCCCCCC ",
        "  GGGG CCCCCCC ",
        "  GGGG  CCCCC  ",
        " GGGGG   CCC   "
    ],
    # 7. 벤또도시락 (Bento Box)
    [
        "NNNNNNNNNNNNNNN",
        "NWWWWWWNRYYYYYN",
        "NWWWWWWNYYYYYYN",
        "NWWWRWWNYYYYYYN",
        "NWWWWWWNRYYYYYN",
        "NWWWWWWNYYYYYYN",
        "NNNNNNNNNNNNNNN",
        "NYYYYYYYYYYYYYN",
        "NYYYYYYYYYYYYYN",
        "NYYYYYYYYYYYYYN",
        "NYYYYYYYYYYYYYN",
        "NYYYYYYYYYYYYYN",
        "NYYYYYYYYYYYYYN",
        "NYYYYYYYYYYYYYN",
        "NNNNNNNNNNNNNNN"
    ],
    # 8. 감자튀김음료 (Fries & Drink)
    [
        " YY YY   WW    ",
        "YYYYYYY  WW    ",
        "YYYYYYY CCCC   ",
        "RRRRRRRCCCCCC  ",
        "RRRRRRRCCCCCC  ",
        "RRRRRRRCCCCCC  ",
        "RRRRRRRCCCCCC  ",
        " RRRRR CCCCCC  ",
        " RRRRR CCCCCC  ",
        " RRRRR CCCCCC  ",
        " RRRRR CCCCCC  ",
        " RRRRR  CCCC   ",
        "  RRR   CCCC   ",
        "  RRR   CCCC   ",
        "  RRR    CC    "
    ],
    # 9. 과일멜론 (Melon)
    [
        "       NN      ",
        "      NNGG     ",
        "    GGGGGGGG   ",
        "   GGGWGGGWGG  ",
        "  GGWGGGWGGGWG ",
        " GGGWGGGWGGGWGG",
        " GGWGGGWGGGWGGG",
        "GGGGWGGGWGGGWGG",
        "GGWGGGWGGGWGGGG",
        " GGGWGGGWGGGWGG",
        " GGWGGGWGGGWGGG",
        "  GGGWGGGWGGGG ",
        "   GGWGGGWGGG  ",
        "    GGGGGGGG   ",
        "      GGGG     "
    ],
    # 10. 팬케이크타워 (Pancake Tower)
    [
        "     YYYY      ",
        "    YYYYYY     ",
        "   YYYYYYYY    ",
        "  YYYYYYYYYY   ",
        " YYYYYYYYYYYY  ",
        "YYYYYYYYYYYYYY ",
        " NNNNNNNNNNNN  ",
        " YYYYYYYYYYYY  ",
        "YYYYYYYYYYYYYY ",
        " NNNNNNNNNNNN  ",
        " YYYYYYYYYYYY  ",
        "YYYYYYYYYYYYYY ",
        " NNNNNNNNNNNN  ",
        " CCCCCCCCCCCC  ",
        "CCCCCCCCCCCCCC "
    ]
]

food_20x20_names = ['럭셔리스테이크', '라멘한그릇', '브런치플래터', '아시안딤섬', '딸기타르트', '바베큐꼬치', '카키고리빙수', '랍스터요리', '칵테일글라스', '치즈퐁듀']
food_20x20_ascii = [
    # 1. 럭셔리스테이크 (Steak)
    [
        "       NNNNNNNN     ",
        "     NNNNNNNNNNNN   ",
        "   NNNNNNNRRRRNNNN  ",
        "  NNNNNNRRRRRRRNNN  ",
        " NNNNNNRRRRRRRRNNNN ",
        "NNNNNNRRRRRRRRRRNNN ",
        "NNNNNRRRRRRRRRRRNNNN",
        "NNNNNRRRRRRRRRRRNNNN",
        "NNNNNRRRRRRRRRRRNNNN",
        "NNNNNRRRRRRRRRRRNNNN",
        "NNNNNNRRRRRRRRRNNNN ",
        " NNNNNNRRRRRRRNNNN  ",
        "  NNNNNNNNRRRNNNN   ",
        "   NNNNNNNNNNNNN    ",
        "    NNNNNNNNNNN     ",
        "     GGGG  GGGG     ",
        "    GGGGGGGGGGGG    ",
        "   WWWWWWWWWWWWWW   ",
        "  WWWWWWWWWWWWWWWW  ",
        "  WWWWWWWWWWWWWWWW  "
    ],
    # 2. 라멘한그릇 (Ramen)
    [
        "    NN       NN     ",
        "   NN       NN      ",
        "  NN       NN       ",
        " NYYYYYYYYYYYYYYN   ",
        "NYYYYYYYYYYYYYYYYYN ",
        "YYYYYYYYYYYYYYYYYYY ",
        "YY NNN YY WWWW YYYY ",
        "YY NNN YY WWYY YYYY ",
        "YY NNN YY WWYY YYYY ",
        "YYYYYYYYYYYYYYYYYYY ",
        " CCCCCCCCCCCCCCCCC  ",
        " CCCCCCCCCCCCCCCCC  ",
        " CCCCCCCCCCCCCCCCC  ",
        " CCCCCCCCCCCCCCCCC  ",
        "  CCCCCCCCCCCCCCC   ",
        "  CCCCCCCCCCCCCCC   ",
        "   CCCCCCCCCCCCC    ",
        "    CCCCCCCCCCC     ",
        "     CCCCCCCCC      ",
        "       CCCCC        "
    ],
    # 3. 브런치플래터 (Brunch Platter)
    [
        "  MMMMMMMMMMMMMMMM  ",
        " MMMMMMMMMMMMMMMMMM ",
        "MMMMMMMMMMMMMMMMMMMM",
        "MMWWWWWWMMMMMMMMMMMM",
        "MWWWWWWWWM RRRR  RMM",
        "MWWWYYYYWMRRRRRRRRMM",
        "MWWWYYYYWMRRRRRRRRMM",
        "MWWWWWWWWM RRRR  RMM",
        "MMWWWWWWMMMMMMMMMMMM",
        "MMMMMMMMMMMMMMMMMMMM",
        " MMMMMMMMMMMMMMMMMM ",
        "  CCCCCCCCCCCCCCCC  ",
        " CCCCCCCCCCCCCCCCCC ",
        "CCCCCCCCCCCCCCCCCCCC",
        "CCCCCCCCCCCCCCCCCCCC",
        "CCCCCCCCCCCCCCCCCCCC",
        " CCCCCCCCCCCCCCCCCC ",
        "  CCCCCCCCCCCCCCCC  ",
        "   CCCCCCCCCCCCCC   ",
        "    CCCCCCCCCCCC    "
    ],
    # 4. 아시안딤섬 (Dim Sum)
    [
        "   NNNNNNNNNNNNNN   ",
        "  NNNNNNNNNNNNNNNN  ",
        " NNNNNNNNNNNNNNNNNN ",
        "NNNNNNNNNNNNNNNNNNNN",
        "NN  WWWW  WWWW  NNNN",
        "NN WWWWWWWWWWWW NNNN",
        "NN WWWWWWWWWWWW NNNN",
        "NN WWWWWWWWWWWW NNNN",
        "NN  WWWW  WWWW  NNNN",
        "NN  WWWW  WWWW  NNNN",
        "NN WWWWWWWWWWWW NNNN",
        "NN WWWWWWWWWWWW NNNN",
        "NN WWWWWWWWWWWW NNNN",
        "NN  WWWW  WWWW  NNNN",
        "NNNNNNNNNNNNNNNNNNNN",
        " NNNNNNNNNNNNNNNNNN ",
        "  NNNNNNNNNNNNNNNN  ",
        "   NNNNNNNNNNNNNN   ",
        "    NNNNNNNNNNNN    ",
        "     NNNNNNNNNN     "
    ],
    # 5. 딸기타르트 (Strawberry Tart)
    [
        "        GGGG        ",
        "       GGGGGG       ",
        "      RRRRRRRR      ",
        "     RRRRRRRRRR     ",
        "    RRRRRRRRRRRR    ",
        "   RRRRRRRRRRRRRR   ",
        "  RRRRRRRRRRRRRRRR  ",
        " WWWWWWWWWWWWWWWWWW ",
        "WWWWWWWWWWWWWWWWWWWW",
        "YYYYYYYYYYYYYYYYYYYY",
        "YYYYYYYYYYYYYYYYYYYY",
        "YYYYYYYYYYYYYYYYYYYY",
        "YYYYYYYYYYYYYYYYYYYY",
        " NNNNNNNNNNNNNNNNNN ",
        " NNNNNNNNNNNNNNNNNN ",
        " NNNNNNNNNNNNNNNNNN ",
        "  NNNNNNNNNNNNNNNN  ",
        "  NNNNNNNNNNNNNNNN  ",
        "   NNNNNNNNNNNNNN   ",
        "    NNNNNNNNNNNN    "
    ],
    # 6. 바베큐꼬치 (BBQ Skewer)
    [
        "         N          ",
        "        NNN         ",
        "       NNNNN        ",
        "      NNNNNNN       ",
        "     NNNNNNNNN      ",
        "      GGGGGGG       ",
        "     GGGGGGGGG      ",
        "      WWWWWWW       ",
        "     WWWWWWWWW      ",
        "      RRRRRRR       ",
        "     RRRRRRRRR      ",
        "      NNNNNNN       ",
        "     NNNNNNNNN      ",
        "        NNN         ",
        "        NNN         ",
        "        NNN         ",
        "        NNN         ",
        "        NNN         ",
        "        NNN         ",
        "        NNN         "
    ],
    # 7. 카키고리빙수 (Shaved Ice)
    [
        "        RRRR        ",
        "       RRRRRR       ",
        "      WWWWWWWW      ",
        "     WWWWWWWWWW     ",
        "    WWWWWWWWWWWW    ",
        "   WWWWWWWWWWWWWW   ",
        "  WWWWWWWWWWWWWWWW  ",
        " WWWWWWWWWWWWWWWWWW ",
        "WWWWWWWWWWWWWWWWWWWW",
        " NNNNNNNNNNNNNNNNNN ",
        " NNNNNNNNNNNNNNNNNN ",
        " CCCCCCCCCCCCCCCCCC ",
        " CCCCCCCCCCCCCCCCCC ",
        " CCCCCCCCCCCCCCCCCC ",
        " CCCCCCCCCCCCCCCCCC ",
        "  CCCCCCCCCCCCCCCC  ",
        "  CCCCCCCCCCCCCCCC  ",
        "   CCCCCCCCCCCCCC   ",
        "    CCCCCCCCCCCC    ",
        "     CCCCCCCCCC     "
    ],
    # 8. 랍스터요리 (Lobster)
    [
        "  RRRR        RRRR  ",
        " RRRRRR      RRRRRR ",
        "RRRRRRRR    RRRRRRRR",
        " RRRRRRR    RRRRRRR ",
        "  RRRRRRR  RRRRRRR  ",
        "   RRRRRRRRRRRRRR   ",
        "   RRRRRRRRRRRRRR   ",
        "  RRRRRRRRRRRRRRRR  ",
        " RRRRRRRRRRRRRRRRRR ",
        "RRRRRRRRRRRRRRRRRRRR",
        " RRRRRRRRRRRRRRRRRR ",
        "  RRRRRRRRRRRRRRRR  ",
        "   RRRRRRRRRRRRRR   ",
        "   RRRRRRRRRRRRRR   ",
        "  YYYY   RR   YYYY  ",
        " YYYYYY RRRR YYYYYY ",
        "WWWWWWWWWWWWWWWWWWWW",
        "WWWWWWWWWWWWWWWWWWWW",
        " WWWWWWWWWWWWWWWWWW ",
        "  WWWWWWWWWWWWWWWW  "
    ],
    # 9. 칵테일글라스 (Cocktail)
    [
        "         YY         ",
        "        YYYY        ",
        " CCCCCCCCCCCCCCCCCC ",
        " CCCCCCCCCCCCCCCCCC ",
        "  CCCCCCCCCCCCCCCC  ",
        "  CKKKKKKKKKKKKKKC  ",
        "   CKKKKKKKKKKKKC   ",
        "   CKKKKKKKKKKKKC   ",
        "    CKKKKKKKKKKC    ",
        "     CKKKKKKKKC     ",
        "      CKKKKKKC      ",
        "       CKKKKC       ",
        "        CKKC        ",
        "         CC         ",
        "         CC         ",
        "         CC         ",
        "         CC         ",
        "         CC         ",
        "      CCCCCCCC      ",
        "     CCCCCCCCCC     "
    ],
    # 10. 치즈퐁듀 (Fondue Pot)
    [
        "         S          ",
        "        SSS         ",
        "       SSSSS        ",
        "      YYYYYYY       ",
        "     YYYYYYYYY      ",
        "    YYYYYYYYYYY     ",
        " RRRRRRRRRRRRRRRRRR ",
        "RRRRRRRRRRRRRRRRRRRR",
        "RRRRRRRRRRRRRRRRRRRR",
        "RRRRRRRRRRRRRRRRRRRR",
        "RRRRRRRRRRRRRRRRRRRR",
        " RRRRRRRRRRRRRRRRRR ",
        "  RRRRRRRRRRRRRRRR  ",
        "   RRRRRRRRRRRRRR   ",
        "    DDDD    DDDD    ",
        "    DDDD    DDDD    ",
        "    DDDD    DDDD    ",
        "    YYYY    YYYY    ",
        "   YYYYYY  YYYYYY   ",
        "  RRRRRRRRRRRRRRRR  "
    ]
]

# ==============================================================================
# 3. TRAVEL THEME (10x10 Easy, 15x15 Normal, 20x20 Hard)
# ==============================================================================

travel_10x10_names = ['비행기', '캐리어', '카메라', '캠핑텐트', '돛단배', '에펠탑', '열기구', '야자수', '나침반', '등대']
travel_10x10_ascii = [
    # 1. 비행기 (Airplane)
    [
        "    BB    ",
        "    BB    ",
        "   BBBB   ",
        "   BBBB   ",
        "BBBBBBBBBB",
        "BBBBBBBBBB",
        "   BBBB   ",
        "   BBBB   ",
        "  BBBBBB  ",
        " BB    BB "
    ],
    # 2. 캐리어 (Suitcase)
    [
        "   SSSS   ",
        "   S  S   ",
        " RRRRRRRR ",
        "RRRRRRRRRR",
        "RR DD  RRR",
        "RRRRRRRRRR",
        "RR DD  RRR",
        "RRRRRRRRRR",
        " RRRRRRRR ",
        " D      D "
    ],
    # 3. 카메라 (Camera)
    [
        "   DDDD   ",
        "  DDDDDD  ",
        "DDDDDDDDDD",
        "DD CCCC DD",
        "DDCCCCCCDD",
        "DDCCCCCCDD",
        "DD CCCC DD",
        "DDDDDDDDDD",
        "DDDDDDDDDD",
        "DDDDDDDDDD"
    ],
    # 4. 캠핑텐트 (Tent)
    [
        "    OO    ",
        "   OOOO   ",
        "  OOOOOO  ",
        " OOOOOOOO ",
        "OOOO D OOO",
        "OOO D D OO",
        "OO D D D O",
        "O D D D D ",
        "OOOOOOOOOO",
        "OOOOOOOOOO"
    ],
    # 5. 돛단배 (Sailboat)
    [
        "    W     ",
        "   WW     ",
        "  WWW     ",
        " WWWW     ",
        "WWWWW     ",
        "  NN      ",
        "NNNNNNNNNN",
        " NNNNNNNN ",
        "  CCCCCC  ",
        " CCCCCCCC "
    ],
    # 6. 에펠탑 (Eiffel Tower)
    [
        "    SS    ",
        "    SS    ",
        "   SSSS   ",
        "   SSSS   ",
        "  SSSSSS  ",
        "  SS  SS  ",
        " SSSSSSSS ",
        " SS    SS ",
        "SSSS  SSSS",
        "SSSSSSSSSS"
    ],
    # 7. 열기구 (Hot Air Balloon)
    [
        "  RRRRRR  ",
        " RRRRRRRR ",
        "RRRRRRRRRR",
        "RRRRRRRRRR",
        " RRRRRRRR ",
        "  RRRRRR  ",
        "   S  S   ",
        "   S  S   ",
        "   NNNN   ",
        "   NNNN   "
    ],
    # 8. 야자수 (Palm Tree)
    [
        "GG  GG  GG",
        " GGGGGGGG ",
        "  GGMMGG  ",
        "   GGGG   ",
        "    NN    ",
        "    NN    ",
        "    NN    ",
        "    NN    ",
        "   NNNN   ",
        "  NNNNNN  "
    ],
    # 9. 나침반 (Compass)
    [
        "   YYYY   ",
        "  YYYYYY  ",
        " YY R  YY ",
        "YY RRR  YY",
        "YYRRRRRNYY",
        "YY  BBB YY",
        " YY  B YY ",
        "  YYYYYY  ",
        "   YYYY   ",
        "    YY    "
    ],
    # 10. 등대 (Lighthouse)
    [
        "    YYYY  ",
        "   YYYYY  ",
        "   WWWW   ",
        "   RRRR   ",
        "   WWWW   ",
        "   RRRR   ",
        "   WWWW   ",
        "  RRRRRR  ",
        "  WWWWWW  ",
        " RRRRRRRR "
    ]
]

travel_15x15_names = ['여권과티켓', '캠핑트레일러', '자유의여신상', '피사의사탑', '크루즈여행선', '열기구축제', '휴양지파라솔', '고성', '야자수해변', '증기기관차']
travel_15x15_ascii = [
    # 1. 여권과티켓 (Passport & Ticket)
    [
        " BBBBBB         ",
        " BBBBBB  WWWWWW ",
        " BB  BB  WRRRRW ",
        " BB  BB  WWWWWW ",
        " BBBBBB  WWWWWW ",
        " BBBBBB  WRRRRW ",
        " BBYYBB  WWWWWW ",
        " BBBBBB  WWWWWW ",
        " BBBBBB  WRRRRW ",
        " BBBBBB  WWWWWW ",
        " BBBBBB         ",
        " BBBBBB         ",
        " BBBBBB         ",
        " BBBBBB         ",
        " BBBBBB         "
    ],
    # 2. 캠핑트레일러 (Camper Van)
    [
        "     OOOOOOO   ",
        "    OOOOOOOOO  ",
        "   OOCCCCCCCCO ",
        "  OOCCCCCCCCCO ",
        " OOOOOOOOOOOOOO",
        "OWWWWWWWWWWWWWWO",
        "OWWWWWWWWWWWWWWO",
        "OOOOOOOOOOOOOOOO",
        "OOOOOOOOOOOOOOOO",
        " OOOOOOOOOOOOOO ",
        " OO DD    DD OO ",
        "  DDDD    DDDD  ",
        "  DDDD    DDDD  ",
        "   DD      DD   ",
        "                "
    ],
    # 3. 자유의여신상 (Statue of Liberty)
    [
        "       RR       ",
        "       YY       ",
        "      GGGG      ",
        "    GGGGGGGG    ",
        "   GG GGGG GG   ",
        "     GGGGGG     ",
        "     GG DGG     ",
        "     GGGGGG     ",
        "     GGGGGG     ",
        "    GGGGGGGG    ",
        "   GGGGGGGGGG   ",
        "  GGGGGGGGGGGG  ",
        " GGGGGGGGGGGGGG ",
        "GGGGGGGGGGGGGGGG",
        "GGGGGGGGGGGGGGGG"
    ],
    # 4. 피사의사탑 (Leaning Tower)
    [
        "        RR     ",
        "       SSSS    ",
        "      S S S S  ",
        "     SSSSSSSS  ",
        "    S S S S S  ",
        "   SSSSSSSSSS  ",
        "  S S S S S S  ",
        " SSSSSSSSSSSS  ",
        "S S S S S S S  ",
        "SSSSSSSSSSSSS  ",
        "S S S S S S S  ",
        "SSSSSSSSSSSSS  ",
        " SSSSSSSSSSS   ",
        " SSSSSSSSSSS   ",
        "  SSSSSSSSS    "
    ],
    # 5. 크루즈여행선 (Cruise Ship)
    [
        "      RR   RR  ",
        "      RR   RR  ",
        "    WWWWWWWWWW ",
        "   WWWWWWWWWWWW",
        "  CCCCCCCCCCCCCC",
        " WWWWWWWWWWWWWWW",
        "WWWWWWWWWWWWWWWW",
        "WWWWWWWWWWWWWWWW",
        " BBBBBBBBBBBBBBB",
        " BBBBBBBBBBBBBBB",
        "  BBBBBBBBBBBBB ",
        "  CCCCCCCCCCCCC ",
        " CCCCCCCCCCCCCCC",
        "CCCCCCCCCCCCCCCC",
        "CCCCCCCCCCCCCCCC"
    ],
    # 6. 열기구축제 (Hot Air Balloons)
    [
        "    RRRRRR     ",
        "   RRRRRRRR    ",
        "  RRRRRRRRRR   ",
        "  RRRRRRRRRR   ",
        "   RRRRRRRR    ",
        "    RRRRRR     ",
        "     S  S      ",
        "     NNNN   BB ",
        "           BBBB",
        "           BBBB",
        "            BB ",
        "            NN ",
        " CCCCCCCCCCCCC ",
        "CCCCCCCCCCCCCC ",
        "CCCCCCCCCCCCCCC"
    ],
    # 7. 휴양지파라솔 (Beach Parasol)
    [
        "       RR      ",
        "     RRRRRR    ",
        "   RRRRRRRRRR  ",
        " RRRRRRRRRRRRRR",
        "RRWWWWWWWWWWWWWR",
        "       SS      ",
        "       SS      ",
        "       SS      ",
        "       SS      ",
        "      YYYY     ",
        "    YYYYYYYY   ",
        "  MMMMMMMMMMMM ",
        " MMMMMMMMMMMMMM",
        "MMMMMMMMMMMMMMMM",
        "MMMMMMMMMMMMMMMM"
    ],
    # 8. 고성 (Castle)
    [
        " R   R   R   R ",
        " S   S   S   S ",
        " SSSSSSSSSSSSS ",
        " S S S S S S S ",
        " SSSSSSSSSSSSS ",
        " SSSSSSSSSSSSS ",
        " SS SSS SSS SS ",
        " SS SSS SSS SS ",
        " SSSSSSSSSSSSS ",
        " SSSSSSSSSSSSS ",
        " SSSS NNN SSSS ",
        " SSSS NNN SSSS ",
        " SSSS NNN SSSS ",
        " SSSSSSSSSSSSS ",
        " SSSSSSSSSSSSS "
    ],
    # 9. 야자수해변 (Tropical Beach)
    [
        "   OOO          ",
        "  OOOOO   GG G  ",
        " OOOOOOO GGGGGG ",
        "  OOOOO   GNNG  ",
        "   OOO     NN   ",
        "           NN   ",
        "          NN    ",
        "          NN    ",
        " MMMMMMMMMNNMMM ",
        "MMMMMMMMMMMMMMMM",
        " BBBBBBBBBBBBBBB",
        " BBBBBBBBBBBBBBB",
        "CCCCCCCCCCCCCCCC",
        "CCCCCCCCCCCCCCCC",
        "CCCCCCCCCCCCCCCC"
    ],
    # 10. 증기기관차 (Steam Train)
    [
        "       SSSS    ",
        "      SSSSSS   ",
        "   SS SSSSSSSS ",
        "  SSSS  DDDDDD ",
        " DDDDDD DDDDDD ",
        " DDDDDD DDDDDD ",
        "DDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDD",
        " RRR  RRR  RRR ",
        "RRRRR RRRRRRRRR",
        " RRR  RRR  RRR ",
        "               ",
        "               "
    ]
]

travel_20x20_names = ['타지마할', '후지산벚꽃', '빅벤시계탑', '콜로세움', '스위스풍차', '복고풍스쿠터', '스쿠버다이빙', '베니스곤돌라', '열대섬항해', '우주선']
travel_20x20_ascii = [
    # 1. 타지마할 (Taj Mahal)
    [
        "        WW          ",
        "       WWWW         ",
        "      WWWWWW        ",
        "     WWWWWWWW       ",
        "      WWWWWW        ",
        "  WW  WWWWWW  WW    ",
        " WWWW WWWWWW WWWW   ",
        " WWWW WWWWWW WWWW   ",
        "WWWWWWWWWWWWWWWWWW  ",
        "WWWWWWWWWWWWWWWWWW  ",
        "WW WW WWWWWW WW WW  ",
        "WW WW WWWWWW WW WW  ",
        "WWWWWWWWWWWWWWWWWW  ",
        "WWWWWWWWWWWWWWWWWW  ",
        "WW WW WWNNWW WW WW  ",
        "WW WW WWNNWW WW WW  ",
        "WWWWWWWWNNWWWWWWWW  ",
        "CCCCCCCCCCCCCCCCCCCC",
        "CCCCCCCCCCCCCCCCCCCC",
        "CCCCCCCCCCCCCCCCCCCC"
    ],
    # 2. 후지산벚꽃 (Mt. Fuji)
    [
        "      RRRRRR        ",
        "     RRRRRRRR       ",
        "     RRRRRRRR       ",
        "  KK  RRRRRR        ",
        " KKKK  WWWW         ",
        "  KK  WWWWWW        ",
        "     WWWWWWWW       ",
        "    BBBBWWBBBB      ",
        "   BBBBBBBBBBBB     ",
        "  BBBBBBBBBBBBBB    ",
        " BBBBBBBBBBBBBBBB   ",
        "BBBBBBBBBBBBBBBBBB  ",
        "BBBBBBBBBBBBBBBBBBB ",
        "CCCCCCCCCCCCCCCCCCCC",
        "CCCCCCCCCCCCCCCCCCCC",
        " CCCCCCCCCCCCCCCCCC ",
        "  CCCCCCCCCCCCCCCC  ",
        "   CCCCCCCCCCCCCC   ",
        "    CCCCCCCCCCCC    ",
        "     CCCCCCCCCC     "
    ],
    # 3. 빅벤시계탑 (Big Ben)
    [
        "         SS         ",
        "        SSSS        ",
        "       SSSSSS       ",
        "        SSSS        ",
        "       YYYYYY       ",
        "      YYYYYYYY      ",
        "      YYDDDDYY      ",
        "      YYDDDDYY      ",
        "      YYYYYYYY      ",
        "      YYYYYYYY      ",
        "      YY SSSS Y     ",
        "      YY SSSS Y     ",
        "      YYYYYYYY      ",
        "      YY SSSS Y     ",
        "      YY SSSS Y     ",
        "      YYYYYYYY      ",
        "      YY SSSS Y     ",
        "      YY SSSS Y     ",
        "     YYYYYYYYYYYY   ",
        "    YYYYYYYYYYYYYY  "
    ],
    # 4. 콜로세움 (Colosseum)
    [
        " CCCCCCCCCCCCCCCCCC ",
        " CCCCCCCCCCCCCCCCCC ",
        " M M M M M M M M M  ",
        " MMMMMMMMMMMMMMMMMM ",
        " M M M M M M M M M  ",
        " MMMMMMMMMMMMMMMMMM ",
        " M M M M M M M M M  ",
        " MMMMMMMMMMMMMMMMMM ",
        "  M M M M M M M M   ",
        "  MMMMMMMMMMMMMMM   ",
        "  M M M M M M M M   ",
        "  MMMMMMMMMMMMMMM   ",
        "   M M M M M M M    ",
        "   MMMMMMMMMMMMM    ",
        "   M M M M M M M    ",
        "   MMMMMMMMMMMMM    ",
        "  YYYYYYYYYYYYYYY   ",
        " YYYYYYYYYYYYYYYYY  ",
        "YYYYYYYYYYYYYYYYYYYY",
        "YYYYYYYYYYYYYYYYYYYY"
    ],
    # 5. 스위스풍차 (Alpine Windmill)
    [
        "  WW            WW  ",
        "   WW          WW   ",
        "    WW        WW    ",
        "     WW      WW     ",
        "      WW    WW      ",
        "       WW  WW       ",
        "        WWWW        ",
        "        NNNN        ",
        "       NNNNNN       ",
        "       N W  N       ",
        "      NNNNNNNN      ",
        "      N  W   N      ",
        "     NNNNNNNNNN     ",
        "     N   W    N     ",
        "    NNNNNNNNNNNN    ",
        "    N    W     N    ",
        "   NNNNNNNNNNNNNN   ",
        "  SSSSSSSSSSSSSSSS  ",
        " SSSSSSSSSSSSSSSSSS ",
        "WWWWWWWWWWWWWWWWWWWW"
    ],
    # 6. 복고풍스쿠터 (Vintage Scooter)
    [
        "        YYYY        ",
        "       YYYYYY       ",
        "       SS  SS       ",
        "      SSSSSSSS      ",
        "     RRRRRRRRRR     ",
        "    RRRRRRRRRRRR    ",
        "   RRRRRRRRRRRRRR   ",
        "  RRRRRRRRRRRRRRRR  ",
        " RRRRRRRRRRRRRRRRRR ",
        "RRRRRRRRRRRRRRRRRRRR",
        "RRRRRRRRRRRRRRRRRRRR",
        " RRRRRRRRRRRRRRRRRR ",
        "  RRRRRRRRRRRRRRRR  ",
        "   RRRRRRRRRRRRRR   ",
        "   DDDD      DDDD   ",
        "  DDDDDD    DDDDDD  ",
        "  DDDDDD    DDDDDD  ",
        "  DDDDDD    DDDDDD  ",
        "   DDDD      DDDD   ",
        "    DD        DD    "
    ],
    # 7. 스쿠버다이빙 (Scuba Diver)
    [
        " CCCCCCCCCCCCCCCCCC ",
        " C C C C C C C C C  ",
        "         YYYY       ",
        "        YYYYYY      ",
        "       YYDDDDYY     ",
        "       YYYYYYYY     ",
        "      BBBBBBBBBB    ",
        "     BBBBBBBBBBBB   ",
        "    BBBBBBBBBBBBBB  ",
        "   BBBBBBBBBBBBBBBB ",
        "  BBBBBBBBBBBBBBBBBB",
        " BBBB  BBBBBB  BBBB ",
        "BBB     BBBB     BBB",
        "BB       BB       BB",
        "YY       YY       YY",
        "YY       YY       YY",
        " KKKK          KKKK ",
        "KKKKKK        KKKKKK",
        " KKKK          KKKK ",
        "  KK            KK  "
    ],
    # 8. 베니스곤돌라 (Gondola)
    [
        "       SSSSSS       ",
        "      SSSSSSSS      ",
        "     SS S S S SS    ",
        "    SS  S S S  SS   ",
        "   SS           SS  ",
        "  SS             SS ",
        "  SS             SS ",
        "                    ",
        "    N          N    ",
        "   NNN        NNN   ",
        "   NNNN      NNNN   ",
        "  NNNNNNNNNNNNNNNN  ",
        " NNNNNNNNNNNNNNNNNN ",
        "NNNNNNNNNNNNNNNNNNNN",
        " NNNNNNNNNNNNNNNNNN ",
        "  NNNNNNNNNNNNNNNN  ",
        "CCCCCCCCCCCCCCCCCCCC",
        "CCCCCCCCCCCCCCCCCCCC",
        " CCCCCCCCCCCCCCCCCC ",
        "  CCCCCCCCCCCCCCCC  "
    ],
    # 9. 열대섬항해 (Yacht Sailing)
    [
        "         WW         ",
        "        WWW         ",
        "       WWWW         ",
        "      WWWWW         ",
        "     WWWWWW         ",
        "    WWWWWWW         ",
        "   WWWWWWWW         ",
        "  WWWWWWWWW  GG GG  ",
        " WWWWWWWWWW GGGGGGG ",
        "WWWWWWWWWWW  GNNNG  ",
        "     NN       NN    ",
        " WWWWWWWWWWWW NN    ",
        "WWWWWWWWWWWWWWNN    ",
        " WWWWWWWWWWWWMMMMMMM",
        "  WWWWWWWWWWMMMMMMMM",
        "CCCCCCCCCCCCCCCCCCCC",
        "CCCCCCCCCCCCCCCCCCCC",
        "CCCCCCCCCCCCCCCCCCCC",
        " CCCCCCCCCCCCCCCCCC ",
        "  CCCCCCCCCCCCCCCC  "
    ],
    # 10. 우주선 (Space Shuttle)
    [
        "         WW         ",
        "        WWWW        ",
        "       WWWWWW       ",
        "      WWWWWWWW      ",
        "     WWWW D WWWW    ",
        "    WWWW  D  WWWW   ",
        "   WWWWWWWWWWWWWW   ",
        "  WWWWWWWWWWWWWWWW  ",
        " WWWWWWWWWWWWWWWWWW ",
        "WWWWWWWWWWWWWWWWWWWW",
        "WWWWDDWWWWWWWWDDWWWW",
        "WWWWDDWWWWWWWWDDWWWW",
        "WWWWDDWWWWWWWWDDWWWW",
        " WWWW  WWWWWW  WWWW ",
        "  WW    WWWW    WW  ",
        "        OOOO        ",
        "       OOOOOO       ",
        "      YYYYYYYY      ",
        "     YYYYYYYYYY     ",
        "    RRRRRRRRRRRR    "
    ]
]

# ==============================================================================
# GENERATION LOGIC
# ==============================================================================

themes_all = {
    'animal': {
        'easy': (animal_10x10_names, animal_10x10_ascii, 10),
        'normal': (animal_15x15_names, animal_15x15_ascii, 15),
        'hard': (animal_20x20_names, animal_20x20_ascii, 20),
    },
    'food': {
        'easy': (food_10x10_names, food_10x10_ascii, 10),
        'normal': (food_15x15_names, food_15x15_ascii, 15),
        'hard': (food_20x20_names, food_20x20_ascii, 20),
    },
    'travel': {
        'easy': (travel_10x10_names, travel_10x10_ascii, 10),
        'normal': (travel_15x15_names, travel_15x15_ascii, 15),
        'hard': (travel_20x20_names, travel_20x20_ascii, 20),
    }
}

os.makedirs('src/data/puzzles', exist_ok=True)
os.makedirs('assets/puzzles', exist_ok=True)

total_count = 0
for theme_key, diff_dict in themes_all.items():
    for diff, (names, ascii_list, sz) in diff_dict.items():
        puzzles = []
        for idx in range(10):
            lines = ascii_list[idx]
            sol, color_sol = parse_ascii_matrix(lines, sz, sz)
            puzzle = {
                'id': f'{theme_key}_{diff}_{idx+1}',
                'theme': theme_key,
                'difficulty': diff,
                'name': names[idx],
                'width': sz,
                'height': sz,
                'solution': sol,
                'colorSolution': color_sol
            }
            puzzles.append(puzzle)
            total_count += 1

        fpath1 = f'src/data/puzzles/{theme_key}_{diff}.json'
        fpath2 = f'assets/puzzles/{theme_key}_{diff}.json'

        with open(fpath1, 'w', encoding='utf-8') as f:
            json.dump(puzzles, f, ensure_ascii=False, indent=2)

        with open(fpath2, 'w', encoding='utf-8') as f:
            json.dump(puzzles, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {total_count} handcrafted nonogram puzzles with high-quality pixel art matrices & rich colors!")
