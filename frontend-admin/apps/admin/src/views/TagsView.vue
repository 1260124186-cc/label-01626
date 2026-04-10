<script setup lang="ts">
import type { Tag } from '@blog/shared'
import { createTag, deleteTag, deleteTags, getTagById, getTags, mergeTags, updateTag } from '@blog/shared'
import { computed, onMounted, ref } from 'vue'
import { UButton, UInput, UCheckbox } from '@/components/ui'

const searchQuery = ref('')
const tags = ref<Tag[]>([])
const selectedTags = ref<string[]>([])
const showBatchOperations = ref(false)

const showModal = ref(false)
const editingTag = ref<Tag | null>(null)
const formData = ref({ name: '', slug: '' })

const showDeleteModal = ref(false)
const deleteTargetId = ref<string | null>(null)
const deleteTargetName = ref('')

const showMergeModal = ref(false)
const mergeTargetId = ref('')
const mergeSourceIds = ref<string[]>([])

function loadTags() {
  tags.value = getTags()
}

onMounted(loadTags)

const filteredTags = computed(() => {
  if (!searchQuery.value)
    return tags.value

  const query = searchQuery.value.toLowerCase()
  return tags.value.filter(
    t => t.name.toLowerCase().includes(query) || t.slug.toLowerCase().includes(query),
  )
})

function toggleTagSelection(id: string) {
  const index = selectedTags.value.indexOf(id)
  if (index === -1) {
    selectedTags.value.push(id)
  }
  else {
    selectedTags.value.splice(index, 1)
  }
  showBatchOperations.value = selectedTags.value.length > 0
}

function toggleAllSelection() {
  if (selectedTags.value.length === filteredTags.value.length) {
    selectedTags.value = []
  }
  else {
    selectedTags.value = filteredTags.value.map(t => t.id)
  }
  showBatchOperations.value = selectedTags.value.length > 0
}

function openCreateModal() {
  editingTag.value = null
  formData.value = { name: '', slug: '' }
  showModal.value = true
}

