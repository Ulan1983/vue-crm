<template>
	<div class="col s12 m6">
		<div>
			<div class="page-subtitle">
				<h4>Создать</h4>
			</div>

			<form @submit.prevent="submitHandler">
				<div class="input-field">
					<input
							id="name"
							type="text"
							v-model="title"
							:class="{invalid: $v.title.$dirty && !$v.title.required}"
					>
					<label for="name">Название</label>
					<span
							v-if="$v.title.$error"
							class="helper-text invalid"
					>
						Введите название категории
					</span>
				</div>

				<div class="input-field">
					<input
							id="limit"
							type="number"
							v-model.number="limit"
							:class="{invalid: ($v.limit.$dirty && !$v.limit.required || $v.limit.$dirty && !$v.limit.minValue)}"
					>
					<label for="limit">Лимит</label>
					<span
							v-if="$v.limit.$dirty && !$v.limit.required"
							class="helper-text invalid"
					>
						Введите значение
					</span>
					<span
							v-else-if="$v.limit.$dirty && !$v.limit.minValue"
							class="helper-text invalid"
					>
						Минимальная величина должна быть {{$v.limit.$params.minValue.min}}
					</span>
				</div>

				<button class="btn waves-effect waves-light" type="submit">
					Создать
					<i class="material-icons right">send</i>
				</button>
			</form>
		</div>
	</div>
</template>

<script>
	import {required, minValue} from 'vuelidate/lib/validators'

	export default {
		data: () => ({
			title: '',
			limit: 1
		}),
		mounted() {
			window.M.updateTextFields()
		},
		methods: {
			async submitHandler() {
				if (this.$v.$invalid) {
					this.$v.$touch();
					return
				}

				try {
					const formData = {
						title: this.title,
						limit: this.limit
					};

					await this.$store.dispatch('createCategory', formData);
					this.title = '';
					this.limit = 1;
					this.$message('Вы успешно создали категорию');
					this.$v.reset();
				} catch (e) {
					console.log(e);
				}
			}
		},
		validations: {
			title: {required},
			limit: {required, minValue: minValue(1)}
		}
	}
</script>