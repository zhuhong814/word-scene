const w=(word,ipa,pos,meaning,definition,memory,example,translation)=>({word,ipa,pos,meaning,definition,memory,example,translation});
export const lessons=[
  {id:'city',title:'城市里的小小绿洲',english:'A little green in the city',category:'城市与环境',scene:'和朋友聊聊，你理想中的社区。',color:'green',words:[
    w('accessible','/əkˈsesəbl/','adj.','可到达的；易使用的','Easy to reach or use.','搭配记忆：accessible to everyone，想象一座每个人都能进入的公园。','The park is accessible to people who use wheelchairs.','这座公园方便使用轮椅的人进入。'),
    w('community','/kəˈmjuːnəti/','n.','社区；群体','People living in one area or sharing an interest.','场景记忆：把邻居、咖啡店老板和公园里的朋友连成一个 community。','The local community helped to plant the trees.','当地社区的居民帮忙种了这些树。'),
    w('benefit','/ˈbenɪfɪt/','n. / v.','益处；使受益','An advantage; to help someone or improve something.','搭配记忆：a benefit of… 是“……的好处”；benefit from… 是“从……中受益”。','One benefit of walking is that it reduces stress.','步行的一个好处是可以减轻压力。'),
    w('sustainable','/səˈsteɪnəbl/','adj.','可持续的','Able to continue without using up resources.','联想 sustain（维持）+ -able（能够）：能够长久维持下去。','Cycling is a sustainable way to travel around the city.','骑自行车是一种可持续的城市出行方式。'),
    w('transform','/trænsˈfɔːm/','v.','改变；使转变','To change something greatly.','联想 trans-（变化）+ form（形态）：让一块空地换一种模样。','A few trees can transform an empty street.','几棵树就能让一条空荡荡的街道大变样。')
  ],paragraphs:[
    ['On Saturday, Maya takes her friend Leo to a small park near her flat. The entrance is wide and the paths are flat, so the park is accessible to wheelchair users and parents with pushchairs. It is also free to enter.','周六，Maya 带朋友 Leo 去她家附近的小公园。入口宽敞，道路平坦，因此使用轮椅的人和推婴儿车的家长都能方便地进入，而且入园免费。'],
    ['They meet a group of neighbours planting flowers. The community looks after the garden together. Leo usually spends his weekends indoors, but today he feels relaxed. “That is one benefit of having green space nearby,” Maya says. They decide to return next weekend and help with the garden.','他们遇到一群正在种花的邻居。社区居民一起照料花园。Leo 平时周末总待在室内，今天却感到很放松。“这就是住处附近有绿地的一个好处。”Maya 说。他们决定下周末再来帮忙。']
  ],extras:[['They collect rainwater for the plants, a sustainable choice that saves tap water.','他们收集雨水来浇灌植物，这种可持续的做法可以节约自来水。'],['Leo is surprised that a shared garden can transform the way neighbours spend time together.','Leo 很惊讶，一座共享花园竟能改变邻居们相处的方式。']],questions:[
    {q:'What makes the park accessible to wheelchair users?',options:['Its wide entrance and flat paths.','Its colourful flowers.','Its weekend events.'],answer:0,why:'第一段直接提到 wide entrance 和 flat paths，它们让轮椅使用者能方便进入。'},
    {q:'Why do Maya and Leo decide to return?',options:['To buy flowers.','To help look after the garden.','To build a new flat.'],answer:1,why:'第二段最后一句说明，他们打算下周末再来帮忙照料花园。'}
  ],prompt:'Describe a place in your neighbourhood that you enjoy visiting.',starter:'One place I enjoy is… It is accessible because… One benefit is…'},
  {id:'cafe',title:'从一杯咖啡开始',english:'More than a cup of coffee',category:'消费与生活',scene:'和店员聊聊，你会如何选择一家咖啡馆。',color:'clay',words:[
    w('affordable','/əˈfɔːdəbl/','adj.','负担得起的','Not too expensive.','afford 是“付得起”；affordable 就是价格在你的预算以内。','This café offers affordable lunches for students.','这家咖啡馆为学生提供价格实惠的午餐。'),
    w('recommend','/ˌrekəˈmend/','v.','推荐；建议','To suggest that someone or something is a good choice.','记住 recommend doing：recommend trying the soup，推荐尝尝汤。','Could you recommend a drink without caffeine?','你能推荐一款不含咖啡因的饮品吗？'),
    w('alternative','/ɔːlˈtɜːnətɪv/','n. / adj.','替代选择；可替代的','Another option that you can choose.','搭配记忆：an alternative to coffee，咖啡以外的另一个选择。','Tea is a good alternative to coffee.','茶是替代咖啡的一个好选择。'),
    w('convenient','/kənˈviːniənt/','adj.','方便的；便利的','Suitable and easy for your needs.','场景记忆：下楼就能买早餐，地点对你很 convenient。','The café is in a convenient location near the station.','这家咖啡馆的位置很方便，就在车站附近。'),
    w('preference','/ˈprefrəns/','n.','偏好；偏爱','A feeling of liking one thing more than another.','prefer 是“更喜欢”；preference 是这种偏好的名词形式。','Do you have a preference for hot or cold drinks?','你更喜欢热饮还是冷饮？')
  ],paragraphs:[
    ['Nina and Sam need a place to study after class. They find a small café with affordable drinks and a quiet table by the window. Nina asks the owner to recommend something warm. She wants to avoid coffee because she hopes to sleep early.','Nina 和 Sam 下课后需要找个学习的地方。他们发现一家小咖啡馆，饮品价格实惠，窗边还有一张安静的桌子。Nina 请店主推荐热饮。她想早点睡觉，所以不想喝咖啡。'],
    ['The owner suggests mint tea as an alternative. Sam orders the same drink, and they share a sandwich. Before opening their books, they agree to put their phones away for half an hour. The café becomes their favourite place to prepare for the next class.','店主建议用薄荷茶替代。Sam 也点了同样的饮品，他们还分享了一份三明治。翻开书之前，两人约好把手机收起来半小时。这家咖啡馆成了他们预习下一节课的最爱地点。']
  ],extras:[['The location is convenient because they can walk there from college in five minutes.','这里的位置很方便，从学校步行五分钟就能到。'],['Although Nina has a preference for tea, Sam usually chooses coffee when he studies alone.','虽然 Nina 偏爱茶，但 Sam 独自学习时通常选择咖啡。']],questions:[
    {q:'Why does Nina avoid coffee?',options:['It is too expensive.','She wants to sleep early.','The café has none.'],answer:1,why:'第一段说明她希望早点睡觉，因此不想喝咖啡。'},
    {q:'What do the friends agree to do before studying?',options:['Order another sandwich.','Leave the café.','Put their phones away.'],answer:2,why:'第二段中，他们决定先收起手机半小时，再开始学习。'}
  ],prompt:'Describe a café or restaurant you like.',starter:'I would recommend… It is affordable, and… A good alternative is…'},
  {id:'campus',title:'找到你的学习节奏',english:'Finding your own rhythm',category:'教育与成长',scene:'和同学讨论，怎样让一次小组作业更顺利。',color:'blue',words:[
    w('collaborate','/kəˈlæbəreɪt/','v.','合作；协作','To work with others on a shared task.','固定搭配 collaborate with someone on a project：和某人合作一个项目。','We collaborate on a presentation about city life.','我们合作准备一场关于城市生活的演讲。'),
    w('resource','/rɪˈsɔːs/','n.','资源；资料','Something useful that helps you achieve a goal.','把图书、时间、老师的建议都想成可以帮助你完成任务的 resource。','The library is a useful resource for our research.','图书馆是我们研究时的有用资源。'),
    w('confidence','/ˈkɒnfɪdəns/','n.','信心；自信','A belief in your own ability.','confident 是“有信心的”；confidence 是“信心”。记住 build confidence。','Practising with friends helps me build confidence.','和朋友练习能帮助我建立信心。'),
    w('approach','/əˈprəʊtʃ/','n. / v.','方法；接近','A way of doing something; to move closer.','把 approach 想成走向目标的一条路：an approach to learning。','We need a different approach to this problem.','我们需要换一种方法来解决这个问题。'),
    w('participate','/pɑːˈtɪsɪpeɪt/','v.','参与；参加','To take part in an activity.','抓住 part（部分）来联想“成为活动的一部分”；搭配 participate in。','Every student can participate in the discussion.','每个学生都可以参与讨论。')
  ],paragraphs:[
    ['Three students decide to collaborate on a presentation about public transport. At first, they all search for the same information. After a confusing meeting, they divide the work: one interviews passengers, one checks timetables, and one prepares the slides.','三名学生决定合作准备一场关于公共交通的演讲。起初，他们都在查找同样的信息。开了一次混乱的会议后，他们分了工：一人采访乘客，一人查阅时刻表，一人制作幻灯片。'],
    ['Their teacher suggests using the local library as a resource. There, they find a report with useful facts. Before the presentation, they practise together and give each other feedback. This helps a shy member gain confidence. By Friday, everyone is ready to speak about their own part.','老师建议把当地图书馆当作资料来源。他们在那里找到了一份包含有用事实的报告。演讲前，大家一起练习，并互相反馈。这帮助一位害羞的成员建立了信心。到了周五，每个人都准备好介绍自己的部分了。']
  ],extras:[['Their new approach saves time because each person has a clear task.','他们的新方法节省了时间，因为每个人都有明确的任务。'],['They also invite the audience to participate by asking questions at the end.','他们还邀请观众在最后提问，参与进来。']],questions:[
    {q:'What was the first problem the group faced?',options:['They searched for the same information.','They could not find a classroom.','Their teacher cancelled the task.'],answer:0,why:'第一段说明他们最初都在搜索相同的信息，工作重复。'},
    {q:'What helps the shy member gain confidence?',options:['Skipping the presentation.','Working alone.','Practising and getting feedback.'],answer:2,why:'第二段说明一起练习和相互反馈帮助害羞的成员建立了信心。'}
  ],prompt:'Describe a time you worked with other people.',starter:'We decided to collaborate on… A useful resource was… It gave me confidence to…'},
  {id:'travel',title:'下一站，慢一点',english:'Taking the slower route',category:'出行与旅行',scene:'和旅伴商量一次周末旅行。',color:'green',words:[
    w('destination','/ˌdestɪˈneɪʃn/','n.','目的地','The place where someone is going.','想象车票上的终点站：它就是你的 destination。','Our destination is a small town by the sea.','我们的目的地是一座海边小镇。'),
    w('flexible','/ˈfleksəbl/','adj.','灵活的；可调整的','Able to change to suit a new situation.','联想可以弯曲的尺子：flexible plans 也能“弯一弯”，随情况调整。','Our travel dates are flexible.','我们的旅行日期可以调整。'),
    w('explore','/ɪkˈsplɔː/','v.','探索；探访','To travel around a place to learn about it.','搭配记忆：explore a city，不只是经过，而是走进街巷去了解它。','We want to explore the old part of the town.','我们想探访小镇的老城区。'),
    w('budget','/ˈbʌdʒɪt/','n.','预算','The amount of money available for a purpose.','把 budget 想成旅行钱包的上限；on a budget 表示预算有限。','We have a small budget for this trip.','我们这次旅行的预算不多。'),
    w('experience','/ɪkˈspɪəriəns/','n. / v.','经历；体验；经验','Something that happens to you; knowledge gained by doing.','一次经历是 an experience；积累的经验是 experience，通常不可数。','Travelling by boat was a memorable experience.','乘船旅行是一次难忘的经历。')
  ],paragraphs:[
    ['Alex and Jo choose a seaside town as their weekend destination. They could drive, but they prefer the train because they can talk and enjoy the view. They keep their plans flexible: if it rains, they will visit a small museum instead of going to the beach.','Alex 和 Jo 选了一座海边小镇作为周末目的地。他们可以开车，但更喜欢坐火车，因为途中能聊天、欣赏风景。他们的计划很灵活：如果下雨，就去一家小博物馆，而不去海滩。'],
    ['When they arrive, the sun is shining. Rather than rushing to a famous attraction, they explore the old streets on foot. A shopkeeper tells them about a quiet path along the water. They follow it and find a beautiful place to eat their lunch. Neither of them checks the time.','到达时，阳光明媚。他们没有急着去著名景点，而是步行探索老街。一位店主告诉他们一条安静的水边小路。他们沿路走去，找到一处美丽的地方吃午餐。两个人都没看时间。']
  ],extras:[['Bringing lunch from home helps them stay within their budget.','从家里带午餐帮助他们把花费控制在预算以内。'],['For Jo, the best part of the experience is having time to notice small details.','对 Jo 来说，这次经历最棒的部分是有时间留意细微之处。']],questions:[
    {q:'What will they do if it rains?',options:['Cancel the trip.','Visit a museum.','Go swimming.'],answer:1,why:'第一段交代了雨天备用方案：去小博物馆。'},
    {q:'How do they discover the quiet path?',options:['A shopkeeper tells them about it.','They read a train timetable.','They follow a large tour group.'],answer:0,why:'第二段说明，是一位店主向他们介绍了这条小路。'}
  ],prompt:'Describe a trip you would like to take.',starter:'My ideal destination is… I would keep the plan flexible so that… I would love to explore…'},
  {id:'digital',title:'给生活一点离线时间',english:'A little time offline',category:'科技与生活',scene:'和室友约定一个不被手机打断的晚上。',color:'blue',words:[
    w('habit','/ˈhæbɪt/','n.','习惯','Something you do regularly, often without thinking.','搭配记忆：form a habit（养成习惯），break a habit（改掉习惯）。','Checking my phone before bed has become a habit.','睡前看手机已经成了我的习惯。'),
    w('reduce','/rɪˈdjuːs/','v.','减少；降低','To make something smaller in amount or size.','用对比记：increase 是增加，reduce 是减少；reduce screen time。','I want to reduce the time I spend online.','我想减少上网的时间。'),
    w('focus','/ˈfəʊkəs/','v. / n.','集中注意力；焦点','To give your attention to one thing.','想象相机对焦：focus on one task，把注意力对准一件事。','It is easier to focus when my phone is in another room.','手机放在另一个房间时，我更容易集中注意力。'),
    w('distraction','/dɪˈstrækʃn/','n.','使人分心的事物','Something that takes your attention away.','distract 是“使分心”；手机提示音就是一种 distraction。','Notifications can be a distraction during a conversation.','聊天时，通知提示可能让人分心。'),
    w('balance','/ˈbæləns/','n. / v.','平衡；兼顾','A suitable amount of different things; to keep things in proportion.','想象天平：a balance between work and rest，工作与休息之间的平衡。','She tries to balance study with time outdoors.','她努力兼顾学习和户外活动。')
  ],paragraphs:[
    ['Every evening, Ben picks up his phone while his dinner is cooking. It has become a habit, and he often continues scrolling after the food is ready. His flatmate Ella suggests a small experiment: leave both phones on a shelf during dinner for one week.','每天晚上，Ben 做饭时都会拿起手机。这已成为习惯，饭做好后他还经常继续刷手机。室友 Ella 提议做个小实验：一周之内，吃晚饭时都把两人的手机放在架子上。'],
    ['They do not want to stop using technology. They simply want to reduce unnecessary screen time and focus on their conversation. On the first evening, Ben reaches for his pocket twice. By the fourth evening, he forgets about his phone and asks Ella about her new course instead.','他们并不想停止使用科技，只是希望减少不必要的屏幕时间，把注意力放在交谈上。第一个晚上，Ben 两次伸手摸口袋。到了第四个晚上，他忘了手机，转而问 Ella 新课程的情况。']
  ],extras:[['Without the distraction of notifications, they listen more carefully to each other.','没有了通知的干扰，他们更认真地倾听对方。'],['For them, a healthy balance means making room for both online and offline life.','对他们来说，健康的平衡意味着同时为线上和线下生活留出空间。']],questions:[
    {q:'What experiment do the flatmates try?',options:['Buy new phones.','Avoid technology for a year.','Leave phones on a shelf during dinner.'],answer:2,why:'第一段明确说，实验是在一周的晚饭时间把手机放到架子上。'},
    {q:'What changes by the fourth evening?',options:['Ben focuses more on Ella.','Ben stops cooking.','Ella leaves the flat.'],answer:0,why:'第四个晚上，Ben 不再想着手机，而是询问 Ella 的新课程。'}
  ],prompt:'Describe a habit you would like to change.',starter:'One habit I would like to change is… I want to reduce… so I can focus on…'},
  {id:'food',title:'把新鲜带回餐桌',english:'From the market to the table',category:'饮食与健康',scene:'和朋友去市场，为晚餐挑选食材。',color:'clay',words:[
    w('variety','/vəˈraɪəti/','n.','多样性；不同种类','A range of different things.','记住 a variety of vegetables：不是单一蔬菜，而是各种各样的蔬菜。','The market sells a variety of fresh vegetables.','市场出售各种新鲜蔬菜。'),
    w('local','/ˈləʊkl/','adj.','当地的；本地的','Connected with the area where you live.','从 local market 到 local farmers，把词和你住的地方联系起来。','We buy apples from local farmers.','我们从当地农民那里购买苹果。'),
    w('nutrition','/njuˈtrɪʃn/','n.','营养','The food and nutrients needed for health and growth.','把 nutrition 和 nutritious（有营养的）一起记：营养 → 有营养的食物。','Our class is learning about food and nutrition.','我们班正在学习食物与营养方面的知识。'),
    w('seasonal','/ˈsiːzənl/','adj.','季节性的；当季的','Available or happening at a particular time of year.','season（季节）+ -al：seasonal fruit 就是当季水果。','Seasonal fruit is often full of flavour.','当季水果通常风味浓郁。'),
    w('waste','/weɪst/','n. / v.','浪费；废弃物','Unwanted material; to use more than is needed.','联想 waste food 与 food waste：前者是浪费食物，后者是食物废弃物。','Planning meals can help reduce food waste.','规划膳食可以帮助减少食物浪费。')
  ],paragraphs:[
    ['On Sunday morning, Aisha takes her friend Tom to an outdoor market. Tom usually buys the same few things at a supermarket, so he is surprised by the variety of vegetables. A local farmer explains how to cook a vegetable that neither of them has tried before.','周日早晨，Aisha 带朋友 Tom 去露天市场。Tom 平时总在超市买那几样东西，因此对蔬菜的丰富种类感到惊讶。一位当地农民向他们介绍了一种两人都没吃过的蔬菜的做法。'],
    ['They choose ingredients for a simple dinner and walk home with two small bags. Aisha has been reading about nutrition, but she does not want cooking to feel complicated. They make soup and share it with a neighbour. Tom writes down the recipe so he can make it again next week.','他们挑选了一顿简单晚餐需要的食材，拎着两个小袋子走回家。Aisha 最近在阅读营养方面的书，但她不希望做饭变得复杂。他们煮了汤，分享给一位邻居。Tom 记下了食谱，打算下周再做一次。']
  ],extras:[['The farmer recommends seasonal produce because it is ready to harvest now.','农民推荐当季农产品，因为它们现在正适合采收。'],['They save the remaining soup for lunch the next day to avoid waste.','他们把剩下的汤留作第二天的午餐，以避免浪费。']],questions:[
    {q:'What surprises Tom at the market?',options:['The lack of vegetables.','The variety of vegetables.','The price of the bags.'],answer:1,why:'第一段说，Tom 因蔬菜种类丰富而感到惊讶。'},
    {q:'Why does Tom write down the recipe?',options:['To sell it to the farmer.','To prepare for a test.','To cook the soup again.'],answer:2,why:'第二段最后一句说明，他希望下周再做一次这道汤。'}
  ],prompt:'Describe a meal you enjoy preparing.',starter:'I enjoy making… I use a variety of… I buy local ingredients because…'},
  {id:'work',title:'让好想法被听见',english:'Making room for good ideas',category:'工作与沟通',scene:'在团队讨论中，清楚地表达一个建议。',color:'green',words:[
    w('opportunity','/ˌɒpəˈtjuːnəti/','n.','机会；时机','A chance to do something.','搭配记忆：an opportunity to learn，把一次新任务看成学习机会。','The project is an opportunity to learn new skills.','这个项目是学习新技能的机会。'),
    w('responsibility','/rɪˌspɒnsəˈbɪləti/','n.','责任；职责','A duty to take care of something.','responsible 是“负责的”；take responsibility for 是“为……承担责任”。','It is my responsibility to organise the meeting.','组织这次会议是我的职责。'),
    w('feedback','/ˈfiːdbæk/','n.','反馈；意见','Information about how well something was done.','想象信息被“送回来”：做完后收到意见，就是 feedback；通常不可数。','Could you give me some feedback on my idea?','你能就我的想法给我一些反馈吗？'),
    w('priority','/praɪˈɒrəti/','n.','优先事项','Something that is more important than other things.','把待办事项中排第一的事想成 top priority。','Making the website easy to use is our top priority.','让网站易于使用是我们的首要任务。'),
    w('adapt','/əˈdæpt/','v.','适应；调整','To change to suit a new situation.','记住 adapt to change（适应变化）；不要和 adopt（采用）混淆。','We need to adapt our plan after hearing from users.','听取用户意见后，我们需要调整计划。')
  ],paragraphs:[
    ['During her first week at a design studio, Lin is invited to suggest an improvement to the company website. She sees it as an opportunity to learn, although she feels nervous. Her responsibility is to look at the contact page and explain what could be clearer.','在设计工作室工作的第一周，Lin 受邀为公司网站提出改进建议。虽然有些紧张，她仍将其视作学习机会。她的职责是查看联系页面，说明哪些地方可以更清楚。'],
    ['Lin notices that the phone number is difficult to find. She draws a simple new layout and asks two colleagues for feedback. One suggests larger text; the other asks for clearer opening hours. Lin adds both ideas before sharing her design at the team meeting. Her manager thanks her for listening carefully.','Lin 注意到电话号码很难找到。她画出一版简单的新布局，并请两位同事给予反馈。一位建议增大文字，另一位建议更清楚地列出营业时间。Lin 采纳了两条意见，然后在团队会议上展示设计。经理感谢她认真倾听。']
  ],extras:[['The team agrees that helping visitors find contact information is the first priority.','团队一致认为，帮助访客找到联系方式是第一优先事项。'],['Lin learns that a useful design must adapt to the needs of the people using it.','Lin 明白了，有用的设计必须适应使用者的需求。']],questions:[
    {q:'What is Lin responsible for?',options:['Improving the contact page.','Hiring new designers.','Answering every phone call.'],answer:0,why:'第一段说明，她负责查看联系页面并提出让它更清楚的建议。'},
    {q:'How does Lin respond to her colleagues?',options:['She ignores their comments.','She includes both suggestions.','She cancels the meeting.'],answer:1,why:'第二段说 Lin 在展示设计前加入了两位同事的建议。'}
  ],prompt:'Describe a time someone gave you useful advice.',starter:'I had an opportunity to… My responsibility was… The feedback helped me…'}
];
