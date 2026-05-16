<template>
  <v-dialog v-model="dialog" width="400" persistent>
    <v-card>
      <v-card-title class="text-h6 bg-primary text-white pa-4">
        检测到{{ genderCard.name }}牌
      </v-card-title>

      <v-card-text class="pa-4">
        <div class="text-body-1 mb-4">
          您抽到了 <strong>{{ genderCard.name }}</strong> 牌，需要确认性别信息：
        </div>

        <v-radio-group v-model="selectedGender" class="mb-2">
          <v-radio label="男性" value="男性"></v-radio>
          <v-radio label="女性" value="女性"></v-radio>
          <v-radio label="未提及" value="未提及"></v-radio>
        </v-radio-group>

        <v-text-field
          v-if="selectedGender === '未提及'"
          v-model="customGender"
          label="请输入性别"
          variant="outlined"
          density="compact"
          class="mt-2"
        ></v-text-field>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :disabled="!canConfirm"
          text="确认"
          @click="confirm"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  genderCard: { number: number; name: string; image: string; meaning: string }
  isQuerent: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [gender: string, isQuerent: boolean]
}>()

const dialog = ref(props.modelValue)
const selectedGender = ref('')
const customGender = ref('')

const canConfirm = computed(() => {
  if (selectedGender.value === '未提及') {
    return customGender.value.trim().length > 0
  }
  return selectedGender.value !== ''
})

watch(() => props.modelValue, (val) => {
  dialog.value = val
  if (val) {
    selectedGender.value = ''
    customGender.value = ''
  }
})

watch(dialog, (val) => {
  emit('update:modelValue', val)
})

const confirm = () => {
  const gender = selectedGender.value === '未提及'
    ? customGender.value.trim()
    : selectedGender.value

  emit('confirm', gender, props.isQuerent)
  dialog.value = false
}
</script>
