<template>
	<div class="col s12 m6">
		<div>
			<div class="page-subtitle">
				<h4>{{ 'CategoryEditTitle' | localize }}</h4>
			</div>

			<form @submit.prevent="submitHandler">
				<div class="input-field" >
					<select ref="select" v-model="current">
						<option
								v-for="c in categories"
								:key="c.id"
								:value="c.id"
						>{{c.title}}</option>
					</select>
					<label>{{'LabelChooseCategory' | localize}}</label>
				</div>

				<div class="input-field">
					<input
							id="name"
							type="text"
							v-model="title"
							:class="{invalid: $v.title.$dirty && !$v.title.required}"
					>
					<label for="name">{{'CategoryCreateNameLabel' | localize}}</label>
					<span
							v-if="$v.title.$error"
							class="helper-text invalid"
					>
						{{'ValidMsgTitle' | localize}}
					</span>
				</div>

				<div class="input-field">
					<input
							id="limit"
							type="number"
							v-model.number="limit"
							:class="{invalid: ($v.limit.$dirty && !$v.limit.required || $v.limit.$dirty && !$v.limit.minValue)}"
					>
					<label for="limit">{{'CategoryCreateLimitLabel' | localize}}</label>
					<span
							v-if="$v.limit.$dirty && !$v.limit.required"
							class="helper-text invalid"
					>
						{{'ValidMsgLimit' | localize}}
					</span>
					<span
							v-else-if="$v.limit.$dirty && !$v.limit.minValue"
							class="helper-text invalid"
					>
						{{'ValidMsgLimitMinVal' | localize}}{{$v.limit.$params.minValue.min}}
					</span>
				</div>

				<button class="btn waves-effect waves-light" type="submit">
          {{ 'EditCategoryBtn' | localize }}
					<i class="material-icons right">send</i>
				</button>
			</form>
		</div>
	</div>
</template>

<script>
	import {required, minValue} from 'vuelidate/lib/validators'

	export default {
		props: {
			categories: {
				type: Array,
				required: true
			}
		},
		data: () => ({
			select: null,
			title: '',
			limit: 1,
			current: null
		}),
		methods: {
			async submitHandler() {
				if (this.$v.$invalid) {
					this.$v.$touch();
					return
				}
				try {
					const categoryData = {
						id: this.current,
						title: this.title,
						limit: this.limit
					};
					await this.$store.dispatch('updateCategory', categoryData);
					this.$message('Вы успешно обновили категорию');
					this.$emit('updated', categoryData);
				} catch (e) {
					throw `${e}`
				}
			}
		},
		mounted() {
			this.select = window.M.FormSelect.init(this.$refs.select);
			window.M.updateTextFields()
		},
		destroyed() {
			if (this.select && this.select.destroy) {
				this.select.destroy()
			}
		},
		validations: {
			title: {required},
			limit: {required, minValue: minValue(1)}
		},
		watch: {
			current(catId) {
				const {title, limit} = this.categories.find(c => c.id === catId);
				this.title = title;
				this.limit = limit;
			}
		},
		created() {
			const {id, title, limit} = this.categories[0];
			this.current = id;
			this.title = title;
			this.limit = limit;
		}
	}
</script>