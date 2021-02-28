<template>
  <div>
    <div class="page-title">
      <h3>{{'MenuNewRecord' | localize}}</h3>
    </div>

    <Loader v-if="loading"/>

    <p class="center" v-else-if="!categories.length">{{'NoCategoriesTitle' | localize}}.
      <router-link to="/categories">{{'AddCategoryTitle' | localize}</router-link>
    </p>

    <form
        class="form"
        v-else
        @submit.prevent="submitHandler"
    >
      <div class="input-field">
        <select ref="select" v-model="category">
          <option
              v-for="c in categories"
              :key="c.id"
              :value="c.id"
          >{{ c.title }}
          </option>
        </select>
        <label>{{'LabelChooseCategory' | localize}}</label>
      </div>

      <p>
        <label>
          <input
              class="with-gap"
              name="type"
              type="radio"
              value="income"
              v-model="type"
          />
          <span>{{'IncomeType' | localize}}</span>
        </label>
      </p>

      <p>
        <label>
          <input
              class="with-gap"
              name="type"
              type="radio"
              value="outcome"
              v-model="type"
          />
          <span>{{'OutcomeType' | localize}}</span>
        </label>
      </p>

      <div class="input-field">
        <input
            id="amount"
            type="number"
            v-model.number="amount"
            :class="{invalid: ($v.amount.$dirty && !$v.amount.required || $v.amount.$dirty && !$v.amount.minValue)}"
        >
        <label for="amount">{{'TableAmount' | localize}}</label>
        <span
            v-if="$v.amount.$dirty && !$v.amount.required"
            class="helper-text invalid"
        >
						{{'ValidMsgLimit' | localize}}
					</span>
        <span
            v-else-if="$v.amount.$dirty && !$v.amount.minValue"
            class="helper-text invalid"
        >
						{{'ValidMsgLimitMinVal' | localize}} {{ $v.amount.$params.minValue.min }}
					</span>
      </div>

      <div class="input-field">
        <input
            id="description"
            type="text"
            v-model="description"
            :class="{invalid: $v.description.$dirty && !$v.description.required}"
        >
        <label for="description">{{'RecordDescription' | localize}}</label>
        <span
            v-if="$v.description.$dirty && !$v.description.required"
            class="helper-text invalid"
        >
						{{'EnterDescription' | localize}}
					</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'CategoryCreateTitle' | localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators'
import {mapGetters} from 'vuex'

export default {
  metaInfo() {
    return {
      title: this.$title('MenuNewRecord')
    }
  },
  name: 'record',
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories');
    this.loading = false;

    if (this.categories) {
      this.category = this.categories[0].id
    }

    setTimeout(() => {
      this.select = window.M.FormSelect.init(this.$refs.select);
      window.M.updateTextFields()
    }, 0)
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }

      return this.info.bill >= this.amount
    }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return
      }

      if (this.canCreateRecord) {
        try {
          const recordData = {
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          };

          await this.$store.dispatch('createRecord', recordData);

          const bill = this.type === 'income' ? this.info.bill + this.amount : this.info.bill - this.amount;

          await this.$store.dispatch('updateInfo', {bill});
          this.$message(`Запись успешно создана`);
          this.$v.$reset();
          this.amount = 1;
          this.description = ''
              } catch (e) {
          throw `${e}`
        }
      } else {
        this.$message(`Недостаточно средств на счете. Вам не хватает ${this.amount - this.info.bill}`)
      }
    }
  },
  data: () => ({
    loading: true,
    categories: [],
    select: null,
    category: null,
    type: 'outcome',
    amount: 1,
    description: ''
  }),
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  },
  validations: {
    amount: {required, minValue: minValue(1)},
    description: {required}
  },
}
</script>