function openEditModal(tag: Tag) {
  editingTag.value = tag
  formData.value = {
    name: tag.name,
    slug: tag.slug,
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingTag.value = null
  formData.value = { name: '', slug: '' }
}

function generateSlug() {
  if (!formData.value.slug && formData.value.name) {
    formData.value.slug = formData.value.name
      .toLowerCase()
      .replace(/[^\w\u4E00-\u9FA5]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

function handleSubmit() {
  if (!formData.value.name || !formData.value.slug)
    return

  if (editingTag.value) {
    updateTag(editingTag.value.id, formData.value)
  }
  else {
    createTag(formData.value)
  }
  loadTags()
  closeModal()
}

function openDeleteModal(id: string, name: string) {
  deleteTargetId.value = id
  deleteTargetName.value = name
  showDeleteModal.value = true
}

function confirmDelete() {
  if (deleteTargetId.value) {
    deleteTag(deleteTargetId.value)
    loadTags()
  }
  showDeleteModal.value = false
  deleteTargetId.value = null
  deleteTargetName.value = ''
}

function cancelDelete() {
  showDeleteModal.value = false
  deleteTargetId.value = null
  deleteTargetName.value = ''
}

function batchDelete() {
  if (selectedTags.value.length > 0) {
    deleteTags(selectedTags.value)
    selectedTags.value = []
    showBatchOperations.value = false
    loadTags()
  }
}

function openMergeModal() {
  mergeSourceIds.value = [...selectedTags.value]
  mergeTargetId.value = ''
  showMergeModal.value = true
}

function confirmMerge() {
  if (mergeSourceIds.value.length > 0 && mergeTargetId.value) {
    mergeTags(mergeSourceIds.value, mergeTargetId.value)
    selectedTags.value = []
    showBatchOperations.value = false
    loadTags()
  }
  showMergeModal.value = false
}

function cancelMerge() {
  showMergeModal.value = false
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">标签管理</h1>
        <p class="mt-1 text-slate-500">管理博客文章标签</p>
      </div>
      <UButton color="blue" @click="openCreateModal">
        ➕ 新建标签
      </UButton>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex flex-col justify-between gap-4 md:flex-row">
        <UInput
          v-model="searchQuery"
          placeholder="搜索标签..."
          icon="search"
          class="w-full md:w-80"
        />
        <transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          leave-active-class="transition-opacity duration-200"
          leave-to-class="opacity-0"
        >
          <div v-if="showBatchOperations" class="flex items-center gap-2">
            <span class="text-sm text-slate-500">已选择 {{ selectedTags.length }} 个标签</span>
            <UButton color="blue" variant="soft" @click="openMergeModal">
              🔗 合并选中
            </UButton>
            <UButton color="red" variant="soft" @click="batchDelete">
              🗑️ 批量删除
            </UButton>
          </div>
        </transition>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">
                <UCheckbox
                  :model-value="selectedTags.length === filteredTags.length && filteredTags.length > 0"
                  class="cursor-pointer"
                  @change="toggleAllSelection"
                />
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">名称</th>
              <th class="hidden px-4 py-3 text-left text-sm font-medium text-slate-700 md:table-cell">别名</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">文章数</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-slate-700">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr
              v-for="tag in filteredTags"
              :key="tag.id"
              class="transition-colors hover:bg-slate-50"
            >
              <td class="px-4 py-3">
                <UCheckbox
                  :model-value="selectedTags.includes(tag.id)"
                  class="cursor-pointer"
                  @change="() => toggleTagSelection(tag.id)"
                />
              </td>
              <td class="px-4 py-3">
                <p class="font-medium text-slate-900">{{ tag.name }}</p>
              </td>
              <td class="hidden px-4 py-3 md:table-cell">
                <code class="rounded bg-slate-100 px-2 py-0.5 text-sm text-slate-600">{{ tag.slug }}</code>
              </td>
              <td class="px-4 py-3">
                <span class="text-sm text-slate-600">{{ tag.postCount }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-blue-100"
                    title="编辑"
                    @click="openEditModal(tag)"
                  >
                    ✏️
                  </button>
                  <button
                    class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-red-100"
                    title="删除"
                    @click="openDeleteModal(tag.id, tag.name)"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredTags.length === 0" class="py-12 text-center">
        <div class="mx-auto mb-4 text-5xl">🏷️</div>
        <p class="mb-4 text-slate-500">暂无标签</p>
        <UButton color="blue" @click="openCreateModal">
          ➕ 创建第一个标签
        </UButton>
      </div>

      <div class="border-t border-slate-200 px-4 py-3">
        <span class="text-sm text-slate-500"> 共 {{ filteredTags.length }} 个标签 </span>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <h3 class="mb-4 text-xl font-bold text-slate-900">
            {{ editingTag ? '编辑标签' : '新建标签' }}
          </h3>
          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">标签名称</label>
              <UInput
                v-model="formData.name"
                placeholder="输入标签名称"
                @blur="generateSlug"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">别名 (Slug)</label>
              <UInput v-model="formData.slug" placeholder="输入标签别名" />
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <UButton class="flex-1" variant="soft" @click="closeModal">取消</UButton>
            <UButton class="flex-1" color="blue" @click="handleSubmit">
              {{ editingTag ? '保存' : '创建' }}
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cancelDelete" />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">⚠️</div>
            <h3 class="mb-2 text-xl font-bold text-slate-900">确认删除</h3>
            <p class="mb-4 text-slate-500">确定要删除标签"{{ deleteTargetName }}"吗？</p>
            <p class="mb-6 text-sm text-red-500">此操作无法撤销</p>
          </div>
          <div class="flex gap-3">
            <UButton class="flex-1" variant="soft" @click="cancelDelete">取消</UButton>
            <UButton class="flex-1" color="red" @click="confirmDelete">确认删除</UButton>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showMergeModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cancelMerge" />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <h3 class="mb-4 text-xl font-bold text-slate-900">合并标签</h3>
          <p class="mb-4 text-sm text-slate-500">
            将 {{ mergeSourceIds.length }} 个选中的标签合并到目标标签。选中标签下的所有文章将被移至目标标签。
          </p>
          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">合并到目标标签</label>
              <select
                v-model="mergeTargetId"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择目标标签</option>
                <option
                  v-for="tag in tags.filter(t => !mergeSourceIds.includes(t.id))"
                  :key="tag.id"
                  :value="tag.id"
                >
                  {{ tag.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <UButton class="flex-1" variant="soft" @click="cancelMerge">取消</UButton>
            <UButton class="flex-1" color="blue" :disabled="!mergeTargetId" @click="confirmMerge">
              确认合并
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
