// Letter groups are visual spelling aids, not claims about syllables or etymology.
export const spellingHints={
  accessible:[['ac','cess','ible'],'记住中间双 c、双 s，结尾是 -ible，不是 -able。'],
  community:[['com','mun','ity'],'两个 m 紧挨着；末尾是 -ity。按 com → mun → ity 拼回去。'],
  benefit:[['ben','e','fit'],'中间保留 e；只有一个 n、一个 f，结尾 fit。'],
  sustainable:[['sus','tain','able'],'先写 sustain，再接 able；中间的 ai 不要漏掉 i。'],
  transform:[['trans','form'],'分成 trans 和 form；trans 末尾的 s 要保留。'],
  affordable:[['af','ford','able'],'双 f：af + ford；再接 able，不是 ible。'],
  recommend:[['re','com','mend'],'只有一个 c、两个 m：re + com + mend。'],
  alternative:[['alter','na','tive'],'按 alter → na → tive 排列；结尾 -tive 中有 i。'],
  convenient:[['con','ven','ient'],'结尾是 -ient，i 在 e 前；不要漏掉 i。'],
  preference:[['prefer','ence'],'先写 prefer，再接 ence；末尾是 -ence，不是 -ance。'],
  collaborate:[['col','labor','ate'],'双 l 藏在 col + labor 的连接处，结尾 ate。'],
  resource:[['re','source'],'先记 source，再在前面加 re；source 中间是 ou。'],
  confidence:[['con','fid','ence'],'按 con → fid → ence；结尾 -ence，不是 -ance。'],
  approach:[['ap','proach'],'双 p：ap + proach；中间是 oa，末尾 ch。'],
  participate:[['part','ici','pate'],'中间 ici 的两个 i 都要写；结尾是 pate。'],
  destination:[['dest','in','ation'],'先写 dest，再写 in，最后 ation；不要漏掉中间的 i。'],
  flexible:[['flex','ible'],'结尾是 -ible，不是 -able；flex 中的 x 保留。'],
  explore:[['ex','plore'],'ex 后面是 pl；末尾有不单独发音的 e。'],
  budget:[['bud','get'],'把 bud 和 get 接起来；只有一个 d、一个 g。'],
  experience:[['ex','peri','ence'],'按 ex → peri → ence；结尾是 -ence，不是 -ance。'],
  habit:[['hab','it'],'只有一个 b；末尾是 it，不要多写一个 b。'],
  reduce:[['re','duce'],'re 后写 duce；末尾保留 e，不要写成 s。'],
  focus:[['fo','cus'],'fo + cus，只有一个 c；不要把 cus 写成 cous。'],
  distraction:[['dis','tract','ion'],'先写 dis，再写 tract，最后 ion；注意 tract 中的 c。'],
  balance:[['bal','ance'],'一个 l；结尾是 -ance，不是 -ence。'],
  variety:[['var','i','ety'],'中间的 i 后接 ety；注意顺序是 i → e。'],
  local:[['lo','cal'],'lo + cal，末尾是 -al，不是 -el。'],
  nutrition:[['nu','tri','tion'],'按 nu → tri → tion，两个 t 分别在 tri 和 tion 中。'],
  seasonal:[['sea','son','al'],'先写 season，再接 al；开头是 sea，带 ea。'],
  waste:[['wa','ste'],'末尾保留 e；和 waist（腰）区分，waste 中没有 i。'],
  opportunity:[['op','por','tun','ity'],'双 p：op + por；后半段是 tun + ity。'],
  responsibility:[['re','spon','si','bil','ity'],'responsible 变为 responsibility 时，结尾变成 -ibility；逐块拼写。'],
  feedback:[['feed','back'],'feed + back；前半段双 e，后半段结尾 ck。'],
  priority:[['pri','or','ity'],'按 pri → or → ity；先 i 后 o，结尾 ity。'],
  adapt:[['a','dapt'],'a + dapt；第二个元音是 a，区别于 adopt（采用）。']
};

