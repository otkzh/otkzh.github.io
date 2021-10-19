<template>
  <div>
    <h1>診断ツール</h1>
    <div class="question">
      <div v-if="data.final !== true" class="question__status">＜設問＞</div>
      <div v-else class="question__status">＜診断結果＞</div>

      <div class="question__text">{{ data.text }}</div>
      <div v-if="data.final !== true" class="answer">
        <div class="answer__yes" @click="answer(data.yes)">Yes</div>
        <div class="answer__no" @click="answer(data.no)">No</div>
      </div>
    </div>
    {{ data }}
  </div>
</template>

<script>
// 問題文は適当
// id 記号
// text 設問・結果テキスト
// yes 「はい」次のid
// no 「いいえ」次のid
// final trueの場合結果表示
const questions = [
  { id: '1', text: 'ひとと話すことが好き', yes: '2', no: '3', final: false },
  { id: '2', text: 'ひとの話を聞くのが好き', yes: '3', no: '4', final: false },
  { id: '3', text: '新しい知識を得たい', yes: '4', no: '5', final: false },
  { id: '4', text: 'お金をかせぎたい', yes: '5', no: '6', final: false },
  { id: '5', text: '友だちがほしい', yes: '6', no: '7', final: false },
  { id: '6', text: '誰かの役に立ちたい', yes: '7', no: '8', final: false },
  { id: '7', text: 'ぼーっとするのが好き', yes: '8', no: '9', final: false },
  { id: '8', text: '一人で行動するのが好き', yes: '9', no: '10', final: false },
  { id: '9', text: '自分磨きをしたい', yes: '10', no: '11', final: false },
  { id: '10', text: '自由になる時間がある', yes: '11', no: '12', final: false },
  { id: '11', text: '旅行が好き', yes: '12', no: '13', final: false },
  { id: '12', text: '体を動かすのが好き', yes: '13', no: '14', final: false },
  {
    id: '13',
    text: '美味しいものを食べることが好き',
    yes: '14',
    no: '15',
    final: false,
  },
  {
    id: '14',
    text: '自分の判断で使えるお金がある',
    yes: '15',
    no: '16',
    final: false,
  },
  { id: '15', text: '友だちが多い', yes: '16', no: '17', final: false },
  { id: '16', text: '多世代の友だちがいる', yes: '17', no: '18', final: false },
  {
    id: '17',
    text: '失敗してもクヨクヨしない',
    yes: 'a',
    no: 'e',
    final: false,
  },
  {
    id: '18',
    text: '調べたり、情報を得ることが好き',
    yes: 'b',
    no: 'f',
    final: false,
  },
  {
    id: '19',
    text: 'SNSなどで情報を発信している',
    yes: 'c',
    no: 'g',
    final: false,
  },
  {
    id: '20',
    text: 'インターネットを使っている',
    yes: 'd',
    no: 'a',
    final: false,
  },
  {
    id: 'a',
    text: '得意や好きを生かして起業したい',
    yes: '',
    no: '',
    final: true,
  },
  { id: 'b', text: 'まだまだ、ガッツリ働きたい', yes: '', no: '', final: true },
  {
    id: 'c',
    text: '地元で新しい仕事にチャレンジ',
    yes: '',
    no: '',
    final: true,
  },
  { id: 'd', text: '友だち・生きがいがほしい', yes: '', no: '', final: true },
  { id: 'e', text: '趣味・学びを極めたい', yes: '', no: '', final: true },
  { id: 'f', text: '誰かの役に立ちたい', yes: '', no: '', final: true },
  { id: 'g', text: 'ちょっと一休み', yes: '', no: '', final: true },
]

export default {
  data: () => ({
    current: 1,
    data: questions.find(({ id }) => id === '1'),
  }),

  methods: {
    answer(choice) {
      this.current = choice
      this.data = questions.find(({ id }) => id === this.current)
      return true
    },
  },
}
</script>
<style scoped>
.question {
  font-size: 40px;
}

.answer {
  display: flex;
  text-align: center;
}

.answer__yes {
  width: 50%;
  border: solid 1px black;
  color: white;
  background-color: blue;
}

.answer__no {
  width: 50%;
  border: solid 1px black;
  color: white;
  background-color: red;
}
</style>
