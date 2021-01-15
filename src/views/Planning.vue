<template>
  <div>
    <div class="page-title">
      <h3>Планирование</h3>
      <h4>{{ info.bill | currency('KGS') }}</h4>
    </div>

    <Loader v-if="loading"/>

    <p class="center" v-else-if="!categories.length">Категорий пока нет.
      <router-link to="/categories">Добавить категорию</router-link>
    </p>

    <section v-else>
      <div v-for="c in categories" :key="c.id">
        <p>
          <strong>{{c.title}}:</strong>
          {{c.moneySpend | currency}} из {{c.limit | currency}}
        </p>
        <div class="progress">
          <div
              class="determinate green"
              :class="[c.progressColor]"
              :style="{width: c.progressPercent + '%'}"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'planning',
  data: () => ({
    loading: true,
    categories: []
  }),
  computed: {
    ...mapGetters(['info'])
  },
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.categories = categories.map(c => {
      const moneySpend = records
          .filter(r => r.categoryId === c.id)
          .filter(r => r.type === 'outcome')
          .reduce((total, record) => {
            return total += +record.amount
          }, 0)

      const percent = 100 * moneySpend / c.limit
      const progressPercent = percent > 100 ? 100 : percent
      const progressColor = percent < 60
          ? 'green'
          : percent < 100
              ? 'yellow'
              : 'red'

      return {
        ...c,
        progressPercent,
        progressColor,
        moneySpend
      }
    })

    this.loading = false
  }
}
</script>