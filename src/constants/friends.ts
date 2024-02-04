/**
 * TODO: legacy definition from old logdown about.md, refactor with readable structure and drop html usage
 */
type Friend = [nick: string, githubId: string, link: string | undefined, descriptionHtml: string, metOffline?: boolean]

const friends: Friend[] = [
    ['cold', 'coldnight', 'https://www.linuxzen.com/', '最开始折腾博客给予我很多支持的 cold 大大。'],
    ['Lazy Mind', 'mapleray', 'https://lazymind.me/', '低调沉稳的学长。'],
    ['Ayase-252', 'Ayase-252', 'https://ayase.moe/', '可爱的自动化<del>LL神教徒</del>学长。'],
    ['飞狐', 'lucumt', 'https://lucumt.info/', '活动于帝都的程序猿前辈。'],
    [
        'FarseerFc',
        'farseerfc',
        'https://farseerfc.me/',
        '<del>远见 RFC，爱复习</del>；经验丰富的 Arch Linux TU，人生赢家 fc 前辈。',
        true,
    ],
    ['EAGzzyCSL', 'EAGzzyCSL', 'https://eagzzycsl.github.io/', '同门室友，安静敲代码的男子。', true],
    [
        'Lyken Syu',
        'Lyken17',
        'https://lzhu.me/',
        '想要追上我们仍未知道那个夏天要以多快的速度前进才能企及的魔法少年力霸是否搞错了什么。',
        true,
    ],
    [
        'Phoenix Nemo',
        'phoenixlzx',
        'https://blog.phoenixlzx.com/',
        '好吃的凤凰卷，绘触（看头像），而且还是个好人 (′ʘ⌄ʘ‵)',
    ],
    [
        'Felix Yan',
        'felixonmars',
        'https://felixc.at/',
        '火星猫，肥猫；带领众 Archer <del>一起吞并全太阳系发行版</del>的肥猫领袖。',
        true,
    ],
    ['acgtyrant', 'acgtyrant', 'http://acgtyrant.com', '御宅暴君；一本正经的萌。', true],
    [
        'quininer kel',
        'quininer',
        'https://quininer.github.io/',
        '奎尼；掌握不管多拗口的昵称都能取一个顺口<del>又鬼畜</del>的别名的魔法。',
        true,
    ],
    ['CUI Hao', 'cuihaoleo', 'https://cvhc.cc/', '催土豪；有爱的 Arch Linux 中文社区源的维护者。'],
    [
        '谷月轩',
        'SilverRainZ',
        'https://silverrainz.me/',
        'SilverRainZ；又会画画又会写内核又会弹琴煮饭很香的辣酱。',
        true,
    ],
    ['ヨイツの賢狼ホロ', 'KenOokamiHoro', 'https://blog.yoitsu.moe/', '抱一下萌狼尾巴。', true],
    ['依云', 'lilydjwg', 'https://blog.lilydjwg.me/', '百合仙子；掌握各种技术经验丰富的仙子前辈。', true],
    ['謝宇恆', 'xieyuheng', 'https://xieyuheng.github.io/', 'xyh，小妖狐，小药壶；语言设计之小药壶。'],
    ['夏娜(VOID001)', 'VOID001', 'https://void-shana.moe/', '向着内核大嗨卡前进的夏娜君。'],
    [
        'metal A-wing',
        'a-wing',
        'https://a-wing.top/',
        '新一；<del>另外一位夏娜</del>，动手和行动力很强的 ArchCN 社群的小伙伴。',
    ],
    ['惠狐', 'MarvelousBlack', 'https://blog.megumifox.com/', '糊糊；糊糊怎么叫（'],
    ['DuckSoft', 'DuckSoft', 'https://www.ducksoft.site/', '各方面都很厉害的可爱鸭鸭'],
    ['千千', 'wwyqianqian', 'https://wwyqianqian.github.io/', '据说很美味的千千'],
    ['Leo Shen', 'szclsya', 'https://szclsya.me/', '音乐真是开心！'],
    ['比特客栈', 'bitinn', 'https://bitinn.net/', '精通魔理沙的店长'],
    ['NovaDNG', 'NovaDNG', 'https://novadng.studio/', '观星者'],
    [
        'NoirGif',
        'noirgif',
        'https://nir.moe/',
        '<del>黑动图</del>（奎尼道）；同为折腾博客 n 次的 Arch CN 社群结识的小伙伴，称呼所有人都以「老」开头，然后我真的老了６Д９',
    ],
    ['Pink Champagne', 'PinkChampagne17', 'https://pinkchampagne.moe/', '萌萌二次元大表哥，生料王启蒙者'],

    /**
     * FIXME: broken links
     */
    // ['星光', 'starlightme', undefined /* 'http://jimmy66.com/'*/, '在现代魔法研究协会相遇的闪闪的星光。'],
    // ['晓风', 'dongdxf', undefined /* 'http://www.dongxf.com/'*/, '最开始折腾博客认识的 Pelican 同伴。'],
]

export default friends
