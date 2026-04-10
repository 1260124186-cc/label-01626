<script setup lang="ts">
import type { Tag } from '@blog/shared'
import {
  batchDeleteTags,
  createTag,
  deleteTag,
  getTagById,
  getTags,
  mergeTags,
  recalculateAllTagPostCounts,
  updateTag,
} from '@blog/shared'
import { computed, onMounted, ref } from 'vue'
import { UButton, UCheckbox, UInput, USelectMenu } from '@/components/ui'

const searchQuery = ref('')
const tags = ref<Tag[]>([])
const selectedTags = ref<string[]>([])

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showBatchDeleteModal = ref(false)
const showMergeModal = ref(false)

const newTag = ref({ name: '', slug: '' })
const editingTag = ref<Tag | null>(null)
const deleteTargetId = ref<string | null>(null)
const deleteTargetName = ref('')
const mergeTargetTagId = ref('')

function loadTags() {
  tags.value = getTags()
  recalculateAllTagPostCounts()
}

onMounted(loadTags)

const filteredTags = computed(() => {
  if (!searchQuery.value)
    return tags.value

  const query = searchQuery.value.toLowerCase()
  return tags.value.filter(
    t => t.name.toLowerCase().includes(query)
      || t.slug.toLowerCase().includes(query),
  )
})

const tagSelectOptions = computed(() => [
  { label: '选择目标标签', value: '' },
  ...tags.value
    .filter(t => !selectedTags.value.includes(t.id))
    .map(t => ({
      label: `${t.name} (${t.postCount || 0} 篇文章)`,
      value: t.id,
    })),
])

function openCreateModal() {
  newTag.value = { name: '', slug: '' }
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
  newTag.value = { name: '', slug: '' }
}

function handleCreate() {
  if (newTag.value.name && newTag.value.slug) {
    createTag(newTag.value)
    loadTags()
    closeCreateModal()
  }
}

function openEditModal(tag: Tag) {
  editingTag.value = { ...tag }
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingTag.value = null
}

function handleEdit() {
  if (editingTag.value) {
    updateTag(editingTag.value.id, {
      name: editingTag.value.name,
      slug: editingTag.value.slug,
    })
    loadTags()
    closeEditModal()
  }
}

function openDeleteModal(id: string, name: string) {
  deleteTargetId.value = id
  deleteTargetName.value = name
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  deleteTargetId.value = null
  deleteTargetName.value = ''
}

function handleDelete() {
  if (deleteTargetId.value) {
    deleteTag(deleteTargetId.value)
    loadTags()
    closeDeleteModal()
  }
}

function openBatchDeleteModal() {
  showBatchDeleteModal.value = true
}

function closeBatchDeleteModal() {
  showBatchDeleteModal.value = false
}

function handleBatchDelete() {
  if (selectedTags.value.length > 0) {
    batchDeleteTags(selectedTags.value)
    selectedTags.value = []
    loadTags()
    closeBatchDeleteModal()
  }
}

function openMergeModal() {
  mergeTargetTagId.value = ''
  showMergeModal.value = true
}

function closeMergeModal() {
  showMergeModal.value = false
  mergeTargetTagId.value = ''
}

function handleMerge() {
  if (mergeTargetTagId.value && selectedTags.value.length > 0) {
    mergeTags(selectedTags.value, mergeTargetTagId.value)
    selectedTags.value = []
    loadTags()
    closeMergeModal()
  }
}

function generateSlug() {
  if (newTag.value.name && !newTag.value.slug) {
    newTag.value.slug = newTag.value.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }
  if (editingTag.value?.name && !editingTag.value.slug) {
    editingTag.value.slug = editingTag.value.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }
}