const line=d=>`<path d="${d}" fill="none" stroke="#506d55" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
const person=(x,y,color='#be805e')=>`<g transform="translate(${x} ${y})"><circle cy="-23" r="9" fill="#dfb693"/><path d="M-14 6v-12a14 14 0 0 1 28 0V6" fill="${color}"/>${line('M-7 6v19M7 6v19')}</g>`;
const tree=(x,y)=>`<g transform="translate(${x} ${y})"><ellipse cy="-25" rx="22" ry="28" fill="#9cac78"/>${line('M0-28v62M0-5l-12-10')}</g>`;
const book=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-30-18q18-5 30 4 12-9 30-4v42q-18-5-30 4-12-9-30-4z" fill="#fffdf3" stroke="#6c805c" stroke-width="2"/>${line('M0-14v42M-22-7h12M-22 3h12M10-7h12M10 3h12')}</g>`;
const cup=(x,y,color='#c9936b')=>`<g transform="translate(${x} ${y})"><path d="M-21-15h42v29q-21 21-42 0z" fill="${color}"/><path d="M21-9c24-4 24 24 0 20" stroke="${color}" stroke-width="5" fill="none"/>${line('M-26 30h59M-8-27q-8-8 0-16M6-27q-8-8 0-16')}</g>`;
const coin=(x,y)=>`<circle cx="${x}" cy="${y}" r="13" fill="#e6c58e" stroke="#b89a62" stroke-width="2"/>`;
const phone=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-23" y="-35" width="46" height="72" rx="7" fill="#d1d9c0" stroke="#687d62" stroke-width="3"/><path d="M-11-22h22M-6 25H6" stroke="#687d62" stroke-width="3"/></g>`;
const arrow=(x,y)=>`<g transform="translate(${x} ${y})">${line('M-20 0h40M10-10 20 0 10 10')}</g>`;
const check=(x,y)=>`<g transform="translate(${x} ${y})"><circle r="15" fill="#dce5cb"/>${line('M-7 0l5 5 9-11')}</g>`;
const heart=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M0 19C-42-6-13-32 0-12 13-32 42-6 0 19" fill="#c7896b"/></g>`;
const plant=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-19 4h38l-6 29h-26z" fill="#c59773"/>${line('M0 4v-30')}<path d="M0-11q-31 0-25-24Q0-37 0-11M0-24q0-25 24-24Q32-22 0-24" fill="#8d9f70"/></g>`;
const clock=(x,y,r=28)=>`<g transform="translate(${x} ${y})"><circle r="${r}" fill="#fffdf3" stroke="#7d8e69" stroke-width="3"/>${line('M0-17v17l13 8')}</g>`;
const speech=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-25-18h50v31H0l-14 13v-13h-11z" fill="#fffdf3" stroke="#829374" stroke-width="2"/>${line('M-15-7h30M-15 3H7')}</g>`;
const house=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-30-4 0-29 30-4v44h-60z" fill="#ded4bd"/>${line('M-35-4 0-34 35-4M-7 40V13H9v27')}<path d="M-23 2h11v12h-11M15 2h11v12H15" fill="#98ab86"/></g>`;
const plate=(x,y)=>`<g transform="translate(${x} ${y})"><circle r="35" fill="#fffdf3" stroke="#b9c5a4" stroke-width="3"/><path d="M0 0V-28A28 28 0 0 1 24 14Z" fill="#9aae7f"/><path d="M0 0l24 14A28 28 0 0 1-24 14Z" fill="#ddbc87"/><path d="M0 0l-24 14A28 28 0 0 1 0-28Z" fill="#c59170"/></g>`;
const pictures={
  accessible:['平缓坡道让轮椅使用者也能进入公园。',`${tree(247,72)}<path d="M34 135h78l89-44h46" stroke="#a6b48d" stroke-width="10" fill="none"/>${line('M111 120a20 20 0 1 1-24-24M106 67v31h24l13 23h13')}<circle cx="106" cy="51" r="9" fill="#ca9874"/>${line('M106 79h23')}`],
  community:['邻居聚在一起照料花园，形成一个社区。',`${house(154,68)}${person(70,103)}${person(147,119,'#8c9d71')}${person(237,104)}${plant(198,132)}`],
  benefit:['散步带来更好的心情，这是它的一个益处。',`${tree(62,77)}${person(119,96)}${arrow(176,88)}${heart(241,85)}`],
  sustainable:['把雨水收集起来浇花，让资源持续发挥作用。',`<path d="M42 50q-8-24 18-23 10-29 35-8 29-4 26 27z" fill="#b9cbd0"/>${line('M57 62l-5 12M78 62l-5 12M99 62l-5 12')}<path d="M42 91h70l-8 48H50z" fill="#a6bbb2"/>${arrow(152,108)}${plant(231,102)}`],
  transform:['同一块空地变成花园，外观和用途都改变了。',`<path d="M32 125h82" stroke="#c9bba1" stroke-width="14"/>${arrow(151,89)}${tree(226,80)}${plant(270,109)}`],
  affordable:['少量硬币就能买到午餐，价格在预算以内。',`${coin(51,112)}${coin(72,97)}${arrow(124,98)}${plate(202,89)}${check(261,62)}`],
  recommend:['有人给你建议：试试这杯茶。',`${person(69,105)}${speech(116,44)}${arrow(151,94)}${cup(231,103,'#91a27b')}${check(261,52)}`],
  alternative:['咖啡之外还有茶，是另一个可选方案。',`${cup(76,96)}${line('M150 128V86l-33-26M150 86l33-26')}${cup(230,96,'#8fa17b')}`],
  convenient:['家旁边就是车站，出行很方便。',`${house(62,77)}${line('M100 118h62M117 109l9 9-9 9')}<rect x="194" y="45" width="66" height="73" rx="14" fill="#a4b396"/>${line('M205 62h44v22h-44zM205 130l9-12M249 130l-9-12')}<circle cx="208" cy="101" r="4" fill="#f9f5e6"/><circle cx="246" cy="101" r="4" fill="#f9f5e6"/>`],
  preference:['两杯饮品中更喜欢茶，这是你的偏好。',`${cup(76,101)}${cup(232,101,'#8fa17b')}${heart(230,37)}`],
  collaborate:['两个人围着同一份材料，共同完成任务。',`${person(66,86)}${person(241,86,'#8fa17b')}${book(152,100)}${line('M83 86l35 15M223 86l-35 15M42 137h224')}`],
  resource:['书籍、资料和电脑都可以成为学习资源。',`${book(75,96)}<rect x="157" y="49" width="95" height="62" rx="5" fill="#b3c1a2"/>${line('M151 121h109M173 65h60M173 77h40M173 89h53')}`],
  confidence:['站上台、抬起头，练习让你更有信心。',`${person(153,92,'#8b9e73')}${line('M134 86l-22-20M171 86l22-20M98 130h110M107 138h92M92 50l-10-7M213 50l10-7')}<path d="m153 25 4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#d5ae72"/>`],
  approach:['到达同一个目标，可以选择不同的方法。',`${line('M49 126C60 43 179 133 244 51M49 126C149 144 213 137 244 51')}<circle cx="49" cy="126" r="7" fill="#bf8b63"/><circle cx="247" cy="45" r="18" fill="#cfddbd"/>${check(247,45)}`],
  participate:['举起手，加入大家的讨论。',`${person(65,109)}${person(151,102,'#8f9e70')}${person(239,109)}${line('M167 95l22-41')}${speech(105,40)}`],
  destination:['沿着路线前进，终点标记就是目的地。',`${line('M39 131C80 40 152 153 229 77')}<path d="M251 51c0 23-22 44-22 44s-22-21-22-44a22 22 0 1 1 44 0" fill="#bc8968"/><circle cx="229" cy="50" r="8" fill="#fff9e7"/><circle cx="39" cy="131" r="6" fill="#8a9d70"/>`],
  flexible:['路线遇到阻碍时弯过去，计划也可以灵活调整。',`${line('M38 119h66C130 119 116 45 153 45S179 119 215 119h50M254 109l11 10-11 10')}<rect x="138" y="85" width="31" height="42" rx="4" fill="#c89b79"/>`],
  explore:['带着地图去观察、寻找，探索陌生的地方。',`${book(97,88)}${tree(249,84)}<circle cx="174" cy="77" r="25" fill="#e4ecd8" stroke="#6b805a" stroke-width="4"/>${line('M192 96l25 29M161 77h26M174 64v26')}`],
  budget:['钱包里的钱要在吃、住、行之间安排，这就是预算。',`<rect x="36" y="49" width="92" height="73" rx="9" fill="#c49a77"/><path d="M94 67h43v34H94z" fill="#e8c79a"/>${coin(112,84)}${line('M154 54h103M154 86h78M154 118h56')}${check(276,54)}`],
  experience:['相册留下一段旅行，是你亲身经历过的事。',`<rect x="61" y="25" width="184" height="121" rx="5" fill="#fffdf2" stroke="#c4cbb4" stroke-width="2"/><path d="M78 119l40-49 31 31 25-22 54 40z" fill="#a8b68a"/><circle cx="199" cy="54" r="14" fill="#e3bd83"/>${person(122,103)}`],
  habit:['日历上连续几天重复同一件事，慢慢成为习惯。',`<rect x="70" y="32" width="166" height="110" rx="8" fill="#fffdf3" stroke="#a4b38e" stroke-width="2"/>${line('M70 59h166M104 24v17M202 24v17')}${check(105,86)}${check(153,86)}${check(201,86)}${check(105,121)}${check(153,121)}`],
  reduce:['高高的一摞变成少少的一摞，数量减少了。',`<path d="M45 134V41h59v93zM210 134V96h59v38z" fill="#a4b48b"/>${line('M42 69h65M42 100h65M207 115h65')}${arrow(157,88)}`],
  focus:['把注意力放在书上，就像对准一个焦点。',`${book(154,91)}${line('M91 57V37h24M195 37h24v20M219 119v20h-24M115 139H91v-20')}<circle cx="153" cy="90" r="49" stroke="#c4aa77" stroke-width="2" fill="none"/>`],
  distraction:['看书时手机消息跳出来，把注意力拉走了。',`${book(84,96)}${phone(221,94)}${speech(203,30)}${line('M124 87l48-24M158 60l14 3-7 13')}`],
  balance:['工作和休息各占一边，保持合适的平衡。',`${line('M154 49v94M129 143h50M65 61h178M75 62l-23 57h46zM231 62l-23 57h46z')}<circle cx="153" cy="60" r="7" fill="#c48f68"/>${book(75,91)}<g transform="translate(231 92) scale(.5)">${tree(0,0)}</g>`],
  variety:['篮子里有多种颜色、形状的食物，种类丰富。',`<path d="M65 98h179l-22 46H86z" fill="#caa77c"/>${line('M98 98q56-108 111 0')}<circle cx="107" cy="90" r="19" fill="#c28567"/><ellipse cx="154" cy="84" rx="17" ry="24" fill="#b7bc79"/><path d="m186 72 30 14-30 41z" fill="#d9a371"/>${line('M195 77l6-21M201 79l13-15')}`],
  local:['农场就在住处附近，食材来自当地。',`${house(64,77)}${line('M105 128h76M134 120l10 8-10 8')}${plant(225,101)}<circle cx="224" cy="51" r="44" stroke="#aab996" stroke-width="2" stroke-dasharray="5 6" fill="none"/>`],
  nutrition:['多样的食物为身体提供营养。',`${plate(101,86)}${arrow(171,89)}${person(239,100,'#91a275')}${heart(239,88)}`],
  seasonal:['日历翻到收获时节，树上的果实正当季。',`<rect x="38" y="42" width="93" height="83" rx="6" fill="#fffdf2" stroke="#a5b38e" stroke-width="2"/>${line('M38 63h93M59 33v18M110 33v18')}<path d="M63 88l13 24 29-36" stroke="#b38c65" stroke-width="4" fill="none"/>${tree(226,86)}<circle cx="214" cy="59" r="7" fill="#c48e67"/><circle cx="237" cy="69" r="7" fill="#c48e67"/>`],
  waste:['剩下的食物被丢进垃圾桶，造成浪费。',`${plate(80,80)}${arrow(151,88)}<path d="M202 65h55l-6 76h-43z" fill="#c1c9b0"/>${line('M195 58h68M219 48h22M218 79v45M239 79v45')}<path d="m145 35 17 18-17 17-17-17z" fill="#cc986f"/>`],
  opportunity:['门打开了，新的道路出现，这是一个机会。',`<path d="M92 144V27h119v117" fill="#d4dec3"/><path d="M92 27l70 17v114l-70-14z" fill="#b9a380"/>${line('M144 93v10M179 121l55-47M222 75l12-1-2 14')}<circle cx="244" cy="56" r="19" fill="#e3bf86"/>`],
  responsibility:['照料小植物、让它健康生长，是你承担的责任。',`${person(78,101)}${plant(218,101)}${line('M96 90l44-12M141 78l42 16M177 99l4 8M185 100l4 8')}${check(240,40)}`],
  feedback:['做完后听取他人的意见，帮助你改进。',`${person(66,112)}${person(240,112,'#91a375')}${book(153,109)}${speech(154,40)}${line('M207 70l-24-10M99 60l-15 10')}`],
  priority:['把最重要的一项排在清单第一位。',`<rect x="77" y="23" width="152" height="127" rx="6" fill="#fffdf3" stroke="#b8c3a2" stroke-width="2"/><rect x="87" y="35" width="132" height="32" rx="5" fill="#e8cca1"/>${line('M121 51h82M121 91h82M121 126h58')}<circle cx="103" cy="91" r="5" fill="#b7c5a0"/><circle cx="103" cy="126" r="5" fill="#b7c5a0"/><path d="m103 40 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#b37a51"/>`],
  adapt:['下雨时撑起伞，调整做法以适应新情况。',`<path d="M39 38q-6-18 16-19 12-25 31-7 25-4 26 23z" fill="#beced0"/>${line('M48 51l-6 16M70 51l-6 16M92 51l-6 16')}${person(208,112)}<path d="M159 68q48-67 96 0z" fill="#b7bb83"/>${line('M207 31v79q0 14-12 8')}`]
};
export const imageWords=Object.keys(pictures);
export function wordPicture(word){
  const [caption,body]=pictures[word];
  return `<figure class="word-picture"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 308 172" role="img" aria-label="${caption}"><rect width="308" height="172" rx="14" fill="#eef0e3"/><ellipse cx="154" cy="147" rx="119" ry="7" fill="#e0e5d1"/>${body}</svg><figcaption><span>画面联想</span>${caption}</figcaption></figure>`;
}
