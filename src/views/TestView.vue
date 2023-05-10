<template>
  <h2>{{ testName }}</h2>
  <div v-for="(question, indexQuestions) in questions" :key="indexQuestions" class="question">
    <p class="question__title">{{ `${indexQuestions + 1}) ${question.title}` }}</p>
    <div class="question__answers">
      <label
        v-for="(answer, indexAnswer) in question.answers"
        :key="indexAnswer"
        :class="statusCheck && answer.value ? 'correct' : ''"
      >
        <input
          type="radio"
          :name="indexQuestions"
          @click="question.selected = indexAnswer"
          :disabled="statusCheck"
        />
        {{ answer.text }}
      </label>
    </div>
  </div>
  <Button
    class="mb-5"
    label="Check"
    icon="pi pi-check"
    iconPos="right"
    :disabled="statusCheck"
    @click="checkAnswers"
  />
  <Dialog
    v-model:visible="visible"
    modal
    :header="`Result ${testName}`"
    :style="{ 'max-width': '340px' }"
  >
    <p>{{ textResult }}</p>
  </Dialog>
</template>

<script>
  import TestService from '@/services/TestService';
  import HistoryService from '@/services/HistoryService';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';

  export default {
    components: { Button, Dialog },

    data() {
      return {
        answersUser: [],
        questions: [],
        statusCheck: false,
        testName: null,
        visible: false,
        textResult: null,
      };
    },

    async created() {
      const response = await TestService.get(this.$route.params.id);
      this.testName = response.data.name;
      this.questions = this.sortArrayQuestions(response.data.questions);
    },

    methods: {
      sortArrayQuestions(questions) {
        const questionsLength = questions.length;
        const allСycles = questionsLength < 20 ? questionsLength : 20;
        const arrayIndex = [];
        const arrayQuestions = [];

        for (let i = 0; i < questionsLength; i++) {
          arrayIndex.push(i);
        }
        for (let i = 0; i < allСycles; i++) {
          arrayIndex.splice(Math.random() * questionsLength, 1)[0];
        }
        for (let i = 0; i < allСycles; i++) {
          arrayQuestions.push(questions[arrayIndex[i]]);
        }
        return arrayQuestions;
      },

      async checkAnswers() {
        this.statusCheck = true;
        let counterAnswers = 0;
        this.questions.forEach((question) => {
          if (
            Object.prototype.hasOwnProperty.call(question, 'selected') &&
            question.answers[question.selected].value
          ) {
            counterAnswers++;
          }
        });
        this.textResult = `You gave ${counterAnswers} correct answers. Your level is ${this.levelDetection(
          counterAnswers
        )}`;
        this.visible = true;
        await HistoryService.create({
          correctAnswers: counterAnswers,
          test: this.$route.params.id,
        });
      },

      levelDetection(answers) {
        let result = '';
        switch (true) {
          case answers < 2:
            result = 'STARTER';
            break;
          case answers < 3:
            result = 'BEGGINER 1';
            break;
          case answers < 5:
            result = 'BEGGINER 2';
            break;
          case answers < 7:
            result = 'ELEMENTARY 1';
            break;
          case answers < 10:
            result = 'ELEMENTARY 2';
            break;
          case answers < 11:
            result = 'PRE-INTERMIDIATE 1';
            break;
          case answers < 12:
            result = 'PRE-INTERMIDIATE 2';
            break;
          case answers < 13:
            result = 'INTERMIDIATE 1';
            break;
          case answers < 14:
            result = 'INTERMIDIATE 2';
            break;
          case answers < 15:
            result = 'UPPER-INTERMIDIATE 1';
            break;
          case answers < 16:
            result = 'UPPER-INTERMIDIATE 2';
            break;
          case answers < 17:
            result = 'ADVANCED 1';
            break;
          case answers < 18:
            result = 'ADVANCED 2';
            break;
          case answers < 19:
            result = 'MASTER 1';
            break;
          default:
            result = 'MASTER 2';
            break;
        }
        return result;
      },
    },
  };
</script>

<style lang="scss" scoped>
  h2 {
    margin: 0 auto 20px;
    text-align: center;
    font-size: 30px;
    line-height: 130%;
  }
  .question {
    border: 2px solid black;
    border-radius: 5px;
    margin-bottom: 10px;
    padding: 10px;
    font-size: 18px;
    &__title {
      margin: 0 0 5px;
    }
    &__answers {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      label {
        display: inline-flex;
        cursor: pointer;
        margin-bottom: 5px;
        input {
          width: 16px;
          height: 16px;
        }
        &.correct {
          color: green;
        }
      }
    }
  }
</style>