function getMergeTargetName() {
  const tag = getTagById(mergeTargetTagId.value)
  return tag ? tag.name : ''
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">
          标签管理
        </h1>
        <p class="mt-1 text-slate-500">
          管理博客文章标签，支持批量操作和标签合并
        </p>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex flex-col justify-between gap-4 md:flex-row">
        <div class="flex flex-1 gap-4">
          <UInput
            v-model="searchQuery"
            placeholder="搜索标签..."
            icon="search"
            class="w-full md:w-80"
          />
        </div>
        <div class="flex gap-2">
          <UButton
            v-if="selectedTags.length > 0"
            color="red"
            variant="soft"
            @click="openBatchDeleteModal"
          >
            🗑️ 删除选中 ({{ selectedTags.length }})
          </UButton>
          <UButton
            v-if="selectedTags.length > 0"
            color="primary"
            variant="soft"
            @click="openMergeModal"
          >
            🔗 合并选中 ({{ selectedTags.length }})
          </UButton>
          <UButton @click="openCreateModal">
            ➕ 新建标签
          </UButton>
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="w-12 px-4 py-3">
                <UCheckbox
                  :model-value="
                    selectedTags.length === filteredTags.length && filteredTags.length > 0
                  "
                  :indeterminate="
                    selectedTags.length > 0 && selectedTags.length < filteredTags.length
                  "
                  @update:model-value="selectedTags = $event ? filteredTags.map((t) => t.id) : []"
                />
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">
                名称
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">
                Slug
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">
                文章数
              </th>
              <th class="px-4 py-3 text-right text-sm font-medium text-slate-700">
                操作
              </th>
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
                  @update:model-value="
                    selectedTags = $event
                      ? [...selectedTags, tag.id]
                      : selectedTags.filter((id) => id !== tag.id)
                  "
                />
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-2">
                  <span
                    class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-medium text-emerald-600"
                  >
                    #
                  </span>
                  <span class="font-medium text-slate-900">
                    {{ tag.name }}
                  </span>
                </span>
              </td>
              <td class="px-4 py-3">
                <code class="rounded bg-slate-100 px-2 py-0.5 text-sm text-slate-600">
                  {{ tag.slug }}
                </code>
              </td>
              <td class="px-4 py-3">
                <span class="text-sm text-slate-600">
                  {{ tag.postCount || 0 }}
                </span>
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
        <div class="mx-auto mb-4 text-5xl">
          🏷️
        </div>
        <p class="mb-4 text-slate-500">
          暂无标签
        </p>
        <UButton @click="openCreateModal">
          ➕ 创建第一个标签
        </UButton>
      </div>

      <div class="border-t border-slate-200 px-4 py-3">
        <span class="text-sm text-slate-500"> 共 {{ filteredTags.length }} 个标签 </span>
      </div>
    </div>

    <!-- 新建标签弹窗 -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeCreateModal" />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <h3 class="mb-4 text-xl font-bold text-slate-900">
            新建标签
          </h3>
          <div class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                标签名称
              </label>
              <UInput
                v-model="newTag.name"
                placeholder="输入标签名称"
                @blur="generateSlug"
                autofocus
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                URL 别名 (Slug)
              </label>
              <UInput
                v-model="newTag.slug"
                placeholder="输入 url 友好的别名"
              />
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <button
              class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              @click="closeCreateModal"
            >
              取消
            </button>
            <button
              class="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!newTag.name || !newTag.slug"
              @click="handleCreate"
            >
              创建
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 编辑标签弹窗 -->
    <Teleport to="body">
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeEditModal" />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <h3 class="mb-4 text-xl font-bold text-slate-900">
            编辑标签
          </h3>
          <div class="space-y-4" v-if="editingTag">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                标签名称
              </label>
              <UInput
                v-model="editingTag.name"
                placeholder="输入标签名称"
                @blur="generateSlug"
                autofocus
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                URL 别名 (Slug)
              </label>
              <UInput
                v-model="editingTag.slug"
                placeholder="输入 url 友好的别名"
              />
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <button
              class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              @click="closeEditModal"
            >
              取消
            </button>
            <button
              class="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!editingTag?.name || !editingTag?.slug"
              @click="handleEdit"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 删除确认弹窗 -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeDeleteModal" />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="text-center">
            <div
              class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl"
            >
              ⚠️
            </div>
            <h3 class="mb-2 text-xl font-bold text-slate-900">
              确认删除
            </h3>
            <p class="mb-2 text-slate-500">
              确定要删除以下标签吗？
            </p>
            <p class="mb-6 truncate px-4 font-medium text-slate-700">
              "{{ deleteTargetName }}"
            </p>
            <p class="mb-6 text-sm text-red-500">
              此操作无法撤销
            </p>
          </div>
          <div class="flex gap-3">
            <button
              class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              @click="closeDeleteModal"
            >
              取消
            </button>
            <button
              class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
              @click="handleDelete"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 批量删除确认弹窗 -->
    <Teleport to="body">
      <div
        v-if="showBatchDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="closeBatchDeleteModal"
        />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="text-center">
            <div
              class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl"
            >
              ⚠️
            </div>
            <h3 class="mb-2 text-xl font-bold text-slate-900">
              批量删除
            </h3>
            <p class="mb-4 text-slate-500">
              确定要删除选中的
              <span class="font-bold text-red-500">{{ selectedTags.length }}</span> 个标签吗？
            </p>
            <p class="mb-6 text-sm text-red-500">
              此操作无法撤销
            </p>
          </div>
          <div class="flex gap-3">
            <button
              class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              @click="closeBatchDeleteModal"
            >
              取消
            </button>
            <button
              class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
              @click="handleBatchDelete"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 合并标签弹窗 -->
    <Teleport to="body">
      <div v-if="showMergeModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeMergeModal" />
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <h3 class="mb-4 text-xl font-bold text-slate-900">
            合并标签
          </h3>
          <div class="space-y-4">
            <p class="text-sm text-slate-600">
              将选中的 <span class="font-bold text-orange-500">{{ selectedTags.length }}</span>
              个标签下的所有文章移动到目标标签下，然后删除这些标签。
            </p>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                目标标签
              </label>
              <USelectMenu
                v-model="mergeTargetTagId"
                :items="tagSelectOptions"
                value-key="value"
                placeholder="选择文章要移动到哪个标签"
                class="w-full"
              />
            </div>
            <div v-if="mergeTargetTagId" class="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
              所有选中标签下的文章将被合并到
              <span class="font-medium">"{{ getMergeTargetName() }}"</span>
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <button
              class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              @click="closeMergeModal"
            >
              取消
            </button>
            <button
              class="flex-1 rounded-lg bg-orange-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!mergeTargetTagId"
              @click="handleMerge"
            >
              确认合并
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
